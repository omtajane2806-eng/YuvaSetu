import React from 'react';
import { ActivityEvent } from '../../types/activity';
import { UserInitialsBadge } from '../UserInitialsBadge';
import {
  Clock,
  BookOpen,
  Download,
  Video,
  Bookmark,
  Heart,
  Radio,
  Users,
  Shield,
  Sparkles,
} from 'lucide-react';

export interface AdminActivityFeedProps {
  events: ActivityEvent[];
  onSelectStudent?: (studentId: string) => void;
  onSelectContent?: (contentId: string) => void;
}

export const AdminActivityFeed: React.FC<AdminActivityFeedProps> = ({
  events,
  onSelectStudent,
  onSelectContent,
}) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'MATERIAL_VIEWED':
        return <BookOpen className="w-3.5 h-3.5 text-cyan-400" />;
      case 'PDF_DOWNLOADED':
        return <Download className="w-3.5 h-3.5 text-amber-400" />;
      case 'VIDEO_WATCHED':
        return <Video className="w-3.5 h-3.5 text-purple-400" />;
      case 'MATERIAL_SAVED':
        return <Bookmark className="w-3.5 h-3.5 text-blue-400" />;
      case 'MATERIAL_LIKED':
        return <Heart className="w-3.5 h-3.5 text-rose-400" />;
      case 'LIVE_SESSION_JOINED':
        return <Radio className="w-3.5 h-3.5 text-rose-400" />;
      case 'STUDY_ROOM_JOINED':
        return <Users className="w-3.5 h-3.5 text-emerald-400" />;
      case 'ADMIN_ACTION':
        return <Shield className="w-3.5 h-3.5 text-yellow-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  return (
    <div id="admin-activity-feed" className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Real-Time Platform Activity Stream</span>
        </h4>
        <span className="text-[10px] font-mono text-slate-500">
          Showing latest {events.length} system events
        </span>
      </div>

      {events.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
          No platform activities logged yet.
        </div>
      ) : (
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {events.slice(0, 15).map((ev) => (
            <div
              key={ev.id}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3 text-xs hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  {getEventIcon(ev.event_type)}
                </div>

                <div className="min-w-0 truncate">
                  <div className="flex items-center gap-1.5 truncate">
                    <button
                      onClick={() => onSelectStudent && onSelectStudent(ev.user_id)}
                      className="font-bold text-white hover:text-cyan-300 transition-colors truncate text-left cursor-pointer"
                    >
                      {ev.user_name}
                    </button>
                    <span className="text-slate-400 text-[11px] shrink-0">
                      {ev.event_type === 'MATERIAL_VIEWED' && 'viewed'}
                      {ev.event_type === 'PDF_DOWNLOADED' && 'downloaded PDF'}
                      {ev.event_type === 'VIDEO_WATCHED' && 'watched video'}
                      {ev.event_type === 'MATERIAL_SAVED' && 'saved'}
                      {ev.event_type === 'MATERIAL_LIKED' && 'liked'}
                      {ev.event_type === 'LIVE_SESSION_JOINED' && 'joined live session'}
                      {ev.event_type === 'STUDY_ROOM_JOINED' && 'joined study room'}
                      {ev.event_type === 'ADMIN_ACTION' && 'performed admin action'}
                    </span>
                    {ev.resource_title && (
                      <span className="font-semibold text-cyan-300 truncate max-w-xs">
                        "{ev.resource_title}"
                      </span>
                    )}
                  </div>
                  {ev.metadata && ev.metadata.subject && (
                    <div className="text-[10px] text-slate-500 truncate">
                      Subject: {ev.metadata.subject}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-500 shrink-0 text-right">
                {new Date(ev.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
