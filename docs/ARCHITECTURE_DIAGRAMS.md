# YuvaSetu — Technical Diagram Portfolio & Visual Architecture
### Subtitle: *"Samajh Se Safalta Tak"*
**Platform Version:** 1.0.0-prod  
**Classification:** Original Diagrammatic Architecture & Workflow Specifications  

---

This document provides the complete, authoritative collection of 14 original architectural, structural, and procedural diagrams for **YuvaSetu**. All compositions are original works created specifically for the YuvaSetu academic platform.

---

### DIAGRAM 01: YuvaSetu Connected Learning Ecosystem
*Visualizes how YuvaSetu unifies fragmented student learning into one coherent environment.*

```
                                  ┌──────────────────────────────┐
                                  │   YUVASETU CONNECTED HUB     │
                                  │  "Samajh Se Safalta Tak"     │
                                  └──────────────┬───────────────┘
                                                 │
                  ┌──────────────────────────────┼──────────────────────────────┐
                  │                              │                              │
                  ▼                              ▼                              ▼
     ┌────────────────────────┐     ┌────────────────────────┐     ┌────────────────────────┐
     │ 1. CURATED STUDY NOTES │     │  2. VIRTUAL STUDY ROOM │     │  3. GEMINI 3.7 AI TUTOR│
     │ • Handwritten master   │     │ • 24/7 quiet focus     │     │ • Anti-cheat integrity │
     │ • Formula cheatsheets  │     │ • Subject-specific     │     │ • Step-by-step proofs  │
     │ • University PYQs      │     │ • Peer accountability  │     │ • In-note grounding    │
     └────────────┬───────────┘     └────────────┬───────────┘     └────────────┬───────────┘
                  │                              │                              │
                  └──────────────────────────────┼──────────────────────────────┘
                                                 │
                  ┌──────────────────────────────┼──────────────────────────────┐
                  │                              │                              │
                  ▼                              ▼                              ▼
     ┌────────────────────────┐     ┌────────────────────────┐     ┌────────────────────────┐
     │ 4. DOUBT RESOLUTION    │     │ 5. LIVE PEER SESSIONS  │     │ 6. ACADEMIC COMMUNITY  │
     │ • Asynchronous Q&A     │     │ • Scheduled workshops  │     │ • Subject discussions  │
     │ • Verified badge system│     │ • Expert faculty leads │     │ • Project collaboration│
     │ • Code & formula input │     │ • Real-time pulse tags │     │ • Moderated forums     │
     └────────────┬───────────┘     └────────────┬───────────┘     └────────────┬───────────┘
                  │                              │                              │
                  └──────────────────────────────┼──────────────────────────────┘
                                                 │
                                                 ▼
                                  ┌──────────────────────────────┐
                                  │   VIDYATOKENS UTILITY ENGINE │
                                  │ Double-entry incentive ledger│
                                  │ Rewards positive study habits│
                                  └──────────────┬───────────────┘
                                                 │
                                                 ▼
                                  ┌──────────────────────────────┐
                                  │   VERIFIED ACADEMIC SUCCESS  │
                                  └──────────────────────────────┘
```

---

### DIAGRAM 02: End-to-End Student User Journey
*Shows the progression of a university student from public arrival to mastery.*

