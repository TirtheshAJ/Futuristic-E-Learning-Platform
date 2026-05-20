# CodeStreak Academy - System Architecture Diagram

## 🏛️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Web App    │  │  Mobile App  │  │   Desktop    │              │
│  │   (React)    │  │  (React      │  │   (Electron) │              │
│  │              │  │   Native)    │  │              │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                 │                  │                       │
│         └─────────────────┴──────────────────┘                       │
│                           │                                          │
└───────────────────────────┼──────────────────────────────────────────┘
                            │ HTTPS
                            ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         CDN / EDGE LAYER                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │              CloudFlare / AWS CloudFront                 │       │
│  │  - SSL/TLS Termination                                   │       │
│  │  - DDoS Protection                                       │       │
│  │  - Static Asset Caching                                  │       │
│  │  - Geographic Distribution                               │       │
│  └──────────────────────┬───────────────────────────────────┘       │
│                         │                                            │
└─────────────────────────┼────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      API GATEWAY / LOAD BALANCER                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │           NGINX / AWS ALB / Kong API Gateway             │       │
│  │  - Request Routing                                       │       │
│  │  - Rate Limiting                                         │       │
│  │  - Authentication Check                                  │       │
│  │  - SSL Termination                                       │       │
│  │  - Load Distribution                                     │       │
│  └──────────────────────┬───────────────────────────────────┘       │
│                         │                                            │
└─────────────────────────┼────────────────────────────────────────────┘
                          │
           ┌──────────────┴──────────────┐
           │                             │
           ↓                             ↓
┌────────────────────────┐    ┌────────────────────────┐
│   API Instance 1       │    │   API Instance N       │
│   (Auto-Scaled)        │    │   (Auto-Scaled)        │
└────────────────────────┘    └────────────────────────┘
           │                             │
           └──────────────┬──────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│  │  Auth Service   │  │ Course Service  │  │  Quiz Service   │    │
│  │  - JWT Auth     │  │ - CRUD Courses  │  │ - Quiz Engine   │    │
│  │  - OAuth        │  │ - Progress      │  │ - Auto Grade    │    │
│  │  - Sessions     │  │ - Lectures      │  │ - Analytics     │    │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘    │
│           │                    │                     │              │
│  ┌────────┴────────┐  ┌────────┴────────┐  ┌────────┴────────┐    │
│  │ Gamification    │  │  Analytics      │  │ Notification    │    │
│  │  - Streaks      │  │  - Dashboard    │  │  - Email        │    │
│  │  - XP/Levels    │  │  - Reports      │  │  - Push         │    │
│  │  - Coins        │  │  - Leaderboard  │  │  - In-App       │    │
│  │  - Achievements │  │  - Insights     │  │                 │    │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘    │
│           │                    │                     │              │
└───────────┼────────────────────┼─────────────────────┼──────────────┘
            │                    │                     │
            └────────────────────┴─────────────────────┘
                                 │
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        CACHE LAYER                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │                   Redis Cluster                          │       │
│  │  - Session Storage (15 min TTL)                          │       │
│  │  - Course Data Cache (1 hour TTL)                        │       │
│  │  - Leaderboard Cache (5 min TTL)                         │       │
│  │  - User Profile Cache (15 min TTL)                       │       │
│  │  - Rate Limit Counters                                   │       │
│  │  - Job Queue (Bull)                                      │       │
│  └──────────────────────────────────────────────────────────┘       │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
                                 │
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │              PostgreSQL Primary (Write)                  │       │
│  │  - Users, Courses, Lectures, Quizzes                     │       │
│  │  - Progress, Streaks, XP, Coins                          │       │
│  │  - Achievements, Leaderboard                             │       │
│  │  - Analytics, Transactions                               │       │
│  └────────────────────┬─────────────────────────────────────┘       │
│                       │                                              │
│           ┌───────────┴───────────┐                                 │
│           │  Replication Stream   │                                 │
│           ↓                       ↓                                 │
│  ┌─────────────────┐    ┌─────────────────┐                        │
│  │ Read Replica 1  │    │ Read Replica N  │                        │
│  │ (Read Only)     │    │ (Read Only)     │                        │
│  └─────────────────┘    └─────────────────┘                        │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
                                 │
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      STORAGE LAYER                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │              AWS S3 / MinIO (Object Storage)             │       │
│  │  - Course Videos                                         │       │
│  │  - PDF Materials                                         │       │
│  │  - User Avatars                                          │       │
│  │  - Quiz Images                                           │       │
│  │  - Static Assets                                         │       │
│  └──────────────────────────────────────────────────────────┘       │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
                                 │
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      MESSAGE QUEUE                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │                  Bull Queue (Redis)                      │       │
│  │  - Email Sending Jobs                                    │       │
│  │  - Achievement Processing                                │       │
│  │  - Analytics Aggregation                                 │       │
│  │  - Leaderboard Refresh                                   │       │
│  │  - Report Generation                                     │       │
│  └──────────────────────────────────────────────────────────┘       │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
                                 │
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│                   MONITORING & LOGGING                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│  │  Prometheus     │  │    Grafana      │  │   ELK Stack     │    │
│  │  - Metrics      │  │  - Dashboards   │  │ - Logs          │    │
│  │  - Alerts       │  │  - Visualization│  │ - Search        │    │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘    │
│                                                                       │
│  ┌─────────────────┐  ┌─────────────────┐                          │
│  │    Sentry       │  │   DataDog       │                          │
│  │  - Error Track  │  │  - APM          │                          │
│  └─────────────────┘  └─────────────────┘                          │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow Diagram

