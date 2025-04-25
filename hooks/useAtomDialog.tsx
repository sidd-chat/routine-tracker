import { useState } from "react";
import { Atom } from "@/lib/types";
import AddAtomItem from "@/components/Tracker/AddAtomItem";

type UseAtomDialogProps = {
  userId: string | undefined;
  atoms: Atom[];
  setAtoms: React.Dispatch<React.SetStateAction<Atom[]>>;
};

export default function useAtomDialog({ userId, atoms, setAtoms }: UseAtomDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [atomToEdit, setAtomToEdit] = useState<Atom | null>(null);

  const openAddDialog = () => {
    setMode('add');
    setAtomToEdit(null);
    setIsOpen(true);
  };

  const openEditDialog = (atom: Atom) => {
    setMode('edit');
    setAtomToEdit(atom);
    setIsOpen(true);
  };

  const dialog = (
    <AddAtomItem
      key={atomToEdit?.id || 'add'}
      type={mode}
      userId={userId}
      atoms={atoms}
      setAtoms={setAtoms}
      atomToEdit={atomToEdit || undefined}
      open={isOpen}
      setOpen={setIsOpen}
    />
  );

  return {
    dialog,
    openAddDialog,
    openEditDialog,
  };
}