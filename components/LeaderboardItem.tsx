import React from 'react'

const medals = ['🥇', '🥈', '🥉'];

type LeaderboardItemProps = {
  index: number;
  user: {
    username: string;
    total_xp: number;
    level: number;
    user_id: string;
  };
  isCurrentUser: boolean;
  currentUserId: string | undefined;
};

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ index, user, isCurrentUser, currentUserId }) => {
  return (
    <tr className={`${
      isCurrentUser ? 'bg-orange-200 dark:bg-orange-600' : index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
    }`}>
      <td className="px-4 py-2">
        {index < 3 ? medals[index] : index + 1}
      </td>
      <td className="px-4 py-2 font-medium">
        {user.username}
        {isCurrentUser && (
          <span className="ml-2 text-sm text-blue-600">(You)</span>
        )}
      </td>
      <td className="px-4 py-2 text-right">{user.total_xp}</td>
      <td className="px-4 py-2 text-right">{user.level}</td>
    </tr>
  );
};

export default LeaderboardItem;