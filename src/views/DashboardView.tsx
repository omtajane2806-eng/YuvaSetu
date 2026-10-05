import React, { useState, useEffect } from 'react';
import { YuvaSetuLogo } from '../components/YuvaSetuLogo';
import { UserInitialsBadge } from '../components/UserInitialsBadge';
import { Course, DoubtItem } from '../data/platformData';
import { User } from '../types/user';
import { contentService } from '../services/contentService';
import { sessionRoomService } from '../services/sessionRoomService';
import { doubtService } from '../services/doubtService';
import { notificationService } from '../services/notificationService';
import { activityService } from '../services/activityService';
import { ContentCard } from '../components/content/ContentCard';
import {
  Flame,
  BookOpen,
  Users,
  HelpCircle,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Calendar,
  Layers,
  ChevronRight,
  Plus,
  Compass,
  FileText,
  Search,
  MessageSquare,
  Video,
  Radio,
  ExternalLink,
  ShieldCheck,
  Bookmark,
  Bell,
  Activity,
  CheckCheck,
  LogOut,
} from 'lucide-react';

export interface DashboardViewProps {
  user: User;
  courses: Course[];
  studyRooms?: any[];
  doubts: DoubtItem[];
  onNavigate: (view: string, payload?: any) => void;
  onOpenProfileSetup?: () => void;
  onLogout?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  courses,
  doubts,
  onNavigate,
  onOpenProfileSetup,
  onLogout,
}) => {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string | null>(null);

  // User's enrolled subjects
  const userSubjects =
    user.learningSubjects && user.learningSubjects.length > 0
      ? user.learningSubjects
      : ['Computer Science (DSA)', 'Operating Systems', 'Database Management Systems'];

  // Content items
  const recommendedContent = contentService.getRecommendedContent(userSubjects, 4);
  const savedResources = contentService.getSavedContent(user.id);
  const recentlyViewed = contentService.getRecentlyViewed(user.id);
  const allRecentMaterials = contentService.getAllContent(false).slice(0, 4);

  // Fallback for Continue Learning if recently viewed is empty
  const continueLearningItems =
    recentlyViewed.length > 0 ? recentlyViewed.slice(0, 3) : allRecentMaterials.slice(0, 2);

  // Live Sessions & Study Rooms
  const allSessions = sessionRoomService.getLiveSessions();
  const liveNowSessions = allSessions.filter((s) => s.status === 'LIVE');
  const upcomingSessions = allSessions.filter((s) => s.status === 'SCHEDULED');

  const allRooms = sessionRoomService.getStudyRooms();
  const activeRooms = allRooms.filter((r) => r.status === 'LIVE' || r.status === 'UPCOMING');

  // Student's real doubts
  const myDoubts = doubtService.getDoubtsByStudent(user.id);

  // Student's real notifications and activity
  const studentNotifications = notificationService.getUserNotifications(user);
  const unreadNotifCount = notificationService.getUnreadCount(user);
  const recentActivityEvents = activityService.getEventsByUserId(user.id).slice(0, 4);

  return (
    <div id="yuvasetu-student-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* 1. WELCOME HEADER WITH PERSONALIZED NAME & BRAND (NO USER PHOTO) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d1428] via-[#090d1c] to-[#120e24] border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 relative z-10">
          <div
            onClick={() => onNavigate('profile')}
            className="cursor-pointer"
            title="View Profile"
          >
            <UserInitialsBadge name={user.name} role={user.role} size="xl" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-3xl font-black font-['Outfit'] text-white">
                Welcome to YuvaSetu, {user.name.split(' ')[0]} 👋
              </h1>
              <span className="px-3 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-black uppercase tracking-wider">
                Student Account (100% Free)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium flex flex-wrap items-center gap-2">
              <span className="text-cyan-400 font-bold">{user.college || 'Engineering College'}</span>
              <span>•</span>
              <span>{user.branch || 'Undergraduate'}</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">{user.year}</span>
            </p>
            <p className="text-xs text-slate-400 italic">
              "Samajh Se Safalta Tak" — Turning raw confusion into structured clarity & academic success.
            </p>
          </div>
        </div>

        {/* Quick Consistency, XP Metrics & Log Out */}
        <div className="flex flex-wrap items-center gap-3 relative z-10 w-full sm:w-auto">
          <div className="flex-1 sm:flex-initial flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-amber-300 shadow-sm">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
            <div>
              <div className="text-xs font-black leading-none">Day 1 Streak</div>
              <div className="text-[10px] text-amber-400/80 font-medium">Daily Consistency</div>
            </div>
          </div>

          <div className="flex-1 sm:flex-initial flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 shadow-sm">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-xs font-black leading-none">{user.reputation} XP</div>
              <div className="text-[10px] text-cyan-400/80 font-medium">Learning Points</div>
            </div>
          </div>

          {onLogout && (
            <button
              id="student-dashboard-logout-btn"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/30 hover:border-rose-400/60 text-rose-300 hover:text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Log out of student account"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </div>

      {/* VIDYASETU AI LEARNING ASSISTANT HERO WIDGET */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0c142b] via-[#090d1c] to-[#170e28] border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg shadow-cyan-500/10">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-wider border border-cyan-500/30">
                Source-Grounded AI
              </span>
              <h2 className="text-base sm:text-lg font-black font-['Outfit'] text-white">
                YuvaSetu AI Learning Assistant
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Understand tough syllabus concepts, generate practice quizzes, and build 1-click revision notes from your study materials.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            id="dash-ai-assistant-btn"
            onClick={() => onNavigate('ai_assistant')}
            className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Ask AI Assistant</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* LIVE NOW BANNER (IF SESSIONS LIVE) */}
      {liveNowSessions.length > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-rose-950/80 via-purple-950/60 to-[#0c1020] border-2 border-rose-500/50 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                  LIVE NOW
                </span>
                <span className="text-xs font-bold text-slate-300">{liveNowSessions[0].subject}</span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white mt-0.5">
                {liveNowSessions[0].title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('live_sessions', { sessionId: liveNowSessions[0].id })}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white text-xs font-black shadow-lg shadow-rose-500/30 transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Join Live ({liveNowSessions[0].attendeeCount} students)</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. ENROLLED SUBJECTS FILTER BAR */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090d1a] border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-300">
            My Enrolled Subjects ({userSubjects.length}):
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setSelectedSubjectFilter(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedSubjectFilter === null
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Subjects
          </button>
          {userSubjects.map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubjectFilter(selectedSubjectFilter === subj ? null : subj)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedSubjectFilter === subj
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-300 hover:border-cyan-500/50 border border-slate-800'
              }`}
            >
              {subj}
            </button>
          ))}
          {onOpenProfileSetup && (
            <button
              onClick={onOpenProfileSetup}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-white text-slate-400 text-xs transition-colors"
              title="Edit Learning Subjects"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. MAIN DASHBOARD CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: CURATED LEARNING & RECOMMENDED CONTENT (Cols 1-8) */}
        <div className="lg:col-span-8 space-y-8">
          {/* QUICK ACTION STRIP */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => onNavigate('explore')}
              className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 hover:bg-cyan-900/40 text-cyan-300 text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Notes</span>
            </button>
            <button
              onClick={() => onNavigate('study_rooms')}
              className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 hover:bg-purple-900/40 text-purple-300 text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              <Users className="w-4 h-4" />
              <span>Study Rooms ({activeRooms.length})</span>
            </button>
            <button
              onClick={() => onNavigate('live_sessions')}
              className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 hover:bg-rose-900/40 text-rose-300 text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              <Radio className="w-4 h-4 text-rose-400" />
              <span>Live Streams ({allSessions.length})</span>
            </button>
            <button
              onClick={() => onNavigate('saved_content')}
              className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>Saved ({savedResources.length})</span>
            </button>
          </div>

          {/* SECTION 1: CONTINUE LEARNING */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h3 className="text-lg font-black font-['Outfit'] text-white">
                  Continue Learning
                </h3>
              </div>
              <button
                onClick={() => onNavigate('explore')}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {continueLearningItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigate('content_details', { contentId: item.id })}
                  className="p-4 rounded-2xl bg-[#0c1020] border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 text-[10px] font-black uppercase">
                      {item.content_type}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.subject_name}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-cyan-400 font-bold pt-1 border-t border-slate-800/80">
                    <span>Resume Reading</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: RECOMMENDED FOR YOU */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black font-['Outfit'] text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> Recommended For You
                </h3>
                <p className="text-xs text-slate-400">
                  Curriculum materials matched to your enrolled subjects
                </p>
              </div>
              <button
                onClick={() => onNavigate('explore')}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Browse All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedContent.map((item) => (
                <ContentCard
                  key={item.id}
                  content={item}
                  currentUser={user}
                  onOpen={(c) => onNavigate('content_details', { contentId: c.id })}
                />
              ))}
            </div>
          </div>

          {/* SECTION 3: RECENT STUDY MATERIALS (EXPLORE ALL) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black font-['Outfit'] text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" /> Recent Study Materials
                </h3>
                <p className="text-xs text-slate-400">
                  Latest verified lecture notes and semester exam guides
                </p>
              </div>
              <button
                onClick={() => onNavigate('explore')}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Explore All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allRecentMaterials.map((item) => (
                <ContentCard
                  key={`recent-${item.id}`}
                  content={item}
                  currentUser={user}
                  onOpen={(c) => onNavigate('content_details', { contentId: c.id })}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: UPCOMING SESSIONS, STUDY ROOMS & SAVED (Cols 9-12) */}
        <div className="lg:col-span-4 space-y-6">
          {/* SECTION: RECENT NOTIFICATIONS & ALERTS */}
          <div className="p-6 rounded-3xl bg-[#0c1020] border border-cyan-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-black font-['Outfit'] text-white">
                  Notifications & Alerts
                </h3>
              </div>
              {unreadNotifCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                  {unreadNotifCount} Unread
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                  Caught Up
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              {studentNotifications.length > 0 ? (
                studentNotifications.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      notificationService.markAsRead(item.id);
                      if (item.related_type === 'doubt' && item.related_id) {
                        onNavigate('doubts', { doubtId: item.related_id });
                      } else if (item.related_type === 'live_session' && item.related_id) {
                        onNavigate('live_sessions', { sessionId: item.related_id });
                      } else if (item.related_type === 'study_room' && item.related_id) {
                        onNavigate('study_rooms', { roomId: item.related_id });
                      } else if (item.related_type === 'material' && item.related_id) {
                        onNavigate('explore', { materialId: item.related_id });
                      } else {
                        onNavigate('notifications');
                      }
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                      !item.is_read
                        ? 'bg-slate-900/90 border-cyan-500/40 hover:border-cyan-400'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-bold truncate ${!item.is_read ? 'text-white' : 'text-slate-300'}`}>
                        {item.title}
                      </span>
                      {!item.is_read && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-2 text-center">No notifications yet.</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('notifications')}
                className="flex-1 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all text-center cursor-pointer"
              >
                View All Alerts ({studentNotifications.length})
              </button>
              <button
                onClick={() => onNavigate('activity')}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-purple-300 text-xs font-bold transition-all cursor-pointer"
                title="Activity Center"
              >
                <Activity className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SECTION 4: UPCOMING LIVE SESSIONS */}
          <div className="p-6 rounded-3xl bg-[#0c1020] border border-rose-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-400" />
                <h3 className="text-base font-black font-['Outfit'] text-white">
                  Upcoming Live Sessions
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                Live Q&A
              </span>
            </div>

            <div className="space-y-3">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.slice(0, 2).map((session) => (
                  <div
                    key={session.id}
                    onClick={() => onNavigate('live_sessions', { sessionId: session.id })}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-200 truncate">{session.title}</span>
                      <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">
                        {session.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{session.topic}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                      <span>{session.date} • {session.startTime}</span>
                      <span className="text-rose-400 font-bold">View Session →</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-3 text-center">No upcoming live sessions today.</p>
              )}
            </div>

            <button
              onClick={() => onNavigate('live_sessions')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-400 text-white text-xs font-black shadow-md transition-all text-center cursor-pointer"
            >
              View All Live Sessions
            </button>
          </div>

          {/* SECTION 5: STUDY ROOMS */}
          <div className="p-6 rounded-3xl bg-[#0c1020] border border-purple-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <h3 className="text-base font-black font-['Outfit'] text-white">
                  Study Rooms
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                Focus Sprints
              </span>
            </div>

            <div className="space-y-3">
              {activeRooms.length > 0 ? (
                activeRooms.slice(0, 2).map((room) => (
                  <div
                    key={room.id}
                    onClick={() => onNavigate('study_rooms', { roomId: room.id })}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-200 truncate">{room.name}</span>
                      <span className="text-[10px] text-purple-400 font-bold">
                        {room.activeParticipants} peers
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{room.topic}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                      <span>{room.duration}</span>
                      <span className="text-cyan-400 font-bold">Join Room →</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-3 text-center">No active study rooms at the moment.</p>
              )}
            </div>

            <button
              onClick={() => onNavigate('study_rooms')}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-md transition-all text-center cursor-pointer"
            >
              View Study Rooms
            </button>
          </div>

          {/* SECTION 6: SAVED MATERIALS */}
          <div className="p-6 rounded-3xl bg-[#0c1020] border border-amber-500/20 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-black font-['Outfit'] text-white">
                  Saved Materials
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                {savedResources.length} Notes
              </span>
            </div>

            <div className="space-y-3">
              {savedResources.length > 0 ? (
                savedResources.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onNavigate('content_details', { contentId: item.id })}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-colors cursor-pointer space-y-1"
                  >
                    <h5 className="text-xs font-bold text-slate-200 truncate">{item.title}</h5>
                    <p className="text-[10px] text-slate-400">{item.subject_name}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-2">
                  Bookmark study handouts while exploring to quickly access them here.
                </p>
              )}
            </div>

            <button
              onClick={() => onNavigate('saved_content')}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-amber-300 text-xs font-black transition-all text-center cursor-pointer"
            >
              View Saved Materials
            </button>
          </div>

          {/* SECTION 7: MY ACADEMIC DOUBTS & ASK A DOUBT */}
          <div className="p-6 rounded-3xl bg-[#0c1020] border border-cyan-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-black font-['Outfit'] text-white">
                  My Doubts ({myDoubts.length})
                </h3>
              </div>
              <button
                onClick={() => onNavigate('ask_doubt')}
                className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white text-[11px] font-black transition-all cursor-pointer inline-flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Ask Doubt</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {myDoubts.length > 0 ? (
                myDoubts.slice(0, 3).map((d) => (
                  <div
                    key={d.id}
                    onClick={() => onNavigate('doubt_detail', { doubtId: d.id })}
                    className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                        {d.title}
                      </span>
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                          d.status === 'RESOLVED'
                            ? 'bg-emerald-500/15 text-emerald-300'
                            : d.status === 'ANSWERED'
                            ? 'bg-cyan-500/15 text-cyan-300'
                            : 'bg-amber-500/15 text-amber-300'
                        }`}
                      >
                        {d.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                      <span>{d.subject_name}</span>
                      <span className="text-slate-400">{d.answers_count} Answers</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-2">
                  No open doubts. Need conceptual clarity? Ask our educators anytime.
                </p>
              )}
            </div>

            <button
              onClick={() => onNavigate('doubts')}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-300 text-xs font-bold transition-all text-center cursor-pointer"
            >
              Browse All Doubts Feed →
            </button>
          </div>

          {/* SECTION 8: MY RECENT LEARNING ACTIVITY */}
          <div className="p-6 rounded-3xl bg-[#0c1020] border border-purple-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <h3 className="text-base font-black font-['Outfit'] text-white">
                  My Activity Stream
                </h3>
              </div>
              <button
                onClick={() => onNavigate('activity')}
                className="text-[11px] font-bold text-purple-400 hover:underline cursor-pointer"
              >
                View Log →
              </button>
            </div>

            <div className="space-y-2.5">
              {recentActivityEvents.length > 0 ? (
                recentActivityEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 truncate">
                        {ev.resource_title || ev.event_type}
                      </span>
                      <span className="text-[9px] font-bold uppercase text-purple-400 bg-purple-950/50 px-1.5 py-0.5 rounded border border-purple-800/30">
                        {ev.event_type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      {new Date(ev.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-2 text-center">
                  Your actions across materials, rooms, and doubts will appear here.
                </p>
              )}
            </div>

            <button
              onClick={() => onNavigate('activity')}
              className="w-full py-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/40 text-purple-300 text-xs font-bold transition-all text-center cursor-pointer"
            >
              Full Learning Timeline →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
