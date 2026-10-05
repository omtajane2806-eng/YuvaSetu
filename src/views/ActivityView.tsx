import React, { useState, useEffect } from 'react';
import {
  Activity,
  Search,
  Filter,
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  BookOpen,
  HelpCircle,
  Radio,
  Users,
  Download,
  Eye,
  Heart,
  Bookmark,
  Play,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  ChevronRight,
  User as UserIcon,
} from 'lucide-react';
import { User } from '../types/user';
import { ActivityEvent, ActivityEventType, ActivityResourceType } from '../types/activity';
import { activityService } from '../services/activityService';
import { UserInitialsBadge } from '../components/UserInitialsBadge';

interface ActivityViewProps {
  currentUser: User | null;
  onNavigate: (view: string, payload?: any) => void;
}

export const ActivityView: React.FC<ActivityViewProps> = ({
  currentUser,
  onNavigate,
}) => {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'DOUBTS' | 'ROOMS' | 'SESSIONS' | 'MATERIALS' | 'ACCOUNTS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewScope, setViewScope] = useState<'MY_ACTIVITY' | 'ALL_PLATFORM'>(
    currentUser?.role === 'admin' ? 'ALL_PLATFORM' : 'MY_ACTIVITY'
  );

  const loadEvents = () => {
    if (!currentUser) return;
    if (viewScope === 'ALL_PLATFORM' && currentUser.role === 'admin') {
      setEvents(activityService.getAllEvents(200));
    } else {
      setEvents(activityService.getEventsByUserId(currentUser.id));
    }
  };

  useEffect(() => {
    loadEvents();
    const interval = setInterval(loadEvents, 5000);
    return () => clearInterval(interval);
  }, [currentUser, viewScope]);

  const getEventIcon = (eventType: ActivityEventType, resourceType: ActivityResourceType) => {
    switch (eventType) {
      case 'DOUBT_CREATED':
      case 'ANSWER_CREATED':
      case 'ANSWER_ACCEPTED':
      case 'DOUBT_RESOLVED':
      case 'DOUBT_REPORTED':
        return <HelpCircle className="w-4 h-4 text-emerald-400" />;
      case 'LIVE_SESSION_JOINED':
        return <Radio className="w-4 h-4 text-cyan-400" />;
      case 'STUDY_ROOM_JOINED':
        return <Users className="w-4 h-4 text-purple-400" />;
      case 'MATERIAL_VIEWED':
        return <Eye className="w-4 h-4 text-blue-400" />;
      case 'PDF_DOWNLOADED':
        return <Download className="w-4 h-4 text-amber-400" />;
      case 'VIDEO_STARTED':
      case 'VIDEO_COMPLETED':
        return <Play className="w-4 h-4 text-rose-400" />;
      case 'MATERIAL_SAVED':
        return <Bookmark className="w-4 h-4 text-indigo-400" />;
      case 'MATERIAL_LIKED':
        return <Heart className="w-4 h-4 text-pink-400" />;
      case 'USER_REGISTERED':
      case 'STUDENT_ADDED':
      case 'STUDENT_ACTIVATED':
      case 'STUDENT_DEACTIVATED':
        return <GraduationCap className="w-4 h-4 text-teal-400" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  const getEventBadgeClass = (eventType: ActivityEventType) => {
    if (eventType.includes('DOUBT') || eventType.includes('ANSWER')) {
      return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
    }
    if (eventType.includes('LIVE') || eventType.includes('SESSION')) {
      return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
    }
    if (eventType.includes('ROOM')) {
      return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
    }
    if (eventType.includes('MATERIAL') || eventType.includes('PDF') || eventType.includes('VIDEO')) {
      return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
    }
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  const formatEventName = (eventType: ActivityEventType) => {
    return eventType.replace(/_/g, ' ');
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return `${d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })} at ${d.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    } catch {
      return 'Recent';
    }
  };

  const handleResourceClick = (event: ActivityEvent) => {
    const isAdmin = currentUser?.role === 'admin';

    if (event.resource_type === 'doubt' || event.resource_type === 'answer') {
      if (isAdmin) {
        onNavigate('admin_doubts', { doubtId: event.metadata?.doubt_id || event.resource_id });
      } else {
        onNavigate('doubts', { doubtId: event.metadata?.doubt_id || event.resource_id });
      }
      return;
    }

    if (event.resource_type === 'live_session') {
      if (isAdmin) {
        onNavigate('admin_live_sessions', { sessionId: event.resource_id });
      } else {
        onNavigate('live_sessions', { sessionId: event.resource_id });
      }
      return;
    }

    if (event.resource_type === 'study_room') {
      if (isAdmin) {
        onNavigate('admin_study_rooms', { roomId: event.resource_id });
      } else {
        onNavigate('study_rooms', { roomId: event.resource_id });
      }
      return;
    }

    if (
      event.resource_type === 'material' ||
      event.resource_type === 'pdf' ||
      event.resource_type === 'video'
    ) {
      if (isAdmin) {
        onNavigate('admin_materials', { materialId: event.resource_id });
      } else {
        onNavigate('explore', { materialId: event.resource_id });
      }
      return;
    }

    if (event.resource_type === 'user' && isAdmin) {
      onNavigate('admin_students', { studentId: event.resource_id });
      return;
    }
  };

  const filteredEvents = events.filter((ev) => {
    // Category filter
    if (
      activeFilter === 'DOUBTS' &&
      !['DOUBT_CREATED', 'ANSWER_CREATED', 'ANSWER_ACCEPTED', 'DOUBT_RESOLVED', 'DOUBT_REPORTED'].includes(
        ev.event_type
      )
    ) {
      return false;
    }
    if (activeFilter === 'ROOMS' && ev.event_type !== 'STUDY_ROOM_JOINED') {
      return false;
    }
    if (activeFilter === 'SESSIONS' && ev.event_type !== 'LIVE_SESSION_JOINED') {
      return false;
    }
    if (
      activeFilter === 'MATERIALS' &&
      ![
        'MATERIAL_VIEWED',
        'PDF_DOWNLOADED',
        'VIDEO_STARTED',
        'VIDEO_COMPLETED',
        'MATERIAL_SAVED',
        'MATERIAL_LIKED',
      ].includes(ev.event_type)
    ) {
      return false;
    }
    if (
      activeFilter === 'ACCOUNTS' &&
      !['USER_REGISTERED', 'STUDENT_ADDED', 'STUDENT_ACTIVATED', 'STUDENT_DEACTIVATED', 'STUDENT_EDITED'].includes(
        ev.event_type
      )
    ) {
      return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ev.user_name?.toLowerCase().includes(q) ||
        ev.user_email?.toLowerCase().includes(q) ||
        ev.resource_title?.toLowerCase().includes(q) ||
        ev.event_type.toLowerCase().includes(q)
      );
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER & SCOPE SELECTOR */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
              <button
                onClick={() => onNavigate(currentUser?.role === 'admin' ? 'admin' : 'dashboard')}
                className="hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{currentUser?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}</span>
              </button>
              <span>/</span>
              <span className="text-slate-400">Activity Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Activity className="w-7 h-7 text-purple-400" />
              <span>Activity Center</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Complete chronological audit stream of student study actions, doubt discussions, session attendances, and curriculum engagements.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {currentUser?.role === 'admin' && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 flex items-center gap-1">
                <button
                  id="activity-scope-all-btn"
                  onClick={() => setViewScope('ALL_PLATFORM')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewScope === 'ALL_PLATFORM'
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Platform
                </button>
                <button
                  id="activity-scope-my-btn"
                  onClick={() => setViewScope('MY_ACTIVITY')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewScope === 'MY_ACTIVITY'
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  My Actions
                </button>
              </div>
            )}

            <button
              id="activity-to-notifications-btn"
              onClick={() => onNavigate('notifications')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Alerts Center</span>
            </button>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-[#0b101e] border border-slate-800/80 rounded-2xl p-4 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="activity-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activity by student name, email, or resource..."
                className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>Showing: <strong className="text-white">{filteredEvents.length}</strong> events</span>
            </div>
          </div>

          {/* FILTER PILLS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/60 pt-3">
            {[
              { id: 'ALL', label: 'All Activities' },
              { id: 'DOUBTS', label: 'Doubts & Q&A' },
              { id: 'ROOMS', label: 'Study Rooms' },
              { id: 'SESSIONS', label: 'Live Sessions' },
              { id: 'MATERIALS', label: 'Study Materials' },
              { id: 'ACCOUNTS', label: 'Student Accounts' },
            ].map((tab) => (
              <button
                key={tab.id}
                id={`activity-tab-${tab.id.toLowerCase()}`}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* TIMELINE STREAM */}
        <div className="space-y-3" id="activity-stream-container">
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center bg-[#0b101e] border border-slate-800/80 rounded-2xl shadow-xl">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                <Activity className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-base font-bold text-white">No activity logged</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                {searchQuery
                  ? 'No activity matches your search.'
                  : 'Start exploring study materials, joining study rooms, or asking doubts to see your progress here!'}
              </p>
            </div>
          ) : (
            filteredEvents.map((ev) => (
              <div
                key={ev.id}
                id={`activity-event-${ev.id}`}
                onClick={() => handleResourceClick(ev)}
                className="p-4 rounded-2xl bg-[#0b101e]/90 border border-slate-800/80 hover:border-purple-500/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-3.5">
                  {/* Actor Initials Badge (ZERO PROFILE PICTURES MANDATE) */}
                  <div className="shrink-0 mt-0.5">
                    <UserInitialsBadge
                      name={ev.user_name || 'Student'}
                      role={ev.user_id.includes('admin') ? 'admin' : 'student'}
                      size="sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {ev.user_name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase border ${getEventBadgeClass(
                          ev.event_type
                        )}`}
                      >
                        {formatEventName(ev.event_type)}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimestamp(ev.created_at)}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-medium">
                      {ev.resource_title || 'Platform resource'}
                    </p>

                    {/* Metadata Context Chips */}
                    {ev.metadata && Object.keys(ev.metadata).length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        {ev.metadata.subject && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-slate-400 border border-slate-800">
                            {ev.metadata.subject}
                          </span>
                        )}
                        {ev.metadata.topic && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-slate-400 border border-slate-800">
                            {ev.metadata.topic}
                          </span>
                        )}
                        {ev.metadata.college && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-slate-400 border border-slate-800">
                            {ev.metadata.college}
                          </span>
                        )}
                        {ev.metadata.status && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                            {ev.metadata.status}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-purple-400 font-bold group-hover:translate-x-1 transition-transform self-end sm:self-center shrink-0">
                  <span>View Resource</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
