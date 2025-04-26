import { User } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react'

const UserStats = ({ level, xp }: { level: number; xp: number }) => {
  return (
    <div className="flex items-center gap-4 mb-4 mt-4">
      <h2 className="text-2xl font-bold">Level: {level}</h2>
      <div className="text-sm text-muted-foreground">
        XP: {xp} / {50 * level * level} {/* Quadratic XP requirement for the level */}
      </div>
    </div>
  )
};

export default UserStats;