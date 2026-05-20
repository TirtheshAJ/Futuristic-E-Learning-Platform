import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useOutletContext, Link } from "react-router";
import { DualThemeGlassCard } from "../components/DualThemeGlassCard";
import { Play, Lock, CheckCircle, Clock, Award, Search, Filter, Coins, X, Check, ShoppingBag } from "lucide-react";
import { getAllCourses } from "../data/courseData";
import { useUser } from "../context/UserContext";

interface LayoutContext {
  isDark: boolean;
}

export function LecturesPage() {
  const { isDark } = useOutletContext<LayoutContext>();
  const { userData, unlockCourse } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [unlockModal, setUnlockModal] = useState<{
    show: boolean;
    courseId: string;
    courseName: string;
    cost: number;
    success: boolean;
    insufficient: boolean;
  }>({
    show: false,
    courseId: "",
    courseName: "",
    cost: 0,
    success: false,
    insufficient: false,
  });

  const courses = getAllCourses().map((course) => ({
    ...course,
    isLocked: !userData.unlockedCourses.includes(course.id),
  }));

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = filterDifficulty === "All" || course.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const handleUnlockAttempt = (courseId: string, courseName: string, cost: number) => {
    setUnlockModal({
      show: true,
      courseId,
      courseName,
      cost,
      success: false,
      insufficient: false,
    });
  };

  const handleUnlock = async () => {
    if (userData.coins < unlockModal.cost) {
      setUnlockModal({
        ...unlockModal,
        insufficient: true,
        success: false,
      });
    } else {
      const success = await unlockCourse(unlockModal.courseId, unlockModal.cost);
      setUnlockModal({
        ...unlockModal,
        success,
        insufficient: false,
      });
    }
  };

  const closeModal = () => {
    setUnlockModal({
      show: false,
      courseId: "",
      courseName: "",
      cost: 0,
      success: false,
      insufficient: false,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1
          className={`text-5xl font-black mb-4 transition-colors duration-300 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          📚 All Lectures
        </h1>
        <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          Choose a course and start learning. Track your progress and earn XP!
        </p>
      </motion.div>

      {/* Search and Filter */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 ${
              isDark
                ? "bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
                : "bg-white border-green-200 text-gray-900 placeholder-gray-500"
            }`}
          />
        </div>

        <div className="relative">
          <Filter
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 ${
              isDark
                ? "bg-gray-800/50 border-green-500/30 text-white"
                : "bg-white border-green-200 text-gray-900"
            }`}
          >
            <option>All</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <DualThemeGlassCard isDark={isDark}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{course.icon}</div>
                    <div>
                      <h3
                        className={`text-xl font-black transition-colors duration-300 ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            course.difficulty === "Beginner"
                              ? "bg-green-500/20 text-green-400"
                              : course.difficulty === "Intermediate"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {course.difficulty}
                        </span>
                        <span className={isDark ? "text-gray-400 text-xs" : "text-gray-600 text-xs"}>
                          <Clock className="w-3 h-3 inline mr-1" />
                          {course.duration}
                        </span>
                        {!course.isLocked && course.lectures.length > 0 && (
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                            🎥 {course.lectures.length} Videos
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {course.isLocked && (
                    <Lock className={isDark ? "w-5 h-5 text-yellow-400" : "w-5 h-5 text-yellow-600"} />
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                      {course.completedLectures} / {course.totalLectures} lectures
                    </span>
                    <span className={`font-bold ${isDark ? "text-green-400" : "text-green-600"}`}>
                      {Math.round((course.completedLectures / course.totalLectures) * 100)}%
                    </span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${isDark ? "bg-gray-800" : "bg-gray-200"}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isDark
                          ? "bg-gradient-to-r from-green-500 to-green-600"
                          : "bg-gradient-to-r from-green-400 to-green-500"
                      }`}
                      style={{
                        width: `${(course.completedLectures / course.totalLectures) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {!course.isLocked && course.lectures.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {course.lectures.slice(0, 3).map((lecture) => (
                      <div
                        key={lecture.id}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors duration-300 ${
                          isDark ? "hover:bg-gray-800/30" : "hover:bg-gray-50"
                        }`}
                      >
                        {lecture.completed ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Play className={isDark ? "w-4 h-4 text-gray-500" : "w-4 h-4 text-gray-400"} />
                        )}
                        <span
                          className={`flex-1 text-sm ${
                            lecture.completed
                              ? isDark
                                ? "text-gray-400 line-through"
                                : "text-gray-500 line-through"
                              : isDark
                              ? "text-gray-200"
                              : "text-gray-700"
                          }`}
                        >
                          {lecture.title}
                        </span>
                        <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                          {lecture.duration}
                        </span>
                      </div>
                    ))}
                    {course.lectures.length > 3 && (
                      <p className={`text-xs text-center ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                        +{course.lectures.length - 3} more lectures
                      </p>
                    )}
                  </div>
                )}

                {course.isLocked ? (
                  <motion.button
                    onClick={() => handleUnlockAttempt(course.id, course.title, 2500)}
                    className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${
                      isDark
                        ? "bg-yellow-600/30 text-yellow-400 border border-yellow-500/50 hover:bg-yellow-600/40"
                        : "bg-yellow-100 text-yellow-700 border border-yellow-300 hover:bg-yellow-200"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Lock className="w-5 h-5 inline mr-2" />
                    Unlock Course (2500 coins)
                  </motion.button>
                ) : (
                  <Link to={`/lectures/${course.id}`}>
                    <motion.button
                      className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 ${
                        isDark
                          ? "bg-gradient-to-r from-green-600 to-green-700 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                          : "bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {course.completedLectures === course.totalLectures ? (
                        <>
                          <Award className="w-5 h-5 inline mr-2" />
                          Review Course
                        </>
                      ) : course.completedLectures > 0 ? (
                        <>
                          <Play className="w-5 h-5 inline mr-2" />
                          Continue Learning
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 inline mr-2" />
                          Start Course
                        </>
                      )}
                    </motion.button>
                  </Link>
                )}
              </div>
            </DualThemeGlassCard>
          </motion.div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            No courses found matching your criteria.
          </p>
        </div>
      )}

      {/* Unlock Modal */}
      <AnimatePresence>
        {unlockModal.show && !unlockModal.success && !unlockModal.insufficient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full"
            >
              <DualThemeGlassCard isDark={isDark}>
                <div className="p-8">
                  <h2 className={`text-2xl font-black mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                    Unlock Course
                  </h2>
                  <p className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Do you want to unlock <span className="font-bold">{unlockModal.courseName}</span>?
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div
                      className={`p-4 rounded-lg text-center ${
                        isDark ? "bg-yellow-500/10" : "bg-yellow-50"
                      }`}
                    >
                      <p className={`text-xs mb-1 ${isDark ? "text-yellow-400" : "text-yellow-600"}`}>
                        Cost
                      </p>
                      <div className="flex items-center justify-center gap-1">
                        <Coins className="w-5 h-5" />
                        <span className="font-black text-xl">{unlockModal.cost}</span>
                      </div>
                    </div>
                    <div
                      className={`p-4 rounded-lg text-center ${
                        isDark ? "bg-green-500/10" : "bg-green-50"
                      }`}
                    >
                      <p className={`text-xs mb-1 ${isDark ? "text-green-400" : "text-green-600"}`}>
                        Your Balance
                      </p>
                      <div className="flex items-center justify-center gap-1">
                        <Coins className="w-5 h-5" />
                        <span className="font-black text-xl">{userData.coins}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      onClick={closeModal}
                      className={`flex-1 py-3 rounded-lg font-bold transition-all duration-300 ${
                        isDark
                          ? "bg-gray-800 text-white hover:bg-gray-700"
                          : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleUnlock}
                      className={`flex-1 py-3 rounded-lg font-bold text-white transition-all duration-300 ${
                        isDark
                          ? "bg-gradient-to-r from-green-600 to-green-700"
                          : "bg-gradient-to-r from-green-500 to-green-600"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Lock className="w-5 h-5 inline mr-2" />
                      Unlock Now
                    </motion.button>
                  </div>
                </div>
              </DualThemeGlassCard>
            </motion.div>
          </motion.div>
        )}

        {/* Success Modal */}
        {unlockModal.show && unlockModal.success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full"
            >
              <DualThemeGlassCard isDark={isDark}>
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <Check className="w-20 h-20 text-green-500 mx-auto mb-4" />
                  </motion.div>
                  <h2 className="text-3xl font-black mb-4 text-green-500">Course Unlocked!</h2>
                  <p className={`mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    You've successfully unlocked:
                  </p>
                  <p className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
                    {unlockModal.courseName}
                  </p>

                  <div className={`p-4 rounded-lg mb-6 ${isDark ? "bg-gray-800/50" : "bg-gray-100"}`}>
                    <p className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Remaining Balance
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <Coins
                        className={isDark ? "w-6 h-6 text-yellow-400" : "w-6 h-6 text-yellow-600"}
                      />
                      <span
                        className={`text-3xl font-black ${isDark ? "text-yellow-300" : "text-yellow-700"}`}
                      >
                        {userData.coins.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <motion.button
                    onClick={closeModal}
                    className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 ${
                      isDark
                        ? "bg-gradient-to-r from-green-600 to-green-700"
                        : "bg-gradient-to-r from-green-500 to-green-600"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Learning
                  </motion.button>
                </div>
              </DualThemeGlassCard>
            </motion.div>
          </motion.div>
        )}

        {/* Insufficient Balance Modal */}
        {unlockModal.show && unlockModal.insufficient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full"
            >
              <DualThemeGlassCard isDark={isDark}>
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <X className="w-20 h-20 text-red-500 mx-auto mb-4" />
                  </motion.div>
                  <h2
                    className={`text-3xl font-black mb-4 ${isDark ? "text-red-400" : "text-red-600"}`}
                  >
                    Insufficient Balance
                  </h2>
                  <p className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    You don't have enough coins to unlock this course.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className={`p-4 rounded-lg ${isDark ? "bg-red-500/10" : "bg-red-50"}`}>
                      <p className={`text-xs ${isDark ? "text-red-400" : "text-red-600"}`}>Required</p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <Coins className="w-4 h-4" />
                        <span className="font-bold">{unlockModal.cost}</span>
                      </div>
                    </div>
                    <div className={`p-4 rounded-lg ${isDark ? "bg-yellow-500/10" : "bg-yellow-50"}`}>
                      <p className={`text-xs ${isDark ? "text-yellow-400" : "text-yellow-600"}`}>
                        Your Balance
                      </p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <Coins className="w-4 h-4" />
                        <span className="font-bold">{userData.coins}</span>
                      </div>
                    </div>
                  </div>

                  <p className={`text-sm mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Complete courses and quizzes to earn more coins, or visit the store for discount coupons!
                  </p>

                  <div className="flex gap-3">
                    <motion.button
                      onClick={closeModal}
                      className={`flex-1 py-3 rounded-lg font-bold transition-all duration-300 ${
                        isDark
                          ? "bg-gray-800 text-white hover:bg-gray-700"
                          : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Close
                    </motion.button>
                    <Link to="/store" className="flex-1">
                      <motion.button
                        className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 ${
                          isDark
                            ? "bg-gradient-to-r from-green-600 to-green-700"
                            : "bg-gradient-to-r from-green-500 to-green-600"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ShoppingBag className="w-5 h-5 inline mr-2" />
                        Visit Store
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </DualThemeGlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}