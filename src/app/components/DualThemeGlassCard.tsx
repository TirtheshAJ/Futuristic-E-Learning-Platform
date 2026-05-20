import { motion } from "motion/react";
import { ReactNode } from "react";

interface DualThemeGlassCardProps {
  children: ReactNode;
  className?: string;
  isDark: boolean;
}

export function DualThemeGlassCard({ children, className = "", isDark }: DualThemeGlassCardProps) {
  return (
    <motion.div
      className={`relative rounded-2xl p-[2px] transition-all duration-300 ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Border gradient */}
      <div
        className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
          isDark
            ? "bg-gradient-to-br from-green-500/50 via-green-400/30 to-green-500/50"
            : "bg-gradient-to-br from-green-400/30 via-green-300/15 to-green-400/30"
        }`}
      />

      {/* Glass content */}
      <div
        className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
          isDark
            ? "bg-black/80 backdrop-blur-xl hover:shadow-[0_0_40px_rgba(34,197,94,0.3)]"
            : "bg-white/80 backdrop-blur-xl hover:shadow-lg"
        }`}
      >
        {/* Top highlight */}
        <div
          className={`absolute top-0 left-0 right-0 h-px transition-colors duration-300 ${
            isDark
              ? "bg-gradient-to-r from-transparent via-green-400/50 to-transparent"
              : "bg-gradient-to-r from-transparent via-green-300/20 to-transparent"
          }`}
        />
        {children}
      </div>
    </motion.div>
  );
}