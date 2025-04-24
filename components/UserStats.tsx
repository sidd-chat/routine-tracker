import React from 'react'

const UserStats = ({ level, xp }: { level: number; xp: number }) => (
  <div className="flex items-center gap-4 mb-4">
    <div className="text-xl font-bold">Level: {level}</div>
    <div className="text-sm text-muted-foreground">XP: {xp} / {level * 100}</div>
  </div>
);

export default UserStats;