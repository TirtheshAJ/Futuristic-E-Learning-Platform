import { motion } from "motion/react";
import { Flame } from "lucide-react";

interface StreakFireProps {
  days: number;
}

export function StreakFire({ days }: StreakFireProps) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Animated fire ring */}
      <div className="relative w-32 h-32">
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,123,0,0.4) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Main fire ring */}
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-orange-500/60"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            boxShadow: "0 0 30px rgba(255,123,0,0.6), inset 0 0 30px rgba(255,123,0,0.3)",
          }}
        />

        {/* Inner ring */}
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-yellow-400/40"
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Center flame icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Flame className="w-12 h-12 text-orange-400 drop-shadow-[0_0_10px_rgba(255,123,0,0.8)]" fill="currentColor" />
          </motion.div>
        </div>

        {/* Streak number */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-red-600 px-4 py-1 rounded-full border border-orange-400/50 shadow-[0_0_20px_rgba(255,123,0,0.5)]">
          <span className="font-black text-white">{days}</span>
        </div>
      </div>

      <p className="mt-6 text-orange-300 font-bold">Day Streak 🔥</p>
    </div>
  );
}
