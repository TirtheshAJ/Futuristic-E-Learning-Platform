import { motion } from "motion/react";
import { BookOpen, FileQuestion, Trophy } from "lucide-react";
import { DualThemeGlassCard } from "./DualThemeGlassCard";

interface DualThemePrimarySectionsProps {
  isDark: boolean;
}

export function DualThemePrimarySections({ isDark }: DualThemePrimarySectionsProps) {
  const sections = [
    {
      title: "Lectures",
      icon: BookOpen,
      description: "Interactive video courses with coding challenges",
      count: "24 Active",
    },
    {
      title: "Quizzes",
      icon: FileQuestion,
      description: "Test your knowledge and earn bonus XP",
      count: "12 Available",
    },
    {
      title: "Streak & Rewards",
      icon: Trophy,
      description: "Daily challenges and exclusive achievements",
      count: "5 Day Streak",
    },
  ];

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
            <DualThemeGlassCard isDark={isDark}>
              <div className="p-8 space-y-4 text-center">
                {/* Icon with glow */}
                <motion.div
                  className="inline-flex"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${
                      isDark
                        ? "bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                        : "bg-gradient-to-br from-green-50 to-green-100 border-green-400/50 shadow-lg"
                    }`}
                  >
                    <Icon
                      className={`w-10 h-10 transition-colors duration-300 ${
                        isDark ? "text-green-400" : "text-green-600"
                      }`}
                    />
                  </div>
                </motion.div>

                {/* Title */}
                <h3
                  className={`text-2xl font-black transition-colors duration-300 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {section.title}
                </h3>

                {/* Description */}
                <p
                  className={`text-sm transition-colors duration-300 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {section.description}
                </p>

                {/* Count badge */}
                <div
                  className={`inline-flex px-4 py-2 rounded-full text-sm font-bold border transition-all duration-300 ${
                    isDark
                      ? "bg-green-500/20 text-green-300 border-green-500/50"
                      : "bg-green-50 text-green-700 border-green-400/50"
                  }`}
                >
                  {section.count}
                </div>

                {/* CTA */}
                <motion.button
                  className={`w-full mt-4 py-3 rounded-lg font-bold text-white transition-all duration-300 ${
                    isDark
                      ? "bg-gradient-to-r from-green-600 to-green-700 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                      : "bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore
                </motion.button>
              </div>
            </DualThemeGlassCard>
          </motion.div>
        );
      })}
    </div>
  );
}
