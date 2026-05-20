import { motion } from "motion/react";
import { Zap } from "lucide-react";

interface DualThemeXPProgressProps {
  currentXP: number;
  requiredXP: number;
  level: number;
  isDark: boolean;
}

export function DualThemeXPProgress({ currentXP, requiredXP, level, isDark }: DualThemeXPProgressProps) {
  const progress = (currentXP / requiredXP) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              isDark
                ? "bg-gradient-to-br from-green-500 to-green-600 border-green-400/50 shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                : "bg-gradient-to-br from-green-400 to-green-500 border-green-300/50 shadow-lg"
            }`}
          >
            <span className="font-black text-white text-lg">{level}</span>
          </div>
          <div>
            <p
              className={`font-bold transition-colors duration-300 ${
                isDark ? "text-green-300" : "text-green-700"
              }`}
            >
              Level {level}
            </p>
            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {currentXP} / {requiredXP} XP
            </p>
          </div>
        </div>
        <Zap
          className={isDark ? "w-6 h-6 text-yellow-400" : "w-6 h-6 text-yellow-600"}
          fill="currentColor"
        />
      </div>

      {/* XP Progress bar */}
      <div
        className={`relative h-3 rounded-full overflow-hidden border transition-all duration-300 ${
          isDark ? "bg-gray-800/50 border-green-500/30" : "bg-gray-200 border-green-300/30"
        }`}
      >
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-300 ${
            isDark
              ? "bg-gradient-to-r from-green-500 to-green-600 shadow-[0_0_20px_rgba(34,197,94,0.6)]"
              : "bg-gradient-to-r from-green-400 to-green-500"
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        {/* Animated shine effect */}
        <motion.div
          className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
}
