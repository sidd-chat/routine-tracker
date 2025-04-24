export type CompletionMap = {
  [habitId: string]: string[] // ISO dates of completion
}

export type Atom = {
  id: string
  name: string
  color?: string
  core?: string
}

export interface AtomItemProps {
  atom: Atom
  completions: CompletionMap
  toggleCompletion: (habitId: string, date: string) => void
  year: number
  month: number
  weekDays: number[]
}

export interface SectionListProps {
  title: string
  atoms: Atom[]
  type: 'atom' | 'core' | 'pathway' | 'legacy'
  completions: CompletionMap
  toggleCompletion: (habitId: string, date: string) => void
  year: number
  month: number
  currentWeekDays: number[]
}