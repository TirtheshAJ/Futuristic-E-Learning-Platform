// Video Service - Fetches additional course videos dynamically
// In production, this would call YouTube Data API or your backend

interface VideoMetadata {
  id: number;
  title: string;
  duration: string;
  type: "video";
  completed: boolean;
  videoUrl: string;
  description: string;
}

interface DynamicVideoSet {
  [courseId: string]: VideoMetadata[];
}

// Simulated dynamic video library that would be fetched from YouTube API
const dynamicVideosLibrary: DynamicVideoSet = {
  "c-programming": [
    {
      id: 10,
      title: "Advanced Pointers and Memory Management",
      duration: "45 min",
      type: "video",
      completed: false,
      videoUrl: "https://www.youtube.com/embed/zuegQmMdy8M",
      description: "Deep dive into pointers, memory allocation, and management in C.",
    },
    {
      id: 11,
      title: "Structures and Unions",
      duration: "38 min",
      type: "video",
      completed: false,
      videoUrl: "https://www.youtube.com/embed/yOdd3uYIT6k",
      description: "Learn how to create and use structures and unions in C.",
    },
    {
      id: 12,
      title: "File Handling in C",
      duration: "35 min",
      type: "video",
      completed: false,
      videoUrl: "https://www.youtube.com/embed/vVUF-7dBmV4",
      description: "Complete guide to file operations in C programming.",
    },
  ],
  cpp: [
    {
      id: 10,
      title: "Templates in C++",
      duration: "42 min",
      type: "video",
      completed: false,
      videoUrl: "https://www.youtube.com/embed/I-hZkUa9mIs",
      description: "Master function and class templates in C++.",
    },
    {
      id: 11,
      title: "STL Containers Deep Dive",
      duration: "55 min",
      type: "video",
      completed: false,
      videoUrl: "https://www.youtube.com/embed/RRVYpIET_RU",
      description: "Comprehensive guide to Standard Template Library containers.",
    },
    {
      id: 12,
      title: "Exception Handling",
      duration: "30 min",
      type: "video",
      completed: false,
      videoUrl: "https://www.youtube.com/embed/8RqG5EcXJoU",
      description: "Error handling using try, catch, and throw in C++.",
    },
  ],
  java: [
    {
      id: 10,
      title: "Exception Handling in Java",
      duration: "40 min",
      type: "video",
      completed: false,
      videoUrl: "https://www.youtube.com/embed/1XAfapkBQjk",
      description: "Complete guide to exception handling in Java.",
    },
    {
      id: 11,
      title: "Multithreading in Java",
      duration: "50 min",
      type: "video",
      completed: false,
      videoUrl: "https://www.youtube.com/embed/r_MbozD32eo",
      description: "Learn concurrent programming with Java threads.",
    },
    {
      id: 12,
      title: "Java Streams and Lambda",
      duration: "45 min",
      type: "video",
      completed: false,
      videoUrl: "https://www.youtube.com/embed/t1-YZ6bF-g0",
      description: "Modern Java with streams and lambda expressions.",
    },
  ],
  python: [
    {
      id: 10,
      title: "Decorators in Python",
      duration: "32 min",
      type: "video",
      completed: false,
      videoUrl: "https://www.youtube.com/embed/FsAPt_9Bf3U",
      description: "Understanding and creating Python decorators.",
    },
    {
      id: 11,
      title: "Generators and Iterators",
      duration: "28 min",
      type: "video",
      completed: false,
      videoUrl: "https://www.youtube.com/embed/bD05uGo_sVI",
      description: "Memory-efficient iteration with generators.",
    },
    {
      id: 12,
      title: "Python Web Scraping",
      duration: "40 min",
      type: "video",
      completed: false,
      videoUrl: "https://www.youtube.com/embed/XVv6mJpFOb0",
      description: "Web scraping with BeautifulSoup and requests.",
    },
  ],
  html: [
    {
      id: 10,
      title: "CSS Fundamentals",
      duration: "35 min",
      type: "video",
      completed: false,
      videoUrl: "https://www.youtube.com/embed/Edsxf_NBFrw",
      description: "Learn CSS styling basics and selectors.",
    },
    {
      id: 11,
      title: "Responsive Web Design",
      duration: "40 min",
      type: "video",
      completed: false,
      videoUrl: "https://www.youtube.com/embed/bn-DQCifeQQ",
      description: "Creating responsive websites with media queries.",
    },
    {
      id: 12,
      title: "JavaScript Basics",
      duration: "45 min",
      type: "video",
      completed: false,
      videoUrl: "https://www.youtube.com/embed/hKB-YGF14SY",
      description: "Introduction to JavaScript programming.",
    },
  ],
  "operating-system": [
    {
      id: 10,
      title: "Virtual Memory Management",
      duration: "42 min",
      type: "video",
      completed: false,
      videoUrl: "https://www.youtube.com/embed/qcBIvnQt0Bw",
      description: "Advanced virtual memory concepts and implementation.",
    },
    {
      id: 11,
      title: "Linux Kernel Architecture",
      duration: "50 min",
      type: "video",
      completed: false,
      videoUrl: "https://www.youtube.com/embed/vyenmLqJQjs",
      description: "Understanding Linux kernel structure and components.",
    },
    {
      id: 12,
      title: "Real-Time Operating Systems",
      duration: "38 min",
      type: "video",
      completed: false,
      videoUrl: "https://www.youtube.com/embed/F18RiREDkwE",
      description: "Introduction to RTOS and scheduling algorithms.",
    },
  ],
  microprocessor: [
    {
      id: 10,
      title: "Advanced 8086 Programming",
      duration: "48 min",
      type: "video",
      completed: false,
      videoUrl: "https://www.youtube.com/embed/45Gxa1OXbtU",
      description: "Complex assembly programs for 8086 processor.",
    },
    {
      id: 11,
      title: "Interfacing with Peripherals",
      duration: "52 min",
      type: "video",
      completed: false,
      videoUrl: "https://www.youtube.com/embed/kqIM75A_Ks0",
      description: "Connecting and programming peripheral devices.",
    },
    {
      id: 12,
      title: "Microcontroller Basics",
      duration: "45 min",
      type: "video",
      completed: false,
      videoUrl: "https://www.youtube.com/embed/7vHJ7bQzkj0",
      description: "Introduction to microcontrollers and embedded systems.",
    },
  ],
};

