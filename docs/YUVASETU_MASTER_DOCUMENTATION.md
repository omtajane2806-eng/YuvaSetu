# YuvaSetu — Complete Product, Business & Intellectual Property Documentation
### Subtitle: *"Samajh Se Safalta Tak"*
**Platform Version:** 1.0.0-prod  
**Classification:** Proprietary Technical, Product, & IP Architecture Document  
**Date of Compilation:** October 2026  
**Document Status:** Confidential & Definitive Project Record  

---

## TABLE OF CONTENTS
1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [The YuvaSetu Solution](#3-the-yuvasetu-solution)
4. [Target User Profiles & Roles](#4-target-user-profiles--roles)
5. [Complete Feature Architecture & Status Map](#5-complete-feature-architecture--status-map)
6. [Student User Journey](#6-student-user-journey)
7. [Administrator User Journey](#7-administrator-user-journey)
8. [Content Management & Curated Publishing Model](#8-content-management--curated-publishing-model)
9. [Future Student-Upload System (Proposed)](#9-future-student-upload-system-proposed)
10. [AI-Assisted Verification Workflow (Proposed)](#10-ai-assisted-verification-workflow-proposed)
11. [AI Learning Assistant Implementation](#11-ai-learning-assistant-implementation)
12. [Live Learning Architecture: Sessions vs. Study Rooms](#12-live-learning-architecture-sessions-vs-study-rooms)
13. [Academic Doubt-Solving Engine](#13-academic-doubt-solving-engine)
14. [Collaborative Academic Community Model](#14-collaborative-academic-community-model)
15. [VidyaTokens Utility Economic Model](#15-vidyatokens-utility-economic-model)
16. [Future Revenue-Sharing Architecture (Proposed)](#16-future-revenue-sharing-architecture-proposed)
17. [End-to-End Platform Architecture](#17-end-to-end-platform-architecture)
18. [Relational Database Schema & Data Model (ER)](#18-relational-database-schema--data-model-er)
19. [Security Architecture & Edge Case Defense](#19-security-architecture--edge-case-defense)
20. [Data Flow Diagrams (DFDs)](#20-data-flow-diagrams-dfds)
21. [Business Model Canvas](#21-business-model-canvas)
22. [Competitive Differentiation & Strategic Moats](#22-competitive-differentiation--strategic-moats)
23. [Intellectual Property (IP) Documentation](#23-intellectual-property-ip-documentation)
24. [Development Ownership & Provenance Record](#24-development-ownership--provenance-record)
25. [Complete System Diagram Portfolio (14 Original Visualizations)](#25-complete-system-diagram-portfolio)
26. [Technical Implementation Verification & Audit](#26-technical-implementation-verification--audit)

---

## 1. EXECUTIVE SUMMARY

### 1.1 What is YuvaSetu?
**YuvaSetu** is an integrated, distraction-free academic ecosystem engineered specifically for university and engineering students. Translating literally from Hindi as the *"Bridge for Youth"* with the philosophical cornerstone **"Samajh Se Safalta Tak"** (*From Deep Conceptual Understanding to Tangible Academic and Career Success*), the platform bridges the systemic fragmentation prevalent in contemporary tertiary education.

Unlike single-purpose tools (such as isolated PDF repositories, generic video boards, or detached chat applications), YuvaSetu unifies six vital pillars of university scholarship into a single high-performance workspace:
1. **Curriculum-Aligned Study Content**: Classroom-tested handwritten masterclass notes, condensed formula revision cheatsheets, structured video lectures, and solved university examination papers (PYQs).
2. **Context-Grounded AI Academic Tutor**: A server-side artificial intelligence pedagogical engine powered by Google Gemini 3.7 Flash with built-in prompt injection defense, note grounding, and strict academic integrity enforcement.
3. **Structured Doubt Clearance**: A tiered question-and-answer subsystem enabling students to ask complex technical doubts categorized by subject, with answer verification workflows.
4. **Live Interactive Learning**: Scheduled faculty/mentor academic workshops and real-time collaborative peer study rooms for focused problem-solving.
5. **Academic Community Discussions**: A moderated peer forum for subject-specific exchange, exam strategy, project collaboration, and career discussions.
6. **VidyaTokens Utility Economy**: A transparent, non-speculative double-entry ledger economy that rewards student learning consistency, peer assistance, and platform participation while keeping all core learning 100% free.

### 1.2 Purpose of Creation
Indian engineering and higher-education curricula demand rigorous mathematical formulation, architectural intuition, and disciplined problem-solving. However, undergraduate students face high cognitive load navigating across disconnected communication groups, unverified cloud drives, and commercial platforms plagued by algorithmic distractions, social pressure, and monetization paywalls. YuvaSetu was architected from first principles to provide an academic-first sanctuary: fast, authenticated, relational, privacy-respecting, and centered entirely on conceptual clarity.

### 1.3 Key Distinctions from Generic EdTech
- **Anti-Social Media Discipline**: Zero profile pictures or vanity avatars. User identity is consistently rendered using deterministic initial typography (`UserInitialsBadge`) to prevent superficial competition and harassment.
- **Academic Integrity Guard**: The platform's AI companion is programmed to reject direct assignment completion and examination cheating; instead, it guides the student step-by-step through core derivations and foundational algorithms.
- **Relational Integrity & Double-Entry Ledger**: Every token balance mutation is audited through immutable debit/credit ledger records with negative balance prevention.
- **Universal Zero-Cost Tier**: All core educational notes, formula sheets, doubt resolution, and study rooms are open to every registered university student without subscription barriers.

---

## 2. PROBLEM STATEMENT

Undergraduate university and engineering students experience severe friction across their academic lifecycle:

1. **Scattered & Ephemeral Learning Resources**:
   High-quality lecture notes, previous-year question solutions, and subject guides are routinely scattered across ad-hoc instant messaging groups, broken cloud drive links, and expired file hosts. Students waste dozens of revision hours before semester examinations attempting to locate legitimate study materials.
2. **High Hesitation in Classroom Doubt Clearing**:
   Large university lecture halls (frequently numbering 60–120 students per classroom) foster social anxiety and imposter syndrome. Students routinely leave lectures with foundational misunderstandings that compound over consecutive semesters.
3. **Fragmented & Distracting Digital Tools**:
   Students are forced to context-switch across 4 to 6 separate platforms: video streaming websites for lectures (cluttered with algorithmic entertainment recommendations), messaging apps for study groups (cluttered with non-academic distractions), and generic AI chatbots (prone to direct hallucination without syllabus alignment).
4. **Lack of Accountable Peer Collaboration**:
   Remote and commuter students frequently lack study partners. Although group study is proven to improve problem-solving retention, organizing quiet, distraction-free virtual study spaces requires manual coordination of meeting URLs and schedule conflicts.
5. **Academic Integrity Risks from Commercial AI**:
   Generic consumer AI tools tempt students to submit machine-generated outputs directly for university coursework, sabotaging foundational cognitive retention and risking disciplinary violations.
6. **Absence of Recognition for Student Mentorship**:
   Top-performing students who spend hours mentoring junior peers, writing immaculate lecture notes, and answering doubts receive zero tangible platform recognition or structured academic rewards.

---

## 3. THE YUVASETU SOLUTION

YuvaSetu addresses these challenges through a systematically engineered triad: **Problem ➔ YuvaSetu Solution ➔ Student Benefit**.

```
+----------------------------------------------------------------------------------------------------+
|                                    THE YUVASETU SOLUTION MATRIX                                    |
+------------------------------------+------------------------------------+--------------------------+
| Identified Problem                 | YuvaSetu Engineered Solution       | Tangible Student Benefit |
+------------------------------------+------------------------------------+--------------------------+
| 1. Fragmented, unverified notes    | Centralized, branch-specific,      | Immediate exam prep;     |
|    scattered across random chats.  | admin-verified master notes &      | zero wasted hours chasing|
|                                    | formula sheets with download cache.| illegible photocopies.   |
+------------------------------------+------------------------------------+--------------------------+
| 2. Social fear & intimidation      | Dual-tier doubt clearance:         | Judgment-free learning;  |
|    when asking technical questions.| 24/7 AI tutor + peer/admin Q&A     | complete conceptual      |
|                                    | with subject categorization.       | mastery ("Samajh").      |
+------------------------------------+------------------------------------+--------------------------+
| 3. Entertainment algorithms &      | Dark academic focused UI; zero     | Uninterrupted focus;     |
|    distractions on generic apps.   | advertisements, zero vanity photos,| 100% time spent on core  |
|                                    | pure pedagogical design system.    | intellectual synthesis.  |
+------------------------------------+------------------------------------+--------------------------+
| 4. Isolated study with no peer     | Scheduled Live Peer Sessions &     | Continuous motivation,   |
|    accountability or quiet rooms.  | persistent 24/7 Virtual Study      | peer camaraderie, and    |
|                                    | Rooms with one-click routing.      | structured study habits. |
+------------------------------------+------------------------------------+--------------------------+
| 5. Direct-answer assignment cheats | AI Academic Integrity Guard:       | Genuine engineering skill|
|    sabotaging deep understanding.  | enforces step-by-step logic,       | development; zero risk of|
|                                    | analogies, & conceptual hints.     | academic misconduct.     |
+------------------------------------+------------------------------------+--------------------------+
| 6. Unrewarded peer tutoring        | VidyaTokens internal ledger:       | Tangible recognition for |
|    and academic contributions.     | earn tokens for helpful answers &  | academic generosity;     |
|                                    | unlock special masterclasses.      | healthy peer incentives. |
+------------------------------------+------------------------------------+--------------------------+
```

---

## 4. TARGET USER PROFILES & ROLES

The YuvaSetu platform operates on a strict two-role architectural model: **Student** and **Administrator**.

```
+------------------------------------------------------------------------------------+
|                               YUVASETU USER TAXONOMY                               |
+-----------------------------------------+------------------------------------------+
| Role: STUDENT                           | Role: ADMINISTRATOR                      |
+-----------------------------------------+------------------------------------------+
| Target:                                 | Target:                                  |
| Undergraduate Engineering & University  | Platform Academic Leads, Faculty Advisors|
| Students (Semesters 1 through 8).       | System Engineers, Governance Curators.   |
|                                         |                                          |
| Capabilities:                           | Capabilities:                            |
| * Browse, read, & download study notes. | * Curate, upload, and publish official   |
| * Search & stream academic video guides.|   study notes, formula sheets, & PYQs.   |
| * Join interactive Virtual Study Rooms. | * Schedule and host platform Live        |
| * Attend scheduled Live Sessions.       |   Sessions with meeting URL governance.  |
| * Submit technical doubts & questions.  | * Answer, verify, and resolve student    |
| * Post helpful answers to peer queries. |   academic doubts with verified badges.  |
| * Interact with Gemini 3.7 AI Assistant.| * Moderate community posts and replies.  |
| * Participate in community discussions. | * Manage user accounts and statuses.     |
| * Earn & spend VidyaTokens via wallet.  | * Oversee double-entry token ledger.     |
| * Audit personal academic activities.   | * Inspect platform analytics & health.   |
| * Maintain profile study subjects.      | * Configure AI thresholds and safety.    |
|                                         | * Protected by Sole-Admin Safety Guard.  |
+-----------------------------------------+------------------------------------------+
```

*Note: The platform explicitly avoids intermediate or fragmented roles (such as unverified commercial creators) to preserve institutional trust and strict curriculum fidelity.*

---

## 5. COMPLETE FEATURE ARCHITECTURE & STATUS MAP

The feature architecture of YuvaSetu is cataloged below across sixteen modules. Each module is assigned an authoritative implementation status:
- **`[IMPLEMENTED]`**: Complete, active, validated in code, and verified in database tests.
- **`[IN DEVELOPMENT]`**: Functional with active polish or enhancements underway.
- **`[PLANNED]`**: Concrete architectural design ready for upcoming sprint cycles.
- **`[FUTURE / PROPOSED]`**: Long-term conceptual roadmap subject to policy, legal, and operational review.

```
====================================================================================================
MODULE 01: LANDING & BRAND OPENING EXPERIENCE
====================================================================================================
Purpose:           Establishes brand identity, value proposition, and frictionless navigation.
Users:             Public Visitors, Prospective Students, Returning Scholars.
Main Features:     - Cinematic dark academic opening sequence ("Samajh Se Safalta Tak").
                   - Session-aware skip logic for returning visitors.
                   - Interactive dynamic showcase of notes, live sessions, and doubt forum.
                   - Ecosystem connectivity visualization node network.
                   - One-click routing to authentication and learning discovery.
Data Entities:     Client-side session flags, aggregated database statistics.
Current Status:    [IMPLEMENTED]

====================================================================================================
MODULE 02: AUTHENTICATION & ACCESS CONTROL (RBAC)
====================================================================================================
Purpose:           Secure, role-aware user onboarding, credential verification, and session state.
Users:             Students, Platform Administrators.
Main Features:     - Native salted HMAC-SHA256 credential hashing (`yuvasetu_salt_2026`).
                   - 3-portal switcher: Option 1 (Student), Option 2 (Admin), Option 3 (Register).
                   - Multi-credential administrator onboarding for verified platform engineers.
                   - Firebase Google OAuth client-side integration (strictly student role).
                   - Dynamic password re-synchronization on verified credential updates.
                   - Interactive in-modal password reset engine (`/api/auth/reset-password`).
                   - Sole-Admin Protection Guard (blocks deactivation of last active administrator).
Data Entities:     `users`, `token_wallets`, `activity_logs`.
Current Status:    [IMPLEMENTED]

====================================================================================================
MODULE 03: STUDENT PROFILE & ACADEMIC PREFERENCES
====================================================================================================
Purpose:           Captures institutional background, course specializations, and learning goals.
Users:             Students.
Main Features:     - College, course, branch, and year of study configuration.
                   - Subject selection: subjects currently learning vs subjects willing to mentor.
                   - Deterministic avatar typography via UserInitialsBadge (zero profile photos).
                   - VidyaTokens balance readout and academic reputation metrics.
                   - First-login profile setup onboarding modal.
Data Entities:     `users`.
Current Status:    [IMPLEMENTED]

====================================================================================================
MODULE 04: STUDY MATERIALS & NOTES REPOSITORY
====================================================================================================
Purpose:           Curated academic repository of verified engineering and science study content.
Users:             Students (Consumer/Reader), Administrators (Publisher/Curator).
Main Features:     - Categorized by branch (CS, IT, Mech, Electrical, Civil) and semester.
                   - Content types: Handwritten Masterclass Notes, Condensed Formula Cheatsheets,
                     and University PYQ (Previous Year Questions) Solutions.
                   - In-browser document viewer with page count and estimated read times.
                   - Full-text search and subject filter pills.
                   - Bookmark/save functionality and view/download tracking.
                   - Admin publishing console with draft/publish validation guards.
Data Entities:     `study_materials`, `user_interactions`, `activity_logs`.
Current Status:    [IMPLEMENTED]

====================================================================================================
MODULE 05: ACADEMIC VIDEO LEARNING
====================================================================================================
Purpose:           Structured video tutorials and engineering algorithm walkthroughs.
Users:             Students, Administrators.
Main Features:     - Topic-by-topic modular video navigation.
                   - Distraction-free embedded player with playback rate controls.
                   - Linked revision notes and timestamps for difficult mathematical proofs.
Data Entities:     `study_materials` (type: 'video').
Current Status:    [IMPLEMENTED]

====================================================================================================
MODULE 06: LIVE PEER SESSIONS
====================================================================================================
Purpose:           Scheduled real-time academic workshops, revision marathons, and mentor lectures.
Users:             Students (Attendees), Administrators (Hosts/Organizers).
Main Features:     - Time-stamped scheduling with dynamic "Live Now" animated pulse badges.
                   - Host accreditation badges with institutional affiliation.
                   - One-click secure external meeting launcher (Google Meet, etc.).
                   - Attendance tracking and automated session status updates.
Data Entities:     `live_sessions`, `session_participations`, `notifications`.
Current Status:    [IMPLEMENTED]

====================================================================================================
MODULE 07: VIRTUAL STUDY ROOMS
====================================================================================================
Purpose:           24/7 collaborative quiet study and peer problem-solving spaces.
Users:             Students, Administrators.
Main Features:     - Subject-designated rooms (DSA Focus Room, DBMS Relational Lab, GATE Prep Room).
                   - Room occupancy indicators and capacity limit management.
                   - Persistent meeting room links for uninterrupted group study.
Data Entities:     `study_rooms`, `study_room_participations`.
Current Status:    [IMPLEMENTED]

====================================================================================================
MODULE 08: DOUBT-SOLVING & RESOLUTION LIFECYCLE
====================================================================================================
Purpose:           Structured asynchronous engineering query and clarification forum.
Users:             Students (Ask/Answer), Administrators (Verify/Resolve).
Main Features:     - Step-by-step doubt submission with subject tag classification.
                   - Three-phase lifecycle: OPEN -> ANSWERED -> CLOSED / RESOLVED.
                   - Answer submission supporting code snippets and mathematical formulas.
                   - Peer upvoting and official administrator verification badge.
Data Entities:     `doubts`, `answers`, `user_interactions`, `notifications`.
Current Status:    [IMPLEMENTED]

====================================================================================================
MODULE 09: COLLABORATIVE COMMUNITY DISCUSSIONS
====================================================================================================
Purpose:           Open scholarly exchange, project brainstorming, and academic announcements.
Users:             Students, Administrators.
Main Features:     - Academic category threads (Algorithms, Career, Exam Tips, Project Showcase).
                   - Thread replies and recursive discussion engagement.
                   - Peer like counts and community reputation tracking.
                   - Administrator moderation suite (soft remove, flag, restore).
Data Entities:     `community_posts`, `community_replies`, `user_interactions`.
Current Status:    [IMPLEMENTED]

====================================================================================================
MODULE 10: NOTIFICATION SUBSYSTEM
====================================================================================================
Purpose:           Real-time academic alerts, session reminders, and wallet activity notices.
Users:             Students, Administrators.
Main Features:     - Categorized notifications (WELCOME, DOUBT_REPLY, LIVE_SESSION, TOKEN_AWARD).
                   - Unread count badge on navigation bar with instant read state toggles.
                   - Deep-link routing directly to relevant question, session, or note item.
Data Entities:     `notifications`.
Current Status:    [IMPLEMENTED]

====================================================================================================
MODULE 11: AI LEARNING ASSISTANT (GEMINI 3.7 FLASH)
====================================================================================================
Purpose:           Private, server-proxied pedagogical tutor with academic integrity enforcement.
Users:             Students.
Main Features:     - Natural language concept breakdown and intuitive analogical synthesis.
                   - Formula Explainer Modal with step-by-step mathematical derivation hints.
                   - Code Syntax & Complexity Explainer with Big-O runtime analysis.
                   - Auto-quiz generation and interactive score evaluation.
                   - Academic Integrity Guard (detects and intercepts assignment cheating).
                   - Untrusted document context grounding isolation.
                   - Dual-engine fallback: live Gemini AI -> local structured pedagogical engine.
Data Entities:     Client-side conversation cache, server-side stateless proxy logs.
Current Status:    [IMPLEMENTED]

====================================================================================================
MODULE 12: STUDENT ACTIVITY AUDIT & LEARNING METRICS
====================================================================================================
Purpose:           Quantifiable learning history tracking and engagement transparency.
Users:             Students, Platform Administrators.
Main Features:     - Chronological activity log (Logins, Downloads, Doubts Asked, Answers Given).
                   - Weekly study consistency indicators and reputation milestones.
                   - Fully immutable activity trail in database.
Data Entities:     `activity_logs`.
Current Status:    [IMPLEMENTED]

====================================================================================================
MODULE 13: ADMIN COMMAND CENTER & GOVERNANCE
====================================================================================================
Purpose:           Comprehensive platform control, curriculum moderation, and user management.
Users:             Administrators only.
Main Features:     - Centralized executive metrics (Total Students, Active Notes, Open Doubts).
                   - Student account manager: view institutional affiliations, search, toggle status.
                   - Administrator status manager guarded by Sole-Admin Safety Protocol.
                   - Curriculum publishing desk with real-time validation checks.
                   - System Health Monitor: checks SQLite connectivity, Gemini API, security headers.
Data Entities:     All relational tables.
Current Status:    [IMPLEMENTED]

====================================================================================================
MODULE 14: PLATFORM ANALYTICS & CURRICULUM INTELLIGENCE
====================================================================================================
Purpose:           Data-informed curriculum optimization and student engagement analysis.
Users:             Administrators.
Main Features:     - Subject demand tracking (most viewed subjects, highest doubt volumes).
                   - Live session attendance analytics and peak study room utilization.
                   - VidyaTokens economic velocity and distribution curves.
Data Entities:     Aggregated database queries.
Current Status:    [IMPLEMENTED]

====================================================================================================
MODULE 15: VIDYATOKENS ATOMIC WALLET & LEDGER
====================================================================================================
Purpose:           Incentive platform token tracking with strict double-entry ledger security.
Users:             Students, Administrators.
Main Features:     - 100 free VidyaTokens credited upon initial student registration.
                   - Reward triggers: daily attendance, quality doubt posting, verified answers.
                   - Double-entry ledger: every mutation records `balance_after` and transaction id.
                   - Negative balance prevention (`CHECK (balance >= 0)`).
                   - Optional test checkout pack simulation for platform development.
Data Entities:     `token_wallets`, `token_transactions`.
Current Status:    [IMPLEMENTED]

====================================================================================================
MODULE 16: SYSTEM SECURITY & ABUSE PREVENTION
====================================================================================================
Purpose:           Full-stack defense against injection, brute-force, double-spend, and data leaks.
Users:             Platform infrastructure (Transparent to all users).
Main Features:     - Sliding-window in-memory rate limiter on authentication and AI routes.
                   - Express payload cap (10MB limit) and OWASP security response headers.
                   - HMAC-SHA256 salted hash with complete client sanitization.
                   - Foreign key cascades and parameterized SQL queries eliminating SQL injection.
Data Entities:     Server runtime middleware and database constraints.
Current Status:    [IMPLEMENTED]
```

---

## 6. STUDENT USER JOURNEY

The user experience for an undergraduate student is structured as a frictionless, continuous academic progression:

```
[ LANDING PAGE & BRAND OPENING ]
      │
      ▼
[ REGISTRATION / GOOGLE SIGN-IN ]
  • Receives instant 100 Free VidyaTokens welcome bonus.
  • Auto-creates persistent token wallet and notification record.
      │
      ▼
[ ONBOARDING PROFILE SETUP ]
  • Selects College (e.g. IIT Bombay), Course (B.Tech), Branch (CS), & Year.
  • Selects Subjects currently studying (e.g. DSA, DBMS, OS).
      │
      ▼
[ PERSONALIZED STUDENT COMMAND CENTER ]
  • Real-time wallet balance, active study rooms, upcoming live sessions.
  • Quick search for engineering topics across all verified notes.
      │
      ├──────────────────────┬──────────────────────┬──────────────────────┐
      ▼                      ▼                      ▼                      ▼
[ EXPLORE STUDY NOTES ]  [ LIVE SESSIONS & ROOMS ] [ ASK ACADEMIC DOUBT ] [ AI COMPANION ]
• Filters by branch/sem. • Joins active peer room • Submits question     • Deep concept help
• Reads handwritten PDF. • 1-click launch to Meet.• with subject tags.   • Formula proofs
• Saves to collection.   • Earns study consistency• Open to peer/admin   • Quiz generation
• Downloads for offline.   ledger points.           answers.             • Step-by-step hints
      │                      │                      │                      │
      └──────────────────────┴──────────────────────┴──────────────────────┘
                                     │
                                     ▼
                      [ COMMUNITY FORUM & PEER ANSWERS ]
                      • Provides detailed answer to peer's technical doubt.
                      • Admin marks answer as VERIFIED.
                      • System automatically awards 10 VidyaTokens.
                                     │
                                     ▼
                      [ STUDENT REPUTATION & ACTIVITY AUDIT ]
                      • Reviews earned badges, unlocked materials, and ledger history.
```

---

## 7. ADMINISTRATOR USER JOURNEY

The administrative experience guarantees platform governance, curriculum fidelity, and pedagogical oversight:

```
[ OPTION 2: ADMIN LOGIN PORTAL ]
  • Enforces administrative role verification (`user.role === 'admin'`).
  • Validates multi-credential hash (`Omtajane2831` / `admin123`).
      │
      ▼
[ ADMIN COMMAND CENTER DASHBOARD ]
  • High-level platform health, student count, open doubts, and active notes.
      │
      ├─────────────────────────────┼─────────────────────────────┐
      ▼                             ▼                             ▼
[ CURRICULUM DESK ]          [ LIVE SESSION DISPATCH ]     [ STUDENT GOVERNANCE ]
• Uploads verified notes,    • Schedules masterclasses.    • Inspects student registry.
  cheatsheets, or PYQs.      • Sets date, topic, & URL.    • Validates affiliations.
• Validates branch mapping.  • Dispatches automated alert  • Moderates suspended
• Publishes instantly to DB.   to all matching students.     accounts if necessary.
      │                             │                             │
      ├─────────────────────────────┼─────────────────────────────┘
      ▼                             ▼
[ DOUBT & COMMUNITY DESK ]   [ ADMIN TOKENS & SYSTEM HEALTH ]
• Inspects open doubts.      • Audits double-entry VidyaTokens economy ledger.
• Submits verified answers.  • Executes safe manual adjustments if requested.
• Moderates flagged posts.   • Checks database integrity and Gemini API proxy.
                             • Guarded: Cannot deactivate last active administrator.
```

---

## 8. CONTENT MANAGEMENT & CURATED PUBLISHING MODEL

To protect university students from low-quality, erroneous, or misleading study notes, YuvaSetu maintains a **Curated Publishing Model**:
- **Official Admin Publishing**: Only authenticated administrators can draft, review, and publish study materials into the primary curriculum repository.
- **Student Consumption Guarantee**: Students have uninhibited, 100% free access to search, preview, read, bookmark, and download all verified materials.
- **Editorial Lifecycle**:

```
+---------------+     +--------------------+     +-------------------+     +------------------+
| DRAFT CREATION | ──> | CURRICULUM REVIEW  | ──> | PUBLISH TO DB     | ──> | STUDENT ACCESS   |
| Admin inputs  |     | Admin verifies     |     | Stored in         |     | Instant discovery|
| title, branch,|     | syllabus match,    |     | `study_materials` |     | across search,   |
| page count,   |     | diagram legibility,|     | with unique ID &  |     | branch filters,  |
| & file asset. |     | & question proofs. |     | indexed subject.  |     | & student reads. |
+---------------+     +--------------------+     +-------------------+     +------------------+
```

---

## 9. FUTURE STUDENT-UPLOAD SYSTEM (PROPOSED)
*Status: `[FUTURE / PROPOSED]` — Not currently active in platform code.*

To enable decentralized student contributions while rigorously preventing academic misinformation, copyright infringement, or spam, the following workflow is proposed:

```
[ STUDENT SUBMISSION ]
  • Student uploads handwritten lecture notes or solved university papers.
  • Inputs academic metadata: University, Course Code, Semester, & Topic.
      │
      ▼
[ AUTOMATED PIPELINE: STAGE 1 (MIME & SECURITY AUDIT) ]
  • Verifies binary signature (Magic Bytes: `%PDF-1.x`).
  • Scans for embedded macros, malicious executables, or script injection.
  • Rejects oversized or malformed payloads.
      │
      ▼
[ AUTOMATED PIPELINE: STAGE 2 (AI OCR & PRE-CHECK) ]
  • Ingests sample pages through OCR extraction.
  • Analyzes legibility, syllabus alignment, and duplicate text similarity.
  • Flags potential plagiarism or inappropriate content.
      │
      ▼
[ ADMINISTRATIVE EDITORIAL QUEUE ]
  • Platform Administrator reviews AI pre-check score and visual quality.
  • Three possible outcomes:
      ├─► APPROVE: Published to public repository; student awarded VidyaTokens.
      ├─► REQUEST REVISION: Notifies student to re-scan blurry diagrams.
      └─► REJECT: Removed with specific policy notification to student.
      │
      ▼
[ PUBLIC CURRICULUM ACCESS ]
```

---

## 10. AI-ASSISTED VERIFICATION WORKFLOW (PROPOSED)
*Status: `[FUTURE / PROPOSED]` — Distinguishes human authority from automated AI evaluation.*

```
+----------------------------------------------------------------------------------------------------+
|                             PROPOSED AI VERIFICATION WORKFLOW MATRIX                               |
+--------------------------+--------------------------------------+----------------------------------+
| Processing Stage         | Automated AI Responsibility          | Human Administrator Authority    |
+--------------------------+--------------------------------------+----------------------------------+
| 1. Text & Math Parsing   | Extracts LaTeX equations, theorems,  | Verifies that extracted math     |
|                          | and section headers from PDF.        | matches university course scope. |
+--------------------------+--------------------------------------+----------------------------------+
| 2. Plagiarism & Match    | Cross-checks text shingles against   | Determines fair academic use vs  |
|                          | known textbook & online solutions.   | direct copyright infringement.   |
+--------------------------+--------------------------------------+----------------------------------+
| 3. Academic Integrity    | Flags direct exam paper leaks or     | Reviews flagged questions and    |
|                          | active take-home assignment prompts. | escalates if necessary.          |
+--------------------------+--------------------------------------+----------------------------------+
| 4. Quality Scoring       | Computes legibility & completeness   | Retains exclusive decision power |
|                          | confidence score (0 to 100).         | to approve or reject content.    |
+--------------------------+--------------------------------------+----------------------------------+
```

*Crucial Boundary: AI serves strictly as an advisory evaluation tool. Autonomous publishing without human administrator sign-off is expressly prohibited.*

---

## 11. AI LEARNING ASSISTANT IMPLEMENTATION

### 11.1 Server-Side Architecture
The YuvaSetu AI companion utilizes Google's flagship **Gemini 3.7 Flash** model, mounted strictly on the Node.js backend (`/api/ai/ask`). Client browsers never receive or handle Gemini API credentials.

```
[ STUDENT CLIENT ]
      │
      │ 1. POST /api/ai/ask { query, context, studentName }
      ▼
[ NODE/EXPRESS SERVER PROXY ]
      │
      ├─► Rate Limiter Check (40 requests / minute)
      ├─► Academic Integrity Filter
      │     (Rejects "solve exam", "cheat", "write my assignment")
      │
      ▼
[ SYSTEM INSTRUCTION INJECTION ]
  "You are YuvaSetu AI, an expert academic tutor built on the pedagogy
   of 'Samajh Se Safalta Tak'. Guide the student step-by-step.
   NEVER write assignment answers for direct submission.
   If reference material context is supplied, ground answers firmly."
      │
      ▼
[ GOOGLE GEMINI 3.7 FLASH API ]
      │
      ▼
[ STREAMED / SANITIZED ACADEMIC RESPONSE ]
```

### 11.2 Specialized Modal Capabilities
- **Formula Explainer**: Deconstructs complex formulas (e.g. Binary Search mid-point `low + (high - low) / 2` overflow prevention, Bayes' Theorem, Navier-Stokes approximations) into intuitive steps.
- **Code Syntax & Complexity Explainer**: Explains code line-by-line while mathematically proving asymptotic time and space bounds ($O(N \log N)$, $O(V + E)$).
- **Practice Quiz Engine**: Dynamically synthesizes four-option multiple-choice engineering questions based on uploaded notes with automated scoring.

---

## 12. LIVE LEARNING ARCHITECTURE: SESSIONS VS. STUDY ROOMS

YuvaSetu cleanly differentiates between scheduled structured lectures and persistent peer collaboration environments:

```
+-----------------------------------+-----------------------------------+
| LIVE SESSIONS                     | STUDY ROOMS                       |
+-----------------------------------+-----------------------------------+
| * Scheduled academic events.      | * Persistent 24/7 peer spaces.    |
| * Led by verified faculty/admin.  | * Self-directed student focus.    |
| * Defined start and end times.    | * Always open and accessible.     |
| * Specific syllabus topic focus.  | * General collaborative study.    |
| * Tracks formal attendance logs.  | * Tracks room occupancy count.    |
| * Animated "LIVE NOW" indicators. | * Quiet focus & co-working vibe.  |
+-----------------------------------+-----------------------------------+
```

---

## 13. ACADEMIC DOUBT-SOLVING ENGINE

Doubts follow a strict state machine to prevent open questions from being abandoned:

```
[ STUDENT ASKS DOUBT ]
      │
      ▼ (Status: 'OPEN')
[ NOTIFICATION DISPATCHED TO MENTORS & ADMINS ]
      │
      ▼
[ PEER OR ADMINISTRATOR RESPONDS ]
      │
      ▼ (Status: 'ANSWERED')
[ PEER UPVOTES & ADMIN VERIFICATION ]
      │
      ▼
[ STUDENT REVIEWS & ACCEPTS ANSWER ]
      │
      ▼ (Status: 'CLOSED' / 'RESOLVED')
[ 10 VIDYATOKENS CREDITED TO HELPFUL RESPONDER ]
```

---

## 14. COLLABORATIVE ACADEMIC COMMUNITY MODEL

The community engine operates as a threaded academic exchange:
- **Thread Categories**: General Discussion, Engineering Projects, Exam Strategies, Coding Challenges, Career & Internships.
- **Content Moderation Flags**:
  - `ACTIVE`: Publicly visible and engageable.
  - `MODERATED`: Temporarily hidden pending admin review.
  - `REMOVED`: Permanently purged from public queries for policy violations.

---

## 15. VIDYATOKENS UTILITY ECONOMIC MODEL

### 15.1 Core Economic Principles
- **Core Learning is 100% Free**: No student is ever required to spend tokens or money to read basic curriculum notes, participate in study rooms, or ask academic questions.
- **Non-Speculative Utility Token**: VidyaTokens have zero cryptocurrency, gambling, or speculative liquidity characteristics. They are internal pedagogical utility points designed to gamify positive academic habits.
- **Double-Entry Ledger Architecture**: The database table `token_transactions` enforces accounting parity:

$$\text{Balance}_{\text{New}} = \text{Balance}_{\text{Previous}} \pm \text{Transaction Amount}$$

Every mutation records `balance_after`, `reference_type`, and `reference_id` to guarantee auditability.

```
+------------------------------------------------------------------------------------+
|                         VIDYATOKENS VALUE CIRCULATION                              |
+-----------------------------------------+------------------------------------------+
| INFLOW (EARNING TOKENS)                 | OUTFLOW (UTILIZING TOKENS)               |
+-----------------------------------------+------------------------------------------+
| * Welcome Gift on Signup (+100 VT)      | * Unlocking Special Masterclass Notes    |
| * Asking a Detailed Academic Doubt (+2) | * Reserving 1-on-1 Mentor Office Hours   |
| * Providing an Accepted Answer (+10)    | * Personalized AI Mock Viva Exam Packs   |
| * 5-Day Consecutive Study Streak (+15)  | * Exclusive Engineering Formula Compendia|
| * Administrative Merit Award (+50)      | * Platform Recognition Hall of Fame      |
+-----------------------------------------+------------------------------------------+
```

---

## 16. FUTURE REVENUE-SHARING ARCHITECTURE (PROPOSED)
*Status: `[FUTURE / PROPOSED]` — Conceptual business model for sustainable institutional scaling.*

```
[ VERIFIED STUDENT / FACULTY CONTRIBUTOR ]
                    │
                    │ 1. Submits Exceptional Masterclass Curriculum
                    ▼
[ PLATFORM PEER ACCREDITATION & VALUE SCORE ]
  • Evaluates download volume, verified doubt answers, & student ratings.
                    │
                    ▼
[ QUARTERLY INSTITUTIONAL SPONSORSHIP / PREMIUM REVENUE POOL ]
                    │
                    ├─► 60% Allocated to Academic Contributors (Honorarium / Stipend)
                    ├─► 25% Allocated to Platform Infrastructure, Hosting, & Gemini AI
                    └─► 15% Allocated to Institutional Student Scholarship Fund
```

*Legal & Compliance Note: Any real-world rollout of financial remuneration requires comprehensive compliance with applicable Indian taxation (GST, TDS), university employment regulations, and payment processing standards.*

---

## 17. END-TO-END PLATFORM ARCHITECTURE

```
====================================================================================================
CLIENT TIER (React 19, TypeScript, Tailwind CSS)
  • Single Page Application running Vite SPA runtime.
  • Views: Landing, Explore, Doubt Forum, Study Rooms, AI Assistant, Community, Admin Console.
  • Security: Client-side route guards, zero token exposure, UserInitialsBadge avatars.
====================================================================================================
                                      │
                                      ▼ HTTPS / JSON REST
====================================================================================================
SERVER RUNTIME TIER (Node.js + Express 4.x on Port 3000)
  • Security Middleware: Helmet-style headers, XSS sanitization, 10MB payload caps.
  • Rate Limiting: Sliding-window in-memory limiter for Auth (60/min) and AI (40/min).
  • REST API Router: `/api/auth/*`, `/api/materials/*`, `/api/doubts/*`, `/api/tokens/*`.
====================================================================================================
                 │                                │                           │
                 ▼                                ▼                           ▼
+---------------------------------+ +---------------------------+ +------------------------+
| DATABASE LAYER (SQLite / sql.js)| | AI PEDAGOGICAL ENGINE     | | EXTERNAL SERVICES      |
| • Persistent `./data/*.sqlite`  | | • Google Gemini 3.7 Flash | | • Firebase Google Auth |
| • Relational Foreign Keys       | | • Academic Integrity Guard| | • Google Meet / Links  |
| • 15 Normalized Schemas         | | • Prompt Isolation Filter | | • Static CDN Assets    |
+---------------------------------+ +---------------------------+ +------------------------+
```

---

## 18. RELATIONAL DATABASE SCHEMA & DATA MODEL (ER)

The database consists of 15 normalized relational tables:

```
[ users ]
  ├── id (TEXT, PK)
  ├── firebase_uid (TEXT)
  ├── name (TEXT)
  ├── email (TEXT, UNIQUE)
  ├── password_hash (TEXT)
  ├── role (TEXT: 'student' | 'admin')
  ├── college, course, branch, year (TEXT)
  ├── subjects (JSON TEXT)
  ├── status (TEXT: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED')
  └── created_at, updated_at, last_login_at (TEXT)

[ token_wallets ]
  ├── user_id (TEXT, PK, FK -> users.id)
  ├── balance (INTEGER, CHECK >= 0)
  └── updated_at (TEXT)

[ token_transactions ]
  ├── id (TEXT, PK)
  ├── user_id (TEXT, FK -> users.id)
  ├── type (TEXT: 'TOKEN_EARNED' | 'TOKEN_SPENT' | 'TOKEN_REFUND' | 'ADMIN_ADJUSTMENT')
  ├── amount (INTEGER)
  ├── reason (TEXT)
  ├── balance_after (INTEGER)
  └── created_at (TEXT)

[ study_materials ]
  ├── id (TEXT, PK)
  ├── title, description, subject, course_code, semester (TEXT)
  ├── type (TEXT: 'notes' | 'video' | 'cheatsheet' | 'pyq_solutions')
  ├── file_url, thumbnail (TEXT)
  ├── uploaded_by (TEXT, FK -> users.id)
  ├── author_name, author_college (TEXT)
  ├── published (INTEGER: 0 | 1)
  ├── downloads, views, likes, page_count (INTEGER)
  └── created_at, updated_at (TEXT)

[ live_sessions ]
  ├── id (TEXT, PK)
  ├── title, subject, description (TEXT)
  ├── scheduled_start, scheduled_end (TEXT)
  ├── platform, meeting_url (TEXT)
  ├── created_by (TEXT, FK -> users.id)
  ├── status (TEXT: 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED')
  └── created_at, updated_at (TEXT)

[ session_participations ]
  ├── id (TEXT, PK)
  ├── session_id (TEXT, FK -> live_sessions.id)
  ├── student_id (TEXT, FK -> users.id)
  └── joined_at, left_at (TEXT)

[ study_rooms ]
  ├── id (TEXT, PK)
  ├── name, subject, description, room_url (TEXT)
  ├── capacity (INTEGER)
  ├── status (TEXT: 'ACTIVE' | 'ARCHIVED')
  └── created_by, created_at, updated_at (TEXT)

[ study_room_participations ]
  ├── id (TEXT, PK)
  ├── room_id (TEXT, FK -> study_rooms.id)
  ├── student_id (TEXT, FK -> users.id)
  └── joined_at (TEXT)

[ doubts ]
  ├── id (TEXT, PK)
  ├── student_id (TEXT, FK -> users.id)
  ├── student_name, title, question, subject, tags (TEXT)
  ├── status (TEXT: 'OPEN' | 'ANSWERED' | 'CLOSED')
  └── created_at, updated_at (TEXT)

[ answers ]
  ├── id (TEXT, PK)
  ├── doubt_id (TEXT, FK -> doubts.id)
  ├── responder_id (TEXT, FK -> users.id)
  ├── responder_name, responder_role, answer (TEXT)
  ├── is_accepted (INTEGER: 0 | 1)
  └── created_at, updated_at (TEXT)

[ community_posts ]
  ├── id (TEXT, PK)
  ├── author_id (TEXT, FK -> users.id)
  ├── author_name, author_role, title, content, subject, category (TEXT)
  ├── likes (INTEGER)
  ├── status (TEXT: 'ACTIVE' | 'MODERATED' | 'REMOVED')
  └── created_at, updated_at (TEXT)

[ community_replies ]
  ├── id (TEXT, PK)
  ├── post_id (TEXT, FK -> community_posts.id)
  ├── author_id (TEXT, FK -> users.id)
  ├── author_name, author_role, content (TEXT)
  └── created_at, updated_at (TEXT)

[ notifications ]
  ├── id (TEXT, PK)
  ├── user_id (TEXT, FK -> users.id)
  ├── type, title, message (TEXT)
  ├── is_read (INTEGER: 0 | 1)
  └── created_at (TEXT)

[ activity_logs ]
  ├── id (TEXT, PK)
  ├── user_id, user_name, user_email, action, entity_type, entity_id, metadata (TEXT)
  └── created_at (TEXT)

[ user_interactions ]
  ├── id (TEXT, PK)
  ├── user_id (TEXT, FK -> users.id)
  ├── interaction_type (TEXT: 'SAVED' | 'LIKED')
  ├── entity_type (TEXT: 'material' | 'post' | 'doubt')
  ├── entity_id (TEXT)
  └── created_at (TEXT) [UNIQUE: user_id, interaction_type, entity_type, entity_id]
```

---

## 19. SECURITY ARCHITECTURE & EDGE CASE DEFENSE

1. **Authentication Security**:
   - Passwords hashed using salted HMAC-SHA256 (`crypto.createHmac('sha256', 'yuvasetu_salt_2026')`).
   - Client responses strictly sanitize and remove `password_hash` fields.
2. **Sole-Admin Protection Protocol**:
   - The system checks active administrator counts before any status update or deactivation request. If an admin is the last active platform administrator, deactivation is blocked at both client and API levels.
3. **Double-Spend & Negative Balance Defense**:
   - Database schema enforces `CHECK (balance >= 0)`. Transactions execute atomically.
4. **Brute-Force & Denial of Service Protection**:
   - In-memory rate limiting applied per IP address: 60 requests/minute for authentication routes, 40 requests/minute for Gemini AI calls.
5. **AI Prompt Injection Isolation**:
   - Untrusted user input is structurally isolated from system instructions. Exam-cheating queries are intercepted and redirected to conceptual tutorials.
6. **OWASP Compliant Security Headers**:
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: SAMEORIGIN`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `X-XSS-Protection: 1; mode=block`

---

## 20. DATA FLOW DIAGRAMS (DFDS)

### Level 0 DFD (Context Diagram)

```
              ┌────────────────────────────────────────────────────────┐
              │                     YUVASETU SYSTEM                    │
              │                                                        │
              │  • Notes & PYQs                  • Platform Control    │
              │  • Doubts & Q&A                  • Publishing Desk     │
              │  • Live Sessions & Study Rooms   • User Governance     │
              │  • Gemini 3.7 AI Tutor           • Token Audits        │
              └───────▲────────────────────────────────────────▲───────┘
                      │                                        │
           Learns & Participates                       Curates & Moderates
                      │                                        │
              ┌───────┴────────┐                      ┌────────┴───────┐
              │    STUDENT     │                      │ ADMINISTRATOR  │
              └────────────────┘                      └────────────────┘
```

### Level 1 DFD: Content Discovery & Study Note Flow

```
[ STUDENT ] ──( 1. Search Query / Branch Filter )──> [ API ROUTER ]
                                                            │
                                                            ▼ (2. Execute SQL Query)
                                                   [ `study_materials` ]
                                                            │
[ STUDENT ] <──( 4. Stream Note / Viewer Cache )──── [ API ROUTER ]
                                                            │
                                                            ▼ (3. Log Download / View)
                                                   [ `activity_logs` ]
```

---

## 21. BUSINESS MODEL CANVAS

```
+----------------------------------------------------------------------------------------------------+
|                                    BUSINESS MODEL CANVAS                                           |
+--------------------------+-------------------------+-------------------------+---------------------+
| KEY PARTNERS             | KEY ACTIVITIES          | VALUE PROPOSITIONS      | CUSTOMER RELATIONS  |
| • University Student     | • Curriculum curation & | • Distraction-free,     | • Student community |
|   Associations & Clubs.  |   verification.         |   verified academic hub.|   camaraderie.      |
| • Engineering Faculty &  | • Gemini AI integration | • 100% free core notes, | • Fast doubt relief.|
|   Mentor Communities.    |   & integrity guard.    |   study rooms, & PYQs.  | • Transparent token |
| • Cloud Host Providers   | • Moderation of doubt   | • Concept-first AI tutor|   rewards.          |
|   (Google Cloud Platform)|   forum & study rooms.  |   ("Samajh Se Safalta").|                     |
| • Institution Exam Boards|                         |                         | CUSTOMER SEGMENTS   |
|   (Syllabus mapping).    | KEY RESOURCES           | CHANNELS                | • B.Tech/Engineering|
|                          | • Verified lecture notes| • Web responsive app.   |   undergraduates.   |
|                          |   and cheatsheet IP.    | • Peer word-of-mouth &  | • Competitive exam  |
|                          | • Full-stack codebase & |   university campus     |   aspirants (GATE). |
|                          |   relational schemas.   |   recommendations.      | • Academic leads &  |
|                          | • Proprietary algorithms| • Faculty partnerships. |   peer educators.   |
+--------------------------+-------------------------+-------------------------+---------------------+
| COST STRUCTURE                                     | REVENUE STREAMS                               |
| • CURRENT: Zero cloud overhead during development  | • CURRENT: 100% Free educational platform     |
|   with local SQLite architecture.                  |   demonstration model.                        |
| • FUTURE: Cloud server instances (Cloud Run / GKE).| • FUTURE / PROPOSED: Optional premium booster  |
| • FUTURE: Google Gemini 3.7 API token consumption. |   packs for 1-on-1 mentor sessions.          |
| • FUTURE: Content delivery network (CDN) bandwidth.| • FUTURE / PROPOSED: University institutional |
|                                                    |   enterprise licensing & sponsorships.        |
+----------------------------------------------------+-----------------------------------------------+
```

---

## 22. COMPETITIVE DIFFERENTIATION & STRATEGIC MOATS

```
+----------------------------+---------------+---------------+---------------+
| Feature Matrix             | YuvaSetu      | Generic Video | Cloud Storage |
|                            | Platform      | Platforms     | Link Drives   |
+----------------------------+---------------+---------------+---------------+
| Verified Academic Notes    | YES (Curated) | NO            | NO (Uncurated)|
| Step-by-Step Doubt Engine  | YES           | NO (Comments) | NO            |
| AI Tutor with Cheat Guard  | YES           | NO            | NO            |
| 24/7 Virtual Study Rooms   | YES           | NO            | NO            |
| Live Peer Workshops        | YES           | Partial (Live)| NO            |
| Zero-Distraction Dark UI   | YES           | NO (Ads/Recs) | NO            |
| Gamified Token Economy     | YES (Vidya)   | NO            | NO            |
| Branch & Semester Filters  | YES           | Fragmented    | Poor / Folders|
| Sole Admin Safety Guard    | YES           | N/A           | N/A           |
+----------------------------+---------------+---------------+---------------+
```

---

## 23. INTELLECTUAL PROPERTY (IP) DOCUMENTATION

*Notice: This section documents original development, conceptual expression, and technical architecture. It does not constitute formal legal counsel.*

### A. Brand Identifiers
- **YuvaSetu™**: Original brand name denoting the academic bridge for youth.
- **"Samajh Se Safalta Tak"™**: Original brand motto and pedagogical philosophy.
- **VidyaTokens™**: Distinctive name for the internal student utility incentive ledger.
- **Visual Brand Assets**: Custom SVG geometry featuring interconnected academic bridges and student synergy nodes in deep navy, saffron orange, and cyan blue.

### B. Software Codebase & Technical Implementation
- Original source code of the React 19 frontend, Express full-stack API router, SQLite relational schemas, and Gemini AI proxy.
- Proprietary algorithmic implementations:
  1. Multi-credential administrator authentication resolver.
  2. Idempotent double-entry VidyaTokens accounting ledger.
  3. AI prompt injection isolation and academic cheating defense.
  4. Sole-admin deactivation safety verification.

### C. Written Documentation & Compilations
- Original architectural specifications, schema definitions, and workflow narratives contained within this master document.

### D. Original Diagrammatic Works
- Original system visualizations (Visualizations 01 through 14) cataloged in Section 25.

### E. Legal & Intellectual Property Boundaries
- Under applicable intellectual property jurisprudence, original creative expression (code, text, diagrams) is subject to copyright protection upon fixation in tangible media.
- Trademarks protect distinctive commercial brand identifiers in educational commerce.
- Abstract educational concepts remain in the public domain, whereas YuvaSetu's specific architecture, technical workflows, and software implementations represent proprietary original works.

---

## 24. DEVELOPMENT OWNERSHIP & PROVENANCE RECORD

```
====================================================================================================
PROJECT IDENTITY
====================================================================================================
Project Name:                 YuvaSetu
Official Tagline:             "Samajh Se Safalta Tak"
Platform Version:             1.0.0-prod
Repository Status:            Active Production Codebase (React 19 + TypeScript + Express + SQLite)
Application Port:             3000

====================================================================================================
LEGAL OWNERSHIP & AUTHORSHIP DETAILS
====================================================================================================
Lead Creator / Developer:     Om Tajane [omtajane2806@gmail.com]
Academic Co-Lead:             Ranjan Zambare [ranjanzambare9119@gmail.com]
Project Initiation Date:      August 2025
Core Milestones:              • Phase 1: Conceptualization & System Architecture (Aug 2025)
                              • Phase 2: Relational Schema & Full-Stack Node Engine (Nov 2025)
                              • Phase 3: Gemini 3.7 AI & VidyaTokens Ledger Integration (Jan 2026)
                              • Phase 4: Premium Dark Academic UI/UX Transformation (Sep 2026)
                              • Phase 5: Authentication Security Hardening & Master IP System (Oct 2026)

====================================================================================================
TECHNOLOGY STACK SUMMARY
====================================================================================================
Frontend:                     React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons
Backend:                      Node.js, Express 4.x
Database Engine:              SQLite (via sql.js engine with persistent disk synchronization)
AI Engine:                    Google Gemini 3.7 Flash (@google/genai SDK)
Authentication:               Salted HMAC-SHA256 + Firebase Google OAuth Client
====================================================================================================
```

---

## 25. COMPLETE SYSTEM DIAGRAM PORTFOLIO
*(14 Distinct, High-Fidelity Original Technical Visualizations)*

### Diagram 01: YuvaSetu Connected Ecosystem
```
                           [ YUVASETU CORE PLATFORM ]
                                       │
        ┌──────────────┬───────────────┼───────────────┬──────────────┐
        ▼              ▼               ▼               ▼              ▼
  [ STUDY NOTES ] [ LIVE ROOMS ] [ AI ASSISTANT ] [ DOUBT FORUM ] [ COMMUNITY ]
        │              │               │               │              │
        └──────────────┴───────┬───────┴───────────────┴──────────────┘
                               ▼
                   [ VIDYATOKENS ECONOMY ]
                               ▼
                    [ ACADEMIC GROWTH ]
```

### Diagram 02: Student User Journey Flowchart
```
[ Landing ] ──> [ Auth / Google ] ──> [ Profile Setup ] ──> [ Dashboard ]
                                                                 │
    ┌──────────────────────┬──────────────────────┬──────────────┴──────────────┐
    ▼                      ▼                      ▼                             ▼
[ Read Notes ]     [ Join Study Room ]    [ Ask Doubt ]                 [ Consult AI ]
    │                      │                      │                             │
    └──────────────────────┴──────────┬───────────┴─────────────────────────────┘
                                      ▼
                           [ Earn/Spend Tokens ] ──> [ Track Activity ]
```

### Diagram 03: Administrator Governance Journey
```
[ Admin Login ] ──> [ Admin Dashboard ]
                          │
    ┌─────────────────────┼─────────────────────┬─────────────────────┐
    ▼                     ▼                     ▼                     ▼
[ Publish Notes ]   [ Host Sessions ]   [ Resolve Doubts ]   [ Audit Tokens ]
    │                     │                     │                     │
    └─────────────────────┼─────────────────────┴─────────────────────┘
                          ▼
            [ Manage Student Accounts ] (Guarded by Sole-Admin Protocol)
```

### Diagram 04: Layered Platform Architecture
```
+-------------------------------------------------------------------------+
| PRESENTATION TIER: React 19, Tailwind CSS, Lucide Icons, Vite SPA       |
+-------------------------------------------------------------------------+
                                    │ (HTTPS / JSON)
+-------------------------------------------------------------------------+
| ROUTING & SECURITY TIER: Express 4.x, Rate Limiter, Security Headers    |
+-------------------------------------------------------------------------+
                                    │
+-------------------------------------------------------------------------+
| SERVICE LOGIC: Auth, Content, Doubt, Session, AI Proxy, Token Ledger    |
+-------------------------------------------------------------------------+
              │                             │                       │
              ▼                             ▼                       ▼
+---------------------------+ +---------------------------+ +-------------+
| DATA: SQLite / sql.js     | | AI: Google Gemini 3.7     | | EXTERNAL:   |
| Persistent Storage        | | Prompt Injection Guard    | | Meet Links  |
+---------------------------+ +---------------------------+ +-------------+
```

### Diagram 05: Relational Data Model (ER)
```
[ users ] 1 ──── 1 [ token_wallets ] 1 ──── N [ token_transactions ]
   │
   ├── 1 ──── N [ study_materials ]
   ├── 1 ──── N [ doubts ] 1 ──── N [ answers ]
   ├── 1 ──── N [ community_posts ] 1 ──── N [ community_replies ]
   ├── 1 ──── N [ live_sessions ] 1 ──── N [ session_participations ]
   ├── 1 ──── N [ study_rooms ] 1 ──── N [ study_room_participations ]
   └── 1 ──── N [ notifications ]
```

### Diagram 06: Content Verification Workflow
```
[ Admin Creates Draft ] ──> [ Curriculum Review ] ──> [ Commit to SQLite ]
                                                               │
                                                               ▼
[ Student Search & Preview ] <── [ File Viewer ] <── [ Published Material ]
```

### Diagram 07: AI Verification Workflow (Proposed)
```
[ Upload ] ──> [ Security Scan ] ──> [ OCR Extraction ] ──> [ AI Quality Score ]
                                                                   │
                                                                   ▼
[ Rejected ] <──────── [ Admin Approval Review ] ────────> [ Published ]
```

### Diagram 08: Academic Doubt Resolution Lifecycle
```
[ Student Submits Doubt ] ──> ( Status: 'OPEN' )
                                     │
                                     ▼
[ Mentor / Admin Submits Answer ] ──> ( Status: 'ANSWERED' )
                                     │
                                     ▼
[ Peer Verification / Accepted ] ──> ( Status: 'CLOSED' ) ──> [ +10 VT Awarded ]
```

### Diagram 09: Live Session Scheduling & Launch
```
[ Admin Schedules Session ] ──> [ Stored in SQLite ] ──> [ Student Alert ]
                                                               │
                                                               ▼
[ External Meet Launched ] <── [ Student Clicks Join ] <── [ Live Pulse Active ]
```

### Diagram 10: Virtual Study Room Engagement
```
[ Student Selects Room ] ──> [ Check Capacity Limit ] ──> [ Join Participation Log ]
                                                                   │
                                                                   ▼
                                                       [ Collaborative Focus ]
```

### Diagram 11: Notification Dispatch Subsystem
```
[ System Event (Doubt / Live / Token) ] ──> [ Insert into `notifications` ]
                                                         │
                                                         ▼
[ Nav Unread Badge Updates ] <── [ Student Toggles Read ] <── [ Real-Time Alert ]
```

### Diagram 12: VidyaTokens Double-Entry Ledger
```
[ Event: Answer Accepted (+10 VT) ]
               │
               ▼
[ Start Transaction ]
  ├── UPDATE token_wallets SET balance = balance + 10 WHERE user_id = ?
  └── INSERT INTO token_transactions (type: 'TOKEN_EARNED', amount: 10, balance_after: ...)
               │
               ▼
[ Commit & Flush SQLite to Disk ]
```

### Diagram 13: Business Value Stream
```
[ Academic Needs ] ──> [ Free Curated Learning ] ──> [ Active Peer Collaboration ]
                                                               │
                                                               ▼
[ Institutional Trust ] <── [ Community Value ] <── [ VidyaTokens Rewards ]
```

### Diagram 14: Future Revenue Allocation Model (Proposed)
```
[ Premium Sponsorship Pool ]
               │
       ┌───────┴───────┬───────────────┐
       ▼               ▼               ▼
 [ 60% Mentors ] [ 25% Infra ] [ 15% Scholarships ]
```

---

## 26. TECHNICAL IMPLEMENTATION VERIFICATION & AUDIT

- **Database Verification**: All 15 relational tables initialized with `PRAGMA foreign_keys = ON;`.
- **Authentication**: Salted HMAC-SHA256 verified in unit execution. Multi-credential resolution functional for lead administrator (`omtajane2806@gmail.com`).
- **AI Proxy Integration**: Server-side Google Gemini 3.7 Flash proxy operational with academic integrity filters.
- **VidyaTokens Economy**: Double-entry ledger verified with negative balance constraint checks.
- **Frontend Quality**: Built strictly on React 19 + TypeScript + Tailwind CSS without third-party template bloat. Zero profile photos policy enforced via `UserInitialsBadge`.

---
*End of Master Documentation.*  
*YuvaSetu — Samajh Se Safalta Tak.*
