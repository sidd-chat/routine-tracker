"use client";

import useUser from '@/hooks/useUser';
import supabase from '@/lib/supabase';
import React, { useEffect, useState } from 'react';
import LeaderboardItem from '@/components/LeaderboardItem';

const Leaderboard = () => {
  const { user: currentUser } = useUser();
  const [users, setUsers] = useState<any[] | null>([]);

  useEffect(() => {
    const fetchUsersStats = async () => {
      const { data: users, error } = await supabase
        .from('user_stats')
        .select('user_id, username, total_xp, level')
        .order('total_xp', { ascending: false });

      if (error || !users) {
        console.log('Error fetching leaderboard:', error.message);
      }

      setUsers(users);
      console.log(users);
    };

    fetchUsersStats();
  }, []);

  return (
    <main className="max-w-3xl mx-auto mt-10 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Leaderboard</h2>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="px-4 py-2 text-left">Rank</th>
            <th className="px-4 py-2 text-left">User</th>
            <th className="px-4 py-2 text-right">Total XP</th>
            <th className="px-4 py-2 text-right">Level</th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user, index) => {
              const isCurrentUser = user.user_id === currentUser?.id;
              return (
                <LeaderboardItem
                  key={user.username}
                  index={index}
                  user={user}
                  isCurrentUser={isCurrentUser}
                  currentUserId={currentUser?.id}
                />
              );
            })}
        </tbody>
      </table>
    </main>
  );
};

export default Leaderboard;
