import { motion } from "motion/react";
import { Zap, Flame, Trophy } from "lucide-react";

interface DualThemeHeroProps {
  isDark: boolean;
}

export function DualThemeHero({ isDark }: DualThemeHeroProps) {
  return (
    <div className="relative overflow-hidden py-24 px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className={`absolute top-20 left-1/4 w-96 h-96 rounded-full blur-[120px] transition-colors duration-300 ${
            isDark ? "bg-green-500/20" : "bg-green-400/10"
          }`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: isDark ? [0.2, 0.4, 0.2] : [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className={`absolute bottom-20 right-1/4 w-96 h-96 rounded-full blur-[120px] transition-colors duration-300 ${
            isDark ? "bg-green-400/20" : "bg-green-300/10"
          }`}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: isDark ? [0.4, 0.2, 0.4] : [0.2, 0.1, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Main heading with theme-aware styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1
            className={`text-6xl md:text-8xl font-black mb-6 transition-all duration-300 ${
              isDark
                ? "text-green-400 drop-shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                : "text-green-600"
            }`}
          >
            Turn Learning Into a Game.
          </h1>
        </motion.div>

        {/* Subtext with icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`flex flex-wrap justify-center items-center gap-6 text-xl md:text-2xl mb-12 transition-colors duration-300 ${
            isDark ? "text-green-100/90" : "text-gray-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <Flame className={isDark ? "w-6 h-6 text-orange-400" : "w-6 h-6 text-orange-500"} />
            <span>Build streaks.</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className={isDark ? "w-6 h-6 text-yellow-400" : "w-6 h-6 text-yellow-500"} />
            <span>Earn coins.</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className={isDark ? "w-6 h-6 text-green-400" : "w-6 h-6 text-green-500"} />
            <span>Unlock mastery.</span>
          </div>
        </motion.div>

        {/* Floating particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full transition-colors duration-300 ${
              isDark ? "bg-green-400/50" : "bg-green-500/30"
            }`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: isDark ? [0.3, 0.8, 0.3] : [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
