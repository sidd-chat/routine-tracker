import React, { useState } from 'react'
import { AtomItemProps } from '../../lib/types'
import { Pencil } from 'lucide-react';
import useAtomDialog from '@/hooks/useAtomDialog';
import useUser from '@/hooks/useUser';

const TODAY = new Date().getDate();

const AtomItem = ({ atom, atoms, setAtoms, completions, toggleCompletion, year, month, weekDays }: AtomItemProps) => {
  const { user } = useUser();
  const { dialog, openEditDialog } = useAtomDialog({ userId: user?.id, atoms, setAtoms });

  return (
    <>
      <div className="flex items-center gap-2">
        <Pencil
          className='w-4 h-4 bg-transparent text-black hover:bg-white cursor-pointer'
          onClick={() => openEditDialog(atom)}>
          {dialog}
        </Pencil>

        <span className='font-medium w-35 bg-black/80 rounded-lg py-2 px-3 text-center text-white'>
          {atom.name}
        </span>
      </div>
      {weekDays.map((day) => {
        const date = new Date(year, month, day + 1).toISOString().split('T')[0];
        const completed = completions[atom.id]?.includes(date);

        return (
          <div
            key={day}
            className={`w-8 h-8 border-2 text-center text-xs flex items-center justify-center cursor-pointer
              ${completed ? 'text-white' : 'bg-muted hover:bg-gray-200'}`}
            style={completed && atom.color ? { backgroundColor: atom.color } : {}}
            // ! Check if default xp as 5 is valid
            onClick={() => toggleCompletion(atom.id, atom.xp || 5, date)}
          >
            {completed ? '✓' : ''}
          </div>
        )
      })}
    </>
  )
}

export default AtomItem
