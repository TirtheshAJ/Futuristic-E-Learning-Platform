import { motion } from "motion/react";
import { Zap } from "lucide-react";

interface XPProgressProps {
  currentXP: number;
  requiredXP: number;
  level: number;
}

export function XPProgress({ currentXP, requiredXP, level }: XPProgressProps) {
  const progress = (currentXP / requiredXP) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(0,240,255,0.5)]">
            <span className="font-black text-white text-lg">{level}</span>
          </div>
          <div>
            <p className="text-cyan-300 font-bold">Level {level}</p>
            <p className="text-xs text-slate-400">
              {currentXP} / {requiredXP} XP
            </p>
          </div>
        </div>
        <Zap className="w-6 h-6 text-yellow-400" fill="currentColor" />
      </div>

      {/* XP Progress bar */}
      <div className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden border border-cyan-500/30">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            boxShadow: "0 0 20px rgba(0,240,255,0.6)",
          }}
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
