import { motion } from "motion/react";
import { Coins, Lock, Trophy, Zap } from "lucide-react";
import { DualThemeGlassCard } from "./DualThemeGlassCard";

interface DualThemeCourseCardProps {
  title: string;
  icon: string;
  progress: number;
  xp: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  coinReward: number;
  isLocked?: boolean;
  unlockCost?: number;
  isDark: boolean;
}

export function DualThemeCourseCard({
  title,
  icon,
  progress,
  xp,
  difficulty,
  coinReward,
  isLocked = false,
  unlockCost = 0,
  isDark,
}: DualThemeCourseCardProps) {
  const difficultyColors = {
    Beginner: isDark
      ? "from-green-500 to-emerald-600"
      : "from-green-400 to-emerald-500",
    Intermediate: isDark
      ? "from-yellow-500 to-orange-600"
      : "from-yellow-400 to-orange-500",
    Advanced: isDark ? "from-red-500 to-pink-600" : "from-red-400 to-pink-500",
  };

  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <DualThemeGlassCard isDark={isDark} className="h-full">
      <div className="p-6 space-y-4 relative">
        {/* Lock overlay */}
        {isLocked && (
          <div
            className={`absolute inset-0 rounded-2xl z-10 flex flex-col items-center justify-center gap-3 transition-colors duration-300 ${
              isDark ? "bg-black/90 backdrop-blur-sm" : "bg-white/95 backdrop-blur-sm"
            }`}
          >
            <Lock className={isDark ? "w-12 h-12 text-green-400" : "w-12 h-12 text-green-600"} />
            <div className="text-center">
              <p
                className={`font-bold transition-colors duration-300 ${
                  isDark ? "text-green-300" : "text-green-700"
                }`}
              >
                Locked Course
              </p>
              <div className="flex items-center gap-2 justify-center mt-2">
                <Coins
                  className={isDark ? "w-5 h-5 text-yellow-400" : "w-5 h-5 text-yellow-600"}
                />
                <span
                  className={`font-bold transition-colors duration-300 ${
                    isDark ? "text-yellow-300" : "text-yellow-700"
                  }`}
                >
                  {unlockCost}
                </span>
              </div>
              <button
                className={`mt-3 px-6 py-2 rounded-lg font-bold transition-all duration-300 ${
                  isDark
                    ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                    : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg"
                }`}
              >
                Unlock Now
              </button>
            </div>
          </div>
        )}

        {/* Header with icon and circular progress */}
        <div className="flex items-start justify-between">
          {/* Icon */}
          <div className="text-5xl">{icon}</div>

          {/* Circular progress indicator */}
          <div className="relative w-20 h-20">
            <svg className="transform -rotate-90" width="80" height="80">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke={isDark ? "rgba(71,85,105,0.3)" : "rgba(209,213,219,0.5)"}
                strokeWidth="6"
                fill="none"
              />
              <motion.circle
                cx="40"
                cy="40"
                r="36"
                stroke={isDark ? "#22c55e" : "#16a34a"}
                strokeWidth="6"
                fill="none"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "easeOut" }}
                strokeLinecap="round"
                style={{
                  filter: isDark
                    ? "drop-shadow(0 0 6px rgba(34,197,94,0.6))"
                    : "drop-shadow(0 0 2px rgba(22,163,74,0.3))",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={`text-sm font-black transition-colors duration-300 ${
                  isDark ? "text-green-300" : "text-green-700"
                }`}
              >
                {progress}%
              </span>
            </div>
          </div>
        </div>

        {/* Course title */}
        <h3
          className={`text-2xl font-black transition-colors duration-300 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h3>

        {/* Difficulty badge */}
        <div className="inline-flex">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${difficultyColors[difficulty]} shadow-lg`}
          >
            {difficulty}
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className={isDark ? "text-gray-400" : "text-gray-600"}>Progress</span>
            <span className={isDark ? "text-gray-400" : "text-gray-600"}>{progress}%</span>
          </div>
          <div
            className={`h-2 rounded-full overflow-hidden transition-colors duration-300 ${
              isDark ? "bg-gray-800" : "bg-gray-200"
            }`}
          >
            <motion.div
              className={`h-full rounded-full transition-all duration-300 ${
                isDark
                  ? "bg-gradient-to-r from-green-500 to-green-600 shadow-[0_0_10px_rgba(34,197,94,0.6)]"
                  : "bg-gradient-to-r from-green-400 to-green-500"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {/* XP */}
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
              isDark
                ? "bg-gray-800/50 border border-green-500/30"
                : "bg-gray-50 border border-green-200"
            }`}
          >
            <Zap
              className={isDark ? "w-4 h-4 text-yellow-400" : "w-4 h-4 text-yellow-600"}
              fill="currentColor"
            />
            <div>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>XP</p>
              <p
                className={`font-bold transition-colors duration-300 ${
                  isDark ? "text-green-300" : "text-green-700"
                }`}
              >
                {xp}
              </p>
            </div>
          </div>

          {/* Coin Reward */}
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
              isDark
                ? "bg-gray-800/50 border border-yellow-500/30"
                : "bg-gray-50 border border-yellow-200"
            }`}
          >
            <Coins className={isDark ? "w-4 h-4 text-yellow-400" : "w-4 h-4 text-yellow-600"} />
            <div>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>Reward</p>
              <p
                className={`font-bold transition-colors duration-300 ${
                  isDark ? "text-yellow-300" : "text-yellow-700"
                }`}
              >
                {coinReward}
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <motion.button
          className={`w-full py-3 rounded-lg font-bold text-white relative overflow-hidden group transition-all duration-300 ${
            isDark
              ? "bg-gradient-to-r from-green-600 to-green-700"
              : "bg-gradient-to-r from-green-500 to-green-600"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {progress === 100 ? (
              <>
                <Trophy className="w-5 h-5" />
                Completed
              </>
            ) : progress > 0 ? (
              "Continue Learning"
            ) : (
              "Start Course"
            )}
          </span>
          <motion.div
            className={`absolute inset-0 ${
              isDark
                ? "bg-gradient-to-r from-green-700 to-green-800"
                : "bg-gradient-to-r from-green-600 to-green-700"
            }`}
            initial={{ x: "-100%" }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </div>
    </DualThemeGlassCard>
  );
}
