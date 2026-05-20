# CodeStreak Academy - Backend Setup Guide

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js 20.x or higher
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional but recommended)

### Option 1: Using Docker Compose (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/codestreak-academy.git
cd codestreak-academy
```

2. **Create environment file**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start all services**
```bash
docker-compose up -d
```

4. **Run database migrations**
```bash
docker-compose exec api npm run migrate
```

5. **Seed initial data**
```bash
docker-compose exec api npm run seed
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/docs
- Grafana: http://localhost:3001
- Prometheus: http://localhost:9090

### Option 2: Manual Setup

1. **Install PostgreSQL and Redis**
```bash
# macOS
brew install postgresql@15 redis

# Ubuntu/Debian
sudo apt install postgresql-15 redis-server

# Start services
brew services start postgresql@15  # macOS
sudo systemctl start postgresql redis  # Linux
```

2. **Create database**
```bash
createdb codestreak_academy
psql codestreak_academy < database/schema.sql
```

3. **Install backend dependencies**
```bash
cd backend
npm install
```

4. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. **Run migrations**
```bash
npm run migrate
```

6. **Seed data**
```bash
npm run seed
```

7. **Start development server**
```bash
npm run dev
```

---

## 📁 Project Structure

```
codestreak-academy/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── models/            # Database models (Prisma)
│   │   ├── middleware/        # Auth, validation, rate limiting
│   │   ├── routes/            # API routes
│   │   ├── utils/             # Helper functions
│   │   ├── validators/        # Input validation schemas
│   │   ├── jobs/              # Background jobs (Bull)
│   │   └── config/            # Configuration files
│   ├── tests/
│   │   ├── unit/              # Unit tests
│   │   ├── integration/       # Integration tests
│   │   └── e2e/               # End-to-end tests
│   ├── prisma/
│   │   ├── schema.prisma      # Prisma schema
│   │   ├── migrations/        # Database migrations
│   │   └── seed.ts            # Seed data
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # React frontend (current code)
├── database/
│   ├── schema.sql             # Database schema
│   └── seed.sql               # Seed data
├── kubernetes/
│   └── deployment.yaml        # K8s configuration
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # CI/CD pipeline
├── docker-compose.yml
└── README.md
```

---

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Application
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://codestreak:password@localhost:5432/codestreak_academy
DB_HOST=localhost
DB_PORT=5432
DB_USER=codestreak
DB_PASSWORD=strongpassword123
DB_NAME=codestreak_academy

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=redispassword

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=30d

# OAuth (Google)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@codestreakacademy.com

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=codestreak-media

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

---

## 🗃️ Database Schema Overview

### Core Tables
1. **users** - User accounts and authentication
2. **courses** - Course catalog
3. **lectures** - Course content (videos, PDFs, etc.)
4. **user_progress** - Track user's learning progress
5. **quizzes** - Quiz definitions
6. **questions** - Quiz questions with options
7. **quiz_attempts** - User quiz submissions and scores

### Gamification Tables
8. **user_streaks** - Daily/weekly streak tracking
9. **user_xp** - XP points and levels
10. **user_coins** - Coin balance
11. **coin_transactions** - Transaction history
12. **achievements** - Achievement definitions
13. **user_achievements** - Earned achievements
14. **course_unlocks** - Locked course access

### Analytics Tables
15. **learning_analytics** - Daily activity metrics
16. **leaderboard** - Materialized view for rankings

### Key Features
- Automatic updated_at triggers
- Foreign key constraints with CASCADE
- Comprehensive indexing for performance
- Materialized views for complex queries
- Helper functions for XP calculations
- Seed data for default achievements

---

## 🔌 API Documentation

### Base URL
```
Development: http://localhost:5000/api/v1
Production: https://api.codestreakacademy.com/v1
```

### Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <your-jwt-token>
```

### Sample API Calls

#### Register User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "SecurePass123!",
    "fullName": "John Doe"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "SecurePass123!"
  }'
```

#### Get All Courses
```bash
curl -X GET http://localhost:5000/api/v1/courses \
  -H "Authorization: Bearer <token>"
```

#### Submit Quiz
```bash
curl -X POST http://localhost:5000/api/v1/quizzes/quiz-id/submit \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "attemptId": "attempt-id",
    "answers": {
      "question-1-id": "option-a",
      "question-2-id": "option-b"
    },
    "timeTakenSeconds": 1200
  }'
```

