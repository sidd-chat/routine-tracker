import React from 'react'

// const LeaderboardItem = ({ user } : {user: User}) => {
//   return (
//     <tr
//       key={user.user_id}
//       className={`${
//         isCurrentUser ? 'bg-orange-200' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
//       }`}
//     >
//       <td className="px-4 py-2">
//         {index < 3 ? medals[index] : index + 1}
//       </td>
//       <td className="px-4 py-2 font-medium">
//         {user.user_id}
//         {isCurrentUser && (
//           <span className="ml-2 text-sm text-blue-600">(You)</span>
//         )}
//       </td>
//       <td className="px-4 py-2 text-right">{user.total_xp}</td>
//       <td className="px-4 py-2 text-right">{user.level}</td>
//     </tr>
//   );
// }

// export default LeaderboardItem