### User Authentication Flow
```
┌──────┐       ┌─────────┐      ┌──────────┐      ┌──────────┐
│Client│       │  API    │      │  Redis   │      │PostgreSQL│
└───┬──┘       └────┬────┘      └────┬─────┘      └────┬─────┘
    │               │                │                  │
    │ POST /login   │                │                  │
    ├──────────────>│                │                  │
    │               │ Check Cache    │                  │
    │               ├───────────────>│                  │
    │               │<───────────────┤                  │
    │               │ Not Found      │                  │
    │               │                │                  │
    │               │ Query User     │                  │
    │               ├──────────────────────────────────>│
    │               │                │                  │
    │               │<──────────────────────────────────┤
    │               │ User Data      │                  │
    │               │                │                  │
    │               │ Verify Password│                  │
    │               │ Generate JWT   │                  │
    │               │                │                  │
    │               │ Store Session  │                  │
    │               ├───────────────>│                  │
    │               │<───────────────┤                  │
    │               │ OK             │                  │
    │               │                │                  │
    │<──────────────┤                │                  │
    │ JWT Token     │                │                  │
    │               │                │                  │
```

### Quiz Submission Flow
```
┌──────┐   ┌─────┐   ┌──────┐   ┌─────┐   ┌────────┐   ┌───────┐
│Client│   │ API │   │Redis │   │  DB │   │  Queue │   │Worker │
└───┬──┘   └──┬──┘   └───┬──┘   └──┬──┘   └───┬────┘   └───┬───┘
    │         │          │         │          │            │
    │ Submit  │          │         │          │            │
    ├────────>│          │         │          │            │
    │         │ Validate │         │          │            │
    │         │ Grade    │         │          │            │
    │         │          │         │          │            │
    │         │ Save     │         │          │            │
    │         ├─────────────────>│          │            │
    │         │<────────────────────│          │            │
    │         │          │         │          │            │
    │         │ Add XP   │         │          │            │
    │         ├─────────────────>│          │            │
    │         │          │         │          │            │
    │         │ Add Coins│         │          │            │
    │         ├─────────────────>│          │            │
    │         │          │         │          │            │
    │         │ Queue Job│         │          │            │
    │         ├─────────────────────────────>│            │
    │         │          │         │          │            │
    │<────────┤          │         │          │            │
    │ Success │          │         │          │            │
    │         │          │         │          │ Process    │
    │         │          │         │          ├───────────>│
    │         │          │         │          │ - Send     │
    │         │          │         │          │   Email    │
    │         │          │         │          │ - Update   │
    │         │          │         │          │   Analytics│
    │         │          │         │          │ - Check    │
    │         │          │         │          │   Achieve- │
    │         │          │         │          │   ments    │
    │         │          │         │          │            │
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Layer 1: Network Security                                   │
│  ┌───────────────────────────────────────────────────┐      │
│  │ - Firewall Rules                                  │      │
│  │ - VPC / Private Subnets                           │      │
│  │ - Security Groups                                 │      │
│  │ - DDoS Protection (CloudFlare)                    │      │
│  └───────────────────────────────────────────────────┘      │
│                                                               │
│  Layer 2: Application Gateway                                │
│  ┌───────────────────────────────────────────────────┐      │
│  │ - WAF (Web Application Firewall)                  │      │
│  │ - SSL/TLS Encryption                              │      │
│  │ - Rate Limiting (100 req/15min)                   │      │
│  │ - IP Whitelist/Blacklist                          │      │
│  └───────────────────────────────────────────────────┘      │
│                                                               │
│  Layer 3: Authentication & Authorization                     │
│  ┌───────────────────────────────────────────────────┐      │
│  │ - JWT Token Validation                            │      │
│  │ - Role-Based Access Control (RBAC)                │      │
│  │ - Session Management                              │      │
│  │ - OAuth 2.0 (Google)                              │      │
│  │ - Multi-Factor Authentication (Optional)          │      │
│  └───────────────────────────────────────────────────┘      │
│                                                               │
│  Layer 4: Input Validation                                   │
│  ┌───────────────────────────────────────────────────┐      │
│  │ - Schema Validation (Joi/Zod)                     │      │
│  │ - SQL Injection Prevention (ORM)                  │      │
│  │ - XSS Prevention (Sanitization)                   │      │
│  │ - CSRF Protection                                 │      │
│  └───────────────────────────────────────────────────┘      │
│                                                               │
│  Layer 5: Data Security                                      │
│  ┌───────────────────────────────────────────────────┐      │
│  │ - Encryption at Rest (DB, S3)                     │      │
│  │ - Encryption in Transit (TLS 1.3)                 │      │
│  │ - Password Hashing (bcrypt, 12 rounds)            │      │
│  │ - Sensitive Data Masking                          │      │
│  └───────────────────────────────────────────────────┘      │
│                                                               │
│  Layer 6: Monitoring & Auditing                              │
│  ┌───────────────────────────────────────────────────┐      │
│  │ - Security Event Logging                          │      │
│  │ - Intrusion Detection                             │      │
│  │ - Vulnerability Scanning                          │      │
│  │ - Audit Trails                                    │      │
│  └───────────────────────────────────────────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow - Course Progress Tracking

```
User Starts Lecture
        │
        ↓
    [Frontend]
        │ API Call: POST /lectures/:id/start
        ↓
   [API Gateway]
        │ Rate Limit Check
        │ JWT Validation
        ↓
   [Auth Middleware]
        │ Extract user_id
        ↓
  [Lecture Controller]
        │ Get lecture_id
        ↓
  [Progress Service]
        │
        ├─> Check Redis Cache
        │   └─> If cached, return
        │
        ├─> Query Database
        │   SELECT * FROM user_progress
        │   WHERE user_id = ? AND lecture_id = ?
        │
        ├─> If not exists, Create new progress record
        │   INSERT INTO user_progress (user_id, lecture_id, status)
        │
        ├─> Update last_accessed timestamp
        │
        ├─> Calculate course progress percentage
        │   (completed_lectures / total_lectures) * 100
        │
        ├─> Cache result in Redis (15 min TTL)
        │
        └─> Return progress data
                │
                ↓
            [Frontend]
            Display progress bar
            Update UI