```
[ 1. PUBLIC DISCOVERY & LANDING ]
  • Experiences dark academic opening animation.
  • Views live platform statistics & note previews.
      │
      ▼
[ 2. ONBOARDING & AUTHENTICATION ]
  • Registers via Email/Password or 1-Click Google OAuth.
  • Automatically receives 100 Free VidyaTokens welcome gift.
      │
      ▼
[ 3. ACADEMIC PROFILE MAPPING ]
  • Selects College, Degree (B.Tech), Branch (CS/IT/ECE/Mech), and Year.
  • Configures subjects of interest (DSA, DBMS, OS, Mathematics).
      │
      ▼
[ 4. PERSONALIZED STUDENT COMMAND CENTER ]
  • Accesses personalized dashboard with wallet readout & quick search.
      │
      ├───────────────────────┬───────────────────────┬───────────────────────┐
      ▼                       ▼                       ▼                       ▼
[ STUDY REPOSITORY ]   [ VIRTUAL STUDY ROOMS ] [ ACADEMIC DOUBT FORUM ][ GEMINI AI ASSISTANT ]
• Searches topic notes • Enters DSA focus room • Submits question      • Requests formula proof
• Reads in viewer      • Connects with peers   • Categorizes by branch • Explains code logic
• Downloads PDF        • Logs participation    • Notifies mentors      • Generates revision quiz
      │                       │                       │                       │
      └───────────────────────┴───────────┬───────────┴───────────────────────┘
                                          │
                                          ▼
                         [ 5. COMMUNITY ENGAGEMENT & PEER HELP ]
                         • Answers a peer's technical question with code snippet.
                         • Administrator reviews and verifies the answer.
                         • Platform credits +10 VidyaTokens to student wallet.
                                          │
                                          ▼
                         [ 6. REPUTATION & ACTIVITY AUDIT ]
                         • Reviews complete study streak, earned badges, and ledger.
```

---

### DIAGRAM 03: Administrator Governance & Operations Journey
*Details administrative privileges, curriculum curation, and platform moderation.*

```
[ 1. ADMIN AUTHENTICATION PORTAL ]
  • Authenticates via Option 2 (Admin Console).
  • Validates against salted HMAC-SHA256 hash (`Omtajane2831` / `admin123`).
  • Checks role constraint (`user.role === 'admin'`).
      │
      ▼
[ 2. ADMIN COMMAND CENTER ]
  • Reviews platform metrics: Total Students, Notes Count, Unresolved Doubts.
      │
      ├───────────────────────────────┬───────────────────────────────┐
      ▼                               ▼                               ▼
[ CURRICULUM PUBLISHING ]     [ LIVE WORKSHOP SCHEDULING ]   [ DOUBT & COMMUNITY DESK ]
• Inputs note title & topic.  • Schedules revision marathon. • Inspects open doubts.
• Selects branch & semester.  • Configures date & Meet URL.  • Submits verified answers.
• Attaches PDF / Cheatsheet.  • Broadcasts system alert.     • Moderates flagged posts.
• Publishes directly to DB.   • Sets active status.          • Marks questions resolved.
      │                               │                               │
      └───────────────────────────────┼───────────────────────────────┘
                                      │
                                      ▼
                      [ USER GOVERNANCE & LEDGER AUDIT ]
                      • Inspects student registry and institutional credentials.
                      • Audits VidyaTokens double-entry ledger.
                      • Safe Admin Guard: System blocks deactivating last admin.
```

---

### DIAGRAM 04: Layered Full-Stack Platform Architecture
*Illustrates technical tiering, security boundaries, and runtime environments.*

```
+----------------------------------------------------------------------------------------------------+
|                                      PRESENTATION TIER                                             |
| • React 19 Single Page Application (SPA) compiled via Vite runtime.                                |
| • Tailwind CSS styling with dark academic aesthetic (#080b14, saffron orange, electric cyan).      |
| • Zero-profile-photo privacy policy: Identity rendered via `UserInitialsBadge`.                   |
+----------------------------------------------------------------------------------------------------+
                                                  │
                                                  │ HTTPS / JSON REST APIs
                                                  ▼
+----------------------------------------------------------------------------------------------------+
|                                    SECURITY & GATEWAY TIER                                         |
| • Express 4.x running on port 3000.                                                                |
| • In-Memory Sliding-Window Rate Limiters: Auth (60 req/min), AI (40 req/min).                     |
| • OWASP Security Headers (nosniff, SAMEORIGIN, strict-origin-when-cross-origin, XSS-Protection).   |
| • Request body size strictly capped at 10MB.                                                       |
+----------------------------------------------------------------------------------------------------+
                                                  │
                                                  ▼
+----------------------------------------------------------------------------------------------------+
|                                    BUSINESS LOGIC & SERVICE TIER                                   |
| • `authService`: Salted HMAC-SHA256 hashing, multi-credential resolution, Sole-Admin Guard.        |
| • `contentService`: Curriculum indexing, branch/semester filters, bookmark tracking.              |
| • `doubtService`: Three-phase doubt lifecycle (OPEN -> ANSWERED -> CLOSED).                        |
| • `sessionRoomService`: Scheduled live sessions, 24/7 study rooms, meeting link routing.           |
| • `tokenService`: Double-entry atomic ledger, non-negative balance constraints.                    |
| • `aiService`: Prompt injection isolation, academic cheating defense, note grounding.             |
+----------------------------------------------------------------------------------------------------+
                          │                                  │                        │
                          ▼                                  ▼                        ▼
+------------------------------------+ +---------------------------+ +-------------------------------+
| PERSISTENT DATABASE TIER           | | AI PEDAGOGICAL TIER       | | EXTERNAL SERVICES             |
| • SQLite via sql.js engine.        | | • Google Gemini 3.7 Flash | | • Firebase Google Auth Client |
| • `./data/yuvasetu.sqlite` storage.| | • Academic integrity filter| | • Google Meet Routing Links  |
| • 15 normalized relational tables. | | • Local fallback engine   | | • Static asset distribution   |
+------------------------------------+ +---------------------------+ +-------------------------------+
```

