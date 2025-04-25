import React from 'react'
import { SectionListProps } from '@/lib/types'
import AtomItem from './AtomItem'

const SectionList = ({ title, atoms, setAtoms, type, completions, toggleCompletion, year, month, currentWeekDays }: SectionListProps) => {
  return (
    <>
      {type === "atom" && atoms.map((atom) => (
        <AtomItem
          key={atom.id}
          atom={atom}
          atoms={atoms}
          setAtoms={setAtoms}
          completions={completions}
          toggleCompletion={toggleCompletion}
          year={year}
          month={month}
          weekDays={currentWeekDays}
        />
      ))}
    </>
  )
}

export default SectionList