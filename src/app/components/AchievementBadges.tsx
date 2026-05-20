import { motion } from "motion/react";
import { Award, Flame, Zap, Trophy, Star, Target } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: typeof Award;
  earned: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export function AchievementBadges() {
  const achievements: Achievement[] = [
    {
      id: "1",
      title: "First Steps",
      description: "Complete your first course",
      icon: Star,
      earned: true,
      rarity: "common",
    },
    {
      id: "2",
      title: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: Flame,
      earned: true,
      rarity: "rare",
    },
    {
      id: "3",
      title: "Speed Demon",
      description: "Complete a course in under 3 hours",
      icon: Zap,
      earned: false,
      rarity: "epic",
    },
    {
      id: "4",
      title: "Perfect Score",
      description: "Get 100% on any quiz",
      icon: Target,
      earned: true,
      rarity: "rare",
    },
    {
      id: "5",
      title: "Grand Master",
      description: "Complete all courses",
      icon: Trophy,
      earned: false,
      rarity: "legendary",
    },
    {
      id: "6",
      title: "Knowledge Seeker",
      description: "Reach level 10",
      icon: Award,
      earned: false,
      rarity: "epic",
    },
  ];

  const rarityColors = {
    common: "from-gray-400 to-gray-500",
    rare: "from-blue-400 to-blue-600",
    epic: "from-purple-400 to-purple-600",
    legendary: "from-yellow-400 to-orange-600",
  };

  const rarityGlow = {
    common: "0 0 20px rgba(156,163,175,0.3)",
    rare: "0 0 20px rgba(59,130,246,0.5)",
    epic: "0 0 30px rgba(168,85,247,0.6)",
    legendary: "0 0 40px rgba(251,191,36,0.8)",
  };

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-black text-white">Achievement Gallery</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.1, y: -5 }}
              className="relative"
            >
              <div
                className={`p-4 rounded-xl bg-slate-900/50 border-2 ${
                  achievement.earned
                    ? "border-cyan-500/50"
                    : "border-slate-700/50 opacity-40 grayscale"
                } backdrop-blur-sm transition-all duration-300`}
                style={{
                  boxShadow: achievement.earned ? rarityGlow[achievement.rarity] : "none",
                }}
              >
                {/* Rarity indicator */}
                {achievement.earned && (
                  <div
                    className={`absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br ${rarityColors[achievement.rarity]} border-2 border-slate-900 flex items-center justify-center`}
                  >
                    <span className="text-[10px]">★</span>
                  </div>
                )}

                {/* Icon */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      achievement.earned
                        ? `bg-gradient-to-br ${rarityColors[achievement.rarity]}`
                        : "bg-slate-800"
                    }`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-white">{achievement.title}</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {achievement.description}
                    </p>
                  </div>
                </div>

                {/* Lock overlay for unearned */}
                {!achievement.earned && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center">
                      <span className="text-slate-500">🔒</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
