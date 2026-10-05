# YuvaSetu — Production Architecture & Deployment Preparation Manual
**Brand:** YuvaSetu  
**Tagline:** *"Samajh Se Safalta Tak"*  
**Status:** Pre-Deployment Production Ready (Deployment NOT Performed)  
**Version:** 1.0.0-prod-ready  
**Date:** October 2026  

---

## 1. Executive Summary & Production Readiness Stance
YuvaSetu has completed all core functional, UI/UX, database persistence, role-based access control (RBAC), and security hardening phases. 
This document defines the comprehensive **Production Architecture, Environment Strategy, Security Hardening, Backup Protocols, and Pre-Deployment Verification Runbook**.

> **CRITICAL RULE**: The application is fully prepared and hardened for production deployment, but **production deployment has NOT been executed**, no live production domains have been connected, and no production credentials have been activated.

---

## 2. Current Architecture Audit

### 2.1 Component Matrix
| Layer | Implementation in YuvaSetu | Production Suitability |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 SPA, TypeScript 5.8, Tailwind CSS v4, Lucide React, Motion | **Ready** — Minified, chunked, and client-optimized via Vite. |
| **Backend Framework** | Node.js with Express 4.x (`server.ts`) | **Ready** — Handles API routing, rate limiting, security headers, CORS, and SSR static serving. |
| **Database Engine** | SQLite engine (`sql.js`) with disk persistence (`data/yuvasetu.sqlite`) | **Ready** — 15 relational tables, foreign key constraints, indexes, and ACID transaction support. |
| **Authentication** | Dual engine: Salted HMAC-SHA256 local auth + Firebase Client SDK for Google Auth | **Ready** — Strictly enforces Student vs Admin RBAC; Google login never grants Admin. |
| **File Storage** | Hybrid client-side PDF/Word generator (`downloadHelper.ts`) + File metadata engine | **Ready** — Standardized 25MB limits, verified MIME types, and watermarked document generation. |
| **AI Provider** | Server-side Google Gemini 3.7 Flash proxy (`/api/ai/ask`) with fallback | **Ready** — Secrets remain server-side; prompt injection defense and academic integrity guards active. |
| **Live Learning** | External HTTPS meeting links (Google Meet, Zoom, Microsoft Teams) | **Ready** — No fake simulation; opens verified HTTPS URLs in secure tabs. |
| **Token Economy** | VidyaTokens double-entry ledger with atomic balance validation | **Ready** — Non-monetary, strictly academic motivation ecosystem. |

### 2.2 System Data Flow
```
[ Student / Administrator Browser ]
               │
               ▼  (HTTPS / Secure Headers / CSP)
[ Express Application Server (:3000) ]
   ├── Rate Limiting & Origin CORS Validation
   ├── Public Health Check (/health & /api/health)
   ├── Security Headers (HSTS, nosniff, SAMEORIGIN)
   ├── Authentication & RBAC Guard
   │       ├── Local Auth (HMAC-SHA256)
   │       └── Firebase Auth Token Exchange
   ├── AI Learning Proxy (/api/ai/ask)
   │       └── Server-side Google Gemini 3.7 Flash
   ├── Study Materials & Document Engine
   └── Database Controller (sql.js / SQLite Engine)
           ├── 15 Relational Tables
           ├── 9 Query Performance Indexes
           └── Double-entry Token Transaction Ledger
```

---

## 3. Environment Strategy & Separation

To eliminate accidental leakage of test credentials or mock data into production:

### 3.1 Environment Separation Matrix
| Parameter | Development (Current) | Staging | Production (Future) |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | `development` | `staging` | `production` |
| `ENABLE_DEMO_SEED` | `true` | `false` | `false` (Strictly No Demo Users) |
| `DATABASE_PATH` | `./data/yuvasetu.sqlite` | `./data/yuvasetu_staging.sqlite` | Managed Volume or PostgreSQL (`DATABASE_URL`) |
| `ALLOWED_ORIGINS` | `http://localhost:*` | `https://staging.yuvasetu.edu` | `https://yuvasetu.edu`, `https://app.yuvasetu.edu` |
| `CORS Policy` | Permissive for dev host | Restricted to Staging Domain | Strict Whitelist Only |
| `Strict-Transport-Security`| Disabled (HTTP allowed) | Enabled (1 year max-age) | Enabled (`max-age=31536000; includeSubDomains`) |
| `AI Engine` | Gemini 3.7 / Fallback | Gemini 3.7 Live | Gemini 3.7 Live (Cost Capped) |

---

## 4. Environment Variables Specification (`.env.example`)

The repository includes a clean, placeholder-only template at `/.env.example`. 

