"use client"

import useUser from '@/hooks/useUser'
import supabase from '@/lib/supabase'
import React, { useEffect, useState } from 'react'

const medals = ['🥇', '🥈', '🥉'];

const Leaderboard = () => {
  const { user: currentUser } = useUser();
  const [users, setUsers] = useState<any[] | null>([]);
  useEffect(() => {
    const fetchUsersStats = async () => {
      const { data: users , error } = await supabase
        .from('user_stats')
        .select('user_id, total_xp, level')
        .order('total_xp', {ascending: false})

      if(error || !users) {
        console.log('Error fetching leaderboard:', error.message)
      }

      setUsers(users)
      console.log(users)
    }

    fetchUsersStats()
  }, [])

  return (
    <main className="max-w-3xl mx-auto mt-10 p-4 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Leaderboard</h2>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Rank</th>
            <th className="px-4 py-2 text-left">User</th>
            <th className="px-4 py-2 text-right">Total XP</th>
            <th className="px-4 py-2 text-right">Level</th>
          </tr>
        </thead>
        <tbody>
          {users && users.map((user, index) => {
            const isCurrentUser = user.user_id === currentUser?.id;
            return (
              <tr
                key={user.user_id}
                className={`${
                  isCurrentUser ? 'bg-orange-200' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-4 py-2">
                  {index < 3 ? medals[index] : index + 1}
                </td>
                <td className="px-4 py-2 font-medium">
                  {user.user_id}
                  {isCurrentUser && (
                    <span className="ml-2 text-sm text-blue-600">(You)</span>
                  )}
                </td>
                <td className="px-4 py-2 text-right">{user.total_xp}</td>
                <td className="px-4 py-2 text-right">{user.level}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  )
}

export default Leaderboard