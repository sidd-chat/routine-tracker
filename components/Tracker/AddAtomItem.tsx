import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import supabase from "@/lib/supabase"
import { AddAtomItemProps, Atom } from "@/lib/types"
import { Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

const AVAILABLE_COLORS = [
  '#077A7D',
  '#FE7743',
  '#C5172E',
  '#FFD63A',
  '#3F7D58'
]

export default function AddAtomItem({setAtoms, atoms, userId, type, atomToEdit, open, setOpen} : AddAtomItemProps) {
  const [name, setName] = useState<string>('');
  const [xp, setXp] = useState(1);
  const [color, setColor] = useState<string>();
  useEffect(() => {
    if (type === 'edit' && atomToEdit) {
      setName(atomToEdit.name);
      setXp(atomToEdit.xp ? atomToEdit.xp : 1);
      setColor(atomToEdit.color || '');
    } else {
      setName('');
      setXp(1);
      setColor(AVAILABLE_COLORS[0]);
    }
  }, [type, atomToEdit]);


  const handleBtnClick = () => {
    if(type === 'add') {
      handleNewAtom();
    } else if(type === 'edit' && atomToEdit) {
      handleEditAtom();
    }
  }

  const handleNewAtom = async () => {
    if(!name || name.length === 0)
      return;

    const optimisticAtom: Atom = {
      id: Date.now().toString(), // temp ID
      // user_id: userId,
      user_id: userId || '',
      name,
      xp,
      color: color || AVAILABLE_COLORS[0],
    };

    setAtoms(prev => [...prev, optimisticAtom])

    const { data, error } = await supabase
      .from('atoms')
      .insert({
        user_id: userId,
        name: name,
        xp: xp,
        color: color,
      })
      .select()


    if (error || !data) {
      console.error("Error inserting atom:", error);
      setAtoms(prev => prev.filter(a => a.id !== optimisticAtom.id));
      return;
    }

    setAtoms(prev =>
      prev.map(a => (a.id === optimisticAtom.id ? data[0] : a))
    );
    setName('');
    setOpen(false);
  }

  const handleEditAtom = async () => {
    if (!atomToEdit?.id) {
      console.error("Attempted to edit atom without valid atomToEdit.");
      return;
    }

    const updatedAtom = { ...atomToEdit, name, xp, color };
    const previousAtoms = [...atoms];

    setAtoms(prev =>
      prev.map(a => (a.id === atomToEdit.id ? updatedAtom : a))
    );

    const { data, error } = await supabase
      .from('atoms')
      .update({
        name,
        xp,
        color,
      })
      .eq('id', atomToEdit.id)
      .select();

    if (error || !data) {
      console.error("Error updating atom:", error);
      setAtoms(previousAtoms);
      return;
    }

    setAtoms(prev =>
      prev.map(a => (a.id === atomToEdit.id ? data[0] : a))
    );
    setOpen(false);
  }

  const handleDeleteAtom = async () => {
    if(!atomToEdit)
      return;

    setAtoms(prev => prev.filter(a => a.id !== atomToEdit.id));
    const previousAtoms = [...atoms]

    const { error } = await supabase
      .from('atoms')
      .delete()
      .eq('id', atomToEdit.id)

    if (error) {
      console.error("Error deleting atom:", error);
      setAtoms(previousAtoms);
      return;
    }

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4 cursor-pointer">New Atom</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {type === 'edit' ? 'Edit Atom' : 'New Atom'}
          </DialogTitle>
          <DialogDescription>
            Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Read 10 pages"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="xp" className="text-right">
            XP
            </Label>
            <Input
              id="xp"
              placeholder="1"
              value={xp}
              onChange={e => setXp(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">
            Color
            </Label>
            <Input
              id="color"
              type="color"
              // placeholder="1"
              value={color}
              onChange={e => setColor(e.target.value)}
              className="col-span-3"
            />
          </div> */}
          <div className="flex gap-2">
            <span className="font-semibold text-right mr-13.5 text-sm">
              Color
            </span>
            {AVAILABLE_COLORS.map((currentColor) => (
              <Button
                title="color"
                key={currentColor}
                onClick={() => setColor(currentColor)}
                className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
                  color === currentColor ? 'ring-2 ring-offset-0 ring-black' : ''
                }`}
                style={{ backgroundColor: currentColor }}
              />
            ))}
          </div>
        </div>
        <DialogFooter className="">
          {type === 'edit' && (
            <Button
            type="submit"
            variant='destructive'
            className="cursor-pointer"
            onClick={handleDeleteAtom}
            >
              <Trash2 />
              {/* Delete */}
            </Button>
          )}
          <Button
            type="submit"
            className="cursor-pointer"
            onClick={handleBtnClick}
          >
            {type === 'edit' ? 'Save Changes' : 'Add Atom'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