```

---

## 🎮 Gamification System Flow

```
User Action (Complete Lecture/Quiz)
            │
            ↓
    [Gamification Service]
            │
    ┌───────┴───────┐
    │               │
    ↓               ↓
[Award XP]      [Award Coins]
    │               │
    │ 1. Get current XP
    │ 2. Add new XP
    │ 3. Check level up
    │ 4. If level up:
    │    - Update level
    │    - Trigger achievement
    │    - Send notification
    │
    │               │ 1. Get coin balance
    │               │ 2. Add coins
    │               │ 3. Create transaction record
    │               │ 4. Update lifetime_earned
    │               │
    └───────┬───────┘
            │
            ↓
    [Check Achievements]
            │
    ┌───────┴────────┬────────┬────────┐
    │                │        │        │
    ↓                ↓        ↓        ↓
[Streak]      [Level]  [Quiz]  [Course]
Achievement   Achieved Perfect Complete
    │                │        │        │
    │ Check criteria │        │        │
    │ If matched:    │        │        │
    │ - Mark earned  │        │        │
    │ - Award rewards│        │        │
    │ - Send notif   │        │        │
    │                │        │        │
    └────────────────┴────────┴────────┘
            │
            ↓
    [Update Leaderboard]
            │
    1. Refresh materialized view
    2. Calculate new rank
    3. Cache top 50
    4. Broadcast to WebSocket clients
            │
            ↓
    [Queue Background Jobs]
            │
    ├─> Send achievement email
    ├─> Update analytics
    ├─> Generate reports
    └─> Push notifications
