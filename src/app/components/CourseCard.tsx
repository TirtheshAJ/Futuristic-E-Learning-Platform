import { motion } from "motion/react";
import { Coins, Lock, Trophy, Zap } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface CourseCardProps {
  title: string;
  icon: string;
  progress: number;
  xp: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  coinReward: number;
  isLocked?: boolean;
  unlockCost?: number;
}

export function CourseCard({
  title,
  icon,
  progress,
  xp,
  difficulty,
  coinReward,
  isLocked = false,
  unlockCost = 0,
}: CourseCardProps) {
  const difficultyColors = {
    Beginner: "from-green-500 to-emerald-600",
    Intermediate: "from-yellow-500 to-orange-600",
    Advanced: "from-red-500 to-pink-600",
  };

  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <GlassCard className="h-full">
      <div className="p-6 space-y-4 relative">
        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm rounded-2xl z-10 flex flex-col items-center justify-center gap-3">
            <Lock className="w-12 h-12 text-cyan-400" />
            <div className="text-center">
              <p className="text-cyan-300 font-bold">Locked Course</p>
              <div className="flex items-center gap-2 justify-center mt-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-300 font-bold">{unlockCost}</span>
              </div>
              <button className="mt-3 px-6 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg font-bold text-white hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all">
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
                stroke="rgba(71,85,105,0.3)"
                strokeWidth="6"
                fill="none"
              />
              <motion.circle
                cx="40"
                cy="40"
                r="36"
                stroke="url(#gradient)"
                strokeWidth="6"
                fill="none"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "easeOut" }}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-black text-cyan-300">{progress}%</span>
            </div>
          </div>
        </div>

        {/* Course title */}
        <h3 className="text-2xl font-black text-white">{title}</h3>

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
          <div className="flex justify-between text-xs text-slate-400">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              style={{
                boxShadow: "0 0 10px rgba(0,240,255,0.6)",
              }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {/* XP */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-purple-500/30">
            <Zap className="w-4 h-4 text-yellow-400" fill="currentColor" />
            <div>
              <p className="text-xs text-slate-400">XP</p>
              <p className="font-bold text-purple-300">{xp}</p>
            </div>
          </div>

          {/* Coin Reward */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-yellow-500/30">
            <Coins className="w-4 h-4 text-yellow-400" />
            <div>
              <p className="text-xs text-slate-400">Reward</p>
              <p className="font-bold text-yellow-300">{coinReward}</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <motion.button
          className="w-full py-3 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg font-bold text-white relative overflow-hidden group"
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
            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
            initial={{ x: "-100%" }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </div>
    </GlassCard>
  );
}
