// API Service Layer - Handles all HTTP requests to backend

import type {
  ApiResponse,
  AuthResponse,
  User,
  Course,
  Lecture,
  Quiz,
  QuizAttempt,
  UserStreak,
  UserCoins,
  CoinTransaction,
  Achievement,
  UserXP,
  LeaderboardEntry,
  DashboardStats,
  WeeklyActivity,
  CourseProgress,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  UpdateThemeRequest,
  UnlockCourseRequest,
  SubmitQuizRequest,
  PaginatedResponse,
} from '../types/api.types';

// Base API URL - Replace with your actual backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// Token management
let accessToken: string | null = null;

export const setAccessToken = (token: string) => {
  accessToken = token;
  localStorage.setItem('accessToken', token);
};

export const getAccessToken = (): string | null => {
  if (!accessToken) {
    accessToken = localStorage.getItem('accessToken');
  }
  return accessToken;
};

export const clearAccessToken = () => {
  accessToken = null;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// HTTP Client with automatic token injection
class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = getAccessToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle 401 - Token expired, try refresh
        if (response.status === 401) {
          const refreshed = await this.refreshToken();
          if (refreshed) {
            // Retry original request
            return this.request<T>(endpoint, options);
          } else {
            clearAccessToken();
            window.location.href = '/login';
          }
        }
        
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

const api = new ApiClient();

// ==================== AUTH APIs ====================

export const authApi = {
  register: (data: RegisterRequest) =>
    api.post<AuthResponse>('/auth/register', data),

  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data),

  logout: () =>
    api.post('/auth/logout'),

  verifyEmail: (token: string) =>
    api.post('/auth/verify-email', { token }),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),

  getCurrentUser: () =>
    api.get<User>('/auth/me'),

  googleLogin: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },
};

// ==================== USER APIs ====================

export const userApi = {
  getProfile: () =>
    api.get<User>('/users/profile'),

  updateProfile: (data: UpdateProfileRequest) =>
    api.put<User>('/users/profile', data),

  updateTheme: (data: UpdateThemeRequest) =>
    api.put<User>('/users/theme', data),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return fetch(`${API_BASE_URL}/users/avatar`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
      body: formData,
    });
  },

  getStats: () =>
    api.get<DashboardStats>('/users/stats'),
};

// ==================== COURSE APIs ====================

export const courseApi = {
  getAllCourses: () =>
    api.get<Course[]>('/courses'),

  getCourseById: (id: string) =>
    api.get<Course>(`/courses/${id}`),

  getCourseLectures: (courseId: string) =>
    api.get<Lecture[]>(`/courses/${courseId}/lectures`),

  getCourseProgress: (courseId: string) =>
    api.get<CourseProgress>(`/courses/${courseId}/progress`),

  unlockCourse: (data: UnlockCourseRequest) =>
    api.post<{ success: boolean }>('/courses/' + data.courseId + '/unlock', data),
};

// ==================== LECTURE APIs ====================

export const lectureApi = {
  getLectureById: (id: string) =>
    api.get<Lecture>(`/lectures/${id}`),

  completeLecture: (lectureId: string, timeSpentMinutes: number) =>
    api.post(`/lectures/${lectureId}/complete`, { timeSpentMinutes }),

  updateProgress: (lectureId: string, progressPercentage: number) =>
    api.post(`/lectures/${lectureId}/progress`, { progressPercentage }),
};

// ==================== QUIZ APIs ====================

export const quizApi = {
  getAllQuizzes: () =>
    api.get<Quiz[]>('/quizzes'),

  getQuizById: (id: string) =>
    api.get<Quiz>(`/quizzes/${id}`),

  startQuiz: (quizId: string) =>
    api.post<{ attemptId: string; questions: any[] }>(`/quizzes/${quizId}/start`),

  submitQuiz: (data: SubmitQuizRequest) =>
    api.post<QuizAttempt>(`/quizzes/${data.quizId}/submit`, data),

  getUserAttempts: (quizId: string) =>
    api.get<QuizAttempt[]>(`/quizzes/${quizId}/attempts`),

  getQuizAnalytics: (quizId: string) =>
    api.get(`/quizzes/${quizId}/analytics`),
};

// ==================== GAMIFICATION APIs ====================

export const gamificationApi = {
  // Streaks
  getStreakData: () =>
    api.get<UserStreak>('/streaks'),

  dailyCheckIn: () =>
    api.post<UserStreak>('/streaks/check-in', { date: new Date().toISOString() }),

  // XP & Levels
  getXPData: () =>
    api.get<UserXP>('/xp'),

  // Coins
  getCoinBalance: () =>
    api.get<UserCoins>('/coins'),

  getTransactions: (page = 1, limit = 20) =>
    api.get<PaginatedResponse<CoinTransaction>>(`/coins/transactions?page=${page}&limit=${limit}`),

  spendCoins: (amount: number, purpose: string, referenceId?: string) =>
    api.post<UserCoins>('/coins/spend', { amount, purpose, referenceId }),

  // Achievements
  getAllAchievements: () =>
    api.get<Achievement[]>('/achievements'),

  getEarnedAchievements: () =>
    api.get<Achievement[]>('/achievements/earned'),

  claimAchievement: (achievementId: string) =>
    api.post(`/achievements/claim`, { achievementId }),
};

// ==================== LEADERBOARD APIs ====================

export const leaderboardApi = {
  getGlobalLeaderboard: (page = 1, limit = 50) =>
    api.get<PaginatedResponse<LeaderboardEntry>>(`/leaderboard?page=${page}&limit=${limit}`),

  getWeeklyLeaderboard: (page = 1, limit = 50) =>
    api.get<PaginatedResponse<LeaderboardEntry>>(`/leaderboard/weekly?page=${page}&limit=${limit}`),

  getUserRank: () =>
    api.get<{ rank: number; percentile: number }>('/leaderboard/rank'),
};

// ==================== ANALYTICS APIs ====================

export const analyticsApi = {
  getDashboard: () =>
    api.get<DashboardStats>('/analytics/dashboard'),

  getWeeklyActivity: (weeks = 4) =>
    api.get<WeeklyActivity[]>(`/analytics/weekly?weeks=${weeks}`),

  getCourseAnalytics: (courseId: string) =>
    api.get(`/analytics/course/${courseId}`),

  getQuizAccuracy: () =>
    api.get('/analytics/quiz-accuracy'),

  getLearningTime: (startDate?: string, endDate?: string) =>
    api.get(`/analytics/learning-time?start=${startDate}&end=${endDate}`),
};

// Export default API client for custom requests
export default api;