```

---

## 🔍 Monitoring Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION METRICS                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  API Server (Express)                                        │
│       │                                                       │
│       ├─> prom-client (Prometheus Client)                    │
│       │   - HTTP request counter                             │
│       │   - Response time histogram                          │
│       │   - Active connections gauge                         │
│       │   - Error rate counter                               │
│       │                                                       │
│       └─> /metrics endpoint                                  │
│                  │                                            │
│                  ↓                                            │
│         [Prometheus Server]                                  │
│                  │                                            │
│       ┌──────────┴──────────┐                                │
│       │  Scrape every 15s   │                                │
│       │  Store in TSDB      │                                │
│       │  Evaluate alerts    │                                │
│       └──────────┬──────────┘                                │
│                  │                                            │
│       ┌──────────┴──────────┬──────────────┐                │
│       │                     │              │                │
│       ↓                     ↓              ↓                │
│  [Grafana]            [AlertManager]  [Slack/Email]         │
│  Dashboards           Send Alerts     Notifications         │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      LOGGING ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Application Logs (Winston)                                 │
│       │                                                       │
│       ├─> Console (Development)                              │
│       ├─> File (Production)                                  │
│       └─> Elasticsearch                                      │
│                  │                                            │
│                  ↓                                            │
│         [Elasticsearch]                                      │
│         Store & Index Logs                                   │
│                  │                                            │
│                  ↓                                            │
│            [Kibana]                                          │
│         Search & Visualize                                   │
│                                                               │
│  ┌─────────────────────────────────────────────┐            │
│  │ Log Levels:                                 │            │
│  │ - ERROR: Application errors                 │            │
│  │ - WARN: Warnings                            │            │
│  │ - INFO: Important events                    │            │
│  │ - DEBUG: Detailed information               │            │
│  └─────────────────────────────────────────────┘            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Deployment Pipeline

```
┌──────────────┐
│ Developer    │
│ Commits Code │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│   GitHub     │
│              │
└──────┬───────┘
       │ Webhook Trigger
       ↓
┌─────────────────────────────────────────────────┐
│            GitHub Actions CI/CD                 │
├─────────────────────────────────────────────────┤
│                                                  │
│  Step 1: Checkout Code                          │
│  Step 2: Run Tests                              │
│          ├─> Unit Tests                         │
│          ├─> Integration Tests                  │
│          └─> E2E Tests                          │
│  Step 3: Security Scan                          │
│          ├─> SAST (Static Analysis)             │
│          ├─> Dependency Check                   │
│          └─> Container Scan                     │
│  Step 4: Build Docker Image                     │
│  Step 5: Push to Registry (ECR/GCR)             │
│  Step 6: Deploy to Staging                      │
│  Step 7: Run Smoke Tests                        │
│  Step 8: Deploy to Production (Blue-Green)      │
│  Step 9: Health Check                           │
│  Step 10: Rollback if Failed                    │
│                                                  │
└─────────────────────────────────────────────────┘
       │
       ↓
┌──────────────┐
│  Production  │
│  Environment │
└──────────────┘
```

---

**Architecture designed to scale from 0 to 1M+ users** 🚀
