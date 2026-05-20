# CodeStreak Academy - Backend Architecture Documentation

## 🏗️ System Architecture Overview

### Tech Stack (Recommended)
- **Backend Framework**: Node.js + Express.js (TypeScript)
- **Database**: PostgreSQL 15+ (Primary), Redis 7+ (Cache/Sessions)
- **Authentication**: JWT + Passport.js
- **ORM**: Prisma (Type-safe, Modern)
- **API Documentation**: Swagger/OpenAPI
- **File Storage**: AWS S3 / MinIO
- **Message Queue**: Bull (Redis-based)
- **Monitoring**: Prometheus + Grafana
- **Logging**: Winston + ELK Stack
- **Rate Limiting**: express-rate-limit + Redis
- **Email**: SendGrid / AWS SES
- **Deployment**: Docker + Kubernetes
- **CI/CD**: GitHub Actions / GitLab CI

---

## 📊 Database Schema Design

### Core Tables

#### 1. Users Table
```sql
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
```

#### 2. Courses Table
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  difficulty VARCHAR(50) CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  estimated_hours INT,
  coin_reward INT DEFAULT 0,
  xp_reward INT DEFAULT 0,
  is_locked BOOLEAN DEFAULT false,
  unlock_cost INT DEFAULT 0,
  order_index INT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_difficulty ON courses(difficulty);
```

#### 3. Lectures Table
```sql
CREATE TABLE lectures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_type VARCHAR(50) CHECK (content_type IN ('video', 'pdf', 'text', 'interactive')),
  content_url TEXT,
  duration_minutes INT,
  xp_reward INT DEFAULT 50,
  order_index INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_lectures_course ON lectures(course_id);
```

#### 4. User Progress Table
```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  lecture_id UUID REFERENCES lectures(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percentage INT DEFAULT 0,
  time_spent_minutes INT DEFAULT 0,
  last_accessed TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, lecture_id)
);

CREATE INDEX idx_progress_user ON user_progress(user_id);
CREATE INDEX idx_progress_course ON user_progress(course_id);
CREATE INDEX idx_progress_user_course ON user_progress(user_id, course_id);
```

#### 5. Quizzes Table
```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INT DEFAULT 30,
  passing_score INT DEFAULT 70,
  total_questions INT,
  coin_reward INT DEFAULT 100,
  xp_reward INT DEFAULT 200,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_quizzes_course ON quizzes(course_id);
```

#### 6. Questions Table
```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) DEFAULT 'multiple_choice',
  options JSONB, -- [{text: "Option A", isCorrect: false}, ...]
  correct_answer TEXT,
  explanation TEXT,
  points INT DEFAULT 10,
  order_index INT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_questions_quiz ON questions(quiz_id);
```

#### 7. Quiz Attempts Table
```sql
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  score INT,
  total_points INT,
  percentage DECIMAL(5,2),
  answers JSONB, -- {questionId: selectedAnswer}
  time_taken_seconds INT,
  passed BOOLEAN,
  coins_earned INT DEFAULT 0,
  xp_earned INT DEFAULT 0,
  started_at TIMESTAMP DEFAULT NOW(),
  submitted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_attempts_quiz ON quiz_attempts(quiz_id);
```

#### 8. User Streaks Table
```sql
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
```

#### 9. Coins & Transactions Table
```sql
CREATE TABLE coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  transaction_type VARCHAR(50) CHECK (transaction_type IN ('earned', 'spent', 'refund')),
  source VARCHAR(100), -- 'quiz_completion', 'course_unlock', 'daily_bonus', etc.
  reference_id UUID, -- quiz_id, course_id, etc.
  description TEXT,
  balance_after INT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_coins_user ON coin_transactions(user_id);
