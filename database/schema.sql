-- CodeStreak Academy Database Schema
-- PostgreSQL 15+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'admin', 'instructor')),
  is_email_verified BOOLEAN DEFAULT false,
  email_verification_token VARCHAR(255),
  reset_password_token VARCHAR(255),
  reset_password_expires TIMESTAMP,
  oauth_provider VARCHAR(50),
  oauth_id VARCHAR(255),
  avatar_url TEXT,
  theme_preference VARCHAR(20) DEFAULT 'dark' CHECK (theme_preference IN ('dark', 'light')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_oauth ON users(oauth_provider, oauth_id);
CREATE INDEX idx_users_role ON users(role);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COURSE & CONTENT TABLES
-- =====================================================

-- Courses Table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  difficulty VARCHAR(50) CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  estimated_hours INT DEFAULT 0,
  coin_reward INT DEFAULT 0,
  xp_reward INT DEFAULT 0,
  is_locked BOOLEAN DEFAULT false,
  unlock_cost INT DEFAULT 0,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_difficulty ON courses(difficulty);
CREATE INDEX idx_courses_active ON courses(is_active);
CREATE INDEX idx_courses_order ON courses(order_index);

CREATE TRIGGER courses_updated_at
BEFORE UPDATE ON courses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Lectures Table
CREATE TABLE lectures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_type VARCHAR(50) CHECK (content_type IN ('video', 'pdf', 'text', 'interactive')),
  content_url TEXT,
  duration_minutes INT DEFAULT 0,
  xp_reward INT DEFAULT 50,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_lectures_course ON lectures(course_id);
CREATE INDEX idx_lectures_active ON lectures(is_active);
CREATE INDEX idx_lectures_order ON lectures(course_id, order_index);

CREATE TRIGGER lectures_updated_at
BEFORE UPDATE ON lectures
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PROGRESS TRACKING
-- =====================================================

-- User Progress Table
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  lecture_id UUID REFERENCES lectures(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percentage INT DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  time_spent_minutes INT DEFAULT 0,
  last_accessed TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, lecture_id)
);

CREATE INDEX idx_progress_user ON user_progress(user_id);
CREATE INDEX idx_progress_course ON user_progress(course_id);
CREATE INDEX idx_progress_user_course ON user_progress(user_id, course_id);
CREATE INDEX idx_progress_status ON user_progress(status);

-- =====================================================
-- QUIZ SYSTEM
-- =====================================================

-- Quizzes Table
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INT DEFAULT 30,
  passing_score INT DEFAULT 70,
  total_questions INT DEFAULT 0,
  coin_reward INT DEFAULT 100,
  xp_reward INT DEFAULT 200,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_quizzes_course ON quizzes(course_id);
CREATE INDEX idx_quizzes_active ON quizzes(is_active);

CREATE TRIGGER quizzes_updated_at
BEFORE UPDATE ON quizzes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Questions Table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) DEFAULT 'multiple_choice',
  options JSONB NOT NULL, -- [{text: "Option A", isCorrect: false}, ...]
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  points INT DEFAULT 10,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_questions_quiz ON questions(quiz_id);
CREATE INDEX idx_questions_order ON questions(quiz_id, order_index);

-- Quiz Attempts Table
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  score INT DEFAULT 0,
  total_points INT DEFAULT 0,
  percentage DECIMAL(5,2) DEFAULT 0,
  answers JSONB, -- {questionId: selectedAnswer}
  time_taken_seconds INT DEFAULT 0,
  passed BOOLEAN DEFAULT false,
  coins_earned INT DEFAULT 0,
  xp_earned INT DEFAULT 0,
  started_at TIMESTAMP DEFAULT NOW(),
  submitted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX idx_attempts_user_quiz ON quiz_attempts(user_id, quiz_id);
CREATE INDEX idx_attempts_submitted ON quiz_attempts(submitted_at);

-- =====================================================
-- GAMIFICATION SYSTEM
-- =====================================================

-- User Streaks Table
CREATE TABLE user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_activity_date DATE,
  weekly_streak INT DEFAULT 0,
  total_active_days INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_streaks_user ON user_streaks(user_id);
CREATE INDEX idx_streaks_current ON user_streaks(current_streak DESC);