### Categorized Variables:
1. **Public Client Configuration (`VITE_*`)**:
   - `VITE_APP_URL`: Base URL of the public web application.
   - `VITE_API_URL`: Empty for co-hosted monolith; specified if API runs on a decoupled subdomain.
   - `VITE_STORAGE_PUBLIC_URL`: Public CDN bucket endpoint for educational PDFs.
2. **Server Configuration & Secrets**:
   - `PORT`: HTTP port (defaults to 3000).
   - `NODE_ENV`: Set to `production` during deployment.
   - `ALLOWED_ORIGINS`: Whitelist of client domains allowed to invoke API endpoints.
   - `SESSION_SECRET`: 64+ char random hexadecimal string.
   - `PASSWORD_PEPPER`: Server-side secret pepper mixed with user passwords.
3. **Database & Seeding**:
   - `DATABASE_PATH`: Filesystem path to SQLite file.
   - `ENABLE_DEMO_SEED`: Must be `false` in production.
   - `DATABASE_URL`: Connection string if deploying against PostgreSQL / Cloud SQL.
4. **Initial Administrator Bootstrap**:
   - `ADMIN_INITIAL_EMAIL`: Designated first platform admin email.
   - `ADMIN_INITIAL_NAME`: Administrator full name.
   - `ADMIN_INITIAL_PASSWORD`: One-time initial bootstrap password.
5. **Authentication & Firebase**:
   - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, etc.
   - `FIREBASE_SERVICE_ACCOUNT_PATH`: Optional for server-side ID token verification.
6. **AI Service Provider**:
   - `GEMINI_API_KEY`: Server-side only key. Never bundle into client JavaScript.
   - `AI_RATE_LIMIT_PER_MINUTE`: Request throttle (defaults to 40).
7. **File Storage**:
   - `STORAGE_PROVIDER`: `local`, `s3`, `gcs`, or `firebase`.
   - `MAX_FILE_SIZE_MB`: Enforced limit (defaults to 25MB).

---

## 5. Security Architecture & Controls

### 5.1 Enforced Security Headers
The Express server transmits standard security headers on every response:
```http
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains (in production)
```

### 5.2 Origin & CORS Enforcement
- Wildcard `Access-Control-Allow-Origin: *` is **forbidden** for authenticated APIs.
- When `NODE_ENV=production`, origins are strictly checked against `ALLOWED_ORIGINS` and `APP_URL`.
- Pre-flight `OPTIONS` requests receive immediate HTTP 204 responses.

### 5.3 Layered Rate Limiting
In-memory token bucket rate limiters prevent brute-force attacks and resource exhaustion:
- **Authentication (`/api/auth/login`, `/api/auth/register`, `/api/auth/reset-password`)**: Max 15 requests per 15 minutes.
- **AI Tutoring (`/api/ai/ask`)**: Max 40 requests per minute per IP.
- **VidyaToken Ledger Transactions**: Max 50 transactions per minute.
- **General REST API Routes**: Max 60 requests per minute.

### 5.4 Redacted Structured Logging
All errors and administrative actions are logged via `logServerEvent` in structured JSON. The logger automatically strips passwords, tokens, API keys, and session cookies from output logs.

---

## 6. Database Production Strategy & Backup Protocol

### 6.1 Schema & Integrity
- 15 relational tables managed in `server/db.ts` with explicit `PRAGMA foreign_keys = ON;`.
- 9 high-frequency query indexes on `users(email)`, `study_materials(subject)`, `live_sessions(status)`, `token_transactions(user_id)`, etc.
- Double-entry token transaction ledger ensures atomic deductions; negative balances are rejected by database CHECK constraints (`CHECK(balance >= 0)`).

### 6.2 Zero-Demo Policy in Production
When `NODE_ENV=production` and `ENABLE_DEMO_SEED=false`:
- Automatic creation of fake students (`Aryan`, `Aditi`, `Rohit`, etc.) is completely disabled.
- Fake activities, mock logs, and demo analytics are not seeded.
- The platform launches with a pristine, empty student registry ready for real university students.

### 6.3 Backup & Disaster Recovery Schedule
1. **Automated Snapshot Frequency**:
   - Hourly differential snapshots of `/data/yuvasetu.sqlite`.
   - Daily full compressed backup (`.sqlite.gz`) stored in an offsite, immutable object bucket (GCS/S3 Glacier) with 30-day retention.
2. **Point-in-Time Recovery (PITR) Procedure**:
   ```bash
   # 1. Stop application server
   systemctl stop yuvasetu || docker stop yuvasetu
   # 2. Archive corrupted or current database
   mv ./data/yuvasetu.sqlite ./data/yuvasetu_corrupted_$(date +%s).sqlite
   # 3. Restore verified backup snapshot
   cp /backups/yuvasetu_snapshot_20261004.sqlite ./data/yuvasetu.sqlite
   # 4. Verify integrity
   sqlite3 ./data/yuvasetu.sqlite "PRAGMA integrity_check;"
   # 5. Restart application
   systemctl start yuvasetu || docker start yuvasetu
   ```

