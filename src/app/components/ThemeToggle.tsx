import { motion } from "motion/react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      className={`relative w-14 h-7 rounded-full p-0.5 transition-all duration-500 overflow-hidden ${
        isDark
          ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-2 border-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
          : "bg-gradient-to-r from-gray-100 via-white to-gray-100 border-2 border-green-400/30 shadow-md"
      }`}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {/* Animated background glow */}
      <motion.div
        className={`absolute inset-0 rounded-full blur-md ${
          isDark ? "bg-green-500/20" : "bg-green-400/10"
        }`}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Sliding pill indicator */}
      <motion.div
        className={`absolute w-5 h-5 rounded-full top-0.5 ${
          isDark
            ? "bg-gradient-to-br from-green-400 to-green-600 shadow-[0_0_12px_rgba(34,197,94,0.6)]"
            : "bg-gradient-to-br from-green-400 to-green-500 shadow-lg"
        }`}
        animate={{
          x: isDark ? 30 : 2,
        }}
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30,
        }}
      >
        {/* Inner glow */}
        <div className={`absolute inset-0 rounded-full ${
          isDark ? "bg-green-300/30" : "bg-white/40"
        }`} />
      </motion.div>

      {/* Sun icon (left) - for light mode */}
      <motion.div
        className="absolute left-1.5 top-1/2 -translate-y-1/2"
        animate={{
          scale: !isDark ? 1 : 0.7,
          opacity: !isDark ? 1 : 0.3,
        }}
        transition={{ duration: 0.3 }}
      >
        <Sun
          className={`w-3.5 h-3.5 transition-colors duration-300 ${
            !isDark ? "text-yellow-600" : "text-gray-600"
          }`}
        />
      </motion.div>

      {/* Moon icon (right) - for dark mode */}
      <motion.div
        className="absolute right-1.5 top-1/2 -translate-y-1/2"
        animate={{
          scale: isDark ? 1 : 0.7,
          opacity: isDark ? 1 : 0.3,
        }}
        transition={{ duration: 0.3 }}
      >
        <Moon
          className={`w-3.5 h-3.5 transition-colors duration-300 ${
            isDark ? "text-green-200" : "text-gray-500"
          }`}
        />
      </motion.div>
    </motion.button>
  );
}
