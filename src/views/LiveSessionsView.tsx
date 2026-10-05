import React, { useState, useEffect } from 'react';
import { YuvaSetuLogo } from '../components/YuvaSetuLogo';
import { UserInitialsBadge } from '../components/UserInitialsBadge';
import { LiveSessionItem, SessionStatus } from '../types/sessionRoom';
import { sessionRoomService } from '../services/sessionRoomService';
import { User } from '../types/user';
import {
  Video,
  Radio,
  Calendar,
  Clock,
  Users,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Search,
  Sparkles,
  Play,
  X,
  Share2,
  AlertCircle,
} from 'lucide-react';

export interface LiveSessionsViewProps {
  currentUser: User | null;
  onNavigate: (view: string, payload?: any) => void;
  activeSessionId?: string;
}

export const LiveSessionsView: React.FC<LiveSessionsViewProps> = ({
  currentUser,
  onNavigate,
  activeSessionId,
}) => {
  const [sessions, setSessions] = useState<LiveSessionItem[]>(() =>
    sessionRoomService.getLiveSessions()
  );
  const [activeTab, setActiveTab] = useState<'LIVE' | 'UPCOMING' | 'PAST'>('LIVE');
  const [selectedSession, setSelectedSession] = useState<LiveSessionItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [meetingError, setMeetingError] = useState<string | null>(null);

  useEffect(() => {
    const data = sessionRoomService.getLiveSessions();
    setSessions(data);
    if (activeSessionId) {
      const match = data.find((s) => s.id === activeSessionId);
      if (match) setSelectedSession(match);
    }
  }, [activeSessionId]);

  const liveSessions = sessions.filter((s) => s.status === 'LIVE');
  const upcomingSessions = sessions.filter((s) => s.status === 'SCHEDULED');
  const pastSessions = sessions.filter((s) => s.status === 'ENDED' || s.status === 'CANCELLED');

  const getDisplayedSessions = () => {
    let currentList =
      activeTab === 'LIVE'
        ? liveSessions
        : activeTab === 'UPCOMING'
        ? upcomingSessions
        : pastSessions;

    if (searchQuery.trim()) {
      currentList = currentList.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.hostName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return currentList;
  };

  const handleJoinLive = (session: LiveSessionItem) => {
    if (!currentUser) {
      onNavigate('login');
      return;
    }

    // 1. Check that the session exists
    const existing = sessionRoomService.getLiveSessionById(session.id);
    if (!existing) {
      setMeetingError('Session no longer exists or has been removed.');
      setTimeout(() => setMeetingError(null), 4000);
      return;
    }

    // 2. Check that the meeting URL is valid
    const url = session.sessionUrl?.trim();
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      setMeetingError('Meeting link is not available yet.');
      setTimeout(() => setMeetingError(null), 4000);
      return;
    }

    // 3. Record student participation
    sessionRoomService.joinTarget(
      {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        college: currentUser.college,
      },
      { sessionId: session.id }
    );

    // 4. Open the real meeting URL
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = (session: LiveSessionItem) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/#live-session-${session.id}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div id="vidyasetu-live-sessions-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* HEADER WITH BRAND IDENTITY */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d1428] via-[#090d1c] to-[#1a0f2e] border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <YuvaSetuLogo variant="icon" size="sm" />
            <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
              Live Sessions
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Join live interactive lectures, concept walkthroughs & doubt clearing hosted by YuvaSetu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('study_rooms')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
          >
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Browse Study Rooms</span>
          </button>
        </div>
      </div>

      {/* Meeting Link Notification / Error Alert */}
      {meetingError && (
        <div
          id="live-session-error-banner"
          className="p-4 rounded-2xl bg-amber-950/70 border border-amber-500/60 text-amber-200 text-xs font-bold flex items-center justify-between gap-3 animate-fadeIn"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>{meetingError}</span>
          </div>
          <button
            onClick={() => setMeetingError(null)}
            className="text-amber-400 hover:text-white text-xs underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TOP LIVE ALERT BANNER (If any session is LIVE NOW) */}
      {liveSessions.length > 0 && activeTab !== 'LIVE' && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-indigo-950/80 border border-rose-500/40 flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black text-rose-300 uppercase tracking-wider">
                Live Now On YuvaSetu
              </span>
              <p className="text-xs sm:text-sm font-bold text-white">
                {liveSessions[0].title}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveTab('LIVE');
              setSelectedSession(liveSessions[0]);
            }}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-black shadow-lg shadow-rose-950/50 transition-all cursor-pointer shrink-0"
          >
            Join Live Session
          </button>
        </div>
      )}

      {/* TABS & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0c1020] border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('LIVE')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'LIVE'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>LIVE NOW ({liveSessions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('UPCOMING')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'UPCOMING'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>UPCOMING ({upcomingSessions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('PAST')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'PAST'
                ? 'bg-slate-800 text-slate-200 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>RECENT / PAST ({pastSessions.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sessions by topic or host..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0c1020] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* SESSIONS GRID */}
      {getDisplayedSessions().length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getDisplayedSessions().map((session) => {
            const isLive = session.status === 'LIVE';
            const isUpcoming = session.status === 'SCHEDULED';
            const isEnded = session.status === 'ENDED';

            return (
              <div
                key={session.id}
                id={`session-card-${session.id}`}
                className="p-6 rounded-3xl bg-[#0c1020] hover:bg-[#0f1528] border border-slate-800 hover:border-cyan-500/40 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  {/* Status and Subject */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold">
                      {session.subject}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                        isLive
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                          : isUpcoming
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {isLive && <Radio className="w-3 h-3" />}
                      <span>{session.status === 'SCHEDULED' ? 'UPCOMING' : session.status}</span>
                    </span>
                  </div>

                  {/* Title & Topic */}
                  <div>
                    <h3 className="text-base font-bold font-['Outfit'] text-white line-clamp-2">
                      {session.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{session.topic}</p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {session.description}
                  </p>
                </div>

                <div className="space-y-4 pt-3 border-t border-slate-800/80">
                  {/* Host info (No photos, name & initials only) */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <UserInitialsBadge name={session.hostName} role="admin" size="xs" />
                      <div>
                        <span className="text-[10px] text-slate-500 block leading-none">Host / Mentor</span>
                        <span className="text-xs font-bold text-slate-200">{session.hostName}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block leading-none">Attendance</span>
                      <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> {session.attendeeCount} Students
                      </span>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center justify-between text-[11px] text-slate-300 bg-slate-950/80 p-2.5 rounded-xl border border-slate-900">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{session.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{session.startTime} ({session.duration})</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {isLive ? (
                      <button
                        onClick={() => handleJoinLive(session)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
                      >
                        <Radio className="w-4 h-4 animate-pulse" />
                        <span>Join Live</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    ) : isUpcoming ? (
                      <button
                        onClick={() => setSelectedSession(session)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-950/40 transition-all cursor-pointer"
                      >
                        <Clock className="w-4 h-4" />
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedSession(session)}
                        className="flex-1 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                      >
                        View Session Info
                      </button>
                    )}

                    <button
                      onClick={() => handleShare(session)}
                      title="Share Session"
                      className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-[#0c1020] border border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500">
            <Video className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No {activeTab.toLowerCase()} sessions found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Check back shortly or browse other session categories.
          </p>
        </div>
      )}

      {/* SESSION DETAILS MODAL / DIALOG */}
      {selectedSession && (
        <div
          id="session-details-modal"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative w-full max-w-xl rounded-3xl bg-[#0c1020] border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-fadeIn">
            <button
              onClick={() => setSelectedSession(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold">
                  {selectedSession.subject}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    selectedSession.status === 'LIVE'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                      : selectedSession.status === 'SCHEDULED'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {selectedSession.status}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
                {selectedSession.title}
              </h2>
              <p className="text-xs text-slate-400">{selectedSession.topic}</p>
            </div>

            {/* Description */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
              {selectedSession.description}
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Host / Admin</span>
                <div className="flex items-center gap-2">
                  <UserInitialsBadge name={selectedSession.hostName} role="admin" size="xs" />
                  <span className="font-bold text-white">{selectedSession.hostName}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Schedule</span>
                <div className="flex items-center gap-1.5 text-slate-200">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{selectedSession.date} • {selectedSession.startTime}</span>
                </div>
              </div>
            </div>

            {/* Status Alert & Action */}
            <div className="space-y-3">
              {selectedSession.status === 'LIVE' ? (
                <button
                  onClick={() => handleJoinLive(selectedSession)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-rose-950/50 transition-all cursor-pointer"
                >
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>Join Live Stream Now</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              ) : selectedSession.status === 'SCHEDULED' ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-center text-xs text-cyan-300 flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>Session starts at {selectedSession.startTime} ({selectedSession.date})</span>
                  </div>
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        onNavigate('login');
                        return;
                      }
                      sessionRoomService.joinTarget(
                        {
                          id: currentUser.id,
                          name: currentUser.name,
                          email: currentUser.email,
                          college: currentUser.college,
                        },
                        { sessionId: selectedSession.id }
                      );
                      setSelectedSession(null);
                    }}
                    className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition-all cursor-pointer"
                  >
                    RSVP / Add to My Sessions
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
                  This educational session has concluded.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