---

### DIAGRAM 05: Relational Database Schema & Entity-Relationship Model
*Complete normalized entity relationships across 15 persistent SQLite tables.*

```
                  ┌───────────────────────────────┐
                  │             users             │
                  │ PK: id                        │
                  │ UK: email                     │
                  │ Fields: role, status, etc.    │
                  └───────────────┬───────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         │ 1:1                    │ 1:N                    │ 1:N
         ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  token_wallets   │    │ study_materials  │    │      doubts      │
│ PK,FK: user_id   │    │ PK: id           │    │ PK: id           │
│ balance >= 0     │    │ FK: uploaded_by  │    │ FK: student_id   │
└────────┬─────────┘    └──────────────────┘    └────────┬─────────┘
         │ 1:N                                           │ 1:N
         ▼                                               ▼
┌──────────────────┐                            ┌──────────────────┐
│token_transactions│                            │     answers      │
│ PK: id           │                            │ PK: id           │
│ FK: user_id      │                            │ FK: doubt_id     │
│ balance_after    │                            │ FK: responder_id │
└──────────────────┘                            └──────────────────┘

                  ┌───────────────────────────────┐
                  │             users             │ (Continued)
                  └───────────────┬───────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         │ 1:N                    │ 1:N                    │ 1:N
         ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  live_sessions   │    │   study_rooms    │    │ community_posts  │
│ PK: id           │    │ PK: id           │    │ PK: id           │
│ FK: created_by   │    │ FK: created_by   │    │ FK: author_id    │
└────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
         │ 1:N                   │ 1:N                   │ 1:N
         ▼                       ▼                       ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│session_participat│    │study_room_partic.│    │community_replies │
│ PK: id           │    │ PK: id           │    │ PK: id           │
│ FK: session_id   │    │ FK: room_id      │    │ FK: post_id      │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

---

### DIAGRAM 06: Official Content Verification & Publishing Workflow
*Current implemented model for administrator-curated educational material.*

```
[ ADMINISTRATOR CONSOLE ]
  • Enters title, description, subject, course code, semester.
  • Attaches PDF note or formula cheatsheet.
      │
      ▼
[ SERVER-SIDE VALIDATION ]
  • Validates branch mapping and non-empty metadata fields.
  • Confirms publishing credentials (`role === 'admin'`).
      │
      ▼
[ COMMIT TO RELATIONAL REPOSITORY ]
  • Inserts into `study_materials` with unique ID and `published = 1`.
  • Logs administrative action into `activity_logs`.
      │
      ▼
[ REAL-TIME STUDENT DISCOVERY ]
  • Immediately indexable in search bar and subject filter pills.
  • Students can read, save to bookmarks, or download for offline exam prep.
```

---

### DIAGRAM 07: Proposed Decentralized Student-Upload & AI Pre-Check Workflow
*Future model for peer-contributed study materials.*

```
[ STUDENT SUBMITS FILE ]
  • Student uploads handwritten lecture notes or solved university paper.
  • Provides syllabus metadata (University, Subject, Semester).
      │
      ▼
