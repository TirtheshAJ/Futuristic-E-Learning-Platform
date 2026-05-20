import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useOutletContext, useParams, Link } from "react-router";
import { DualThemeGlassCard } from "../components/DualThemeGlassCard";
import { Play, CheckCircle, Lock, Clock, Award, ChevronLeft, ChevronRight, BookOpen, FileText } from "lucide-react";
import { getCourseById } from "../data/courseData";
import { useUser } from "../context/UserContext";

interface LayoutContext {
  isDark: boolean;
}

export function CoursePage() {
  const { isDark } = useOutletContext<LayoutContext>();
  const { courseId } = useParams();
  const { userData } = useUser();
  const [selectedLecture, setSelectedLecture] = useState<number>(0);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [videoLoading, setVideoLoading] = useState<boolean>(true);

  // Load course from data
  const courseData = getCourseById(courseId || "");
  
  // Check if user has unlocked this course or has premium
  const isUnlocked = userData.hasPremium || userData.unlockedCourses.includes(courseId || "");
  
  // If course doesn't exist
  if (!courseData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          Course not found
        </h2>
        <Link to="/lectures" className={`mt-4 inline-block ${isDark ? "text-green-400" : "text-green-600"}`}>
          ← Back to Lectures
        </Link>
      </div>
    );
  }
  
  // If course is locked (not in user's unlocked courses and no premium)
  if (!isUnlocked) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <Lock className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-gray-600" : "text-gray-400"}`} />
        <h2 className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
          This course is locked
        </h2>
        <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Unlock this course from the Lectures page to start learning.
        </p>
        <Link 
          to="/lectures" 
          className={`inline-block px-6 py-3 rounded-lg font-bold text-white ${
            isDark
              ? "bg-gradient-to-r from-green-600 to-green-700"
              : "bg-gradient-to-r from-green-500 to-green-600"
          }`}
        >
          Go to Lectures
        </Link>
      </div>
    );
  }
  
  // Course is unlocked, proceed with normal rendering
  const course = courseData;

  useEffect(() => {
    // Reset to first lecture when course changes
    setSelectedLecture(0);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [courseId]);

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          Course not found
        </h2>
        <Link to="/lectures" className={`mt-4 inline-block ${isDark ? "text-green-400" : "text-green-600"}`}>
          ← Back to Lectures
        </Link>
      </div>
    );
  }

  // Safety check for lectures
  if (!course.lectures || course.lectures.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
          No lectures available
        </h2>
        <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          This course doesn't have any lectures yet.
        </p>
        <Link to="/lectures" className={`mt-4 inline-block ${isDark ? "text-green-400" : "text-green-600"}`}>
          ← Back to Lectures
        </Link>
      </div>
    );
  }

  const currentLecture = course.lectures[selectedLecture];

  // Debug logging
  useEffect(() => {
    console.log("📚 Course loaded:", {
      courseId,
      courseName: course?.title,
      totalLectures: course?.lectures?.length,
      currentLectureIndex: selectedLecture,
      currentLecture: currentLecture,
      hasVideoUrl: !!currentLecture?.videoUrl,
      videoUrl: currentLecture?.videoUrl
    });
    
    // Reset video state when lecture changes
    setVideoError(false);
    setVideoLoading(true);
  }, [courseId, selectedLecture, course, currentLecture]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/lectures"
          className={`inline-flex items-center gap-2 text-sm ${
            isDark ? "text-gray-400 hover:text-green-400" : "text-gray-600 hover:text-green-600"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Back to All Lectures
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <DualThemeGlassCard isDark={isDark}>
            <div className="aspect-video bg-black rounded-t-2xl overflow-hidden relative">
              {/* Real YouTube Video Player */}
              {currentLecture && currentLecture.videoUrl ? (
                <iframe
                  key={currentLecture.id} // Force re-render on lecture change
                  src={currentLecture.videoUrl}
                  title={currentLecture.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={() => setVideoLoading(false)}
                  onError={() => setVideoError(true)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                  <div className="text-center p-8">
                    <Play className="w-24 h-24 text-green-500/50 mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-white mb-2">Video Not Available</h3>
                    <p className="text-gray-400 text-sm max-w-md">
                      This lecture's video is currently unavailable. Please check back later or contact support.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2
                    className={`text-2xl font-black mb-2 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {currentLecture.title}
                  </h2>
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Lecture {selectedLecture + 1} of {course.lectures.length}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedLecture(Math.max(0, selectedLecture - 1))}
                    disabled={selectedLecture === 0}
                    className={`p-2 rounded-lg ${
                      selectedLecture === 0
                        ? isDark
                          ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : isDark
                        ? "bg-gray-800 text-white hover:bg-gray-700"
                        : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedLecture(Math.min(course.lectures.length - 1, selectedLecture + 1))
                    }
                    disabled={selectedLecture === course.lectures.length - 1}
                    className={`p-2 rounded-lg ${
                      selectedLecture === course.lectures.length - 1
                        ? isDark
                          ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : isDark
                        ? "bg-gray-800 text-white hover:bg-gray-700"
                        : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {currentLecture.description}
              </p>

              <div className="flex gap-3">
                <motion.button
                  className={`flex-1 py-3 rounded-lg font-bold text-white ${
                    isDark
                      ? "bg-gradient-to-r from-green-600 to-green-700"
                      : "bg-gradient-to-r from-green-500 to-green-600"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="w-5 h-5 inline mr-2" />
                  {currentLecture.completed ? "Watch Again" : "Continue Watching"}
                </motion.button>
                
                {!currentLecture.completed && (
                  <motion.button
                    className={`px-6 py-3 rounded-lg font-bold ${
                      isDark
                        ? "bg-gray-800 text-white hover:bg-gray-700"
                        : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CheckCircle className="w-5 h-5 inline mr-2" />
                    Mark Complete
                  </motion.button>
                )}
              </div>
            </div>
          </DualThemeGlassCard>

          {/* Course Info */}
          <DualThemeGlassCard isDark={isDark}>
            <div className="p-6">
              <h3
                className={`text-xl font-black mb-4 flex items-center gap-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                <BookOpen className="w-5 h-5" />
                About This Course
              </h3>
              <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {course.description}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  className={`p-3 rounded-lg ${
                    isDark ? "bg-gray-800/50" : "bg-gray-50"
                  }`}
                >
                  <FileText className={`w-5 h-5 mb-1 ${isDark ? "text-green-400" : "text-green-600"}`} />
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Lectures
                  </p>
                  <p className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    {course.totalLectures}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    isDark ? "bg-gray-800/50" : "bg-gray-50"
                  }`}
                >
                  <Clock className={`w-5 h-5 mb-1 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Duration
                  </p>
                  <p className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    {course.duration}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    isDark ? "bg-gray-800/50" : "bg-gray-50"
                  }`}
                >
                  <Award className={`w-5 h-5 mb-1 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Difficulty
                  </p>
                  <p className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    {course.difficulty}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    isDark ? "bg-gray-800/50" : "bg-gray-50"
                  }`}
                >
                  <CheckCircle className={`w-5 h-5 mb-1 ${isDark ? "text-green-400" : "text-green-600"}`} />
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Progress
                  </p>
                  <p className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    {Math.round((course.completedLectures / course.totalLectures) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          </DualThemeGlassCard>
        </div>

        {/* Sidebar - Lecture List */}
        <div>
          <DualThemeGlassCard isDark={isDark}>
            <div className="p-6">
              <h3
                className={`text-lg font-black mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Course Content
              </h3>
              
              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                    {course.completedLectures} / {course.totalLectures} lectures
                  </span>
                  <span className={isDark ? "text-green-400" : "text-green-600"}>
                    {Math.round((course.completedLectures / course.totalLectures) * 100)}%
                  </span>
                </div>
                <div
                  className={`h-2 rounded-full overflow-hidden ${
                    isDark ? "bg-gray-800" : "bg-gray-200"
                  }`}
                >
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600"
                    style={{
                      width: `${(course.completedLectures / course.totalLectures) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Lecture List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {course.lectures.map((lecture, index) => (
                  <motion.button
                    key={lecture.id}
                    onClick={() => setSelectedLecture(index)}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-300 ${
                      selectedLecture === index
                        ? isDark
                          ? "bg-green-500/20 border-2 border-green-500/50"
                          : "bg-green-50 border-2 border-green-400/50"
                        : isDark
                        ? "bg-gray-800/30 hover:bg-gray-800/50"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {lecture.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Play
                            className={
                              isDark ? "w-5 h-5 text-gray-500" : "w-5 h-5 text-gray-400"
                            }
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-bold mb-1 ${
                            lecture.completed
                              ? isDark
                                ? "text-gray-400"
                                : "text-gray-600"
                              : isDark
                              ? "text-white"
                              : "text-gray-900"
                          }`}
                        >
                          {lecture.title}
                        </p>
                        <p
                          className={`text-xs ${
                            isDark ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          <Clock className="w-3 h-3 inline mr-1" />
                          {lecture.duration}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </DualThemeGlassCard>
        </div>
      </div>
    </div>
  );
}