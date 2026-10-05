import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  FileText,
  Radio,
  HelpCircle,
  Clock,
  Eye,
  Download,
  Bookmark,
  Heart,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Shield,
  Layers,
  Sparkles,
  Search,
  Filter,
  RefreshCw,
  Video,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { DateRangeSelector } from '../components/analytics/DateRangeSelector';
import { DateRangeFilter } from '../types/analytics';
import { analyticsService } from '../services/analyticsService';
import { activityService } from '../services/activityService';
import { aiService } from '../services/aiService';
import { UserInitialsBadge } from '../components/UserInitialsBadge';
import { User } from '../types/user';

interface AdminAnalyticsViewProps {
  currentUser: User | null;
  onNavigate: (view: string, payload?: any) => void;
}

export const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps> = ({
  currentUser,
  onNavigate,
}) => {
  // Date range filter state (default 30 days)
  const [dateFilter, setDateFilter] = useState<DateRangeFilter>({ preset: '30d' });
  const [activeSection, setActiveSection] = useState<
    'overview' | 'students' | 'materials' | 'live' | 'doubts' | 'subjects' | 'ai' | 'admin_audit'
  >('overview');
  const [growthGranularity, setGrowthGranularity] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [searchQuery, setSearchQuery] = useState('');

  // AI telemetry
  const aiStats = useMemo(() => aiService.getAIStatsOverview(), []);

  // Re-compute all analytics when dateFilter changes
  const overview = useMemo(() => analyticsService.getPlatformOverview(dateFilter), [dateFilter]);
  const growthData = useMemo(
    () => analyticsService.getStudentGrowthData(dateFilter, growthGranularity),
    [dateFilter, growthGranularity]
  );
  const activityCategories = useMemo(
    () => analyticsService.getActivityCategories(dateFilter),
    [dateFilter]
  );
  const activityTrend = useMemo(
    () => analyticsService.getActivityTrend(dateFilter),
    [dateFilter]
  );
  const materialPopularity = useMemo(
    () => analyticsService.getMaterialPopularity(dateFilter),
    [dateFilter]
  );
  const subjectAnalytics = useMemo(
    () => analyticsService.getSubjectAnalytics(dateFilter),
    [dateFilter]
  );
  const videoAnalytics = useMemo(
    () => analyticsService.getVideoAnalytics(dateFilter),
    [dateFilter]
  );
  const liveSessionAnalytics = useMemo(
    () => analyticsService.getLiveSessionAnalytics(dateFilter),
    [dateFilter]
  );
  const studyRoomAnalytics = useMemo(
    () => analyticsService.getStudyRoomAnalytics(dateFilter),
    [dateFilter]
  );
  const doubtsBySubject = useMemo(
    () => analyticsService.getDoubtsBySubject(dateFilter),
    [dateFilter]
  );
  const adminActivity = useMemo(
    () => analyticsService.getAdminActivityAnalytics(dateFilter),
    [dateFilter]
  );
  const studentRankings = useMemo(
    () => analyticsService.getStudentEngagementRankings(dateFilter),
    [dateFilter]
  );
  const recentEvents = useMemo(
    () => analyticsService.getFilteredEvents(dateFilter).slice(0, 15),
    [dateFilter]
  );

  const { label: dateWindowLabel } = analyticsService.getDateWindow(dateFilter);

  // Filtered student rankings by search query
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return studentRankings;
    const q = searchQuery.toLowerCase();
    return studentRankings.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.college.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q)
    );
  }, [studentRankings, searchQuery]);

  return (
    <div
      id="vidyasetu-admin-analytics-root"
      className="min-h-screen bg-[#070913] text-slate-100 pb-20 selection:bg-cyan-500 selection:text-white"
    >
      {/* TOP BANNER / HEADER */}
      <div className="border-b border-slate-800/80 bg-[#0a0e1c]/80 backdrop-blur-xl sticky top-18 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white tracking-tight">
                    YuvaSetu Analytics
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Understand how students are learning and how the platform is being used.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <DateRangeSelector value={dateFilter} onChange={setDateFilter} />

              <button
                onClick={() => onNavigate('admin_reports')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                <span>View Full Reports & CSV</span>
              </button>
            </div>
          </div>

          {/* ACTIVE DATE WINDOW BADGE & SUB-NAV TABS */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
            {/* Section tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {[
                { id: 'overview', label: 'Platform Overview', icon: Layers },
                { id: 'students', label: 'Student Analytics', icon: Users },
                { id: 'materials', label: 'Study Materials', icon: BookOpen },
                { id: 'live', label: 'Live & Study Rooms', icon: Radio },
                { id: 'doubts', label: 'Doubt Desk', icon: HelpCircle },
                { id: 'subjects', label: 'Subjects & Videos', icon: Video },
                { id: 'ai', label: 'AI Learning Telemetry', icon: Sparkles },
                { id: 'admin_audit', label: 'Admin Activity', icon: Shield },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-800">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Window:</span>
              <strong className="text-slate-200 font-bold">{dateWindowLabel}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* ============================================================== */}
        {/* 1. PLATFORM OVERVIEW & TOP METRIC CARDS (ALL 12 REAL METRICS) */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black font-['Outfit'] text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span>Platform Performance Metrics</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">Real tracked metrics</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
            {/* Total Students */}
            <div className="p-4 rounded-2xl bg-[#0b0f1e] border border-slate-800/80 shadow-lg space-y-1">
              <span className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
                Total Students
                <Users className="w-3.5 h-3.5 text-cyan-400" />
              </span>
              <div className="text-2xl font-black font-['Outfit'] text-white">
                {overview.totalStudents}
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Registered in database</p>
            </div>

            {/* New Students in Range */}
            <div className="p-4 rounded-2xl bg-[#0b0f1e] border border-cyan-500/30 shadow-lg space-y-1">
              <span className="text-[11px] font-bold text-cyan-300 flex items-center justify-between">
                New Students
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </span>
              <div className="text-2xl font-black font-['Outfit'] text-cyan-400">
                +{overview.newStudents}
              </div>
              <p className="text-[10px] text-slate-400 font-medium">In selected window</p>
            </div>

            {/* Active Students */}
            <div className="p-4 rounded-2xl bg-[#0b0f1e] border border-emerald-500/30 shadow-lg space-y-1">
              <span className="text-[11px] font-bold text-emerald-300 flex items-center justify-between">
                Active Students
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </span>
              <div className="text-2xl font-black font-['Outfit'] text-emerald-400">
                {overview.activeStudents}
              </div>
              <p className="text-[10px] text-slate-400 font-medium">With recorded activity</p>
            </div>

            {/* Inactive Students */}
            <div className="p-4 rounded-2xl bg-[#0b0f1e] border border-slate-800/80 shadow-lg space-y-1">
              <span className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
                Inactive Students
                <Clock className="w-3.5 h-3.5 text-slate-500" />
              </span>
              <div className="text-2xl font-black font-['Outfit'] text-slate-400">
                {overview.inactiveStudents}
              </div>
              <p className="text-[10px] text-slate-500 font-medium">No actions in window</p>
            </div>

            {/* Material Views */}
            <div className="p-4 rounded-2xl bg-[#0b0f1e] border border-cyan-500/20 shadow-lg space-y-1">
              <span className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                Material Views
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
              </span>
              <div className="text-2xl font-black font-['Outfit'] text-white">
                {overview.totalMaterialViews}
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Verified view events</p>
            </div>

            {/* PDF Downloads */}
            <div className="p-4 rounded-2xl bg-[#0b0f1e] border border-blue-500/30 shadow-lg space-y-1">
              <span className="text-[11px] font-bold text-blue-300 flex items-center justify-between">
                PDF Downloads
                <Download className="w-3.5 h-3.5 text-blue-400" />
              </span>
              <div className="text-2xl font-black font-['Outfit'] text-blue-400">
                {overview.totalPdfDownloads}
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Handouts downloaded</p>
            </div>

            {/* Total Study Materials */}
            <div className="p-4 rounded-2xl bg-[#0b0f1e] border border-slate-800/80 shadow-lg space-y-1">
              <span className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
                Total Materials
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              </span>
              <div className="text-2xl font-black font-['Outfit'] text-white">
                {overview.totalMaterials}
              </div>
              <p className="text-[10px] text-slate-400 font-medium">{overview.publishedMaterials} published</p>
            </div>

            {/* Live Sessions */}
            <div className="p-4 rounded-2xl bg-[#0b0f1e] border border-cyan-500/30 shadow-lg space-y-1">
              <span className="text-[11px] font-bold text-cyan-300 flex items-center justify-between">
                Live Sessions
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
              </span>
              <div className="text-2xl font-black font-['Outfit'] text-cyan-400">
                {overview.totalLiveSessions}
              </div>
              <p className="text-[10px] text-slate-400 font-medium">{overview.totalSessionJoins} total joins</p>
            </div>

            {/* Study Room Joins */}
            <div className="p-4 rounded-2xl bg-[#0b0f1e] border border-purple-500/30 shadow-lg space-y-1">
              <span className="text-[11px] font-bold text-purple-300 flex items-center justify-between">
                Room Participation
                <Users className="w-3.5 h-3.5 text-purple-400" />
              </span>
              <div className="text-2xl font-black font-['Outfit'] text-purple-400">
                {overview.totalStudyRoomJoins}
              </div>
              <p className="text-[10px] text-slate-400 font-medium">{overview.uniqueStudentsInRooms} unique learners</p>
            </div>

            {/* Doubts Submitted */}
            <div className="p-4 rounded-2xl bg-[#0b0f1e] border border-amber-500/30 shadow-lg space-y-1">
              <span className="text-[11px] font-bold text-amber-300 flex items-center justify-between">
                Doubts Submitted
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              </span>
              <div className="text-2xl font-black font-['Outfit'] text-amber-400">
                {overview.totalDoubts}
              </div>
              <p className="text-[10px] text-slate-400 font-medium">{overview.openDoubts} open awaiting reply</p>
            </div>

            {/* Doubts Resolved */}
            <div className="p-4 rounded-2xl bg-[#0b0f1e] border border-emerald-500/30 shadow-lg space-y-1">
              <span className="text-[11px] font-bold text-emerald-300 flex items-center justify-between">
                Doubts Resolved
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </span>
              <div className="text-2xl font-black font-['Outfit'] text-emerald-400">
                {overview.resolvedDoubts}
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Verified solutions</p>
            </div>

            {/* Avg Response Time */}
            <div className="p-4 rounded-2xl bg-[#0b0f1e] border border-slate-800/80 shadow-lg space-y-1">
              <span className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                Avg Response Time
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
              </span>
              <div className="text-2xl font-black font-['Outfit'] text-white">
                {overview.avgDoubtResponseTimeMinutes !== null
                  ? `${overview.avgDoubtResponseTimeMinutes}m`
                  : 'N/A'}
              </div>
              <p className="text-[10px] text-slate-400 font-medium truncate">
                {overview.avgDoubtResponseTimeMinutes !== null
                  ? 'First response time'
                  : 'Response-time data unavailable'}
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 2. CHARTS: STUDENT GROWTH & ACTIVITY DISTRIBUTION */}
        {/* ============================================================== */}
        {(activeSection === 'overview' || activeSection === 'students') && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student Growth Chart */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0a0e1e] border border-slate-800/80 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black font-['Outfit'] text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>Student Registration Growth</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real time-series of student sign-ups on YuvaSetu
                  </p>
                </div>

                {/* Granularity Switcher */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-bold">
                  {(['daily', 'weekly', 'monthly'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGrowthGranularity(g)}
                      className={`px-2.5 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                        growthGranularity === g
                          ? 'bg-cyan-500 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {growthData.length > 0 ? (
                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0c1222',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          fontSize: '12px',
                          color: '#f8fafc',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="cumulative"
                        name="Total Registered Students"
                        stroke="#06b6d4"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#growthGrad)"
                      />
                      <Line
                        type="monotone"
                        dataKey="registrations"
                        name="New Signups"
                        stroke="#38bdf8"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-slate-500 text-xs">
                  <AlertTriangle className="w-6 h-6 text-amber-500/60 mb-2" />
                  <p>No historical registration data available in this window.</p>
                </div>
              )}
            </div>

            {/* Activity Category Distribution */}
            <div className="p-6 rounded-3xl bg-[#0a0e1e] border border-slate-800/80 shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-black font-['Outfit'] text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span>Activity by Event Category</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Actual breakdown from Module 6 audit stream
                </p>
              </div>

              <div className="h-52 w-full flex items-center justify-center">
                {activityCategories.some((c) => c.count > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={activityCategories}
                        dataKey="count"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                      >
                        {activityCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0c1222',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          fontSize: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-slate-500 text-xs text-center">
                    No activity recorded in this period.
                  </div>
                )}
              </div>

              {/* Legend List */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                {activityCategories.map((c) => (
                  <div key={c.category} className="flex items-center gap-2 text-xs">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="text-slate-300 truncate">{c.category}:</span>
                    <span className="font-mono font-bold text-white ml-auto">{c.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* 3. STUDY MATERIAL ANALYTICS (MOST VIEWED, DOWNLOADED, SAVED, ENGAGED) */}
        {/* ============================================================== */}
        {(activeSection === 'overview' || activeSection === 'materials') && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-black font-['Outfit'] text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  <span>Study Material Performance & Popularity</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Real views, PDF downloads, saves, and transparent engagement formula
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Engagement = Views + Downloads + Saves + Likes
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Most Viewed Materials */}
              <div className="p-6 rounded-3xl bg-[#0a0e1e] border border-slate-800/80 shadow-xl space-y-3">
                <h4 className="text-sm font-bold text-slate-200 flex items-center justify-between">
                  <span>Most Viewed Study Materials</span>
                  <Eye className="w-4 h-4 text-cyan-400" />
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-2 font-semibold">Material Title</th>
                        <th className="pb-2 font-semibold">Subject</th>
                        <th className="pb-2 font-semibold text-right">Views</th>
                        <th className="pb-2 font-semibold text-right">Downloads</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {materialPopularity.mostViewed.slice(0, 5).map((m) => (
                        <tr key={m.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-2.5 pr-2 font-medium text-white max-w-[200px] truncate">
                            {m.title}
                          </td>
                          <td className="py-2.5 pr-2 text-slate-400 truncate">{m.subject}</td>
                          <td className="py-2.5 text-right font-mono font-bold text-cyan-400">
                            {m.views}
                          </td>
                          <td className="py-2.5 text-right font-mono text-slate-300">
                            {m.downloads}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Most Engaged Materials (Transparent Formula) */}
              <div className="p-6 rounded-3xl bg-[#0a0e1e] border border-slate-800/80 shadow-xl space-y-3">
                <h4 className="text-sm font-bold text-slate-200 flex items-center justify-between">
                  <span>Most Engaged Materials</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-2 font-semibold">Material Title</th>
                        <th className="pb-2 font-semibold text-center">Saves</th>
                        <th className="pb-2 font-semibold text-center">Likes</th>
                        <th className="pb-2 font-semibold text-right">Engagement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {materialPopularity.mostEngaged.slice(0, 5).map((m) => (
                        <tr key={m.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-2.5 pr-2 font-medium text-white max-w-[200px] truncate">
                            {m.title}
                          </td>
                          <td className="py-2.5 text-center font-mono text-purple-300">{m.saves}</td>
                          <td className="py-2.5 text-center font-mono text-rose-300">{m.likes}</td>
                          <td className="py-2.5 text-right font-mono font-black text-amber-400">
                            {m.engagementScore}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* 4. LIVE LEARNING & STUDY ROOM ANALYTICS */}
        {/* ============================================================== */}
        {(activeSection === 'overview' || activeSection === 'live') && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Sessions Performance */}
            <div className="p-6 rounded-3xl bg-[#0a0e1e] border border-cyan-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black font-['Outfit'] text-white flex items-center gap-2">
                    <Radio className="w-5 h-5 text-cyan-400" />
                    <span>Popular Live Sessions</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live broadcasts sorted by verified participant count
                  </p>
                </div>
                {liveSessionAnalytics.averageAttendance !== null && (
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Avg Attendance</span>
                    <span className="text-base font-mono font-black text-cyan-400">
                      {liveSessionAnalytics.averageAttendance} learners
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2.5">
                {liveSessionAnalytics.sessions.slice(0, 4).map((sess) => (
                  <div
                    key={sess.id}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="space-y-0.5 max-w-[70%]">
                      <div className="text-xs font-bold text-white truncate">{sess.title}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>{sess.subject}</span>
                        <span>•</span>
                        <span className="font-mono">{sess.duration}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
                        {sess.participants} Attendees
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Rooms Performance */}
            <div className="p-6 rounded-3xl bg-[#0a0e1e] border border-purple-500/30 shadow-xl space-y-4">
              <div>
                <h3 className="text-base font-black font-['Outfit'] text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span>Popular Study Rooms</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Peer study rooms sorted by active participant joins
                </p>
              </div>

              <div className="space-y-2.5">
                {studyRoomAnalytics.slice(0, 4).map((room) => (
                  <div
                    key={room.id}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="space-y-0.5 max-w-[70%]">
                      <div className="text-xs font-bold text-white truncate">{room.name}</div>
                      <div className="text-[11px] text-slate-400">{room.subject}</div>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
                        {room.participants} Joined
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* 5. DOUBT DESK & RESPONSE TIME ANALYTICS */}
        {/* ============================================================== */}
        {(activeSection === 'overview' || activeSection === 'doubts') && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Doubts by Subject Bar Chart */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0a0e1e] border border-amber-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black font-['Outfit'] text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-400" />
                    <span>Most Asked Doubt Subjects</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real question volume submitted across subjects
                  </p>
                </div>
              </div>

              {doubtsBySubject.length > 0 ? (
                <div className="h-56 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={doubtsBySubject.slice(0, 6)}
                      margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis
                        dataKey="subject"
                        stroke="#64748b"
                        tick={{ fontSize: 10 }}
                        angle={-15}
                        textAnchor="end"
                      />
                      <YAxis stroke="#64748b" tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0c1222',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="count" name="Total Doubts" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="resolvedCount" name="Resolved" fill="#10b981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-56 flex items-center justify-center text-slate-500 text-xs">
                  No doubt records available yet in this window.
                </div>
              )}
            </div>

            {/* Response Time & Status Breakdown */}
            <div className="p-6 rounded-3xl bg-[#0a0e1e] border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-black font-['Outfit'] text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <span>Doubt Resolution SLA</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calculated from DOUBT_CREATED to ANSWER_CREATED
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
                <span className="text-xs text-slate-400">Average Turnaround Time</span>
                <div className="text-3xl font-black font-['Outfit'] text-cyan-400">
                  {overview.avgDoubtResponseTimeMinutes !== null
                    ? `${overview.avgDoubtResponseTimeMinutes} mins`
                    : 'Unavailable'}
                </div>
                <p className="text-[11px] text-slate-500">
                  {overview.avgDoubtResponseTimeMinutes !== null
                    ? 'Based on real timestamp delta'
                    : 'Response-time data unavailable.'}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Open Doubts:</span>
                  <span className="font-mono font-bold text-amber-400">{overview.openDoubts}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Answered Doubts:</span>
                  <span className="font-mono font-bold text-blue-400">{overview.answeredDoubts}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Resolved Doubts:</span>
                  <span className="font-mono font-bold text-emerald-400">{overview.resolvedDoubts}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* 6. SUBJECT & VIDEO ANALYTICS */}
        {/* ============================================================== */}
        {(activeSection === 'overview' || activeSection === 'subjects') && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Subject Breakdown */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0a0e1e] border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-base font-black font-['Outfit'] text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>Popular Subjects (Multi-Channel Activity)</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-2 font-semibold">Subject</th>
                      <th className="pb-2 font-semibold text-center">Views</th>
                      <th className="pb-2 font-semibold text-center">Downloads</th>
                      <th className="pb-2 font-semibold text-center">Doubts</th>
                      <th className="pb-2 font-semibold text-right">Total Interactions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {subjectAnalytics.slice(0, 6).map((sub) => (
                      <tr key={sub.subject} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-2.5 font-bold text-slate-200">{sub.subject}</td>
                        <td className="py-2.5 text-center font-mono text-cyan-300">{sub.views}</td>
                        <td className="py-2.5 text-center font-mono text-blue-300">{sub.downloads}</td>
                        <td className="py-2.5 text-center font-mono text-amber-300">{sub.doubts}</td>
                        <td className="py-2.5 text-right font-mono font-black text-white">
                          {sub.totalActivity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Video Lecture Analytics */}
            <div className="p-6 rounded-3xl bg-[#0a0e1e] border border-slate-800 shadow-xl space-y-4">
              <div>
                <h3 className="text-base font-black font-['Outfit'] text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-rose-400" />
                  <span>Video Lectures</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Recorded lecture video metrics</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Videos Started</span>
                  <span className="text-xl font-bold font-mono text-white">
                    {videoAnalytics.videosStarted}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Videos Completed</span>
                  <span className="text-xl font-bold font-mono text-slate-400">
                    {videoAnalytics.videosCompleted}
                  </span>
                </div>
              </div>

              {/* Requirement Rule: Video completion tracking note */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Video completion tracking is not available yet. Real playback events will populate as students stream video player lessons.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* 7. ADMIN ACTIVITY AUDIT */}
        {/* ============================================================== */}
        {(activeSection === 'overview' || activeSection === 'admin_audit') && (
          <section className="space-y-4">
            <h3 className="text-base font-black font-['Outfit'] text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-rose-400" />
              <span>Admin Governance & Activity Audit</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminActivity.map((act) => (
                <div
                  key={act.actionType}
                  className="p-4 rounded-2xl bg-[#0b0f1e] border border-slate-800 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-200">{act.description}</span>
                    <span className="text-[10px] font-mono text-slate-500 block">{act.actionType}</span>
                  </div>
                  <span className="text-xl font-black font-mono text-cyan-400">{act.count}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* 8. STUDENT ENGAGEMENT RANKINGS & DETAIL LINKS */}
        {/* ============================================================== */}
        <section className="p-6 rounded-3xl bg-[#0a0e1e] border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black font-['Outfit'] text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <span>Student Engagement Report (Most Active Students)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ranked by verified event counts (views, downloads, sessions, doubts)
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2.5 font-semibold">Student Name</th>
                  <th className="pb-2.5 font-semibold">College & Course</th>
                  <th className="pb-2.5 font-semibold text-center">Views</th>
                  <th className="pb-2.5 font-semibold text-center">Downloads</th>
                  <th className="pb-2.5 font-semibold text-center">Sessions</th>
                  <th className="pb-2.5 font-semibold text-center">Rooms</th>
                  <th className="pb-2.5 font-semibold text-center">Doubts</th>
                  <th className="pb-2.5 font-semibold text-right">Total Actions</th>
                  <th className="pb-2.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredStudents.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 pr-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-bold text-slate-500 w-4">
                          #{idx + 1}
                        </span>
                        <UserInitialsBadge name={s.name} role="student" size="xs" />
                        <div>
                          <span className="font-bold text-white block">{s.name}</span>
                          <span className="text-[10px] text-slate-400">{s.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-2 text-slate-300">
                      <div>{s.college}</div>
                      <div className="text-[10px] text-slate-500">
                        {s.course} ({s.year})
                      </div>
                    </td>
                    <td className="py-3 text-center font-mono text-cyan-400">{s.materialsViewed}</td>
                    <td className="py-3 text-center font-mono text-blue-400">{s.downloads}</td>
                    <td className="py-3 text-center font-mono text-cyan-300">{s.sessionsJoined}</td>
                    <td className="py-3 text-center font-mono text-purple-300">{s.studyRoomsJoined}</td>
                    <td className="py-3 text-center font-mono text-amber-300">{s.doubtsAsked}</td>
                    <td className="py-3 text-right font-mono font-black text-emerald-400">
                      {s.totalActions}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => onNavigate('admin_students', { studentId: s.id })}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-cyan-300 text-[11px] font-bold border border-slate-700 transition-colors cursor-pointer"
                      >
                        Inspect Profile →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 9. AI LEARNING ASSISTANT TELEMETRY (MODULE 8) */}
        {/* ============================================================== */}
        {(activeSection === 'overview' || activeSection === 'ai') && (
          <section id="analytics-ai-section" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black font-['Outfit'] text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span>AI Learning Assistant Telemetry & Insights</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Source-grounded query volume, quiz completion rates, and pedagogical satisfaction metrics
                </p>
              </div>

              <button
                onClick={() => onNavigate('admin_ai_settings')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-cyan-300 hover:text-white hover:border-cyan-500/40 transition-all flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
              >
                <span>AI System Settings</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* AI Top Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-4 rounded-2xl bg-[#0b0f1e] border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400">Total Questions Asked</span>
                <div className="text-2xl font-black font-mono text-white">
                  {aiStats.totalQuestionsAsked}
                </div>
                <p className="text-[10px] text-slate-500">Student queries</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0b0f1e] border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400">Total Conversations</span>
                <div className="text-2xl font-black font-mono text-cyan-400">
                  {aiStats.totalConversations}
                </div>
                <p className="text-[10px] text-slate-500">Learning threads</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0b0f1e] border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400">Summaries Created</span>
                <div className="text-2xl font-black font-mono text-purple-400">
                  {aiStats.totalSummariesGenerated}
                </div>
                <p className="text-[10px] text-slate-500">Curriculum notes</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0b0f1e] border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400">Quizzes Completed</span>
                <div className="text-2xl font-black font-mono text-emerald-400">
                  {aiStats.totalQuizzesCompleted}
                </div>
                <p className="text-[10px] text-slate-500">Interactive tests</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0b0f1e] border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400">Avg Quiz Score</span>
                <div className="text-2xl font-black font-mono text-amber-400">
                  {aiStats.averageQuizScorePercent}%
                </div>
                <p className="text-[10px] text-slate-500">Student comprehension</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0b0f1e] border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400">Helpful Rating</span>
                <div className="text-2xl font-black font-mono text-blue-400">
                  {aiStats.helpfulRatePercent}%
                </div>
                <p className="text-[10px] text-slate-500">
                  {aiStats.helpfulCount} up / {aiStats.notHelpfulCount} down
                </p>
              </div>
            </div>

            {/* AI Breakdown Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Question Types Distribution */}
              <div className="p-5 rounded-3xl bg-[#0b0f1e] border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Query Types Distribution
                </h4>
                <div className="space-y-2.5">
                  {aiStats.questionTypesBreakdown.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 capitalize">{item.type}</span>
                        <span className="font-mono text-cyan-400 font-bold">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Materials Asked About */}
              <div className="p-5 rounded-3xl bg-[#0b0f1e] border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Top Grounded Study Materials
                </h4>
                <div className="space-y-2.5">
                  {aiStats.topMaterialsAskedAbout.length === 0 ? (
                    <p className="text-xs text-slate-500">No material queries logged yet.</p>
                  ) : (
                    aiStats.topMaterialsAskedAbout.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="text-slate-200 font-medium truncate">
                            {item.materialTitle}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/10 shrink-0">
                          {item.queryCount} queries
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Identified Weak Concept Areas */}
              <div className="p-5 rounded-3xl bg-[#0b0f1e] border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Identified Weak Concept Areas
                </h4>
                <div className="space-y-2">
                  {aiStats.identifiedWeakTopics.length === 0 ? (
                    <p className="text-xs text-slate-500">No weak topics diagnosed yet.</p>
                  ) : (
                    aiStats.identifiedWeakTopics.map((topic, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="font-semibold">{topic.topic}</span>
                        </div>
                        <span className="text-[10px] font-mono bg-amber-500/20 px-2 py-0.5 rounded text-amber-300">
                          {topic.failedCount} quiz misses
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* 10. RECENT PLATFORM ACTIVITY AUDIT STREAM */}
        {/* ============================================================== */}
        <section className="p-6 rounded-3xl bg-[#0a0e1e] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black font-['Outfit'] text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span>Recent Platform Activity Stream</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real immutable event log across learners and educators
              </p>
            </div>
            <button
              onClick={() => onNavigate('activity')}
              className="text-xs text-cyan-400 font-bold hover:underline"
            >
              View Full Feed →
            </button>
          </div>

          <div className="divide-y divide-slate-800/60">
            {recentEvents.map((e) => (
              <div key={e.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <UserInitialsBadge name={e.user_name || 'YuvaSetu User'} role="student" size="xs" />
                  <div>
                    <span className="font-bold text-white mr-1.5">{e.user_name}</span>
                    <span className="text-slate-400">
                      performed{' '}
                      <span className="font-mono text-cyan-300 font-semibold">{e.event_type}</span>{' '}
                      on{' '}
                      <span className="text-slate-200 font-medium">
                        {e.resource_title || e.resource_id}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-slate-500 shrink-0">
                  {new Date(e.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
