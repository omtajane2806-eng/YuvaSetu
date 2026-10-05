import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Download,
  Filter,
  Search,
  Users,
  BookOpen,
  Radio,
  HelpCircle,
  Clock,
  Layers,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Shield,
  FileText,
} from 'lucide-react';
import { DateRangeSelector } from '../components/analytics/DateRangeSelector';
import { DateRangeFilter, ReportCategory } from '../types/analytics';
import { analyticsService } from '../services/analyticsService';
import { authService } from '../services/authService';
import { contentService } from '../services/contentService';
import { sessionRoomService } from '../services/sessionRoomService';
import { doubtService } from '../services/doubtService';
import { UserInitialsBadge } from '../components/UserInitialsBadge';
import { User } from '../types/user';

interface AdminReportsViewProps {
  currentUser: User | null;
  onNavigate: (view: string, payload?: any) => void;
}

export const AdminReportsView: React.FC<AdminReportsViewProps> = ({
  currentUser,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory>('students');
  const [dateFilter, setDateFilter] = useState<DateRangeFilter>({ preset: '30d' });
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const { start, end, label: dateWindowLabel } = analyticsService.getDateWindow(dateFilter);

  // 1. STUDENT REPORT DATA
  const studentReportData = useMemo(() => {
    const rankings = analyticsService.getStudentEngagementRankings(dateFilter);
    return rankings.filter((s) => {
      const matchSearch =
        !searchQuery.trim() ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.college.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [dateFilter, searchQuery, statusFilter]);

  // 2. STUDY MATERIAL REPORT DATA
  const materialReportData = useMemo(() => {
    const materials = contentService.getAllContent(true);
    const events = analyticsService.getFilteredEvents(dateFilter);

    return materials
      .filter((m) => {
        const matchSearch =
          !searchQuery.trim() ||
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.subject_name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchSubject = subjectFilter === 'ALL' || m.subject_name === subjectFilter;
        const matchStatus = statusFilter === 'ALL' || m.status === statusFilter;
        return matchSearch && matchSubject && matchStatus;
      })
      .map((m) => {
        const mEvents = events.filter((e) => e.resource_id === m.id);
        const views = mEvents.filter((e) => e.event_type === 'MATERIAL_VIEWED').length;
        const downloads = mEvents.filter((e) => e.event_type === 'PDF_DOWNLOADED').length;
        const saves = mEvents.filter((e) => e.event_type === 'MATERIAL_SAVED').length;
        const likes = mEvents.filter((e) => e.event_type === 'MATERIAL_LIKED').length;

        return {
          id: m.id,
          title: m.title,
          subject: m.subject_name || 'General',
          type: m.content_type || 'note',
          status: m.status,
          views,
          downloads,
          saves,
          likes,
          createdAt: m.created_at,
          publishedAt: m.created_at,
        };
      });
  }, [dateFilter, searchQuery, subjectFilter, statusFilter]);

  // 3. LIVE SESSION REPORT DATA
  const liveSessionReportData = useMemo(() => {
    const sessions = sessionRoomService.getLiveSessions(true);
    const events = analyticsService.getFilteredEvents(dateFilter);

    return sessions
      .filter((s) => {
        const matchSearch =
          !searchQuery.trim() ||
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.subject.toLowerCase().includes(searchQuery.toLowerCase());
        const matchSubject = subjectFilter === 'ALL' || s.subject === subjectFilter;
        const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
        return matchSearch && matchSubject && matchStatus;
      })
      .map((s) => {
        const joins = events.filter(
          (e) => e.event_type === 'LIVE_SESSION_JOINED' && e.resource_id === s.id
        ).length;
        return {
          id: s.id,
          title: s.title,
          subject: s.subject,
          date: s.date,
          status: s.status,
          participants: Math.max(s.attendeeCount || 0, joins),
          duration: s.duration,
          createdAt: s.createdAt,
        };
      });
  }, [dateFilter, searchQuery, subjectFilter, statusFilter]);

  // 4. STUDY ROOM REPORT DATA
  const studyRoomReportData = useMemo(() => {
    const rooms = sessionRoomService.getStudyRooms(true);
    const events = analyticsService.getFilteredEvents(dateFilter);

    return rooms
      .filter((r) => {
        const matchSearch =
          !searchQuery.trim() ||
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.subject.toLowerCase().includes(searchQuery.toLowerCase());
        const matchSubject = subjectFilter === 'ALL' || r.subject === subjectFilter;
        const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
        return matchSearch && matchSubject && matchStatus;
      })
      .map((r) => {
        const joins = events.filter(
          (e) => e.event_type === 'STUDY_ROOM_JOINED' && e.resource_id === r.id
        ).length;
        return {
          id: r.id,
          name: r.name,
          subject: r.subject,
          status: r.status,
          participants: Math.max(r.activeParticipants || 0, joins),
          sessions: 1,
          createdAt: r.createdAt,
        };
      });
  }, [dateFilter, searchQuery, subjectFilter, statusFilter]);

  // 5. DOUBT REPORT DATA
  const doubtReportData = useMemo(() => {
    const doubts = doubtService.getAllDoubts();

    return doubts.filter((d) => {
      const matchSearch =
        !searchQuery.trim() ||
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.subject_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSubject = subjectFilter === 'ALL' || d.subject_name === subjectFilter;
      const matchStatus = statusFilter === 'ALL' || d.status === statusFilter;
      return matchSearch && matchSubject && matchStatus;
    });
  }, [searchQuery, subjectFilter, statusFilter]);

  // 6. ACTIVITY REPORT DATA
  const activityReportData = useMemo(() => {
    const events = analyticsService.getFilteredEvents(dateFilter);
    return events.filter((e) => {
      const matchSearch =
        !searchQuery.trim() ||
        (e.user_name && e.user_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (e.resource_title && e.resource_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        e.event_type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [dateFilter, searchQuery]);

  // Total items based on selected category
  const currentTotal = useMemo(() => {
    switch (selectedCategory) {
      case 'students':
        return studentReportData.length;
      case 'materials':
        return materialReportData.length;
      case 'live_sessions':
        return liveSessionReportData.length;
      case 'study_rooms':
        return studyRoomReportData.length;
      case 'doubts':
        return doubtReportData.length;
      case 'activity':
        return activityReportData.length;
      default:
        return 0;
    }
  }, [
    selectedCategory,
    studentReportData,
    materialReportData,
    liveSessionReportData,
    studyRoomReportData,
    doubtReportData,
    activityReportData,
  ]);

  const totalPages = Math.max(1, Math.ceil(currentTotal / pageSize));
  const paginatedIndex = (currentPage - 1) * pageSize;

  // CSV EXPORT ACTION
  const handleExportCsv = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let fileName = `YuvaSetu_${selectedCategory}_Report`;

    if (selectedCategory === 'students') {
      headers = [
        'Student ID',
        'Student Name',
        'Email',
        'College',
        'Course',
        'Year',
        'Status',
        'Registration Date',
        'Last Activity',
        'Materials Viewed',
        'Downloads',
        'Sessions Joined',
        'Rooms Joined',
        'Doubts Asked',
        'Total Actions',
      ];
      rows = studentReportData.map((s) => [
        s.id,
        s.name,
        s.email,
        s.college,
        s.course,
        s.year,
        s.status,
        s.registrationDate,
        s.lastActivity || 'None Recorded',
        s.materialsViewed,
        s.downloads,
        s.sessionsJoined,
        s.studyRoomsJoined,
        s.doubtsAsked,
        s.totalActions,
      ]);
    } else if (selectedCategory === 'materials') {
      headers = [
        'Material ID',
        'Title',
        'Subject',
        'Type',
        'Status',
        'Views',
        'Downloads',
        'Saves',
        'Likes',
        'Created Date',
        'Published Date',
      ];
      rows = materialReportData.map((m) => [
        m.id,
        m.title,
        m.subject,
        m.type,
        m.status,
        m.views,
        m.downloads,
        m.saves,
        m.likes,
        m.createdAt,
        m.publishedAt,
      ]);
    } else if (selectedCategory === 'live_sessions') {
      headers = [
        'Session ID',
        'Title',
        'Subject',
        'Date',
        'Status',
        'Participants',
        'Duration',
        'Created Date',
      ];
      rows = liveSessionReportData.map((s) => [
        s.id,
        s.title,
        s.subject,
        s.date,
        s.status,
        s.participants,
        s.duration,
        s.createdAt,
      ]);
    } else if (selectedCategory === 'study_rooms') {
      headers = [
        'Room ID',
        'Name',
        'Subject',
        'Status',
        'Participants',
        'Sessions Count',
        'Created Date',
      ];
      rows = studyRoomReportData.map((r) => [
        r.id,
        r.name,
        r.subject,
        r.status,
        r.participants,
        r.sessions,
        r.createdAt,
      ]);
    } else if (selectedCategory === 'doubts') {
      headers = [
        'Doubt ID',
        'Question Title',
        'Subject',
        'Student Name',
        'Status',
        'Answers Count',
        'Created Date',
        'Has Accepted Answer',
      ];
      rows = doubtReportData.map((d) => [
        d.id,
        d.title,
        d.subject_name,
        d.student_name,
        d.status,
        d.answers_count || 0,
        d.created_at,
        d.has_accepted_answer ? 'Yes' : 'No',
      ]);
    } else if (selectedCategory === 'activity') {
      headers = [
        'Event ID',
        'Timestamp',
        'User Name',
        'User Email',
        'Event Type',
        'Resource Type',
        'Resource ID',
        'Resource Title',
        'Subject',
      ];
      rows = activityReportData.map((e) => [
        e.id,
        e.created_at,
        e.user_name || 'N/A',
        e.user_email || 'N/A',
        e.event_type,
        e.resource_type,
        e.resource_id,
        e.resource_title || 'N/A',
        e.metadata?.subject || 'N/A',
      ]);
    }

    const csvContent = analyticsService.generateCsvContent(headers, rows);
    analyticsService.downloadCsv(fileName, csvContent);
  };

  return (
    <div
      id="vidyasetu-admin-reports-root"
      className="min-h-screen bg-[#070913] text-slate-100 pb-20 selection:bg-cyan-500 selection:text-white"
    >
      {/* TOP HEADER */}
      <div className="border-b border-slate-800/80 bg-[#0a0e1c]/80 backdrop-blur-xl sticky top-18 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white tracking-tight">
                    Admin Reports Center
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Generate, inspect, and export verified system records to CSV
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleExportCsv}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV ({currentTotal} Rows)</span>
              </button>

              <button
                onClick={() => onNavigate('admin_analytics')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                ← Back to Analytics
              </button>
            </div>
          </div>

          {/* REPORT CATEGORY TABS */}
          <div className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-slate-800/60 pt-3">
            {[
              { id: 'students', label: 'Student Report', icon: Users },
              { id: 'materials', label: 'Study Material Report', icon: BookOpen },
              { id: 'live_sessions', label: 'Live Session Report', icon: Radio },
              { id: 'study_rooms', label: 'Study Room Report', icon: Users },
              { id: 'doubts', label: 'Doubt Report', icon: HelpCircle },
              { id: 'activity', label: 'Activity Audit Report', icon: Clock },
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id as any);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-black'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* FILTER & DATA CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* FILTER BAR */}
        <div className="p-4 rounded-2xl bg-[#0a0e1e] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <DateRangeSelector value={dateFilter} onChange={setDateFilter} />

            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search report records..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Status Filter if applicable */}
            {(selectedCategory === 'students' ||
              selectedCategory === 'materials' ||
              selectedCategory === 'doubts' ||
              selectedCategory === 'live_sessions' ||
              selectedCategory === 'study_rooms') && (
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
              >
                <option value="ALL">All Statuses</option>
                {selectedCategory === 'students' && (
                  <>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </>
                )}
                {selectedCategory === 'materials' && (
                  <>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </>
                )}
                {selectedCategory === 'doubts' && (
                  <>
                    <option value="OPEN">OPEN</option>
                    <option value="ANSWERED">ANSWERED</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </>
                )}
                {selectedCategory === 'live_sessions' && (
                  <>
                    <option value="SCHEDULED">SCHEDULED</option>
                    <option value="LIVE">LIVE</option>
                    <option value="ENDED">ENDED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </>
                )}
                {selectedCategory === 'study_rooms' && (
                  <>
                    <option value="LIVE">LIVE</option>
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="ENDED">ENDED</option>
                  </>
                )}
              </select>
            )}
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Showing <strong className="text-white">{currentTotal}</strong> records in window (
            {dateWindowLabel})
          </div>
        </div>

        {/* DATA TABLE CONTAINER */}
        <div className="rounded-3xl bg-[#0a0e1e] border border-slate-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            {/* 1. STUDENT REPORT TABLE */}
            {selectedCategory === 'students' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3.5 font-semibold">Student</th>
                    <th className="p-3.5 font-semibold">Email</th>
                    <th className="p-3.5 font-semibold">College & Year</th>
                    <th className="p-3.5 font-semibold">Status</th>
                    <th className="p-3.5 font-semibold text-center">Views</th>
                    <th className="p-3.5 font-semibold text-center">Downloads</th>
                    <th className="p-3.5 font-semibold text-center">Sessions</th>
                    <th className="p-3.5 font-semibold text-center">Rooms</th>
                    <th className="p-3.5 font-semibold text-center">Doubts</th>
                    <th className="p-3.5 font-semibold text-right">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {studentReportData.slice(paginatedIndex, paginatedIndex + pageSize).map((s) => (
                    <tr key={s.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3.5 font-bold text-white flex items-center gap-2">
                        <UserInitialsBadge name={s.name} role="student" size="xs" />
                        <span>{s.name}</span>
                      </td>
                      <td className="p-3.5 text-slate-400 font-mono">{s.email}</td>
                      <td className="p-3.5 text-slate-300">
                        {s.college} ({s.year})
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.status === 'ACTIVE'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-mono text-cyan-400">{s.materialsViewed}</td>
                      <td className="p-3.5 text-center font-mono text-blue-400">{s.downloads}</td>
                      <td className="p-3.5 text-center font-mono text-cyan-300">{s.sessionsJoined}</td>
                      <td className="p-3.5 text-center font-mono text-purple-300">{s.studyRoomsJoined}</td>
                      <td className="p-3.5 text-center font-mono text-amber-300">{s.doubtsAsked}</td>
                      <td className="p-3.5 text-right font-mono text-slate-400">
                        {s.lastActivity ? new Date(s.lastActivity).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 2. STUDY MATERIAL REPORT TABLE */}
            {selectedCategory === 'materials' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3.5 font-semibold">Material Title</th>
                    <th className="p-3.5 font-semibold">Subject</th>
                    <th className="p-3.5 font-semibold">Type</th>
                    <th className="p-3.5 font-semibold">Status</th>
                    <th className="p-3.5 font-semibold text-center">Views</th>
                    <th className="p-3.5 font-semibold text-center">Downloads</th>
                    <th className="p-3.5 font-semibold text-center">Saves</th>
                    <th className="p-3.5 font-semibold text-center">Likes</th>
                    <th className="p-3.5 font-semibold text-right">Published</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {materialReportData.slice(paginatedIndex, paginatedIndex + pageSize).map((m) => (
                    <tr key={m.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3.5 font-bold text-white max-w-xs truncate">{m.title}</td>
                      <td className="p-3.5 text-slate-300">{m.subject}</td>
                      <td className="p-3.5 uppercase font-mono text-cyan-300">{m.type}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            m.status === 'published'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-mono text-cyan-400">{m.views}</td>
                      <td className="p-3.5 text-center font-mono text-blue-400">{m.downloads}</td>
                      <td className="p-3.5 text-center font-mono text-purple-300">{m.saves}</td>
                      <td className="p-3.5 text-center font-mono text-rose-300">{m.likes}</td>
                      <td className="p-3.5 text-right font-mono text-slate-400">
                        {new Date(m.publishedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 3. LIVE SESSION REPORT TABLE */}
            {selectedCategory === 'live_sessions' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3.5 font-semibold">Session Title</th>
                    <th className="p-3.5 font-semibold">Subject</th>
                    <th className="p-3.5 font-semibold">Date</th>
                    <th className="p-3.5 font-semibold">Status</th>
                    <th className="p-3.5 font-semibold text-center">Participants</th>
                    <th className="p-3.5 font-semibold text-right">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {liveSessionReportData
                    .slice(paginatedIndex, paginatedIndex + pageSize)
                    .map((s) => (
                      <tr key={s.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-3.5 font-bold text-white">{s.title}</td>
                        <td className="p-3.5 text-slate-300">{s.subject}</td>
                        <td className="p-3.5 text-slate-400">{s.date}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                            {s.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-center font-mono font-bold text-cyan-400">
                          {s.participants}
                        </td>
                        <td className="p-3.5 text-right font-mono text-slate-400">{s.duration}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}

            {/* 4. STUDY ROOM REPORT TABLE */}
            {selectedCategory === 'study_rooms' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3.5 font-semibold">Room Name</th>
                    <th className="p-3.5 font-semibold">Subject</th>
                    <th className="p-3.5 font-semibold">Status</th>
                    <th className="p-3.5 font-semibold text-center">Participants</th>
                    <th className="p-3.5 font-semibold text-right">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {studyRoomReportData.slice(paginatedIndex, paginatedIndex + pageSize).map((r) => (
                    <tr key={r.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3.5 font-bold text-white">{r.name}</td>
                      <td className="p-3.5 text-slate-300">{r.subject}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-mono font-bold text-purple-300">
                        {r.participants}
                      </td>
                      <td className="p-3.5 text-right font-mono text-slate-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 5. DOUBT REPORT TABLE */}
            {selectedCategory === 'doubts' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3.5 font-semibold">Question Title</th>
                    <th className="p-3.5 font-semibold">Subject</th>
                    <th className="p-3.5 font-semibold">Asked By</th>
                    <th className="p-3.5 font-semibold">Status</th>
                    <th className="p-3.5 font-semibold text-center">Answers</th>
                    <th className="p-3.5 font-semibold text-right">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {doubtReportData.slice(paginatedIndex, paginatedIndex + pageSize).map((d) => (
                    <tr key={d.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3.5 font-bold text-white max-w-sm truncate">{d.title}</td>
                      <td className="p-3.5 text-slate-300">{d.subject_name}</td>
                      <td className="p-3.5 text-slate-300">{d.student_name}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            d.status === 'RESOLVED'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : d.status === 'ANSWERED'
                              ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-mono text-cyan-400">
                        {d.answers_count || 0}
                      </td>
                      <td className="p-3.5 text-right font-mono text-slate-400">
                        {new Date(d.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 6. ACTIVITY AUDIT REPORT TABLE */}
            {selectedCategory === 'activity' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3.5 font-semibold">Timestamp</th>
                    <th className="p-3.5 font-semibold">User</th>
                    <th className="p-3.5 font-semibold">Event Type</th>
                    <th className="p-3.5 font-semibold">Resource</th>
                    <th className="p-3.5 font-semibold text-right">Subject</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {activityReportData.slice(paginatedIndex, paginatedIndex + pageSize).map((e) => (
                    <tr key={e.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3.5 font-mono text-slate-400">
                        {new Date(e.created_at).toLocaleString()}
                      </td>
                      <td className="p-3.5 font-bold text-white">{e.user_name || 'System'}</td>
                      <td className="p-3.5 font-mono font-bold text-cyan-300">{e.event_type}</td>
                      <td className="p-3.5 text-slate-300 max-w-xs truncate">
                        {e.resource_title || e.resource_id}
                      </td>
                      <td className="p-3.5 text-right text-slate-400 font-medium">
                        {e.metadata?.subject || 'General'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Page <strong className="text-white">{currentPage}</strong> of{' '}
                <strong className="text-white">{totalPages}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