[ STAGE 1: AUTOMATED SECURITY & FORMAT VALIDATION ]
  • Inspects magic bytes (validates genuine `%PDF-1.x`).
  • Scans for embedded script payloads.
  • Validates file size constraints (< 25MB).
      │
      ▼
[ STAGE 2: AI OCR & QUALITY PRE-CHECK ]
  • Extracts text and mathematical equation layers.
  • Evaluates handwriting legibility and diagram clarity.
  • Checks duplicate text similarity against existing repository.
  • Detects potential exam-paper leaks or policy violations.
      │
      ▼
[ STAGE 3: EDITORIAL ADMIN QUEUE ]
  • Administrator reviews file preview alongside AI confidence score.
      ├──────────────────────┬──────────────────────┐
      ▼                      ▼                      ▼
  [ REJECT ]        [ REQUEST REVISION ]       [ APPROVE ]
  • Violates policy. • Re-scan blurry page.     • Published to public repo.
  • Notifies student.• Notifies student.        • Contributor awarded +50 VT.
```

---

### DIAGRAM 08: Academic Doubt Resolution Lifecycle
*State machine for technical doubt submission, peer contribution, and verification.*

```
                     ┌─────────────────────────────┐
                     │   STUDENT ASKS DOUBT        │
                     │ Inputs question, subject,   │
                     │ and optional code/formula.  │
                     └──────────────┬──────────────┘
                                    │
                                    ▼
                     ┌─────────────────────────────┐
                     │       STATUS: 'OPEN'        │
                     │ Stored in `doubts` table.   │
                     │ Visible in student feed.    │
                     └──────────────┬──────────────┘
                                    │
                                    ▼
                     ┌─────────────────────────────┐
                     │ PEER / ADMIN SUBMITS ANSWER │
                     │ Stored in `answers` table.  │
                     │ Dispatches notification.    │
                     └──────────────┬──────────────┘
                                    │
                                    ▼
                     ┌─────────────────────────────┐
                     │     STATUS: 'ANSWERED'      │
                     │ Upvoted by peer community.  │
                     └──────────────┬──────────────┘
                                    │
                                    ▼
                     ┌─────────────────────────────┐
                     │ ASKER ACCEPTS / ADMIN VERIFY│
                     │ Marked `is_accepted = 1`.   │
                     └──────────────┬──────────────┘
                                    │
                                    ▼
                     ┌─────────────────────────────┐
                     │      STATUS: 'CLOSED'       │
                     │ +10 VidyaTokens awarded to  │
                     │ helpful responder wallet.   │
                     └─────────────────────────────┘
```

---

### DIAGRAM 09: Live Peer Session Scheduling & Execution
*Procedural flow for live workshops and mentor-led interactive marathons.*

```
[ ADMINISTRATOR DESK ] ──( 1. Schedules Session with topic, date, & Meet link )──> [ API ROUTER ]
                                                                                           │
                                                                                           ▼
[ STUDENT DASHBOARD ] <──( 2. Broadcasts notification & displays "LIVE NOW" pulse )── [ `live_sessions` ]
         │
         │ (3. Clicks "Join Session Now")
         ▼
[ PARTICIPATION LOG ] ──( 4. Inserts into `session_participations` with timestamp )──> [ SQLite DB ]
         │
         ▼
[ EXTERNAL SECURE MEETING ROOM LAUNCHED (Google Meet) ]
```

---

### DIAGRAM 10: Virtual Study Room Engagement
*Lifecycle of 24/7 collaborative focus rooms.*

```
[ STUDENT ] ──( 1. Selects Study Room, e.g., "DSA & Algorithm Focus" )──> [ API ROUTER ]
                                                                                 │
                                                                                 ▼
[ ROOM OCCUPANCY CHECK ] <──( 2. Evaluates active participants vs capacity )─── [ `study_rooms` ]
        │
        ├─► IF CAPACITY EXCEEDED: Prompts student to join parallel study room.
        │
        └─► IF CAPACITY AVAILABLE:
                  │
                  ▼
          [ PARTICIPATION AUDIT ]
          • Records student join event in `study_room_participations`.
          • Updates real-time room occupancy indicator.
          • Opens persistent study space URL for quiet co-working.
