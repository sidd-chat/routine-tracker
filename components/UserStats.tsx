const UserStats = ({ level, xp }: { level: number; xp: number }) => {
  // Calculate XP required for the next level
  const nextLevelXp = 50 * level * level;
  const progress = xp / nextLevelXp * 100;

  return (
    <div className="flex flex-col items-center gap-6 mb-6 p-6 w-full max-w-xs">
      {/* Level Display */}
      <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
        Level {level}
      </h2>

      {/* XP Display */}
      <div className="text-sm text-muted-foreground -mt-5">
        <span className="font-medium">XP:</span> {xp} / {nextLevelXp}
      </div>

      {/* Progress Bar */}
      <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 -mt-2 overflow-hidden">
        {/* Filled Portion */}
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-green-500 to-green-800"
          style={{ width: `${progress}%` }}
        />

        {/* Centered Text */}
        <div className="absolute inset-0 flex items-center justify-center text-sm font-extralight tracking-widest text-white dark:text-gray-200 cursor-default">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
};

export default UserStats;
