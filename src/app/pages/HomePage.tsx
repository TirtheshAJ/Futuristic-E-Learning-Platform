import { motion } from "motion/react";
import { useOutletContext, Link } from "react-router";
import { DualThemeHero } from "../components/DualThemeHero";
import { DualThemeCourseCard } from "../components/DualThemeCourseCard";
import { DualThemeStreakFire } from "../components/DualThemeStreakFire";
import { DualThemeXPProgress } from "../components/DualThemeXPProgress";
import { DualThemeGlassCard } from "../components/DualThemeGlassCard";
import { BookOpen, FileQuestion, Trophy } from "lucide-react";
import { useUser } from "../context/UserContext";
import { getAllCourses } from "../data/courseData";

interface LayoutContext {
  isDark: boolean;
}

export function HomePage() {
  const { isDark } = useOutletContext<LayoutContext>();
  const { userData } = useUser();

  // Filter to show unlocked courses or all courses if premium
  const allCourses = getAllCourses();
  const displayCourses = userData.hasPremium
    ? allCourses
    : allCourses.filter(course => userData.unlockedCourses.includes(course.id));

  const sections = [
    {
      title: "Lectures",
      icon: BookOpen,
      description: "Interactive video courses with coding challenges",
      count: `${displayCourses.length} Active`,
      path: "/lectures",
    },
    {
      title: "Quizzes",
      icon: FileQuestion,
      description: "Test your knowledge and earn bonus XP",
      count: "7 Available",
      path: "/quizzes",
    },
    {
      title: "Streak & Rewards",
      icon: Trophy,
      description: "Daily challenges and exclusive achievements",
      count: `${userData.streak} Day Streak`,
      path: "/streak-rewards",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <DualThemeHero isDark={isDark} />

      {/* Primary Sections */}
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
              <Link to={section.path}>
                <DualThemeGlassCard isDark={isDark}>
                  <div className="p-8 space-y-4 text-center cursor-pointer">
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
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Gamification Dashboard */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <DualThemeGlassCard isDark={isDark}>
          <div className="p-8">
            <h2
              className={`text-3xl font-black mb-8 flex items-center gap-3 transition-colors duration-300 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              <span className="text-4xl">🎮</span>
              Your Gaming Stats
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Streak */}
              <div className="flex justify-center">
                <DualThemeStreakFire days={userData.streak} isDark={isDark} />
              </div>

              {/* XP Progress */}
              <div className="flex items-center">
                <DualThemeXPProgress 
                  currentXP={userData.xp} 
                  requiredXP={userData.level * 1000} 
                  level={userData.level} 
                  isDark={isDark} 
                />
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    isDark
                      ? "bg-gray-800/50 border-green-500/30"
                      : "bg-gray-50 border-green-200"
                  }`}
                >
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Total Courses
                  </p>
                  <p
                    className={`text-3xl font-black transition-colors duration-300 ${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {allCourses.length}
                  </p>
                </div>
                <div
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    isDark
                      ? "bg-gray-800/50 border-green-500/30"
                      : "bg-gray-50 border-green-200"
                  }`}
                >
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {userData.hasPremium ? "Premium Active" : "Completed"}
                  </p>
                  <p
                    className={`text-3xl font-black transition-colors duration-300 ${
                      isDark ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {userData.hasPremium ? "👑" : displayCourses.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DualThemeGlassCard>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2
            className={`text-4xl font-black mb-2 transition-colors duration-300 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Premium Courses
          </h2>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Master the fundamentals and unlock advanced paths
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayCourses.map((course, index) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <DualThemeCourseCard {...course} isDark={isDark} />
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}