// Service to fetch additional videos when course is unlocked
export const videoService = {
  /**
   * Fetches additional videos for a course
   * In production, this would call YouTube Data API or backend
   */
  fetchAdditionalVideos: async (courseId: string): Promise<VideoMetadata[]> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return additional videos for the course
    const additionalVideos = dynamicVideosLibrary[courseId] || [];
    
    return additionalVideos;
  },

  /**
   * Searches for videos by topic (for future enhancement)
   * Would use YouTube Data API search endpoint
   */
  searchVideos: async (query: string, maxResults: number = 5): Promise<VideoMetadata[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock search results
    // In production: Call YouTube Data API with query
    console.log(`Searching for videos with query: ${query}`);
    
    return [];
  },

  /**
   * Gets recommended videos based on user progress
   */
  getRecommendedVideos: async (
    courseId: string,
    completedLectures: number[]
  ): Promise<VideoMetadata[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Get all additional videos for course
    const allVideos = dynamicVideosLibrary[courseId] || [];
    
    // Filter based on progress (simple recommendation logic)
    // In production: Use ML/AI for personalized recommendations
    return allVideos.slice(0, 2);
  },
};

// Helper function to merge base course videos with dynamic videos
export function mergeCourseVideos(
  baseVideos: VideoMetadata[],
  dynamicVideos: VideoMetadata[]
): VideoMetadata[] {
  return [...baseVideos, ...dynamicVideos];
}

// Helper to get video count for a course
export function getDynamicVideoCount(courseId: string): number {
  return dynamicVideosLibrary[courseId]?.length || 0;
}

export default videoService;
