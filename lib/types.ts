export interface User {
  id: string
  email: string
  user_metadata: {
    full_name: string
    avatar_url?: string
  }
  created_at: string
  updated_at: string
}

export type CompletionMap = {
  [habitId: string]: string[] // ISO dates of completion
}

export type Atom = {
  id: string
  user_id: string
  name: string
  xp?: number
  color?: string
}

export interface AtomItemProps {
  atom: Atom
  atoms: Atom[]
  setAtoms: React.Dispatch<React.SetStateAction<Atom[]>>
  completions: CompletionMap
  toggleCompletion: (habitId: string, xp: number, date: string) => void
  year: number
  month: number
  weekDays: number[]
}

export interface SectionListProps {
  title: string
  atoms: Atom[]
  setAtoms: React.Dispatch<React.SetStateAction<Atom[]>>
  type: 'atom' | 'core' | 'pathway' | 'legacy'
  completions: CompletionMap
  toggleCompletion: (habitId: string, xp: number, date: string) => void
  year: number
  month: number
  currentWeekDays: number[]
}

export interface AddAtomItemProps {
  atoms: Atom[];
  setAtoms: React.Dispatch<React.SetStateAction<Atom[]>>;
  userId: string | undefined;
  type: 'add' | 'edit';
  atomToEdit?: Atom;
  open: boolean;
  setOpen: (open: boolean) => void;
}