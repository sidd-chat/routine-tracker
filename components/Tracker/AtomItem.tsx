import React from 'react'
import { AtomItemProps } from '../../lib/types'

const AtomItem = ({ atom, completions, toggleCompletion, year, month, weekDays }: AtomItemProps) => {
  return (
    <>
      <div className="font-medium flex items-center">{atom.name}</div>
      {weekDays.map((day) => {

          const date = new Date(year, month, day + 1).toISOString().split('T')[0];
          const completed = completions[atom.id]?.includes(date);

          return (
            <div
              key={day}
              className={`w-8 h-8 border text-center text-xs flex items-center justify-center
                ${completed ? atom.color ? `bg-[${atom.color}] text-white` : 'bg-green-400 text-white' : 'bg-muted hover:bg-gray-200'}
                cursor-pointer`}
              onClick={() => toggleCompletion(atom.id, date)}
            >
              {completed ? '✓' : ''}
            </div>
          )
      })}
    </>
  )
}

export default AtomItem