---

## 7. File Storage & Educational Resource Architecture

### 7.1 Storage Model
- Uploaded study notes and past year solutions (PYQs) must not reside in arbitrary desktop folders (e.g. `C:/`, `D:/`, `Downloads/`).
- In production, uploaded files must be directed to **Cloud Object Storage** (Google Cloud Storage, AWS S3, or Firebase Storage).
- Each resource receives an immutable, content-addressed path: `materials/{subject_id}/{material_id}.pdf`.

### 7.2 Upload Constraints & Validation
- **Allowed MIME Types**: `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `image/png`, `image/jpeg`.
- **Max File Size**: 25 MB per educational document.
- **Watermarking**: Client-side document generator (`downloadHelper.ts`) guarantees that every downloaded PDF contains the official YuvaSetu academic watermark (*"YuvaSetu • Samajh Se Safalta Tak"*), protecting author rights and brand authenticity.

---

## 8. Firebase Authentication Preparation

### 8.1 Current Implementation
- Handled through Firebase Client SDK and mapped to the backend user table via `firebase_uid`.
- Name and email are extracted from verified identity tokens.
- **Privacy Enforcement**: Profile pictures from Google accounts are suppressed to preserve student privacy; avatars are generated from initials.

### 8.2 Production Domain Whitelist Procedure
During live deployment:
1. Navigate to **Firebase Console** &rarr; **Authentication** &rarr; **Settings** &rarr; **Authorized Domains**.
2. Add the future production domain:
   - `yuvasetu.edu`
   - `app.yuvasetu.edu`
3. Verify that unauthorized origins cannot initiate OAuth popups.
4. **RBAC Rule**: Under no circumstances does Google Login grant `admin` privileges. All external sign-ins default to `student`.

---

## 9. Domain & DNS Launch Plan

*The production domain is currently unconfigured: `[PRODUCTION DOMAIN — TO BE DECIDED]`.*

### Step-by-Step DNS & Certificate Setup
1. **Domain Procurement**: Acquire primary domain (`yuvasetu.edu` or `yuvasetu.com`).
2. **DNS Records Configuration**:
   - `A` / `AAAA` records pointed to production reverse proxy / Cloud Run IP.
   - `CNAME` for `www` and `app` subdomains.
3. **Automated SSL/TLS Provisioning**:
   - Issue Let's Encrypt / Cloudflare wildcard SSL certificate.
   - Force HTTPS redirect (301) for all HTTP traffic.
4. **Update Application Config**:
   - Update `APP_URL`, `VITE_APP_URL`, and `ALLOWED_ORIGINS` in production environment secrets.

---

## 10. Recommended Hosting Topologies

### Option A: Unified Container on Google Cloud Run / AWS App Runner (Recommended)
- **Frontend + Backend**: Packaged into a single Docker container serving Express on port 3000 and static Vite assets from `/dist`.
- **Database**: Managed Cloud SQL (PostgreSQL) or Persistent Volume Mount for SQLite.
- **Benefits**: Near-zero maintenance, scale-to-zero cost efficiency, automated SSL, native Secret Manager integration.

### Option B: Decoupled Architecture
- **Frontend**: Hosted on Vercel / Cloudflare Pages (Points `VITE_API_URL` to `https://api.yuvasetu.com`).
- **Backend API**: Hosted on dedicated Node.js service (Fly.io, Railway, or AWS ECS).
- **Benefits**: Global edge CDN delivery for static assets; independent scaling of AI and API workloads.

---

## 11. Production Deployment Runbook (21-Step Checklist)

Execute these steps in strict sequence when authorization to deploy is granted:

- [ ] **Step 1:** Provision production hosting container / virtual private cloud (VPC).
- [ ] **Step 2:** Provision production database storage volume or managed SQL instance.
- [ ] **Step 3:** Run database migrations and initialize schema tables (`PRAGMA foreign_keys = ON;`).
- [ ] **Step 4:** Provision cloud object storage bucket for educational PDF assets.
- [ ] **Step 5:** Add production domain to Firebase Authentication authorized domains list.
- [ ] **Step 6:** Configure production environment variables in host Secret Manager (set `NODE_ENV=production`, `ENABLE_DEMO_SEED=false`).
- [ ] **Step 7:** Set `ADMIN_INITIAL_EMAIL`, `ADMIN_INITIAL_NAME`, and strong `ADMIN_INITIAL_PASSWORD`.
- [ ] **Step 8:** Execute production build (`npm run build`).
- [ ] **Step 9:** Deploy backend container (`npm start` &rarr; `node dist/server.cjs`).
- [ ] **Step 10:** Verify public health endpoints (`GET /health` returns HTTP 200).
- [ ] **Step 11:** Bind production DNS records and verify automated HTTPS certificate handshake.
- [ ] **Step 12:** Log into the platform using the designated initial Admin credentials.
- [ ] **Step 13:** Verify that zero fake/demo student accounts exist in the production database.
- [ ] **Step 14:** Publish initial curated curriculum notes (DSA, DBMS, OS, Cheatsheets).
- [ ] **Step 15:** Verify PDF download with embedded YuvaSetu center-aligned watermark.
- [ ] **Step 16:** Schedule a test Live Session with a valid Google Meet/Teams HTTPS link.
- [ ] **Step 17:** Join the live session to confirm external meeting link redirect.
- [ ] **Step 18:** Test AI Learning Assistant query to verify server-side Gemini response and academic guardrails.
- [ ] **Step 19:** Register a real student test account and confirm 100 free welcome VidyaTokens.
- [ ] **Step 20:** Confirm rate limiter blocks excessive authentication attempts.
- [ ] **Step 21:** Platform is declared operational and opened for students!

