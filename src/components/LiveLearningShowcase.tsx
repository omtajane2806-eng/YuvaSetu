import React, { useState, useEffect } from 'react';
import {
  Radio,
  Calendar,
  Clock,
  ExternalLink,
  Users,
  Video,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { LiveSessionItem, SessionStatus } from '../types/sessionRoom';
import { sessionRoomService } from '../services/sessionRoomService';
import { UserInitialsBadge } from './UserInitialsBadge';

export interface LiveLearningShowcaseProps {
  onViewAllSessions: () => void;
  onOpenStudyRooms: () => void;
}

export const LiveLearningShowcase: React.FC<LiveLearningShowcaseProps> = ({
  onViewAllSessions,
  onOpenStudyRooms,
}) => {
  const [sessions, setSessions] = useState<LiveSessionItem[]>([]);

  useEffect(() => {
    const all = sessionRoomService.getLiveSessions();
    setSessions(all);
  }, []);

  const liveSessions = sessions.filter((s) => s.status === 'LIVE');
  const scheduledSessions = sessions.filter((s) => s.status === 'SCHEDULED');

  // Active primary session is either a currently live session or the earliest scheduled one
  const primarySession = liveSessions[0] || scheduledSessions[0];
  const otherSessions = liveSessions.length > 0
    ? [...liveSessions.slice(1), ...scheduledSessions].slice(0, 3)
    : scheduledSessions.slice(1, 4);

  const handleJoin = (session: LiveSessionItem) => {
    if (session.sessionUrl) {
      window.open(session.sessionUrl, '_blank', 'noopener,noreferrer');
    } else {
      onViewAllSessions();
    }
  };

  return (
    <section id="live-learning-showcase-section" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-800/80">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            Synchronous Academic Circles
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-white tracking-tight">
            Live Peer Learning & Masterclasses
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
            Join interactive problem-solving sessions, ask questions in real-time, or study alongside peers in collaborative study rooms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenStudyRooms}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-bold transition-all cursor-pointer"
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Study Rooms</span>
          </button>

          <button
            onClick={onViewAllSessions}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-500/20 transition-all cursor-pointer"
          >
            <span>Live Schedule</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* NO SESSIONS FALLBACK */}
      {!primarySession ? (
        <div className="mt-8 p-10 rounded-3xl bg-[#0a0e1c] border border-slate-800 text-center space-y-3">
          <Radio className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Live Sessions Scheduled Right Now</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Check the study rooms or drop a doubt for peer resolution while upcoming sessions are scheduled.
          </p>
        </div>
      ) : (
        /* HIERARCHICAL PRESENTATION: PRIMARY LIVE/UPCOMING + LIST */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8 items-stretch">
          {/* PRIMARY SESSION STAGE (Col 1-7) */}
          <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-[#120f24] via-[#0b0c1c] to-[#070814] border border-rose-500/30 p-6 sm:p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {primarySession.status === 'LIVE' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs font-black uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      Live Now
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      Next Scheduled
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900 text-slate-300 border border-slate-800">
                    {primarySession.subject}
                  </span>
                </div>

                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {primarySession.startTime} • {primarySession.duration}
                </span>
              </div>

              <div className="mt-6">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-rose-400">
                  Topic Breakdown
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white mt-1.5 group-hover:text-rose-300 transition-colors">
                  {primarySession.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-3">
                  {primarySession.description}
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <UserInitialsBadge
                  name={primarySession.hostName}
                  size="sm"
                  className="border border-slate-700"
                />
                <div className="text-xs">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>{primarySession.hostName}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-slate-400">Host & Academic Mentor</div>
                </div>
              </div>

              <button
                onClick={() => handleJoin(primarySession)}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shadow-xl ${
                  primarySession.status === 'LIVE'
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 hover:scale-105'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-95'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>{primarySession.status === 'LIVE' ? 'Join Live Room Now' : 'Join Session Link'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* OTHER UPCOMING SESSIONS (Col 8-12) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3">
            {otherSessions.length === 0 ? (
              <div className="h-full p-6 rounded-2xl bg-[#0a0e1c] border border-slate-800 flex flex-col items-center justify-center text-center">
                <p className="text-xs text-slate-400">Additional weekly sessions scheduled regularly.</p>
              </div>
            ) : (
              otherSessions.map((sess) => (
                <div
                  key={sess.id}
                  onClick={() => handleJoin(sess)}
                  className="p-4 rounded-2xl bg-[#0a0e1c] border border-slate-800/90 hover:border-slate-700 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      {sess.subject}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {sess.date} • {sess.startTime}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-2 group-hover:text-rose-300 transition-colors line-clamp-1">
                    {sess.title}
                  </h4>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <UserInitialsBadge name={sess.hostName} size="xs" />
                      <span className="text-slate-300 truncate max-w-[120px]">{sess.hostName}</span>
                    </div>

                    <span className="text-rose-400 font-bold flex items-center gap-1 text-[11px] group-hover:underline">
                      <span>Open Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </section>
  );
};