CREATE INDEX idx_coins_type ON coin_transactions(transaction_type);
```

#### 10. User Coins Balance Table
```sql
CREATE TABLE user_coins (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  balance INT DEFAULT 0,
  lifetime_earned INT DEFAULT 0,
  lifetime_spent INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 11. Achievements Table
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  rarity VARCHAR(50) CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  criteria JSONB, -- {type: 'streak', value: 7}
  coin_reward INT DEFAULT 0,
  xp_reward INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 12. User Achievements Table
```sql
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements ON user_achievements(user_id);
```

#### 13. User XP & Levels Table
```sql
CREATE TABLE user_xp (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_xp INT DEFAULT 0,
  level INT DEFAULT 1,
  total_xp_earned INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 14. Leaderboard (Materialized View)
```sql
CREATE MATERIALIZED VIEW leaderboard AS
SELECT 
  u.id,
  u.full_name,
  u.avatar_url,
  ux.level,
  ux.current_xp,
  ux.total_xp_earned,
  us.current_streak,
  ROW_NUMBER() OVER (ORDER BY ux.total_xp_earned DESC, ux.level DESC) as rank
FROM users u
JOIN user_xp ux ON u.id = ux.user_id
LEFT JOIN user_streaks us ON u.id = us.user_id
WHERE u.role = 'student'
ORDER BY rank;

CREATE UNIQUE INDEX idx_leaderboard_id ON leaderboard(id);
```

#### 15. Course Unlocks Table
```sql
CREATE TABLE course_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_unlocks_user ON course_unlocks(user_id);
```

#### 16. Learning Analytics Table
```sql
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

CREATE INDEX idx_analytics_user_date ON learning_analytics(user_id, date);
```

---

## 🔌 API Endpoint Structure

### Base URL: `https://api.codestreakacademy.com/v1`

### 1. Authentication Endpoints
```
POST   /auth/register              - Register new user
POST   /auth/login                 - Login user
POST   /auth/logout                - Logout user
POST   /auth/refresh-token         - Refresh JWT token
POST   /auth/verify-email          - Verify email
POST   /auth/forgot-password       - Request password reset
POST   /auth/reset-password        - Reset password
GET    /auth/google                - OAuth Google login
GET    /auth/google/callback       - OAuth callback
GET    /auth/me                    - Get current user
```

### 2. User Profile Endpoints
```
GET    /users/profile              - Get user profile
PUT    /users/profile              - Update profile
PUT    /users/theme                - Update theme preference
PUT    /users/avatar               - Upload avatar
GET    /users/stats                - Get user statistics
```

### 3. Course Endpoints
```
GET    /courses                    - List all courses
GET    /courses/:id                - Get course details
POST   /courses                    - Create course (Admin)
PUT    /courses/:id                - Update course (Admin)
DELETE /courses/:id                - Delete course (Admin)
GET    /courses/:id/lectures       - Get course lectures
POST   /courses/:id/unlock         - Unlock course with coins
GET    /courses/:id/progress       - Get course progress
```

### 4. Lecture Endpoints
```
GET    /lectures/:id               - Get lecture details
POST   /lectures                   - Create lecture (Admin)
PUT    /lectures/:id               - Update lecture (Admin)
DELETE /lectures/:id               - Delete lecture (Admin)
POST   /lectures/:id/complete      - Mark lecture complete
POST   /lectures/:id/progress      - Update lecture progress
```

### 5. Quiz Endpoints
```
GET    /quizzes                    - List all quizzes
GET    /quizzes/:id                - Get quiz details
POST   /quizzes                    - Create quiz (Admin)
PUT    /quizzes/:id                - Update quiz (Admin)
DELETE /quizzes/:id                - Delete quiz (Admin)
POST   /quizzes/:id/start          - Start quiz attempt
POST   /quizzes/:id/submit         - Submit quiz answers
GET    /quizzes/:id/attempts       - Get user quiz attempts
GET    /quizzes/:id/analytics      - Get quiz analytics
```

### 6. Gamification Endpoints
```
GET    /streaks                    - Get user streak data
POST   /streaks/check-in           - Daily check-in
GET    /xp                         - Get XP and level data
GET    /coins                      - Get coin balance
GET    /coins/transactions         - Get transaction history
POST   /coins/spend                - Spend coins
GET    /achievements               - Get all achievements
GET    /achievements/earned        - Get earned achievements
POST   /achievements/claim         - Claim achievement
```

### 7. Leaderboard Endpoints
```
GET    /leaderboard                - Get global leaderboard
GET    /leaderboard/weekly         - Get weekly leaderboard
GET    /leaderboard/friends        - Get friends leaderboard
GET    /leaderboard/rank           - Get user rank
```

### 8. Analytics Endpoints
```
GET    /analytics/dashboard        - Get dashboard data
GET    /analytics/weekly           - Get weekly activity
GET    /analytics/course/:id       - Get course analytics
GET    /analytics/quiz-accuracy    - Get quiz accuracy stats
GET    /analytics/learning-time    - Get learning time data
```

---

## 🔐 Security Implementation

### JWT Token Structure
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "student",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Rate Limiting Configuration
```javascript
// Global rate limit: 100 requests per 15 minutes
// Auth endpoints: 5 requests per 15 minutes
// Quiz submit: 1 request per quiz
// Course unlock: 10 requests per hour
```

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

---

## 🎯 Business Logic Implementations

### Daily Streak Logic
```
1. Check last_activity_date
2. If today - last_activity_date = 1 day → increment streak
3. If today - last_activity_date > 1 day → reset streak to 1
4. Update longest_streak if current > longest
5. Award bonus coins/XP for milestone streaks (7, 14, 30 days)
```

### XP Level System
```
Level 1: 0 XP
Level 2: 1000 XP
Level 3: 2500 XP
Level 4: 5000 XP
Level 5: 10000 XP
Level 6: 20000 XP
Level 7: 35000 XP
Level 8: 50000 XP
Level 9: 75000 XP
Level 10: 100000 XP
```

### Quiz Auto-Grading
```
1. Calculate score per question (correct = points, wrong = 0)
2. Sum total score
3. Calculate percentage
4. Check if passed (percentage >= passing_score)
5. Award coins and XP if passed
6. Create coin transaction
7. Update user_xp
8. Check and award achievements
9. Update analytics
```

### Achievement Auto-Unlock
```
Triggers:
- Streak milestones (3, 7, 14, 30 days)
- Course completion
- Quiz perfect score
- Level up
- Total XP milestones
- First course, first quiz, etc.
```

---

## 📦 Microservices Architecture (Optional)

### Service Breakdown
1. **Auth Service** - Authentication & Authorization
2. **Course Service** - Course & Lecture Management
3. **Quiz Service** - Quiz Engine & Grading
4. **Gamification Service** - Streaks, XP, Coins, Achievements
5. **Analytics Service** - Data Processing & Reporting
6. **Notification Service** - Email & Push Notifications
7. **Media Service** - File Upload & CDN Management

### Inter-Service Communication
- **Synchronous**: REST APIs (Primary)
- **Asynchronous**: RabbitMQ / Kafka (Events)
- **API Gateway**: Kong / AWS API Gateway

---

## 🐳 Docker & Deployment

### Docker Compose Stack
```yaml
services:
  - api (Node.js)
  - postgres
  - redis
  - nginx (Reverse Proxy)
  - prometheus
  - grafana
```

### Kubernetes Deployment
```
- Horizontal Pod Autoscaling (HPA)
- Load Balancer (NGINX Ingress)
- Persistent Volumes for DB
- ConfigMaps & Secrets
- Rolling Updates
```

### CI/CD Pipeline (GitHub Actions)
```
1. Code Push → Trigger Pipeline
2. Run Tests (Unit, Integration, E2E)
3. Build Docker Image
4. Push to Registry (Docker Hub / ECR)
5. Deploy to Staging
6. Run Smoke Tests
7. Deploy to Production (Blue-Green)
8. Monitor & Rollback if needed
```

---

## 📈 Performance Optimization

### Caching Strategy
```
Redis Cache:
- User sessions (30 min TTL)
- Course list (1 hour TTL)
- Leaderboard (5 min TTL)
- User profile (15 min TTL)
```

### Database Indexing
```
- Primary Keys (UUID)
- Foreign Keys
- Email (unique)
- Composite indexes (user_id + course_id)
- Date fields for analytics
```

### Query Optimization
```
- Use SELECT specific columns
- Implement pagination (LIMIT/OFFSET)
- Use database views for complex queries
- Connection pooling (pg-pool)
- Prepared statements
```

---

## 🚀 Scalability Considerations

### Horizontal Scaling
- Load balancer with multiple API instances
- Redis cluster for distributed caching
- PostgreSQL read replicas
- CDN for static assets

### Database Sharding (Future)
- Shard by user_id for user-specific data
- Geographic sharding for global users

### Message Queue for Heavy Tasks
- Email sending
- Analytics processing
- Achievement calculations
- Leaderboard updates

---

## 📊 Monitoring & Logging

### Metrics to Track
- API response times
- Error rates
- Active users
- Database query performance
- Cache hit/miss rates
- Quiz submission rates

### Alerts
- API downtime
- High error rate (> 5%)
- Database connection issues
- Disk space warnings
- High memory usage

---

## 🧪 Testing Strategy

### Test Levels
1. **Unit Tests** - 80% coverage
2. **Integration Tests** - API endpoints
3. **E2E Tests** - Critical user flows
4. **Load Tests** - 10,000 concurrent users
5. **Security Tests** - OWASP Top 10

### Tools
- Jest (Unit/Integration)
- Supertest (API Testing)
- Artillery (Load Testing)
- OWASP ZAP (Security)

---

## 📝 Environment Variables

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@localhost:5432/codestreak
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-secret
GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret
AWS_S3_BUCKET=codestreak-media
SENDGRID_API_KEY=your-sendgrid-key
FRONTEND_URL=https://codestreakacademy.com
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

---

This architecture is designed to handle 10,000+ concurrent users with sub-100ms API response times, 99.9% uptime, and enterprise-grade security.
