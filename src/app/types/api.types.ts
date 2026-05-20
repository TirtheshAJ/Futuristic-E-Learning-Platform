// TypeScript Types and Interfaces for Backend API

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'admin' | 'instructor';
  isEmailVerified: boolean;
  avatarUrl?: string;
  themePreference: 'dark' | 'light';
  createdAt: string;
  lastLogin?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  coinReward: number;
  xpReward: number;
  isLocked: boolean;
  unlockCost: number;
  orderIndex: number;
  isActive: boolean;
  progress?: number; // User-specific progress
  isUnlocked?: boolean; // User-specific unlock status
  createdAt: string;
  updatedAt: string;
}

export interface Lecture {
  id: string;
  courseId: string;
  title: string;
  description: string;
  contentType: 'video' | 'pdf' | 'text' | 'interactive';
  contentUrl: string;
  durationMinutes: number;
  xpReward: number;
  orderIndex: number;
  isActive: boolean;
  isCompleted?: boolean; // User-specific
  createdAt: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string;
  durationMinutes: number;
  passingScore: number;
  totalQuestions: number;
  coinReward: number;
  xpReward: number;
  isActive: boolean;
  bestScore?: number; // User-specific
  attempts?: number; // User-specific
  createdAt: string;
}

export interface Question {
  id: string;
  quizId: string;
  questionText: string;
  questionType: 'multiple_choice';
  options: QuestionOption[];
  explanation?: string;
  points: number;
  orderIndex: number;
}

export interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  answers: Record<string, string>;
  timeTakenSeconds: number;
  passed: boolean;
  coinsEarned: number;
  xpEarned: number;
  startedAt: string;
  submittedAt: string;
}

export interface UserStreak {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  weeklyStreak: number;
  totalActiveDays: number;
  updatedAt: string;
}

export interface CoinTransaction {
  id: string;
  userId: string;
  amount: number;
  transactionType: 'earned' | 'spent' | 'refund';
  source: string;
  referenceId?: string;
  description: string;
  balanceAfter: number;
  createdAt: string;
}

export interface UserCoins {
  userId: string;
  balance: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  criteria: {
    type: string;
    value: number;
  };
  coinReward: number;
  xpReward: number;
  isActive: boolean;
  earned?: boolean; // User-specific
  earnedAt?: string; // User-specific
}

export interface UserXP {
  userId: string;
  currentXp: number;
  level: number;
  totalXpEarned: number;
  nextLevelXp: number; // Calculated
  progressToNextLevel: number; // Calculated percentage
  updatedAt: string;
}

export interface LeaderboardEntry {
  id: string;
  fullName: string;
  avatarUrl?: string;
  level: number;
  currentXp: number;
  totalXpEarned: number;
  currentStreak: number;
  rank: number;
}

export interface CourseProgress {
  userId: string;
  courseId: string;
  progressPercentage: number;
  completedLectures: number;
  totalLectures: number;
  timeSpentMinutes: number;
  lastAccessed: string;
  completedAt?: string;
}

export interface LearningAnalytics {
  date: string;
  totalTimeMinutes: number;
  lecturesCompleted: number;
  quizzesAttempted: number;
  xpEarned: number;
  coinsEarned: number;
}

export interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalQuizzes: number;
  passedQuizzes: number;
  totalTimeMinutes: number;
  currentStreak: number;
  level: number;
  currentXp: number;
  coinBalance: number;
  totalAchievements: number;
  earnedAchievements: number;
  globalRank: number;
}

export interface WeeklyActivity {
  date: string;
  timeMinutes: number;
  xpEarned: number;
  coinsEarned: number;
}

// API Request/Response Types

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  avatarUrl?: string;
}

export interface UpdateThemeRequest {
  themePreference: 'dark' | 'light';
}

export interface UnlockCourseRequest {
  courseId: string;
}

export interface CompleteL LectureRequest {
  lectureId: string;
  timeSpentMinutes: number;
}

export interface StartQuizRequest {
  quizId: string;
}

export interface SubmitQuizRequest {
  quizId: string;
  attemptId: string;
  answers: Record<string, string>; // questionId -> selectedAnswer
  timeTakenSeconds: number;
}

export interface CheckInRequest {
  date: string;
}

// API Response Wrappers

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Types

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
}