CREATE TRIGGER streaks_updated_at
BEFORE UPDATE ON user_streaks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- User XP & Levels Table
CREATE TABLE user_xp (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_xp INT DEFAULT 0,
  level INT DEFAULT 1 CHECK (level >= 1 AND level <= 100),
  total_xp_earned INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_xp_level ON user_xp(level DESC);
CREATE INDEX idx_xp_total ON user_xp(total_xp_earned DESC);

CREATE TRIGGER xp_updated_at
BEFORE UPDATE ON user_xp
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- User Coins Balance Table
CREATE TABLE user_coins (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  balance INT DEFAULT 0 CHECK (balance >= 0),
  lifetime_earned INT DEFAULT 0,
  lifetime_spent INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_coins_balance ON user_coins(balance DESC);

CREATE TRIGGER coins_updated_at
BEFORE UPDATE ON user_coins
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Coin Transactions Table
CREATE TABLE coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  transaction_type VARCHAR(50) CHECK (transaction_type IN ('earned', 'spent', 'refund')),
  source VARCHAR(100) NOT NULL, -- 'quiz_completion', 'course_unlock', 'daily_bonus', etc.
  reference_id UUID, -- quiz_id, course_id, etc.
  description TEXT,
  balance_after INT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_coins_user ON coin_transactions(user_id);
CREATE INDEX idx_coins_type ON coin_transactions(transaction_type);
CREATE INDEX idx_coins_created ON coin_transactions(created_at DESC);

-- Achievements Table
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  rarity VARCHAR(50) CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  criteria JSONB NOT NULL, -- {type: 'streak', value: 7}
  coin_reward INT DEFAULT 0,
  xp_reward INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_achievements_rarity ON achievements(rarity);
CREATE INDEX idx_achievements_active ON achievements(is_active);

-- User Achievements Table
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_earned ON user_achievements(earned_at DESC);

-- =====================================================
-- COURSE UNLOCKS
-- =====================================================

CREATE TABLE course_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_unlocks_user ON course_unlocks(user_id);
CREATE INDEX idx_unlocks_course ON course_unlocks(course_id);

-- =====================================================
-- ANALYTICS & REPORTING
-- =====================================================

CREATE TABLE learning_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_time_minutes INT DEFAULT 0,
  lectures_completed INT DEFAULT 0,
  quizzes_attempted INT DEFAULT 0,
  xp_earned INT DEFAULT 0,
  coins_earned INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_analytics_user_date ON learning_analytics(user_id, date DESC);
CREATE INDEX idx_analytics_date ON learning_analytics(date DESC);

-- =====================================================
-- LEADERBOARD (Materialized View)
-- =====================================================

CREATE MATERIALIZED VIEW leaderboard AS
SELECT 
  u.id,
  u.full_name,
  u.avatar_url,
  ux.level,
  ux.current_xp,
  ux.total_xp_earned,
  COALESCE(us.current_streak, 0) as current_streak,
  ROW_NUMBER() OVER (ORDER BY ux.total_xp_earned DESC, ux.level DESC, ux.current_xp DESC) as rank
FROM users u
JOIN user_xp ux ON u.id = ux.user_id
LEFT JOIN user_streaks us ON u.id = us.user_id
WHERE u.role = 'student'
ORDER BY rank;

CREATE UNIQUE INDEX idx_leaderboard_id ON leaderboard(id);
CREATE INDEX idx_leaderboard_rank ON leaderboard(rank);

-- Function to refresh leaderboard
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to calculate XP required for next level
CREATE OR REPLACE FUNCTION get_xp_for_level(level INT)
RETURNS INT AS $$
BEGIN
  RETURN CASE 
    WHEN level = 1 THEN 0
    WHEN level = 2 THEN 1000
    WHEN level = 3 THEN 2500
    WHEN level = 4 THEN 5000
    WHEN level = 5 THEN 10000
    WHEN level = 6 THEN 20000
    WHEN level = 7 THEN 35000
    WHEN level = 8 THEN 50000
    WHEN level = 9 THEN 75000
    WHEN level = 10 THEN 100000
    ELSE 100000 + ((level - 10) * 15000)
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to add XP and auto-level up
CREATE OR REPLACE FUNCTION add_user_xp(p_user_id UUID, p_xp INT)
RETURNS TABLE(new_level INT, leveled_up BOOLEAN) AS $$
DECLARE
  v_current_xp INT;
  v_current_level INT;
  v_new_xp INT;
  v_new_level INT;
  v_leveled_up BOOLEAN := false;
BEGIN
  -- Get current XP and level
  SELECT current_xp, level INTO v_current_xp, v_current_level
  FROM user_xp
  WHERE user_id = p_user_id;

  -- Calculate new XP
  v_new_xp := v_current_xp + p_xp;
  v_new_level := v_current_level;

  -- Check for level up
  WHILE v_new_xp >= get_xp_for_level(v_new_level + 1) AND v_new_level < 100 LOOP
    v_new_level := v_new_level + 1;
    v_leveled_up := true;
  END LOOP;

  -- Update user XP
  UPDATE user_xp
  SET 
    current_xp = v_new_xp,
    level = v_new_level,
    total_xp_earned = total_xp_earned + p_xp
  WHERE user_id = p_user_id;

  RETURN QUERY SELECT v_new_level, v_leveled_up;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SEED DATA FOR DEFAULT ACHIEVEMENTS
-- =====================================================

INSERT INTO achievements (title, description, icon, rarity, criteria, coin_reward, xp_reward) VALUES
('First Steps', 'Complete your first lecture', '⭐', 'common', '{"type": "lectures_completed", "value": 1}', 50, 100),
('Week Warrior', 'Maintain a 7-day streak', '🔥', 'rare', '{"type": "streak", "value": 7}', 200, 500),
('Speed Demon', 'Complete a course in under 3 hours', '⚡', 'epic', '{"type": "course_speed", "value": 180}', 500, 1000),
('Perfect Score', 'Get 100% on any quiz', '🎯', 'rare', '{"type": "quiz_perfect", "value": 100}', 300, 750),
('Grand Master', 'Complete all courses', '🏆', 'legendary', '{"type": "courses_completed", "value": 7}', 1000, 5000),
('Knowledge Seeker', 'Reach level 10', '📚', 'epic', '{"type": "level", "value": 10}', 750, 2000),
('Quiz Master', 'Pass 10 quizzes', '📝', 'rare', '{"type": "quizzes_passed", "value": 10}', 400, 800),
('Monthly Dedication', 'Maintain a 30-day streak', '🌟', 'legendary', '{"type": "streak", "value": 30}', 1500, 3000);

-- =====================================================
-- PERFORMANCE OPTIMIZATIONS
-- =====================================================

-- Analyze tables for query optimization
ANALYZE users;
ANALYZE courses;
ANALYZE lectures;
ANALYZE quizzes;
ANALYZE user_progress;
ANALYZE quiz_attempts;
ANALYZE user_streaks;
ANALYZE user_xp;
ANALYZE user_coins;
ANALYZE coin_transactions;
ANALYZE achievements;
ANALYZE user_achievements;
ANALYZE learning_analytics;
