import { motion, AnimatePresence } from "motion/react";
import { useOutletContext } from "react-router";
import { DualThemeGlassCard } from "../components/DualThemeGlassCard";
import { DualThemeStreakFire } from "../components/DualThemeStreakFire";
import { Flame, Trophy, Star, Medal, Crown, Zap, Coins, Gift, Calendar, Check, X } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useState } from "react";

interface LayoutContext {
  isDark: boolean;
}

export function StreakRewardsPage() {
  const { isDark } = useOutletContext<LayoutContext>();
  const { userData, checkIn, leaderboard } = useUser();
  const [checkInModal, setCheckInModal] = useState<{ show: boolean; success: boolean; message: string }>({
    show: false,
    success: false,
    message: "",
  });

  const handleCheckIn = () => {
    const success = checkIn();
    
    if (success) {
      setCheckInModal({
        show: true,
        success: true,
        message: `Streak is now ${userData.streak + 1} days! +50 coins, +25 XP`,
      });
    } else {
      setCheckInModal({
        show: true,
        success: false,
        message: "You've already checked in today. Come back tomorrow!",
      });
    }
  };

  const closeModal = () => {
    setCheckInModal({ show: false, success: false, message: "" });
  };

  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first lecture",
      icon: Star,
      rarity: "common",
      earned: true,
      coinReward: 50,
      xpReward: 100,
      earnedDate: "2026-02-10",
    },
    {
      id: 2,
      title: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: Flame,
      rarity: "rare",
      earned: true,
      coinReward: 200,
      xpReward: 500,
      earnedDate: "2026-02-15",
    },
    {
      id: 3,
      title: "Perfect Score",
      description: "Get 100% on any quiz",
      icon: Trophy,
      rarity: "rare",
      earned: false,
      coinReward: 300,
      xpReward: 750,
    },
    {
      id: 4,
      title: "Speed Demon",
      description: "Complete a course in under 3 hours",
      icon: Zap,
      rarity: "epic",
      earned: false,
      coinReward: 500,
      xpReward: 1000,
    },
    {
      id: 5,
      title: "Knowledge Seeker",
      description: "Reach level 10",
      icon: Medal,
      rarity: "epic",
      earned: true,
      coinReward: 750,
      xpReward: 2000,
      earnedDate: "2026-02-12",
    },
    {
      id: 6,
      title: "Grand Master",
      description: "Complete all courses",
      icon: Crown,
      rarity: "legendary",
      earned: false,
      coinReward: 1000,
      xpReward: 5000,
    },
  ];

  const dailyRewards = [
    { day: 1, coins: 10, claimed: true },
    { day: 2, coins: 15, claimed: true },
    { day: 3, coins: 20, claimed: true },
    { day: 4, coins: 25, claimed: true },
    { day: 5, coins: 30, claimed: true },
    { day: 6, coins: 40, claimed: true },
    { day: 7, coins: 50, claimed: true },
    { day: 8, coins: 75, claimed: false },
    { day: 9, coins: 100, claimed: false },
    { day: 10, coins: 150, claimed: false },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return isDark ? "from-gray-500 to-gray-600" : "from-gray-400 to-gray-500";
      case "rare":
        return isDark ? "from-blue-500 to-blue-600" : "from-blue-400 to-blue-500";
      case "epic":
        return isDark ? "from-purple-500 to-purple-600" : "from-purple-400 to-purple-500";
      case "legendary":
        return isDark ? "from-yellow-500 to-orange-600" : "from-yellow-400 to-orange-500";
      default:
        return isDark ? "from-gray-500 to-gray-600" : "from-gray-400 to-gray-500";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1
          className={`text-5xl font-black mb-4 transition-colors duration-300 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          🏆 Streak & Rewards
        </h1>
        <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          Track your learning streak, earn achievements, and climb the leaderboard!
        </p>
      </motion.div>

      {/* Streak Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <DualThemeGlassCard isDark={isDark}>
          <div className="p-8 text-center">
            <DualThemeStreakFire days={userData.streak} isDark={isDark} />
            <motion.button
              onClick={handleCheckIn}
              className={`w-full mt-6 py-3 rounded-lg font-bold text-white transition-all duration-300 ${
                isDark
                  ? "bg-gradient-to-r from-green-600 to-green-700"
                  : "bg-gradient-to-r from-green-500 to-green-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar className="w-5 h-5 inline mr-2" />
              Check In Today
            </motion.button>
          </div>
        </DualThemeGlassCard>

        <div className="md:col-span-2">
          <DualThemeGlassCard isDark={isDark}>
            <div className="p-6">
              <h3
                className={`text-xl font-black mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Daily Rewards
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {dailyRewards.map((reward) => (
                  <div
                    key={reward.day}
                    className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-300 ${
                      userData.streak >= reward.day
                        ? isDark
                          ? "border-green-500/50 bg-green-500/20"
                          : "border-green-400/50 bg-green-50"
                        : isDark
                        ? "border-gray-700 bg-gray-800/30 hover:border-green-500/30"
                        : "border-gray-200 bg-white hover:border-green-300"
                    }`}
                  >
                    <p
                      className={`text-xs mb-1 ${
                        userData.streak >= reward.day
                          ? isDark
                            ? "text-green-400"
                            : "text-green-600"
                          : isDark
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}
                    >
                      Day {reward.day}
                    </p>
                    <Coins
                      className={`w-5 h-5 ${
                        userData.streak >= reward.day
                          ? isDark
                            ? "text-yellow-400"
                            : "text-yellow-600"
                          : isDark
                          ? "text-gray-600"
                          : "text-gray-400"
                      }`}
                    />
                    <p
                      className={`text-xs font-bold ${
                        userData.streak >= reward.day
                          ? isDark
                            ? "text-yellow-400"
                            : "text-yellow-600"
                          : isDark
                          ? "text-gray-600"
                          : "text-gray-400"
                      }`}
                    >
                      {reward.coins}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </DualThemeGlassCard>
        </div>
      </div>

      {/* Achievements */}
      <div className="mb-12">
        <h2
          className={`text-3xl font-black mb-6 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          🎖️ Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <DualThemeGlassCard isDark={isDark}>
                  <div
                    className={`p-6 relative ${
                      !achievement.earned && (isDark ? "opacity-50" : "opacity-60")
                    }`}
                  >
                    {/* Rarity Border */}
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getRarityColor(
                        achievement.rarity
                      )} opacity-10`}
                    />

                    {/* Content */}
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRarityColor(
                            achievement.rarity
                          )} flex items-center justify-center`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full uppercase font-bold bg-gradient-to-r ${getRarityColor(
                            achievement.rarity
                          )} text-white`}
                        >
                          {achievement.rarity}
                        </span>
                      </div>

                      <h3
                        className={`text-lg font-black mb-2 ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {achievement.title}
                      </h3>
                      <p
                        className={`text-sm mb-4 ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {achievement.description}
                      </p>

                      {/* Rewards */}
                      <div className="flex gap-2 mb-3">
                        <div
                          className={`flex-1 px-3 py-2 rounded-lg ${
                            isDark ? "bg-yellow-500/10" : "bg-yellow-50"
                          }`}
                        >
                          <Coins
                            className={`w-4 h-4 inline mr-1 ${
                              isDark ? "text-yellow-400" : "text-yellow-600"
                            }`}
                          />
                          <span
                            className={`text-sm font-bold ${
                              isDark ? "text-yellow-300" : "text-yellow-700"
                            }`}
                          >
                            {achievement.coinReward}
                          </span>
                        </div>
                        <div
                          className={`flex-1 px-3 py-2 rounded-lg ${
                            isDark ? "bg-green-500/10" : "bg-green-50"
                          }`}
                        >
                          <Zap
                            className={`w-4 h-4 inline mr-1 ${
                              isDark ? "text-green-400" : "text-green-600"
                            }`}
                            fill="currentColor"
                          />
                          <span
                            className={`text-sm font-bold ${
                              isDark ? "text-green-300" : "text-green-700"
                            }`}
                          >
                            {achievement.xpReward}
                          </span>
                        </div>
                      </div>

                      {achievement.earned && achievement.earnedDate && (
                        <p
                          className={`text-xs ${
                            isDark ? "text-green-400" : "text-green-600"
                          }`}
                        >
                          ✓ Earned on {new Date(achievement.earnedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </DualThemeGlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <div>
        <h2
          className={`text-3xl font-black mb-6 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          🏅 Leaderboard
        </h2>
        <DualThemeGlassCard isDark={isDark}>
          <div className="p-6">
            <div className="space-y-3">
              {leaderboard && leaderboard.length > 0 ? (
                leaderboard.map((user, index) => (
                  <motion.div
                    key={user.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ${
                      user.username === "You"
                        ? isDark
                          ? "bg-green-500/20 border-2 border-green-500/50"
                          : "bg-green-50 border-2 border-green-400/50"
                        : isDark
                        ? "bg-gray-800/30 hover:bg-gray-800/50"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {/* Rank */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${
                        user.rank === 1
                          ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white"
                          : user.rank === 2
                          ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white"
                          : user.rank === 3
                          ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                          : isDark
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {user.rank}
                    </div>

                    {/* Avatar */}
                    <div className="text-3xl">{user.avatar || "👤"}</div>

                    {/* Name */}
                    <div className="flex-1">
                      <p
                        className={`font-bold ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {user.username}
                        {user.username === "You" && (
                          <span
                            className={`ml-2 text-xs px-2 py-1 rounded-full ${
                              isDark
                                ? "bg-green-500/30 text-green-300"
                                : "bg-green-200 text-green-700"
                            }`}
                          >
                            You
                          </span>
                        )}
                      </p>
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        <Zap className="w-3 h-3 inline mr-1" fill="currentColor" />
                        {user.xp.toLocaleString()} XP • Level {user.level}
                      </p>
                    </div>

                    {/* Streak */}
                    <div
                      className={`px-3 py-1 rounded-lg ${
                        isDark ? "bg-orange-500/20" : "bg-orange-50"
                      }`}
                    >
                      <Flame
                        className={`w-4 h-4 inline mr-1 ${
                          isDark ? "text-orange-400" : "text-orange-600"
                        }`}
                        fill="currentColor"
                      />
                      <span
                        className={`font-bold ${
                          isDark ? "text-orange-300" : "text-orange-700"
                        }`}
                      >
                        {user.streak}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  No users in the leaderboard yet.
                </p>
              )}
            </div>
          </div>
        </DualThemeGlassCard>
      </div>

      {/* Check-in Modal */}
      <AnimatePresence>
        {checkInModal.show && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center"
          >
            <DualThemeGlassCard isDark={isDark} className="p-8 w-96">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`text-xl font-black ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {checkInModal.success ? "Success!" : "Oops!"}
                </h3>
                <button
                  onClick={closeModal}
                  className={`w-6 h-6 text-gray-500 hover:text-gray-700 ${
                    isDark ? "hover:text-gray-300" : ""
                  }`}
                >
                  <X />
                </button>
              </div>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {checkInModal.message}
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={closeModal}
                  className={`px-4 py-2 rounded-lg font-bold ${
                    isDark
                      ? "bg-gradient-to-r from-green-600 to-green-700 text-white"
                      : "bg-gradient-to-r from-green-500 to-green-600 text-white"
                  }`}
                >
                  <Check className="w-4 h-4 inline mr-2" />
                  Close
                </button>
              </div>
            </DualThemeGlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}