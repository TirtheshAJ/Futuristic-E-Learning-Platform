import { motion } from "motion/react";
import { BookOpen, FileQuestion, Trophy } from "lucide-react";
import { GlassCard } from "./GlassCard";

export function PrimarySections() {
  const sections = [
    {
      title: "Lectures",
      icon: BookOpen,
      description: "Interactive video courses with coding challenges",
      count: "24 Active",
      color: "cyan",
    },
    {
      title: "Quizzes",
      icon: FileQuestion,
      description: "Test your knowledge and earn bonus XP",
      count: "12 Available",
      color: "purple",
    },
    {
      title: "Streak & Rewards",
      icon: Trophy,
      description: "Daily challenges and exclusive achievements",
      count: "5 Day Streak",
      color: "pink",
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 py-12">
      {sections.map((section, index) => {
        const Icon = section.icon;
        return (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <GlassCard glowColor={section.color}>
              <div className="p-8 space-y-4 text-center">
                {/* Icon with glow */}
                <motion.div
                  className="inline-flex"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${
                      section.color === "cyan"
                        ? "from-cyan-500/20 to-cyan-600/20 border-cyan-500/50"
                        : section.color === "purple"
                        ? "from-purple-500/20 to-purple-600/20 border-purple-500/50"
                        : "from-pink-500/20 to-pink-600/20 border-pink-500/50"
                    } border-2 flex items-center justify-center`}
                    style={{
                      boxShadow:
                        section.color === "cyan"
                          ? "0 0 30px rgba(0,240,255,0.3)"
                          : section.color === "purple"
                          ? "0 0 30px rgba(168,85,247,0.3)"
                          : "0 0 30px rgba(236,72,153,0.3)",
                    }}
                  >
                    <Icon
                      className={`w-10 h-10 ${
                        section.color === "cyan"
                          ? "text-cyan-400"
                          : section.color === "purple"
                          ? "text-purple-400"
                          : "text-pink-400"
                      }`}
                    />
                  </div>
                </motion.div>

                {/* Title */}
                <h3 className="text-2xl font-black text-white">{section.title}</h3>

                {/* Description */}
                <p className="text-slate-300 text-sm">{section.description}</p>

                {/* Count badge */}
                <div
                  className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${
                    section.color === "cyan"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                      : section.color === "purple"
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/50"
                      : "bg-pink-500/20 text-pink-300 border border-pink-500/50"
                  }`}
                >
                  {section.count}
                </div>

                {/* CTA */}
                <motion.button
                  className={`w-full mt-4 py-3 rounded-lg font-bold text-white bg-gradient-to-r ${
                    section.color === "cyan"
                      ? "from-cyan-600 to-cyan-700"
                      : section.color === "purple"
                      ? "from-purple-600 to-purple-700"
                      : "from-pink-600 to-pink-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        );
      })}
    </div>
  );
}
