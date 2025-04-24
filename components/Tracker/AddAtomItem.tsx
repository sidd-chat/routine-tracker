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
import { Atom } from "@/lib/types"
import { useState } from "react"

interface AddAtomItemProps {
  setAtoms: React.Dispatch<React.SetStateAction<Atom[]>>;
  userId: string | undefined;
}

export default function AddAtomItem({setAtoms, userId} : AddAtomItemProps) {
  const [name, setName] = useState<string>('');
  // const [color, setColor] = useState();
  // const [core, setCore] = useState();

  const [openDialog, setOpenDialog] = useState(false);

  const handleNewAtom = async () => {
    if(!name || name.length === 0)
      return;

    const { data, error } = await supabase
      .from('atoms')
      .insert({
        user_id: userId, // uncomment if using RLS
        name: name,
        // color: color,
        // core: core
      })
      .select()

    if(error) {
      console.log('Error Inserting Atom:', error)
    }

    if(data) {
      setAtoms(prev => [...prev, data[0]]);
      setName('');
      setOpenDialog(false);
    }
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="mt-4 cursor-pointer">New Atom</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Atom</DialogTitle>
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
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
            Color
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
            </div> */}
        </div>
        <DialogFooter className="">
          <Button
            type="submit"
            className="cursor-pointer"
            onClick={handleNewAtom}
            >
            Add Atom
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
