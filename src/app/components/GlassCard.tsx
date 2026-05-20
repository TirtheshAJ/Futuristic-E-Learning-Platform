import { motion } from "motion/react";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "cyan" | "purple" | "pink";
}

export function GlassCard({ children, className = "", glowColor = "cyan" }: GlassCardProps) {
  const glowColors = {
    cyan: "hover:shadow-[0_0_40px_rgba(0,240,255,0.4)]",
    purple: "hover:shadow-[0_0_40px_rgba(176,38,255,0.4)]",
    pink: "hover:shadow-[0_0_40px_rgba(217,70,239,0.4)]",
  };

  return (
    <motion.div
      className={`relative rounded-2xl p-[2px] ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Gradient border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/50 via-purple-500/50 to-pink-500/50 opacity-75" />
      
      {/* Glass content */}
      <div className={`relative bg-slate-950/80 backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-300 ${glowColors[glowColor]}`}>
        {/* Top highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        {children}
      </div>
    </motion.div>
  );
}
