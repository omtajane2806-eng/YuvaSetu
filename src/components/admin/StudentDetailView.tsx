import React, { useState, useMemo } from 'react';
import { User } from '../../types/user';
import { activityService } from '../../services/activityService';
import { UserInitialsBadge } from '../UserInitialsBadge';
import {
  ArrowLeft,
  BookOpen,
  Download,
  Video,
  Bookmark,
  Heart,
  Radio,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Edit,
  Power,
  Shield,
  GraduationCap,
  Mail,
  Building,
  Layers,
  Sparkles,
  FileText,
  AlertTriangle,
} from 'lucide-react';

export interface StudentDetailViewProps {
  student: User;
  onBack: () => void;
  onEdit: (student: User) => void;
  onToggleStatus: (student: User) => void;
  onNavigateToContent?: (contentId: string) => void;
}

export const StudentDetailView: React.FC<StudentDetailViewProps> = ({
  student,
  onBack,
  onEdit,
  onToggleStatus,
  onNavigateToContent,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'viewed' | 'downloads' | 'videos' | 'saved' | 'liked' | 'sessions' | 'rooms' | 'timeline'
  >('overview');

  const summary = useMemo(() => {
    return activityService.getStudentSummary(student.id);
  }, [student.id]);

  const lastActivityDate = useMemo(() => {
    const last = activityService.getLastActivity(student.id);
    return last ? new Date(last).toLocaleString() : 'No recent activity';
  }, [student.id]);

  return (
    <div id="student-detail-view" className="space-y-6 animate-fadeIn">
      {/* 1. TOP BAR WITH BACK BUTTON & ACTIONS */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <button
          id="back-to-students-btn"
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Back to Students List</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onEdit(student)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-300 hover:bg-purple-900/60 text-xs font-bold transition-all cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Student</span>
          </button>

          <button
            onClick={() => onToggleStatus(student)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              student.status === 'INACTIVE'
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-rose-950/60 border-rose-500/40 text-rose-300 hover:bg-rose-900/60'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{student.status === 'INACTIVE' ? 'Activate Account' : 'Deactivate Account'}</span>
          </button>
        </div>
      </div>

      {/* 2. STUDENT BASIC INFORMATION CARD (ZERO PROFILE PICTURES - INITIALS ONLY) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0c1020] border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <UserInitialsBadge name={student.name} size="xl" />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
                  {student.name}
                </h2>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border ${
                    student.status === 'INACTIVE'
                      ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {student.status || 'ACTIVE'}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-bold">
                  Student
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-mono text-cyan-300">{student.email}</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-white font-medium">{student.college}</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {student.course} • {student.branch} ({student.year})
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1 text-xs text-slate-400 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <div>
              <span className="text-slate-500">Registered: </span>
              <span className="font-mono text-slate-300">
                {new Date(student.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Last Activity: </span>
              <span className="font-mono text-cyan-400">{lastActivityDate}</span>
            </div>
          </div>
        </div>

        {student.bio && (
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] block mb-1">
              Student Bio & Academic Focus
            </span>
            {student.bio}
          </div>
        )}
      </div>

      {/* 3. LEARNING ACTIVITY METRICS SUMMARY */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-[#090e1c] border border-cyan-500/20 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1 text-cyan-400">
              <BookOpen className="w-3.5 h-3.5" /> Viewed
            </span>
          </div>
          <div className="text-2xl font-black font-['Outfit'] text-white">
            {summary.materialsViewedCount}
          </div>
          <span className="text-[10px] text-slate-500 block">Materials Opened</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#090e1c] border border-amber-500/20 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1 text-amber-400">
              <Download className="w-3.5 h-3.5" /> Downloads
            </span>
          </div>
          <div className="text-2xl font-black font-['Outfit'] text-white">
            {summary.pdfsDownloadedCount}
          </div>
          <span className="text-[10px] text-slate-500 block">PDFs Downloaded</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#090e1c] border border-purple-500/20 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1 text-purple-400">
              <Video className="w-3.5 h-3.5" /> Videos
            </span>
          </div>
          <div className="text-2xl font-black font-['Outfit'] text-white">
            {summary.videosWatchedCount}
          </div>
          <span className="text-[10px] text-slate-500 block">Lectures Watched</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#090e1c] border border-blue-500/20 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1 text-blue-400">
              <Bookmark className="w-3.5 h-3.5" /> Saved
            </span>
          </div>
          <div className="text-2xl font-black font-['Outfit'] text-white">
            {summary.materialsSavedCount}
          </div>
          <span className="text-[10px] text-slate-500 block">Bookmarked Items</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#090e1c] border border-rose-500/20 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1 text-rose-400">
              <Radio className="w-3.5 h-3.5" /> Live
            </span>
          </div>
          <div className="text-2xl font-black font-['Outfit'] text-white">
            {summary.liveSessionsJoinedCount}
          </div>
          <span className="text-[10px] text-slate-500 block">Live Sessions</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#090e1c] border border-emerald-500/20 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1 text-emerald-400">
              <Users className="w-3.5 h-3.5" /> Rooms
            </span>
          </div>
          <div className="text-2xl font-black font-['Outfit'] text-white">
            {summary.studyRoomsJoinedCount}
          </div>
          <span className="text-[10px] text-slate-500 block">Study Rooms</span>
        </div>
      </div>

      {/* 4. ACTIVITY BREAKDOWN TABS */}
      <div className="p-6 rounded-3xl bg-[#090d1a] border border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          {[
            { id: 'overview', label: 'All Learning History', count: summary.timeline.length },
            { id: 'viewed', label: 'Materials Viewed', count: summary.materialsViewedCount },
            { id: 'downloads', label: 'PDFs Downloaded', count: summary.pdfsDownloadedCount },
            { id: 'videos', label: 'Videos Watched', count: summary.videosWatchedCount },
            { id: 'saved', label: 'Saved Materials', count: summary.materialsSavedCount },
            { id: 'liked', label: 'Liked Materials', count: summary.materialsLikedCount },
            { id: 'sessions', label: 'Live Sessions', count: summary.liveSessionsJoinedCount },
            { id: 'rooms', label: 'Study Rooms', count: summary.studyRoomsJoinedCount },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{t.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                  activeTab === t.id ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW / TIMELINE */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Student Activity Timeline ({summary.timeline.length} Events)</span>
            </h4>

            {summary.timeline.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                No activity recorded yet for this student.
              </div>
            ) : (
              <div className="space-y-3">
                {summary.timeline.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-4 text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                        {ev.event_type.includes('DOWNLOAD') ? (
                          <Download className="w-4 h-4 text-amber-400" />
                        ) : ev.event_type.includes('VIDEO') ? (
                          <Video className="w-4 h-4 text-purple-400" />
                        ) : ev.event_type.includes('SAVED') ? (
                          <Bookmark className="w-4 h-4 text-blue-400" />
                        ) : ev.event_type.includes('LIKED') ? (
                          <Heart className="w-4 h-4 text-rose-400" />
                        ) : ev.event_type.includes('LIVE') ? (
                          <Radio className="w-4 h-4 text-rose-400" />
                        ) : ev.event_type.includes('ROOM') ? (
                          <Users className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <BookOpen className="w-4 h-4 text-cyan-400" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{ev.resource_title || 'Resource'}</span>
                          <span className="px-2 py-0.2 rounded bg-slate-800 text-[10px] font-mono text-cyan-300">
                            {ev.event_type.replace(/_/g, ' ')}
                          </span>
                        </div>
                        {ev.metadata && Object.keys(ev.metadata).length > 0 && (
                          <div className="text-[11px] text-slate-400 flex flex-wrap gap-2 pt-0.5">
                            {ev.metadata.subject && <span>Subject: {ev.metadata.subject}</span>}
                            {ev.metadata.fileName && <span>File: {ev.metadata.fileName}</span>}
                            {ev.metadata.fileSize && <span>Size: {ev.metadata.fileSize}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 shrink-0 text-right">
                      {new Date(ev.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VIEWED MATERIALS */}
        {activeTab === 'viewed' && (
          <div className="space-y-3">
            {summary.viewedMaterials.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                No materials viewed yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Material Title</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Viewed Date & Time</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {summary.viewedMaterials.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="p-3 font-semibold text-white">{m.title}</td>
                        <td className="p-3 text-slate-300">{m.subject}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 text-[10px] font-bold uppercase">
                            {m.contentType}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-400">
                          {new Date(m.viewedAt).toLocaleString()}
                        </td>
                        <td className="p-3 text-right">
                          {onNavigateToContent && (
                            <button
                              onClick={() => onNavigateToContent(m.id)}
                              className="text-cyan-400 hover:text-cyan-300 font-bold"
                            >
                              Inspect →
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DOWNLOADED PDFS */}
        {activeTab === 'downloads' && (
          <div className="space-y-3">
            {summary.downloadedPdfs.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                No PDFs downloaded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3">PDF Material Title</th>
                      <th className="p-3">File Name</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Download Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {summary.downloadedPdfs.map((pdf, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="p-3 font-semibold text-white">{pdf.title}</td>
                        <td className="p-3 font-mono text-amber-300">{pdf.fileName}</td>
                        <td className="p-3 text-slate-300">{pdf.subject}</td>
                        <td className="p-3 font-mono text-slate-400">
                          {new Date(pdf.downloadedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: VIDEOS WATCHED */}
        {activeTab === 'videos' && (
          <div className="space-y-3">
            {summary.watchedVideos.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                No video masterclasses watched yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Video Title</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3">Progress</th>
                      <th className="p-3">Watched Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {summary.watchedVideos.map((v, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="p-3 font-semibold text-white">{v.title}</td>
                        <td className="p-3 text-slate-300">{v.subject}</td>
                        <td className="p-3 font-mono text-purple-300">{v.duration}</td>
                        <td className="p-3 font-mono text-emerald-400">{v.progress}</td>
                        <td className="p-3 font-mono text-slate-400">
                          {new Date(v.watchedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SAVED MATERIALS */}
        {activeTab === 'saved' && (
          <div className="space-y-3">
            {summary.savedMaterials.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                No materials currently bookmarked.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Material Title</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Saved Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {summary.savedMaterials.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="p-3 font-semibold text-white">{s.title}</td>
                        <td className="p-3 text-slate-300">{s.subject}</td>
                        <td className="p-3 font-mono text-blue-300 uppercase">{s.contentType}</td>
                        <td className="p-3 font-mono text-slate-400">
                          {new Date(s.savedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: LIKED MATERIALS */}
        {activeTab === 'liked' && (
          <div className="space-y-3">
            {summary.likedMaterials.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                No materials liked yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Material Title</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Liked Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {summary.likedMaterials.map((l, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="p-3 font-semibold text-white">{l.title}</td>
                        <td className="p-3 text-slate-300">{l.subject}</td>
                        <td className="p-3 font-mono text-slate-400">
                          {new Date(l.likedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: LIVE SESSIONS */}
        {activeTab === 'sessions' && (
          <div className="space-y-3">
            {summary.liveSessions.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                No live doubt resolution sessions joined yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Session Title</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Joined Timestamp</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {summary.liveSessions.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="p-3 font-semibold text-white">{s.title}</td>
                        <td className="p-3 text-slate-300">{s.subject}</td>
                        <td className="p-3 text-slate-400">{s.date}</td>
                        <td className="p-3 font-mono text-slate-400">
                          {new Date(s.joinedAt).toLocaleString()}
                        </td>
                        <td className="p-3 font-mono text-rose-400 font-bold">{s.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 8: STUDY ROOMS */}
        {activeTab === 'rooms' && (
          <div className="space-y-3">
            {summary.studyRooms.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                No study rooms joined yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Study Room Name</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Joined Timestamp</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {summary.studyRooms.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="p-3 font-semibold text-white">{r.name}</td>
                        <td className="p-3 text-slate-300">{r.subject}</td>
                        <td className="p-3 font-mono text-slate-400">
                          {new Date(r.joinedAt).toLocaleString()}
                        </td>
                        <td className="p-3 font-mono text-emerald-400 font-bold">{r.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