#### Daily Check-in
```bash
curl -X POST http://localhost:5000/api/v1/streaks/check-in \
  -H "Authorization: Bearer <token>"
```

---

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Specific Test Suites
```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Test Structure
```javascript
describe('Auth Controller', () => {
  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test123!',
          fullName: 'Test User'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('accessToken');
    });
  });
});
```

---

## 📊 Database Migrations

### Create Migration
```bash
npx prisma migrate dev --name add_new_table
```

### Run Migrations
```bash
npx prisma migrate deploy
```

### Reset Database (Development)
```bash
npx prisma migrate reset
```

### Generate Prisma Client
```bash
npx prisma generate
```

---

## 🚢 Deployment

### Deploy to AWS ECS with Fargate

1. **Build and push Docker image**
```bash
docker build -t codestreak-api:latest ./backend
docker tag codestreak-api:latest <ecr-repo>/codestreak-api:latest
docker push <ecr-repo>/codestreak-api:latest
```

2. **Create ECS Task Definition**
```json
{
  "family": "codestreak-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "api",
      "image": "<ecr-repo>/codestreak-api:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [...],
      "secrets": [...]
    }
  ]
}
```

3. **Deploy via AWS CLI**
```bash
aws ecs update-service \
  --cluster codestreak-prod \
  --service codestreak-api \
  --force-new-deployment
```

### Deploy to Kubernetes

1. **Apply Kubernetes configurations**
```bash
kubectl apply -f kubernetes/deployment.yaml
```

2. **Check deployment status**
```bash
kubectl get pods -n codestreak-academy
kubectl logs -f deployment/codestreak-api -n codestreak-academy
```

3. **Scale deployment**
```bash
kubectl scale deployment codestreak-api --replicas=5 -n codestreak-academy
```

---

## 📈 Monitoring & Logging

### Prometheus Metrics
Access metrics at: `http://localhost:5000/metrics`

Key metrics:
- `http_requests_total` - Total HTTP requests
- `http_request_duration_seconds` - Request latency
- `active_users` - Current active users
- `quiz_submissions_total` - Quiz submissions
- `coin_transactions_total` - Coin transactions

### Grafana Dashboards
- API Performance Dashboard
- Database Metrics
- User Activity Dashboard
- Gamification Metrics

### Logging
Logs are structured JSON format:
```json
{
  "level": "info",
  "timestamp": "2026-02-15T12:00:00.000Z",
  "message": "User logged in",
  "userId": "user-id",
  "email": "user@example.com",
  "ip": "192.168.1.1"
}
```

---

## 🔒 Security Best Practices

### Implemented Security Measures
- ✅ JWT token authentication with refresh tokens
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Rate limiting per IP and per user
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection (input sanitization)
- ✅ CORS configuration
- ✅ Helmet.js security headers
- ✅ Input validation (Joi/Zod)
- ✅ HTTPS enforcement
- ✅ Secure session management

### Security Checklist
- [ ] Rotate JWT secrets regularly
- [ ] Enable 2FA for admin accounts
- [ ] Regular security audits
- [ ] Monitor for suspicious activity
- [ ] Keep dependencies updated
- [ ] Implement CAPTCHA for public endpoints
- [ ] Use environment-specific secrets
- [ ] Enable database encryption at rest

---

## 🐛 Troubleshooting

### Common Issues

**Database connection error**
```
Solution: Check DATABASE_URL, ensure PostgreSQL is running
pg_ctl status  # Check PostgreSQL status
```

**Redis connection error**
```
Solution: Verify Redis is running and password is correct
redis-cli ping  # Should return PONG
```

**Migration failed**
```
Solution: Reset database and rerun migrations
npx prisma migrate reset
npx prisma migrate deploy
```

**JWT token invalid**
```
Solution: Check JWT_SECRET matches between auth and verification
Clear browser cookies and log in again
```

---

## 📞 Support & Resources

- **Documentation**: https://docs.codestreakacademy.com
- **API Reference**: https://api.codestreakacademy.com/docs
- **GitHub Issues**: https://github.com/yourusername/codestreak-academy/issues
- **Discord Community**: https://discord.gg/codestreak
- **Email Support**: support@codestreakacademy.com

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Follow conventional commit messages
- Ensure CI/CD pipeline passes

---

**Built with ❤️ by the CodeStreak Academy Team**
