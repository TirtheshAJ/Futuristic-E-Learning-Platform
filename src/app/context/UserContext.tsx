import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { videoService } from "../services/video.service";

interface LeaderboardEntry {
  userId: string;
  username: string;
  xp: number;
  level: number;
  rank: number;
  streak: number;
  avatar?: string;
}

interface UserData {
  coins: number;
  xp: number;
  level: number;
  streak: number;
  lastCheckIn: string | null;
  unlockedCourses: string[];
  purchasedItems: string[];
  discountCoupons: { id: string; discount: number; used: boolean }[];
  coursesWithDynamicVideos: string[];
  completedQuizzes: string[];
  quizScores: { [quizId: string]: number };
  hasPremium: boolean;
}

interface UserContextType {
  userData: UserData;
  setUserData: (data: UserData) => void;
  unlockCourse: (courseId: string, cost: number) => Promise<boolean>;
  purchaseItem: (itemId: string, cost: number) => boolean;
  purchaseCoupon: (couponId: string, discount: number, cost: number) => boolean;
  purchasePremium: (cost: number) => boolean;
  applyCoupon: (couponId: string) => number;
  addCoins: (amount: number) => void;
  addXP: (amount: number) => void;
  completeQuiz: (quizId: string, score: number, earnedCoins: number) => void;
  checkIn: () => boolean;
  loadingDynamicVideos: boolean;
  leaderboard: LeaderboardEntry[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Default user data
const defaultUserData: UserData = {
  coins: 4250,
  xp: 8420,
  level: 15,
  streak: 7,
  lastCheckIn: null,
  unlockedCourses: ["c-programming", "cpp", "java", "python", "html", "os"],
  purchasedItems: [],
  discountCoupons: [],
  coursesWithDynamicVideos: [],
  completedQuizzes: [],
  quizScores: {},
  hasPremium: false,
};

// Calculate level from XP
function calculateLevel(xp: number): number {
  return Math.floor(xp / 1000) + 1;
}

// Load user data from localStorage
function loadUserData(): UserData {
  try {
    const saved = localStorage.getItem("codestreakUserData");
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.level = calculateLevel(parsed.xp);
      return parsed;
    }
  } catch (error) {
    console.error("Failed to load user data:", error);
  }
  return defaultUserData;
}

// Save user data to localStorage
function saveUserData(data: UserData) {
  try {
    localStorage.setItem("codestreakUserData", JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save user data:", error);
  }
}

// Generate mock leaderboard
function generateLeaderboard(currentUser: UserData): LeaderboardEntry[] {
  const mockUsers = [
    { username: "CodeMaster_Pro", xp: 15420, streak: 25 },
    { username: "AlgoNinja_99", xp: 14850, streak: 18 },
    { username: "DevQueen_42", xp: 13920, streak: 32 },
    { username: "ByteWarrior", xp: 12450, streak: 15 },
    { username: "StackOverflow_", xp: 11280, streak: 22 },
    { username: "GitGuru_2024", xp: 10650, streak: 19 },
    { username: "PythonSensei", xp: 9840, streak: 14 },
  ];

  const currentUserEntry: LeaderboardEntry = {
    userId: "current-user",
    username: "You",
    xp: currentUser.xp,
    level: currentUser.level,
    rank: 0,
    streak: currentUser.streak,
  };

  const allUsers = [
    ...mockUsers.map((u, i) => ({
      userId: `user-${i}`,
      username: u.username,
      xp: u.xp,
      level: calculateLevel(u.xp),
      rank: 0,
      streak: u.streak,
    })),
    currentUserEntry,
  ].sort((a, b) => b.xp - a.xp);

  allUsers.forEach((user, index) => {
    user.rank = index + 1;
  });

  return allUsers;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserDataState] = useState<UserData>(loadUserData);
  const [loadingDynamicVideos, setLoadingDynamicVideos] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setLeaderboard(generateLeaderboard(userData));
  }, [userData.xp, userData.level, userData.streak]);

  useEffect(() => {
    saveUserData(userData);
  }, [userData]);

  const setUserData = (data: UserData) => {
    setUserDataState(data);
  };

  const unlockCourse = async (courseId: string, cost: number): Promise<boolean> => {
    if (userData.coins >= cost && !userData.unlockedCourses.includes(courseId)) {
      const newUserData = {
        ...userData,
        coins: userData.coins - cost,
        unlockedCourses: [...userData.unlockedCourses, courseId],
      };
      setUserDataState(newUserData);

      try {
        setLoadingDynamicVideos(true);
        const additionalVideos = await videoService.fetchAdditionalVideos(courseId);
        
        if (additionalVideos.length > 0) {
          setUserDataState({
            ...newUserData,
            coursesWithDynamicVideos: [...newUserData.coursesWithDynamicVideos, courseId],
          });
          
          console.log(`✅ Loaded ${additionalVideos.length} additional videos for ${courseId}`);
        }
      } catch (error) {
        console.error("Failed to fetch additional videos:", error);
      } finally {
        setLoadingDynamicVideos(false);
      }

      return true;
    }
    return false;
  };

  const purchaseItem = (itemId: string, cost: number): boolean => {
    if (userData.coins >= cost && !userData.purchasedItems.includes(itemId)) {
      setUserDataState({
        ...userData,
        coins: userData.coins - cost,
        purchasedItems: [...userData.purchasedItems, itemId],
      });
      return true;
    }
    return false;
  };

  const purchaseCoupon = (couponId: string, discount: number, cost: number): boolean => {
    if (userData.coins >= cost) {
      setUserDataState({
        ...userData,
        coins: userData.coins - cost,
        discountCoupons: [
          ...userData.discountCoupons,
          { id: couponId, discount, used: false },
        ],
      });
      return true;
    }
    return false;
  };

  const purchasePremium = (cost: number): boolean => {
    if (userData.coins >= cost) {
      setUserDataState({
        ...userData,
        coins: userData.coins - cost,
        hasPremium: true,
      });
      return true;
    }
    return false;
  };

  const applyCoupon = (couponId: string): number => {
    const coupon = userData.discountCoupons.find((c) => c.id === couponId && !c.used);
    if (coupon) {
      setUserDataState({
        ...userData,
        discountCoupons: userData.discountCoupons.map((c) =>
          c.id === couponId ? { ...c, used: true } : c
        ),
      });
      return coupon.discount;
    }
    return 0;
  };

  const addCoins = (amount: number) => {
    setUserDataState({
      ...userData,
      coins: userData.coins + amount,
    });
  };

  const addXP = (amount: number) => {
    const newXP = userData.xp + amount;
    const newLevel = calculateLevel(newXP);
    
    setUserDataState({
      ...userData,
      xp: newXP,
      level: newLevel,
    });
  };

  const completeQuiz = (quizId: string, score: number, earnedCoins: number) => {
    const xpEarned = Math.floor(score * 10);
    const newXP = userData.xp + xpEarned;
    const newLevel = calculateLevel(newXP);
    
    const isFirstTime = !userData.completedQuizzes.includes(quizId);
    
    setUserDataState({
      ...userData,
      xp: newXP,
      level: newLevel,
      coins: userData.coins + earnedCoins,
      completedQuizzes: isFirstTime 
        ? [...userData.completedQuizzes, quizId]
        : userData.completedQuizzes,
      quizScores: {
        ...userData.quizScores,
        [quizId]: Math.max(userData.quizScores[quizId] || 0, score),
      },
    });

    console.log(`🎉 Quiz completed! +${xpEarned} XP, +${earnedCoins} coins`);
  };

  const checkIn = (): boolean => {
    const today = new Date().toDateString();
    const lastCheckIn = userData.lastCheckIn ? new Date(userData.lastCheckIn).toDateString() : null;

    if (lastCheckIn === today) {
      return false;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    let newStreak = userData.streak;
    
    if (lastCheckIn === yesterdayStr) {
      newStreak = userData.streak + 1;
    } else if (lastCheckIn && lastCheckIn !== yesterdayStr) {
      newStreak = 1;
    } else {
      newStreak = userData.streak + 1;
    }

    const coinsReward = 50;
    const xpReward = 25;
    const newXP = userData.xp + xpReward;
    const newLevel = calculateLevel(newXP);

    setUserDataState({
      ...userData,
      streak: newStreak,
      lastCheckIn: new Date().toISOString(),
      coins: userData.coins + coinsReward,
      xp: newXP,
      level: newLevel,
    });

    console.log(`🔥 Check-in successful! Streak: ${newStreak} days. +${coinsReward} coins, +${xpReward} XP`);
    return true;
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        unlockCourse,
        purchaseItem,
        purchaseCoupon,
        purchasePremium,
        applyCoupon,
        addCoins,
        addXP,
        completeQuiz,
        checkIn,
        loadingDynamicVideos,
        leaderboard,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}