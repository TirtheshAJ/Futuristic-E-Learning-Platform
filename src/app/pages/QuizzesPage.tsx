import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useOutletContext } from "react-router";
import { DualThemeGlassCard } from "../components/DualThemeGlassCard";
import { CodeEditor } from "../components/CodeEditor";
import {
  Play,
  CheckCircle,
  XCircle,
  Code,
  FileQuestion,
  Trophy,
  ChevronRight,
  ChevronLeft,
  X,
  Coins as CoinsIcon,
  Zap,
  Target,
  Clock,
} from "lucide-react";
import { getAllQuizzes } from "../data/quizData";
import { useUser } from "../context/UserContext";

interface LayoutContext {
  isDark: boolean;
}

type QuizSection = "mcq" | "coding";

export function QuizzesPage() {
  const { isDark } = useOutletContext<LayoutContext>();
  const { completeQuiz } = useUser();
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);
  const [currentSection, setCurrentSection] = useState<QuizSection>("mcq");
  const [currentMCQIndex, setCurrentMCQIndex] = useState(0);
  const [currentCodingIndex, setCurrentCodingIndex] = useState(0);
  const [mcqAnswers, setMCQAnswers] = useState<Record<number, number>>({});
  const [codingAnswers, setCodingAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuizData = getAllQuizzes().find((q) => q.id === activeQuiz);

  const handleStartQuiz = (quizId: number) => {
    setActiveQuiz(quizId);
    setCurrentSection("mcq");
    setCurrentMCQIndex(0);
    setCurrentCodingIndex(0);
    setMCQAnswers({});
    setCodingAnswers({});
    setShowResults(false);
  };

  const handleMCQAnswerSelect = (questionId: number, optionIndex: number) => {
    setMCQAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleNextMCQ = () => {
    if (currentQuizData && currentMCQIndex < currentQuizData.mcqQuestions.length - 1) {
      setCurrentMCQIndex(currentMCQIndex + 1);
    } else {
      // Move to coding section
      setCurrentSection("coding");
      setCurrentCodingIndex(0);
    }
  };

  const handlePreviousMCQ = () => {
    if (currentMCQIndex > 0) {
      setCurrentMCQIndex(currentMCQIndex - 1);
    }
  };

  const handleNextCoding = () => {
    if (currentQuizData && currentCodingIndex < currentQuizData.codingQuestions.length - 1) {
      setCurrentCodingIndex(currentCodingIndex + 1);
    }
  };

  const handlePreviousCoding = () => {
    if (currentCodingIndex > 0) {
      setCurrentCodingIndex(currentCodingIndex - 1);
    } else {
      // Go back to MCQ section
      setCurrentSection("mcq");
      setCurrentMCQIndex(currentQuizData!.mcqQuestions.length - 1);
    }
  };

  const handleSubmitQuiz = () => {
    if (!currentQuizData) return;

    // Calculate MCQ score
    let correctMCQ = 0;
    currentQuizData.mcqQuestions.forEach((q) => {
      if (mcqAnswers[q.id] === q.correctAnswer) {
        correctMCQ++;
      }
    });

    // For coding questions, give partial credit if answered
    let codingScore = 0;
    currentQuizData.codingQuestions.forEach((q) => {
      if (codingAnswers[q.id] && codingAnswers[q.id].trim().length > 20) {
        codingScore += 0.5; // Partial credit for attempting
      }
    });

    const totalQuestions = currentQuizData.mcqQuestions.length + currentQuizData.codingQuestions.length;
    const totalCorrect = correctMCQ + codingScore;
    const finalScore = Math.round((totalCorrect / totalQuestions) * 100);
    
    // Calculate coins earned
    const coinsEarned = finalScore >= currentQuizData.passingScore ? currentQuizData.coinReward : 0;
    
    setScore(finalScore);
    setShowResults(true);
    
    // Update XP and coins in user context
    completeQuiz(activeQuiz!, finalScore, coinsEarned);
  };

  const handleCodeChange = (questionId: number, code: string) => {
    setCodingAnswers((prev) => ({
      ...prev,
      [questionId]: code,
    }));
  };

  const handleCloseQuiz = () => {
    setActiveQuiz(null);
    setShowResults(false);
  };

  if (activeQuiz && currentQuizData) {
    const isPassed = score >= currentQuizData.passingScore;
    const currentMCQ = currentQuizData.mcqQuestions[currentMCQIndex];
    const currentCoding = currentQuizData.codingQuestions[currentCodingIndex];
    const totalProgress =
      currentSection === "mcq"
        ? (currentMCQIndex + 1) / (currentQuizData.mcqQuestions.length + currentQuizData.codingQuestions.length)
        : ((currentQuizData.mcqQuestions.length + currentCodingIndex + 1) /
            (currentQuizData.mcqQuestions.length + currentQuizData.codingQuestions.length));

    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <DualThemeGlassCard isDark={isDark}>
                <div className="p-8">
                  {/* Quiz Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2
                        className={`text-2xl font-black ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {currentQuizData.title}
                      </h2>
                      <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                        {currentSection === "mcq"
                          ? `MCQ ${currentMCQIndex + 1} of ${currentQuizData.mcqQuestions.length}`
                          : `Coding ${currentCodingIndex + 1} of ${currentQuizData.codingQuestions.length}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          currentSection === "mcq"
                            ? isDark
                              ? "bg-green-500/20 text-green-400"
                              : "bg-green-100 text-green-700"
                            : isDark
                            ? "bg-gray-700 text-gray-400"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        <FileQuestion className="w-4 h-4 inline mr-1" />
                        MCQ
                      </div>
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          currentSection === "coding"
                            ? isDark
                              ? "bg-green-500/20 text-green-400"
                              : "bg-green-100 text-green-700"
                            : isDark
                            ? "bg-gray-700 text-gray-400"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        <Code className="w-4 h-4 inline mr-1" />
                        Coding
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div
                    className={`h-2 rounded-full mb-8 overflow-hidden ${
                      isDark ? "bg-gray-800" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300"
                      style={{ width: `${totalProgress * 100}%` }}
                    />
                  </div>

                  {/* MCQ Section */}
                  {currentSection === "mcq" && (
                    <div className="space-y-6">
                      <h3
                        className={`text-xl font-bold ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {currentMCQ.question}
                      </h3>

                      <div className="space-y-3">
                        {currentMCQ.options.map((option, idx) => (
                          <motion.button
                            key={idx}
                            onClick={() => handleMCQAnswerSelect(currentMCQ.id, idx)}
                            className={`w-full p-4 rounded-lg text-left transition-all duration-300 border-2 ${
                              mcqAnswers[currentMCQ.id] === idx
                                ? isDark
                                  ? "border-green-500 bg-green-500/20 text-white"
                                  : "border-green-500 bg-green-50 text-gray-900"
                                : isDark
                                ? "border-gray-700 bg-gray-800/30 text-gray-300 hover:border-green-500/50"
                                : "border-gray-200 bg-white text-gray-700 hover:border-green-300"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="font-bold mr-3">
                              {String.fromCharCode(65 + idx)}.
                            </span>
                            {option}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Coding Section */}
                  {currentSection === "coding" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Question Side */}
                      <div className="space-y-4">
                        <h3
                          className={`text-xl font-bold ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {currentCoding.title}
                        </h3>
                        <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                          {currentCoding.description}
                        </p>

                        {currentCoding.expectedOutput && (
                          <div
                            className={`p-4 rounded-lg ${
                              isDark ? "bg-gray-800/50" : "bg-gray-50"
                            }`}
                          >
                            <p
                              className={`text-sm font-bold mb-2 ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              Expected Output:
                            </p>
                            <code
                              className={`text-sm ${
                                isDark ? "text-green-400" : "text-green-700"
                              }`}
                            >
                              {currentCoding.expectedOutput}
                            </code>
                          </div>
                        )}

                        {currentCoding.hints && currentCoding.hints.length > 0 && (
                          <div
                            className={`p-4 rounded-lg ${
                              isDark ? "bg-blue-500/10 border border-blue-500/30" : "bg-blue-50 border border-blue-200"
                            }`}
                          >
                            <p
                              className={`text-sm font-bold mb-2 ${
                                isDark ? "text-blue-400" : "text-blue-700"
                              }`}
                            >
                              💡 Hints:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                              {currentCoding.hints.map((hint, idx) => (
                                <li
                                  key={idx}
                                  className={`text-sm ${
                                    isDark ? "text-blue-300" : "text-blue-600"
                                  }`}
                                >
                                  {hint}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Code Editor Side */}
                      <div>
                        <CodeEditor
                          initialCode={currentCoding.example}
                          isDark={isDark}
                          onRunCode={(code) => handleCodeChange(currentCoding.id, code)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between mt-8">
                    <motion.button
                      onClick={currentSection === "mcq" ? handlePreviousMCQ : handlePreviousCoding}
                      disabled={currentSection === "mcq" && currentMCQIndex === 0}
                      className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                        currentSection === "mcq" && currentMCQIndex === 0
                          ? isDark
                            ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : isDark
                          ? "bg-gray-800 text-white hover:bg-gray-700"
                          : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                      }`}
                      whileHover={
                        !(currentSection === "mcq" && currentMCQIndex === 0) ? { scale: 1.05 } : {}
                      }
                      whileTap={
                        !(currentSection === "mcq" && currentMCQIndex === 0) ? { scale: 0.95 } : {}
                      }
                    >
                      Previous
                    </motion.button>

                    {currentSection === "coding" &&
                    currentCodingIndex === currentQuizData.codingQuestions.length - 1 ? (
                      <motion.button
                        onClick={handleSubmitQuiz}
                        className={`px-6 py-3 rounded-lg font-bold text-white transition-all duration-300 ${
                          isDark
                            ? "bg-gradient-to-r from-green-600 to-green-700"
                            : "bg-gradient-to-r from-green-500 to-green-600"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Submit Quiz
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={currentSection === "mcq" ? handleNextMCQ : handleNextCoding}
                        className={`px-6 py-3 rounded-lg font-bold text-white transition-all duration-300 ${
                          isDark
                            ? "bg-gradient-to-r from-green-600 to-green-700"
                            : "bg-gradient-to-r from-green-500 to-green-600"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Next
                      </motion.button>
                    )}
                  </div>
                </div>
              </DualThemeGlassCard>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <DualThemeGlassCard isDark={isDark}>
                <div className="p-8 text-center">
                  {/* Result Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="mb-6"
                  >
                    {isPassed ? (
                      <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="w-24 h-24 text-red-500 mx-auto" />
                    )}
                  </motion.div>

                  <h2
                    className={`text-4xl font-black mb-4 ${
                      isPassed ? "text-green-500" : isDark ? "text-red-400" : "text-red-600"
                    }`}
                  >
                    {isPassed ? "Congratulations!" : "Keep Trying!"}
                  </h2>

                  <p className={`text-xl mb-8 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    You scored <span className="font-black">{score}%</span>
                  </p>

                  {/* Rewards */}
                  {isPassed && (
                    <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
                      <div
                        className={`p-4 rounded-lg ${
                          isDark ? "bg-yellow-500/20" : "bg-yellow-50"
                        }`}
                      >
                        <CoinsIcon
                          className={
                            isDark
                              ? "w-8 h-8 text-yellow-400 mx-auto mb-2"
                              : "w-8 h-8 text-yellow-600 mx-auto mb-2"
                          }
                        />
                        <p
                          className={
                            isDark
                              ? "text-yellow-300 font-bold"
                              : "text-yellow-700 font-bold"
                          }
                        >
                          +{currentQuizData.coinReward} Coins
                        </p>
                      </div>
                      <div
                        className={`p-4 rounded-lg ${
                          isDark ? "bg-green-500/20" : "bg-green-50"
                        }`}
                      >
                        <Zap
                          className={
                            isDark
                              ? "w-8 h-8 text-green-400 mx-auto mb-2"
                              : "w-8 h-8 text-green-600 mx-auto mb-2"
                          }
                          fill="currentColor"
                        />
                        <p
                          className={
                            isDark
                              ? "text-green-300 font-bold"
                              : "text-green-700 font-bold"
                          }
                        >
                          +{currentQuizData.xpReward} XP
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-4 justify-center">
                    <motion.button
                      onClick={handleCloseQuiz}
                      className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                        isDark
                          ? "bg-gray-800 text-white hover:bg-gray-700"
                          : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Back to Quizzes
                    </motion.button>
                    <motion.button
                      onClick={() => handleStartQuiz(activeQuiz)}
                      className={`px-6 py-3 rounded-lg font-bold text-white transition-all duration-300 ${
                        isDark
                          ? "bg-gradient-to-r from-green-600 to-green-700"
                          : "bg-gradient-to-r from-green-500 to-green-600"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Retake Quiz
                    </motion.button>
                  </div>
                </div>
              </DualThemeGlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

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
          📝 All Quizzes
        </h1>
        <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          Test your knowledge with MCQs and coding challenges. Pass with 70%+ to unlock rewards!
        </p>
      </motion.div>

      {/* Quiz Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {getAllQuizzes().map((quiz, index) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <DualThemeGlassCard isDark={isDark}>
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-4xl">{quiz.icon}</div>
                  <div className="flex-1">
                    <h3
                      className={`text-xl font-black mb-1 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {quiz.title}
                    </h3>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {quiz.course}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      quiz.difficulty === "Beginner"
                        ? "bg-green-500/20 text-green-400"
                        : quiz.difficulty === "Intermediate"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {quiz.difficulty}
                  </span>
                </div>

                {/* Question Types */}
                <div className="flex gap-3 mb-4">
                  <div
                    className={`flex-1 p-3 rounded-lg text-center ${
                      isDark ? "bg-blue-500/10" : "bg-blue-50"
                    }`}
                  >
                    <FileQuestion
                      className={`w-5 h-5 mx-auto mb-1 ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                    <p className={`text-xs ${isDark ? "text-blue-300" : "text-blue-700"}`}>
                      {quiz.mcqQuestions.length} MCQs
                    </p>
                  </div>
                  <div
                    className={`flex-1 p-3 rounded-lg text-center ${
                      isDark ? "bg-purple-500/10" : "bg-purple-50"
                    }`}
                  >
                    <Code
                      className={`w-5 h-5 mx-auto mb-1 ${
                        isDark ? "text-purple-400" : "text-purple-600"
                      }`}
                    />
                    <p className={`text-xs ${isDark ? "text-purple-300" : "text-purple-700"}`}>
                      {quiz.codingQuestions.length} Coding
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div
                    className={`p-3 rounded-lg text-center ${
                      isDark ? "bg-gray-800/50" : "bg-gray-50"
                    }`}
                  >
                    <Target
                      className={`w-4 h-4 mx-auto mb-1 ${
                        isDark ? "text-green-400" : "text-green-600"
                      }`}
                    />
                    <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {quiz.totalQuestions} Questions
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-lg text-center ${
                      isDark ? "bg-gray-800/50" : "bg-gray-50"
                    }`}
                  >
                    <Clock
                      className={`w-4 h-4 mx-auto mb-1 ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                    <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {quiz.duration} min
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-lg text-center ${
                      isDark ? "bg-gray-800/50" : "bg-gray-50"
                    }`}
                  >
                    <Trophy
                      className={`w-4 h-4 mx-auto mb-1 ${
                        isDark ? "text-yellow-400" : "text-yellow-600"
                      }`}
                    />
                    <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {quiz.passingScore}% Pass
                    </p>
                  </div>
                </div>

                {/* Rewards */}
                <div className="flex gap-3 mb-4">
                  <div
                    className={`flex-1 p-3 rounded-lg flex items-center gap-2 ${
                      isDark
                        ? "bg-yellow-500/10 border border-yellow-500/30"
                        : "bg-yellow-50 border border-yellow-200"
                    }`}
                  >
                    <CoinsIcon
                      className={isDark ? "w-5 h-5 text-yellow-400" : "w-5 h-5 text-yellow-600"}
                    />
                    <span className={`font-bold ${isDark ? "text-yellow-300" : "text-yellow-700"}`}>
                      {quiz.coinReward}
                    </span>
                  </div>
                  <div
                    className={`flex-1 p-3 rounded-lg flex items-center gap-2 ${
                      isDark
                        ? "bg-green-500/10 border border-green-500/30"
                        : "bg-green-50 border border-green-200"
                    }`}
                  >
                    <Zap
                      className={isDark ? "w-5 h-5 text-green-400" : "w-5 h-5 text-green-600"}
                      fill="currentColor"
                    />
                    <span className={`font-bold ${isDark ? "text-green-300" : "text-green-700"}`}>
                      {quiz.xpReward}
                    </span>
                  </div>
                </div>

                {/* Best Score */}
                {quiz.bestScore !== null && (
                  <div
                    className={`mb-4 p-3 rounded-lg ${
                      isDark ? "bg-green-500/10" : "bg-green-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        Best Score
                      </span>
                      <span
                        className={`font-black text-lg ${
                          isDark ? "text-green-400" : "text-green-600"
                        }`}
                      >
                        {quiz.bestScore}%
                      </span>
                    </div>
                    <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"} mt-1`}>
                      Attempts: {quiz.attempts}
                    </p>
                  </div>
                )}

                {/* CTA */}
                <motion.button
                  onClick={() => handleStartQuiz(quiz.id)}
                  className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 ${
                    isDark
                      ? "bg-gradient-to-r from-green-600 to-green-700 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                      : "bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="w-5 h-5 inline mr-2" />
                  {quiz.attempts > 0 ? "Retake Quiz" : "Start Quiz"}
                </motion.button>
              </div>
            </DualThemeGlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}