---

## 12. Production Smoke Test Script

### Student Workflow Test:
1. **Registration**: Register new student account &rarr; Verify redirect & 100 welcome VidyaTokens.
2. **Explore**: Search "Data Structures" &rarr; View material preview & multi-page summaries.
3. **Download**: Download DSA Masterclass PDF &rarr; Verify generated file opens with YuvaSetu watermark.
4. **Live Learning**: View upcoming live masterclass &rarr; Click "Join Meeting" &rarr; Verify Google Meet URL opens in new tab.
5. **Study Room**: Enter "DSA & Competitive Coding Room" &rarr; Confirm room URL opens and participant count increments.
6. **Doubt Resolution**: Ask conceptual question &rarr; Post question &rarr; Verify doubt appears in forum.
7. **AI Tutor**: Open YuvaSetu AI &rarr; Ask "Explain AVL tree rotations" &rarr; Confirm structured pedagogical response.
8. **VidyaTokens**: Check wallet &rarr; Confirm 100 VT balance and double-entry transaction record.
9. **Logout**: Logout &rarr; Confirm session termination.

### Admin Workflow Test:
1. **Admin Login**: Log in as Platform Administrator &rarr; Verify Admin Dashboard view.
2. **RBAC Guard**: Confirm access to Student Management, Economy Ledger, Content Manager, and Reports.
3. **Content Management**: Create new study material &rarr; Upload & publish &rarr; Verify public visibility.
4. **Community Moderation**: View student doubt &rarr; Post verified solution &rarr; Mark as solved.
5. **Analytics & Activity**: Verify real-time audit log records all user actions with sanitized metadata.
6. **Last Admin Protection**: Attempt to delete the sole active admin &rarr; Verify system rejects operation.

---

## 13. Rollback & Disaster Recovery Strategy

If an unexpected regression or deployment failure occurs:
1. **Frontend / Container Rollback**: Revert traffic immediately to previous container revision in Cloud Run / hosting dashboard (1-click traffic shift).
2. **Database Schema Rollback**: Revert uncommitted migrations using the snapshot taken immediately prior to deployment (`./data/yuvasetu_pre_deploy.sqlite`).
3. **Feature Isolation**: If the AI provider or payment gateway experiences third-party outages, internal fallbacks (pedagogical synthesis engine and verified checkout) remain operational without downtime.
4. **Incident Post-Mortem**: Document root cause in incident log, formulate automated regression test, and verify in staging environment before re-attempting launch.

---

## 14. Deployment Readiness Scorecard

| Area | Status | Notes |
| :--- | :--- | :--- |
| **Architecture** | **READY** | Express + Vite + SQLite monolithic server builds cleanly. |
| **Database** | **READY** | 15 schemas, indexes, foreign keys, and zero-demo seed logic active. |
| **Authentication** | **READY** | Multi-role RBAC, salted password hashing, last-admin guard verified. |
| **Storage** | **READY** | Dynamic watermarking, 25MB limits, and verified MIME types. |
| **AI Subsystem** | **READY** | Server-side Gemini 3.7 proxy with prompt injection defense. |
| **Security & Headers**| **READY** | HSTS, nosniff, SAMEORIGIN, rate limiters, sanitized JSON logging. |
| **Responsiveness** | **READY** | Tailwind CSS v4 responsive layout tested across mobile and desktop. |
| **Legal & Policies** | **READY** | Pre-deployment drafts for Privacy, Terms, Community, and Copyright. |
| **Domain & DNS** | **NOT CONFIGURED**| Intentionally pending deployment authorization. |
| **Prod Credentials** | **NOT CONFIGURED**| Intentionally kept as placeholders in `.env.example`. |
| **Live Deployment** | **NOT PERFORMED** | Strict compliance with Phase 8 instruction: **DO NOT DEPLOY**. |
