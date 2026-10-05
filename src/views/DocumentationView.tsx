import React, { useState } from 'react';
import { YuvaSetuLogo } from '../components/YuvaSetuLogo';
import {
  FileText,
  Shield,
  Layers,
  Coins,
  Cpu,
  Users,
  Compass,
  Database,
  Lock,
  Workflow,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  BookOpen,
  ChevronRight,
  AlertTriangle,
  Copy,
  Check,
} from 'lucide-react';

export interface DocumentationViewProps {
  onNavigate: (view: string) => void;
}

type DocSection =
  | 'overview'
  | 'features'
  | 'workflows'
  | 'architecture'
  | 'database'
  | 'vidyatokens'
  | 'business'
  | 'ip_ownership'
  | 'diagrams';

export const DocumentationView: React.FC<DocumentationViewProps> = ({ onNavigate }) => {
  const [activeSection, setActiveSection] = useState<DocSection>('overview');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const navItems: { id: DocSection; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: '1. Executive & Problem-Solution', icon: <Compass className="w-4 h-4" /> },
    { id: 'features', label: '2. 16-Module Feature Architecture', icon: <Layers className="w-4 h-4" />, badge: 'Status Map' },
    { id: 'workflows', label: '3. Workflows & Lifecycles', icon: <Workflow className="w-4 h-4" /> },
    { id: 'architecture', label: '4. System & Security Architecture', icon: <Cpu className="w-4 h-4" /> },
    { id: 'database', label: '5. Relational Schema & ER Model', icon: <Database className="w-4 h-4" />, badge: '15 Tables' },
    { id: 'vidyatokens', label: '6. VidyaTokens Economy & Ledger', icon: <Coins className="w-4 h-4" /> },
    { id: 'business', label: '7. Business Model Canvas', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'ip_ownership', label: '8. Intellectual Property & Ownership', icon: <Shield className="w-4 h-4" />, badge: 'IP Record' },
    { id: 'diagrams', label: '9. 14 System Architecture Diagrams', icon: <FileText className="w-4 h-4" />, badge: 'Original' },
  ];

  return (
    <div id="yuvasetu-documentation-view" className="min-h-screen bg-[#060810] text-slate-300 pb-24">
      {/* HEADER BANNER */}
      <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-[#0b0f20] via-[#080c18] to-[#060810] pt-10 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient Top Saffron & Cyan Glow */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-48 bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 translate-x-1/2 w-96 h-48 bg-gradient-to-l from-cyan-500/15 via-blue-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                Official Product, Business & IP Documentation
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-950/60 border border-amber-700/50 text-amber-300">
                v1.0.0-prod
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-['Outfit'] text-white tracking-tight">
              YuvaSetu Architecture & IP Documentation System
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Official technical specification, conceptual workflows, relational data models, utility economics, and intellectual property records for the YuvaSetu platform.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('landing')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-2"
            >
              ← Back to App
            </button>
            <button
              onClick={() => onNavigate('explore')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-xs font-bold text-white shadow-lg shadow-orange-500/20 transition-all cursor-pointer flex items-center gap-2"
            >
              Explore Learning Materials →
            </button>
          </div>
        </div>
      </div>

      {/* MAIN DOCUMENTATION LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDEBAR NAVIGATION */}
          <div className="lg:col-span-4 xl:col-span-3 sticky top-6 z-20 space-y-4">
            <div className="p-3 rounded-2xl bg-[#0c1020]/90 border border-slate-800 shadow-xl backdrop-blur-xl space-y-1">
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Documentation Modules
              </div>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-cyan-950 to-blue-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={activeSection === item.id ? 'text-cyan-400' : 'text-slate-500'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 shrink-0 ml-1">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Quick Document Summary Card */}
            <div className="p-4 rounded-2xl bg-[#0a0e1c] border border-slate-800/80 text-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <YuvaSetuLogo size="sm" showTagline={false} variant="compact" />
                <span>Samajh Se Safalta Tak</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Persistent local SQLite database with 15 relational tables, Google Gemini 3.7 Flash AI proxy, double-entry VidyaTokens ledger, and dark academic design system.
              </p>
            </div>
          </div>

          {/* RIGHT CONTENT PANEL */}
          <div className="lg:col-span-8 xl:col-span-9 bg-[#0b0e1c] border border-slate-800/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl relative min-h-[80vh]">
            {/* 1. OVERVIEW & PROBLEM-SOLUTION */}
            {activeSection === 'overview' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="border-b border-slate-800 pb-5">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Module 1</span>
                  <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white mt-1">
                    Executive Summary & Problem-Solution Matrix
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Comprehensive overview of why YuvaSetu was built and how it bridges tertiary educational fragmentation.
                  </p>
                </div>

                <div className="space-y-4 text-sm leading-relaxed text-slate-300">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    What is YuvaSetu?
                  </h3>
                  <p>
                    <strong className="text-white">YuvaSetu</strong> is an integrated, distraction-free academic ecosystem engineered specifically for university and engineering students. Translating from Hindi as the <em>"Bridge for Youth"</em> with the core motto <strong>"Samajh Se Safalta Tak"</strong> (<em>From Deep Conceptual Understanding to Tangible Academic and Career Success</em>), the platform unifies curriculum study materials, doubt clearing, live peer workshops, virtual study rooms, an academic-integrity AI tutor, and an incentive utility economy.
                  </p>
                  <p>
                    Rather than forcing students to context-switch across disconnected chat groups, unorganized file drives, and entertainment-driven video platforms, YuvaSetu offers an authenticated, relational sanctuary built exclusively for conceptual mastery.
                  </p>
                </div>

                {/* PROBLEM STATEMENT */}
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    Problem Statement (The 6 Academic Crises)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {[
                      { title: '1. Scattered & Ephemeral Resources', desc: 'Lecture notes and university PYQs are lost across fragmented chat threads and broken drive links.' },
                      { title: '2. High Hesitation in Asking Doubts', desc: 'Large lecture halls create social fear; students leave class with foundational misconceptions.' },
                      { title: '3. Algorithmic Distractions', desc: 'Generic video and social platforms surround learners with addictive entertainment algorithms.' },
                      { title: '4. Isolated Self-Study', desc: 'Students lack structured peer accountability and quiet, focused co-working environments.' },
                      { title: '5. Assignment Cheating via Generic AI', desc: 'Commercial AI encourages direct answer copying, destroying deep cognitive synthesis.' },
                      { title: '6. Unrewarded Peer Mentorship', desc: 'High-performing students spend hours tutoring juniors with zero formal recognition or platform rewards.' },
                    ].map((p, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 text-xs space-y-1">
                        <span className="font-bold text-rose-200">{p.title}</span>
                        <p className="text-slate-400 text-[11px] leading-relaxed">{p.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* THE YUVASETU SOLUTION TABLE */}
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    The Solution Matrix (Problem ➔ YuvaSetu Solution ➔ Student Benefit)
                  </h3>
                  <div className="overflow-x-auto rounded-2xl border border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0e1428] text-slate-300 uppercase tracking-wider font-bold">
                        <tr>
                          <th className="p-3 border-b border-slate-800">Identified Problem</th>
                          <th className="p-3 border-b border-slate-800">YuvaSetu Engineered Solution</th>
                          <th className="p-3 border-b border-slate-800">Student Benefit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 bg-[#090d1c]">
                        <tr>
                          <td className="p-3 text-rose-300 font-medium">Scattered study notes</td>
                          <td className="p-3 text-slate-300">Centralized, branch-specific verified masterclass notes & cheatsheets</td>
                          <td className="p-3 text-emerald-300">Instant exam prep, zero wasted search hours</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-rose-300 font-medium">Classroom doubt fear</td>
                          <td className="p-3 text-slate-300">Dual-tier doubt resolution: 24/7 AI Tutor + verified peer/admin Q&A</td>
                          <td className="p-3 text-emerald-300">Judgment-free learning; deep conceptual clarity</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-rose-300 font-medium">Commercial distractions</td>
                          <td className="p-3 text-slate-300">Dark academic design system; zero ads, zero vanity photos</td>
                          <td className="p-3 text-emerald-300">Uninterrupted focus and maximum cognitive retention</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-rose-300 font-medium">Isolated study</td>
                          <td className="p-3 text-slate-300">Scheduled live workshops + persistent 24/7 virtual study rooms</td>
                          <td className="p-3 text-emerald-300">Peer camaraderie, accountability, and regular study habits</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-rose-300 font-medium">AI assignment cheating</td>
                          <td className="p-3 text-slate-300">Academic Integrity Guard: step-by-step logic, proofs, analogies</td>
                          <td className="p-3 text-emerald-300">True engineering skills; zero risk of academic misconduct</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-rose-300 font-medium">Unrewarded mentorship</td>
                          <td className="p-3 text-slate-300">Double-entry VidyaTokens economy awarding points for helpful answers</td>
                          <td className="p-3 text-emerald-300">Formal recognition and unlocked masterclass benefits</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* TARGET USERS */}
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    Target User Profiles & Strict Roles
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 space-y-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-900/60 text-cyan-300 border border-cyan-700/60">
                        Primary Role
                      </span>
                      <h4 className="text-sm font-bold text-white">STUDENT</h4>
                      <p className="text-xs text-slate-400">
                        Undergraduate engineering and science students across Semesters 1 to 8. Accesses all verified notes, doubts forum, live workshops, study rooms, AI assistant, and VidyaTokens wallet for 100% free.
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 space-y-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-900/60 text-amber-300 border border-amber-700/60">
                        Governance Role
                      </span>
                      <h4 className="text-sm font-bold text-white">ADMINISTRATOR</h4>
                      <p className="text-xs text-slate-400">
                        Platform academic leads and governance curators. Has full rights to curate and publish curriculum, schedule live sessions, verify student doubts, moderate community discussions, and audit system health. Guarded by Sole-Admin protection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. FEATURE ARCHITECTURE */}
            {activeSection === 'features' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-800 pb-5">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Module 2</span>
                  <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white mt-1">
                    16-Module Feature Architecture & Status Map
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Authoritative technical status of every platform capability (Implemented vs Proposed).
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: '01', name: 'Landing & Brand Opening Experience', status: 'IMPLEMENTED', users: 'Public & Students', desc: 'Cinematic brand reveal animation with session skip logic, dynamic showcase, and ecosystem connectivity visualization.' },
                    { id: '02', name: 'Authentication & Access Control (RBAC)', status: 'IMPLEMENTED', users: 'Students & Admins', desc: 'Salted HMAC-SHA256 hashing, Firebase Google OAuth, multi-credential safety, Sole-Admin protection guard, and password reset engine.' },
                    { id: '03', name: 'Student Profile & Academic Mapping', status: 'IMPLEMENTED', users: 'Students', desc: 'College, branch, degree, and subject preferences with deterministic UserInitialsBadge avatars (zero profile photo discipline).' },
                    { id: '04', name: 'Study Materials & Notes Repository', status: 'IMPLEMENTED', users: 'Students & Admins', desc: 'Curated repository for handwritten notes, formula cheatsheets, and PYQs with branch/semester filters and in-browser preview.' },
                    { id: '05', name: 'Academic Video Learning', status: 'IMPLEMENTED', users: 'Students & Admins', desc: 'Modular video guide navigation with embedded player, linked note timestamps, and algorithmic walkthroughs.' },
                    { id: '06', name: 'Live Peer Sessions', status: 'IMPLEMENTED', users: 'Students & Admins', desc: 'Scheduled academic marathons with real-time "Live Now" pulse indicators, instructor badges, and secure Meet link routing.' },
                    { id: '07', name: 'Virtual Study Rooms', status: 'IMPLEMENTED', users: 'Students', desc: '24/7 collaborative quiet study spaces with capacity management, active occupancy indicators, and persistent co-working links.' },
                    { id: '08', name: 'Doubt-Solving & Resolution Lifecycle', status: 'IMPLEMENTED', users: 'Students & Admins', desc: 'Three-phase state machine (OPEN -> ANSWERED -> CLOSED) with code snippet input, peer upvotes, and admin verification.' },
                    { id: '09', name: 'Collaborative Community Discussions', status: 'IMPLEMENTED', users: 'Students & Admins', desc: 'Threaded subject discussions, project collaboration channels, peer likes, and administrator moderation suite.' },
                    { id: '10', name: 'Notification Subsystem', status: 'IMPLEMENTED', users: 'Students & Admins', desc: 'Categorized notifications (welcome, doubt reply, session alert, token reward) with unread badge counter and deep linking.' },
                    { id: '11', name: 'AI Academic Companion (Gemini 3.7 Flash)', status: 'IMPLEMENTED', users: 'Students', desc: 'Server-proxied pedagogical tutor with Academic Integrity Guard (anti-cheating filter), formula explainer, and quiz generator.' },
                    { id: '12', name: 'Student Activity Audit & History', status: 'IMPLEMENTED', users: 'Students & Admins', desc: 'Immutable chronological activity logs tracking logins, downloads, questions asked, and answers verified.' },
                    { id: '13', name: 'Admin Command Center & Governance', status: 'IMPLEMENTED', users: 'Admins only', desc: 'Platform metrics, student directory management, curriculum publishing desk, and live System Health monitor.' },
                    { id: '14', name: 'Platform Analytics & Intelligence', status: 'IMPLEMENTED', users: 'Admins only', desc: 'Subject demand analytics, live session attendance curves, and VidyaTokens economic velocity monitoring.' },
                    { id: '15', name: 'VidyaTokens Atomic Wallet & Ledger', status: 'IMPLEMENTED', users: 'Students & Admins', desc: '100 free VT welcome gift, double-entry ledger transactions, negative balance prevention, and safe balance adjustments.' },
                    { id: '16', name: 'System Security & Rate Limiting', status: 'IMPLEMENTED', users: 'Infrastructure', desc: 'In-memory sliding-window rate limiters, 10MB payload size limits, parameterized SQL queries, and OWASP response headers.' },
                  ].map((m) => (
                    <div key={m.id} className="p-4 rounded-2xl bg-[#0c1022] border border-slate-800 hover:border-slate-700 transition-colors space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-500">#{m.id}</span>
                          <h4 className="text-sm font-bold text-white">{m.name}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-medium">Audience: {m.users}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-950/80 border border-emerald-700/60 text-emerald-400">
                            {m.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. WORKFLOWS & LIFECYCLES */}
            {activeSection === 'workflows' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="border-b border-slate-800 pb-5">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Module 3</span>
                  <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white mt-1">
                    System Workflows & Architectural State Machines
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Formal procedural progressions governing student journeys, editorial lifecycles, and future workflows.
                  </p>
                </div>

                {/* 1. STUDENT JOURNEY */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                    <Workflow className="w-4 h-4" /> 1. Implemented Student User Journey
                  </h3>
                  <div className="p-4 rounded-2xl bg-[#090d1c] border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
                    Landing Page ➔ Option 1 / 3 Auth ➔ 100 Free VT Credited ➔ Profile Setup ➔ Personalized Dashboard ➔ Explore Notes (Filter Branch/Sem) ➔ Read / Download PDF ➔ Join Live Session / Study Room ➔ Submit Technical Doubt ➔ Consult AI Assistant ➔ Answer Peer Doubt ➔ +10 VT Earned ➔ Activity Audit
                  </div>
                </div>

                {/* 2. ADMIN JOURNEY */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <Workflow className="w-4 h-4" /> 2. Implemented Administrator Journey
                  </h3>
                  <div className="p-4 rounded-2xl bg-[#090d1c] border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
                    Option 2 Admin Portal ➔ Multi-Credential Validation (`Omtajane2831`/`admin123`) ➔ Admin Dashboard ➔ Curate & Publish Note ➔ Schedule Live Workshop (Meet Link) ➔ Answer & Verify Doubts ➔ Moderate Community Discussions ➔ Audit Student Accounts ➔ Inspect System Health
                  </div>
                </div>

                {/* 3. DOUBT LIFECYCLE */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                    <Workflow className="w-4 h-4" /> 3. Implemented Doubt-Solving State Machine
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs space-y-1">
                      <span className="font-bold text-cyan-300">Phase 1: OPEN</span>
                      <p className="text-slate-400 text-[11px]">Question submitted by student with subject tag; awaiting peer or mentor response.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs space-y-1">
                      <span className="font-bold text-amber-300">Phase 2: ANSWERED</span>
                      <p className="text-slate-400 text-[11px]">Peer or mentor provides answer with code/formula; open for peer upvoting.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-xs space-y-1">
                      <span className="font-bold text-emerald-300">Phase 3: CLOSED</span>
                      <p className="text-slate-400 text-[11px]">Asker or admin marks answer verified; +10 VT awarded to responder wallet.</p>
                    </div>
                  </div>
                </div>

                {/* 4. PROPOSED FUTURE STUDENT UPLOAD WORKFLOW */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-950 text-purple-300 border border-purple-700/60">
                      FUTURE / PROPOSED
                    </span>
                    <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider">
                      4. Proposed Decentralized Student-Upload & AI Pre-Check Workflow
                    </h3>
                  </div>
                  <div className="p-4 rounded-2xl bg-purple-950/10 border border-purple-900/30 text-xs text-slate-300 space-y-3">
                    <p className="text-slate-400 leading-relaxed">
                      *Note: In the current release, only administrators publish official study content (Admin Exclusive Publishing). The following workflow is planned for decentralized community scaling:*
                    </p>
                    <div className="font-mono text-xs bg-black/40 p-3 rounded-xl border border-purple-900/40 text-purple-200">
                      Student Upload ➔ Magic Bytes Security Scan (%PDF-1.x) ➔ AI OCR & Math Extraction ➔ Plagiarism & Duplicate Similarity Check ➔ AI Confidence Legibility Score (0-100) ➔ Human Admin Review Queue ➔ Approved & Published (Student Earns +50 VT) OR Revision Requested OR Rejected
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. ARCHITECTURE & SECURITY */}
            {activeSection === 'architecture' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-800 pb-5">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Module 4</span>
                  <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white mt-1">
                    System Architecture & Security Engineering
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Full-stack Node/Express + SQLite engine with enterprise security controls.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#090d1c] border border-slate-800 space-y-2">
                    <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-cyan-400" /> Salted HMAC-SHA256 Auth
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Passwords hashed via application-isolated cryptographic salt (<code className="text-cyan-200">yuvasetu_salt_2026</code>). Hashes are completely stripped before returning user data to client applications.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#090d1c] border border-slate-800 space-y-2">
                    <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-400" /> Sole-Admin Protection Guard
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Programmatic guard verifying active administrator counts. The system physically prevents deactivating or suspending the last active administrator (<code className="text-amber-200">canDeactivateAdmin()</code>).
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#090d1c] border border-slate-800 space-y-2">
                    <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-emerald-400" /> Gemini AI Academic Integrity
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Server-side proxy strictly intercepting exam cheating or assignment completion requests. Redirects learners to step-by-step conceptual proofs and intuitive analogies.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#090d1c] border border-slate-800 space-y-2">
                    <h4 className="text-sm font-bold text-blue-300 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-400" /> Sliding Rate Limiting
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      In-memory sliding-window limiters active on port 3000: 60 requests/min on <code className="text-blue-200">/api/auth/*</code> and 40 requests/min on <code className="text-blue-200">/api/ai/ask</code> preventing brute-force attacks.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 text-xs space-y-2">
                  <span className="font-bold text-cyan-300">Security Response Headers Active:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                    <div>• X-Content-Type-Options: nosniff</div>
                    <div>• X-Frame-Options: SAMEORIGIN</div>
                    <div>• Referrer-Policy: strict-origin-when-cross-origin</div>
                    <div>• X-XSS-Protection: 1; mode=block</div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. DATABASE SCHEMA */}
            {activeSection === 'database' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-800 pb-5">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Module 5</span>
                  <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white mt-1">
                    Relational Schema & Database Architecture (SQLite)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Persistent relational database (<code className="text-cyan-300">./data/yuvasetu.sqlite</code>) with 15 normalized tables, foreign keys, and indexes.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {[
                    { table: 'users', count: '13 cols', desc: 'Accounts, role (student/admin), college, branch, year, status.' },
                    { table: 'study_materials', count: '17 cols', desc: 'Curated notes, PYQs, cheatsheets, downloads, page count.' },
                    { table: 'live_sessions', count: '12 cols', desc: 'Scheduled masterclasses, status (SCHEDULED, LIVE, COMPLETED).' },
                    { table: 'session_participations', count: '6 cols', desc: 'Audit records of students joining live academic workshops.' },
                    { table: 'study_rooms', count: '10 cols', desc: '24/7 collaborative focus spaces, capacity limits, meet URLs.' },
                    { table: 'study_room_participations', count: '5 cols', desc: 'Real-time room occupancy and student join audit trail.' },
                    { table: 'doubts', count: '9 cols', desc: 'Technical questions, subject tags, status (OPEN, ANSWERED, CLOSED).' },
                    { table: 'answers', count: '9 cols', desc: 'Peer/mentor technical answers, code snippets, verified badges.' },
                    { table: 'community_posts', count: '11 cols', desc: 'Scholarly discussions, project showcases, moderation status.' },
                    { table: 'community_replies', count: '8 cols', desc: 'Threaded responses and peer academic commentary.' },
                    { table: 'notifications', count: '8 cols', desc: 'System alerts, doubt updates, session alerts, unread states.' },
                    { table: 'activity_logs', count: '9 cols', desc: 'Immutable chronological audit trail of user actions.' },
                    { table: 'user_interactions', count: '6 cols', desc: 'Bookmarked (SAVED) notes and peer upvoted (LIKED) items.' },
                    { table: 'token_wallets', count: '3 cols', desc: 'VidyaTokens balances constrained with CHECK (balance >= 0).' },
                    { table: 'token_transactions', count: '8 cols', desc: 'Immutable double-entry transaction accounting ledger.' },
                  ].map((t) => (
                    <div key={t.table} className="p-3 rounded-xl bg-[#090d1c] border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-cyan-300">{t.table}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{t.count}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. VIDYATOKENS ECONOMY */}
            {activeSection === 'vidyatokens' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-800 pb-5">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Module 6</span>
                  <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white mt-1">
                    VidyaTokens Utility Economic Model & Ledger
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Incentive platform economy engineered to reward scholarship while keeping all core learning 100% free.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 text-xs space-y-2">
                  <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-400" /> Non-Speculative Pedagogical Utility Token
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    VidyaTokens (VT) are non-cryptocurrency, non-financial educational utility points designed to gamify positive academic habits. They cannot be traded on external exchanges or used for gambling.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-[#090d1c] border border-slate-800 space-y-2">
                    <span className="font-bold text-emerald-300 uppercase tracking-wider text-[11px]">Earning VidyaTokens</span>
                    <ul className="space-y-1.5 text-slate-300 text-[11px]">
                      <li>• <strong>+100 VT:</strong> Welcome Gift credited on initial account registration</li>
                      <li>• <strong>+2 VT:</strong> Submitting a well-formulated technical academic doubt</li>
                      <li>• <strong>+10 VT:</strong> Providing an accepted answer that resolves a peer doubt</li>
                      <li>• <strong>+15 VT:</strong> Maintaining a 5-day continuous study room streak</li>
                      <li>• <strong>+50 VT:</strong> Meritorious administrator academic contribution award</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#090d1c] border border-slate-800 space-y-2">
                    <span className="font-bold text-cyan-300 uppercase tracking-wider text-[11px]">Utilizing VidyaTokens</span>
                    <ul className="space-y-1.5 text-slate-300 text-[11px]">
                      <li>• Unlocking specialized faculty masterclass revision compendia</li>
                      <li>• Reserving 1-on-1 virtual mentor problem-solving office hours</li>
                      <li>• Generating personalized AI mock viva question packs</li>
                      <li>• Platform recognition badges & community hall of fame</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 7. BUSINESS MODEL CANVAS */}
            {activeSection === 'business' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-800 pb-5">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Module 7</span>
                  <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white mt-1">
                    Business Model Canvas & Commercial Strategy
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Nine-block business canvas distinguishing current demonstration stage from proposed future monetization.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#090d1c] border border-slate-800 space-y-1">
                    <span className="font-bold text-cyan-300 uppercase text-[11px]">Customer Segments</span>
                    <p className="text-slate-400 text-[11px]">Undergraduate B.Tech/Engineering students (Sem 1-8), competitive exam aspirants (GATE CS/ECE), and peer student mentors.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#090d1c] border border-slate-800 space-y-1">
                    <span className="font-bold text-amber-300 uppercase text-[11px]">Value Proposition</span>
                    <p className="text-slate-400 text-[11px]">Distraction-free dark academic environment; 100% free core notes, live study rooms, peer doubt answers, and anti-cheat AI tutor.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#090d1c] border border-slate-800 space-y-1">
                    <span className="font-bold text-emerald-300 uppercase text-[11px]">Channels</span>
                    <p className="text-slate-400 text-[11px]">Web responsive platform, university campus clubs, student WhatsApp groups, and academic word-of-mouth recommendations.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#090d1c] border border-slate-800 space-y-1">
                    <span className="font-bold text-purple-300 uppercase text-[11px]">Customer Relationships</span>
                    <p className="text-slate-400 text-[11px]">Collegiate student camaraderie, prompt doubt resolution, privacy-respecting photo-free profiles, and merit recognition.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#090d1c] border border-slate-800 space-y-1">
                    <span className="font-bold text-blue-300 uppercase text-[11px]">Revenue Streams</span>
                    <p className="text-slate-400 text-[11px]"><strong>CURRENT:</strong> 100% Free platform.<br /><strong>FUTURE / PROPOSED:</strong> Premium 1-on-1 mentor booking packs & university institutional licensing.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#090d1c] border border-slate-800 space-y-1">
                    <span className="font-bold text-rose-300 uppercase text-[11px]">Cost Structure</span>
                    <p className="text-slate-400 text-[11px]">Cloud computing instances (Google Cloud), Gemini AI token fees, domain/DNS hosting, and security audits.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 8. IP & OWNERSHIP */}
            {activeSection === 'ip_ownership' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-800 pb-5">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Module 8</span>
                  <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white mt-1">
                    Intellectual Property Documentation & Provenance Record
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Definitive record of original development, copyrightable assets, and legal authorship boundaries.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 text-xs space-y-2">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" /> Legal Notice & IP Guidance
                  </span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    This section documents original technical authorship, design systems, and software architectures. It serves as institutional documentation guidance and does not replace formal legal counsel. Under applicable copyright conventions, original software code, diagrams, and written documentation are protected upon tangible creation.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-cyan-400" /> Platform Authorship & Milestones
                  </h4>
                  <div className="p-4 rounded-2xl bg-[#090d1c] border border-slate-800 text-xs font-mono space-y-2 text-slate-300">
                    <div><strong>Project Name:</strong> YuvaSetu</div>
                    <div><strong>Official Motto:</strong> "Samajh Se Safalta Tak"</div>
                    <div><strong>Lead Developer / Architect:</strong> Om Tajane [omtajane2806@gmail.com]</div>
                    <div><strong>Academic Co-Lead:</strong> Ranjan Zambare [ranjanzambare9119@gmail.com]</div>
                    <div><strong>Initiation Date:</strong> August 2025</div>
                    <div><strong>Current Version:</strong> 1.0.0-prod (Port 3000 Node/Express + React 19)</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" /> Protected Proprietary Assets
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#090d1c] border border-slate-800 space-y-1">
                      <span className="font-bold text-cyan-300">A. Brand Identifiers</span>
                      <p className="text-slate-400 text-[11px]">YuvaSetu™, "Samajh Se Safalta Tak"™, VidyaTokens™, and custom geometric bridge iconography.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#090d1c] border border-slate-800 space-y-1">
                      <span className="font-bold text-cyan-300">B. Source Code & Schemas</span>
                      <p className="text-slate-400 text-[11px]">Complete full-stack TypeScript codebase, 15 relational tables, and double-entry ledger queries.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#090d1c] border border-slate-800 space-y-1">
                      <span className="font-bold text-cyan-300">C. UI/UX Design System</span>
                      <p className="text-slate-400 text-[11px]">Dark academic identity, UserInitialsBadge deterministic avatars, and cinematic opening experience.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#090d1c] border border-slate-800 space-y-1">
                      <span className="font-bold text-cyan-300">D. Proprietary Algorithms</span>
                      <p className="text-slate-400 text-[11px]">Multi-credential authentication resolver, sole-admin protection guard, and AI cheating defense.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 9. SYSTEM DIAGRAMS */}
            {activeSection === 'diagrams' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="border-b border-slate-800 pb-5">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Module 9</span>
                  <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white mt-1">
                    System Architecture Diagram Portfolio
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Collection of original architectural blueprints and workflows.
                  </p>
                </div>

                {/* DIAGRAM 1 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400">Diagram 01: YuvaSetu Ecosystem Hub</span>
                    <button
                      onClick={() => handleCopy(`YuvaSetu Connected Hub Diagram`, 'd1')}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSection === 'd1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy
                    </button>
                  </div>
                  <pre className="p-4 rounded-2xl bg-[#070a14] border border-slate-800 text-[11px] font-mono text-cyan-200 overflow-x-auto leading-relaxed">
{`                    ┌──────────────────────────────┐
                    │    YUVASETU CONNECTED HUB    │
                    │   "Samajh Se Safalta Tak"    │
                    └──────────────┬───────────────┘
                                   │
      ┌─────────────┬──────────────┼──────────────┬─────────────┐
      ▼             ▼              ▼              ▼             ▼
[STUDY NOTES] [STUDY ROOMS] [GEMINI AI TUTOR] [DOUBT FORUM] [COMMUNITY]
      │             │              │              │             │
      └─────────────┴──────┬───────┴──────────────┴─────────────┘
                           ▼
               [VIDYATOKENS ECONOMY]
                           ▼
               [ACADEMIC EXCELLENCE]`}
                  </pre>
                </div>

                {/* DIAGRAM 4 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">Diagram 04: Layered Full-Stack Platform Architecture</span>
                    <button
                      onClick={() => handleCopy(`Layered Full-Stack Architecture Diagram`, 'd4')}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSection === 'd4' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy
                    </button>
                  </div>
                  <pre className="p-4 rounded-2xl bg-[#070a14] border border-slate-800 text-[11px] font-mono text-amber-200 overflow-x-auto leading-relaxed">
{`+-------------------------------------------------------------------------+
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
+---------------------------+ +---------------------------+ +-------------+`}
                  </pre>
                </div>

                {/* DIAGRAM 12 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">Diagram 12: VidyaTokens Double-Entry Ledger Transaction</span>
                    <button
                      onClick={() => handleCopy(`VidyaTokens Double-Entry Ledger Diagram`, 'd12')}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSection === 'd12' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy
                    </button>
                  </div>
                  <pre className="p-4 rounded-2xl bg-[#070a14] border border-slate-800 text-[11px] font-mono text-emerald-200 overflow-x-auto leading-relaxed">
{`[ EVENT TRIGGER: Accepted Verified Answer (+10 VT) ]
                         │
                         ▼
[ ATOMIC TRANSACTION (Serialized SQL Query) ]
  • Step 1: Query current balance:
            SELECT balance FROM token_wallets WHERE user_id = ?
  • Step 2: Compute: NewBalance = CurrentBalance + 10
  • Step 3: Mutate wallet state:
            UPDATE token_wallets SET balance = ?, updated_at = ? WHERE user_id = ?
  • Step 4: Write immutable audit record:
            INSERT INTO token_transactions (type: 'TOKEN_EARNED', amount: 10, balance_after: ...)
                         │
                         ▼
[ COMMIT & FLUSH TO DISK (./data/yuvasetu.sqlite) ]`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