```

---

### DIAGRAM 11: Notification Dispatch & State Transition
*Event-driven notification routing for user academic updates.*

```
[ PLATFORM EVENT TRIGGER ]
  • Trigger Types:
      ├─► Welcome Bonus Credited (Registration)
      ├─► New Answer Submitted to Student's Doubt
      ├─► Upcoming Live Session Starting in 15 Minutes
      └─► VidyaTokens Merit Award Received
               │
               ▼
[ DATABASE INSERTION ]
  • Creates record in `notifications` table (`is_read = 0`).
  • Associates `related_entity_id` and deep link target.
               │
               ▼
[ CLIENT NAVIGATION BADGE ]
  • Header bell icon displays dynamic unread indicator count.
  • Student clicks notification -> updates `is_read = 1` -> navigates directly to target view.
```

---

### DIAGRAM 12: VidyaTokens Double-Entry Ledger Mechanics
*Mathematical accounting flow ensuring balance integrity and zero double-spending.*

```
[ TRIGGER EVENT: Answer Marked Verified (+10 VT) ]
                         │
                         ▼
[ ATOMIC DATABASE TRANSACTION (Serialized SQL) ]
  • Step 1: Read current wallet balance for responder:
            `SELECT balance FROM token_wallets WHERE user_id = ?`
  • Step 2: Compute new balance:
            $$\text{NewBalance} = \text{CurrentBalance} + 10$$
  • Step 3: Mutate wallet state:
            `UPDATE token_wallets SET balance = ?, updated_at = ? WHERE user_id = ?`
  • Step 4: Write immutable double-entry ledger entry:
            `INSERT INTO token_transactions (id, user_id, type, amount, reason, balance_after, created_at)
             VALUES (?, ?, 'TOKEN_EARNED', 10, 'Helpful verified answer', ?, ?)`
                         │
                         ▼
[ FLUSH TO DISK (`./data/yuvasetu.sqlite`) ]
```

---

### DIAGRAM 13: Platform Business Value Stream & Flywheel
*Systemic compounding value loop connecting students, quality content, and mentors.*

```
         ┌────────────────────────────────────────────────────────┐
         ▼                                                        │
┌──────────────────┐                                     ┌──────────────────┐
│ More Verified    │                                     │ High Student     │
│ Notes & PYQs     │                                     │ Engagement       │
└────────┬─────────┘                                     └────────▲─────────┘
         │                                                        │
         ▼                                                        │
┌──────────────────┐         ┌──────────────────┐        ┌────────┴─────────┐
│ Higher Student   │ ──────> │ Fast Academic    │ ─────> │ VidyaTokens Peer │
│ Exam Success     │         │ Doubt Resolution │        │ Tutoring Rewards │
└──────────────────┘         └──────────────────┘        └──────────────────┘
```

---

### DIAGRAM 14: Proposed Contributor Revenue-Sharing Allocation
*Institutional scaling model for sustainable academic expansion.*

```
                         ┌───────────────────────────────┐
                         │ QUARTERLY PREMIUM REVENUE /   │
                         │ INSTITUTIONAL SPONSORSHIP     │
                         └───────────────┬───────────────┘
                                         │
                 ┌───────────────────────┼───────────────────────┐
                 │ 60%                   │ 25%                   │ 15%
                 ▼                       ▼                       ▼
     ┌───────────────────────┐ ┌───────────────────┐ ┌───────────────────────┐
     │ CONTRIBUTOR INCENTIVES│ │ INFRASTRUCTURE    │ │ SCHOLARSHIP FUND      │
     │ Honorariums for top   │ │ Cloud hosting,    │ │ Meritorious needs-    │
     │ student mentors and   │ │ Gemini AI tokens, │ │ based student book &  │
     │ verified educators.   │ │ security audits.  │ │ tuition sponsorships. │
     └───────────────────────┘ └───────────────────┘ └───────────────────────┘
```

---
*End of Technical Diagram Portfolio.*  
*YuvaSetu — Samajh Se Safalta Tak.*
