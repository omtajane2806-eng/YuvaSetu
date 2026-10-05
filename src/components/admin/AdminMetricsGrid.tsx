import React from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  BookOpen,
  CheckCircle2,
  FileText,
  Download,
  Video,
  Radio,
  Eye,
  Bookmark,
  TrendingUp,
} from 'lucide-react';

export interface PlatformMetricsData {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  totalAdmins: number;
  activeAdmins: number;
  totalMaterials: number;
  publishedMaterials: number;
  draftMaterials: number;
  totalViews: number;
  totalPdfDownloads: number;
  totalVideosWatched: number;
  totalMaterialsSaved: number;
  totalMaterialsLiked: number;
  totalStudyRooms: number;
  liveStudyRooms: number;
  upcomingStudyRooms: number;
  totalLiveSessions: number;
  liveSessions: number;
  scheduledLiveSessions: number;
  endedLiveSessions: number;
  totalParticipants: number;
}

export interface AdminMetricsGridProps {
  metrics: PlatformMetricsData;
  onNavigateTab?: (tab: string) => void;
}

export const AdminMetricsGrid: React.FC<AdminMetricsGridProps> = ({
  metrics,
  onNavigateTab,
}) => {
  return (
    <div id="admin-metrics-grid" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black font-['Outfit'] uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span>Real-Time Platform Analytics & Core Metrics</span>
        </h3>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
          Live System Telemetry
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Students */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('students')}
          className="p-4 rounded-2xl bg-[#0a0f1d] border border-cyan-500/20 hover:border-cyan-500/50 transition-all cursor-pointer space-y-1.5 shadow-md"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1 text-cyan-400">
              <Users className="w-3.5 h-3.5" /> Total Students
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
            {metrics.totalStudents.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="text-emerald-400">{metrics.activeStudents} Active</span>
            <span className="text-slate-600">•</span>
            <span className="text-rose-400">{metrics.inactiveStudents} Inactive</span>
          </div>
        </div>

        {/* Total Admins */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('admins')}
          className="p-4 rounded-2xl bg-[#0a0f1d] border border-rose-500/20 hover:border-rose-500/50 transition-all cursor-pointer space-y-1.5 shadow-md"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1 text-rose-400">
              <Shield className="w-3.5 h-3.5" /> Administrators
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
            {metrics.totalAdmins}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            <span className="text-emerald-400 font-bold">{metrics.activeAdmins} Active</span> Governance
          </div>
        </div>

        {/* Study Materials */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('materials')}
          className="p-4 rounded-2xl bg-[#0a0f1d] border border-blue-500/20 hover:border-blue-500/50 transition-all cursor-pointer space-y-1.5 shadow-md"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1 text-blue-400">
              <BookOpen className="w-3.5 h-3.5" /> Study Materials
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
            {metrics.totalMaterials}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="text-emerald-400">{metrics.publishedMaterials} Published</span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-400">{metrics.draftMaterials} Draft</span>
          </div>
        </div>

        {/* PDF Downloads */}
        <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-amber-500/20 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1 text-amber-400">
              <Download className="w-3.5 h-3.5" /> PDF Downloads
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
            {metrics.totalPdfDownloads.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Offline Study Handouts
          </div>
        </div>

        {/* Study Rooms */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('study_rooms')}
          className="p-4 rounded-2xl bg-[#0a0f1d] border border-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer space-y-1.5 shadow-md"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1 text-purple-400">
              <Users className="w-3.5 h-3.5" /> Study Rooms
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
            {metrics.totalStudyRooms}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="text-rose-400">{metrics.liveStudyRooms} Live</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">{metrics.upcomingStudyRooms} Upcoming</span>
          </div>
        </div>

        {/* Live Sessions */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('live_sessions')}
          className="p-4 rounded-2xl bg-[#0a0f1d] border border-pink-500/20 hover:border-pink-500/50 transition-all cursor-pointer space-y-1.5 shadow-md"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1 text-pink-400">
              <Radio className="w-3.5 h-3.5" /> Live Sessions
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
            {metrics.totalLiveSessions}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="text-rose-400">{metrics.liveSessions} Live</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400">{metrics.scheduledLiveSessions} Sched</span>
          </div>
        </div>
      </div>

      {/* Secondary Engagement Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-cyan-400" /> Total Resource Views
          </span>
          <span className="font-mono font-bold text-white">
            {metrics.totalViews.toLocaleString()}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-purple-400" /> Video Lectures Played
          </span>
          <span className="font-mono font-bold text-white">
            {metrics.totalVideosWatched.toLocaleString()}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-blue-400" /> Saved Bookmarks
          </span>
          <span className="font-mono font-bold text-white">
            {metrics.totalMaterialsSaved.toLocaleString()}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-400" /> Room Participants
          </span>
          <span className="font-mono font-bold text-white">
            {metrics.totalParticipants.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
