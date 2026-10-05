import React, { useState, useMemo } from 'react';
import { User } from '../types/user';
import {
  CommunityDiscussion,
  CommunityReport,
  CommunityReportStatus,
  DiscussionCategory,
  DiscussionStatus,
} from '../types/community';
import { communityService } from '../services/communityService';
import { PLATFORM_SUBJECTS } from '../data/subjectData';
import { UserInitialsBadge } from '../components/UserInitialsBadge';
import {
  ShieldAlert,
  Users,
  MessageSquare,
  ThumbsUp,
  CheckCircle2,
  Lock,
  Unlock,
  Trash2,
  Eye,
  Search,
  Filter,
  AlertTriangle,
  FileSpreadsheet,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Clock,
  Sparkles,
  BarChart3,
} from 'lucide-react';

interface AdminCommunityManagementViewProps {
  currentUser: User | null;
  onNavigate: (view: string, payload?: any) => void;
  initialTab?: 'discussions' | 'reports';
}

export const AdminCommunityManagementView: React.FC<AdminCommunityManagementViewProps> = ({
  currentUser,
  onNavigate,
  initialTab = 'discussions',
}) => {
  const [activeTab, setActiveTab] = useState<'discussions' | 'reports'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<DiscussionStatus | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<DiscussionCategory | 'ALL'>('ALL');
  const [reportStatusFilter, setReportStatusFilter] = useState<CommunityReportStatus | 'ALL'>('ALL');
  const [reloadKey, setReloadKey] = useState(0);

  // Modals state
  const [selectedDiscussionForClose, setSelectedDiscussionForClose] = useState<CommunityDiscussion | null>(
    null
  );
  const [closeReason, setCloseReason] = useState('Topic resolved or closed by administrative review.');

  const metrics = useMemo(() => communityService.getCommunityMetrics(), [reloadKey]);

  const discussions = useMemo(() => {
    return communityService.getDiscussions(
      {
        searchQuery,
        subjectId: selectedSubject,
        discussionType: selectedCategory,
        status: selectedStatus,
        sortBy: 'recent',
      },
      currentUser?.id
    );
  }, [searchQuery, selectedSubject, selectedCategory, selectedStatus, currentUser, reloadKey]);

  const reports = useMemo(() => {
    return communityService.getReports(reportStatusFilter);
  }, [reportStatusFilter, reloadKey]);

  const handleCloseDiscussionConfirm = () => {
    if (!currentUser || !selectedDiscussionForClose) return;
    communityService.closeDiscussion(selectedDiscussionForClose.id, currentUser, closeReason);
    setSelectedDiscussionForClose(null);
    setReloadKey((prev) => prev + 1);
  };

  const handleReopenDiscussion = (disc: CommunityDiscussion) => {
    if (!currentUser) return;
    communityService.reopenDiscussion(disc.id, currentUser);
    setReloadKey((prev) => prev + 1);
  };

  const handleDeleteDiscussion = (disc: CommunityDiscussion) => {
    if (!currentUser) return;
    if (window.confirm(`Are you sure you want to permanently remove "${disc.title}"?`)) {
      communityService.deleteDiscussion(disc.id, currentUser);
      setReloadKey((prev) => prev + 1);
    }
  };

  const handleUpdateReportStatus = (
    reportId: string,
    status: CommunityReportStatus,
    actionTaken?: string
  ) => {
    communityService.updateReportStatus(reportId, status, actionTaken);
    setReloadKey((prev) => prev + 1);
  };

  const timeAgo = (isoDate: string) => {
    const diff = Date.now() - new Date(isoDate).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#0a0d1a] text-slate-100 pb-20 font-['Outfit',sans-serif]">
      {/* Top Header */}
      <section className="bg-gradient-to-b from-[#111833] via-[#0d1226] to-[#0a0d1a] border-b border-cyan-900/30 pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-wide uppercase mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Moderation
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Community & Peer Moderation
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Oversee student discussions, enforce academic standards, review reports, and ensure quality.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('community')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all"
              >
                <Eye className="w-4 h-4 text-cyan-400" />
                View Student Feed
              </button>
              <button
                onClick={() => onNavigate('admin_analytics')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-950/50 transition-all"
              >
                <BarChart3 className="w-4 h-4" />
                Community Analytics
              </button>
            </div>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mt-8">
            <div className="bg-[#11172e] border border-cyan-900/40 rounded-2xl p-4 shadow-lg">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Total Discussions
              </span>
              <p className="text-2xl font-black text-white">{metrics.totalDiscussions}</p>
              <span className="text-[10px] text-cyan-400 font-semibold mt-1 block">
                +{metrics.newDiscussions} new today
              </span>
            </div>

            <div className="bg-[#11172e] border border-cyan-900/40 rounded-2xl p-4 shadow-lg">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Total Replies
              </span>
              <p className="text-2xl font-black text-cyan-300">{metrics.totalReplies}</p>
              <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
                Active responses
              </span>
            </div>

            <div className="bg-[#11172e] border border-cyan-900/40 rounded-2xl p-4 shadow-lg">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Helpful Reactions
              </span>
              <p className="text-2xl font-black text-amber-300">{metrics.helpfulReactions}</p>
              <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Peer votes</span>
            </div>

            <div className="bg-[#11172e] border border-cyan-900/40 rounded-2xl p-4 shadow-lg">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Accepted Solutions
              </span>
              <p className="text-2xl font-black text-emerald-400">{metrics.acceptedAnswers}</p>
              <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">
                Resolved topics
              </span>
            </div>

            <div className="bg-[#11172e] border border-cyan-900/40 rounded-2xl p-4 shadow-lg">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Closed Topics
              </span>
              <p className="text-2xl font-black text-slate-300">{metrics.closedDiscussions}</p>
              <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Moderated</span>
            </div>

            <div
              onClick={() => setActiveTab('reports')}
              className={`border rounded-2xl p-4 shadow-lg cursor-pointer transition-all ${
                metrics.reportedDiscussions > 0
                  ? 'bg-rose-500/10 border-rose-500/40 hover:bg-rose-500/20'
                  : 'bg-[#11172e] border-cyan-900/40'
              }`}
            >
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Open Reports
              </span>
              <p
                className={`text-2xl font-black ${
                  metrics.reportedDiscussions > 0 ? 'text-rose-400' : 'text-slate-400'
                }`}
              >
                {metrics.reportedDiscussions}
              </p>
              <span
                className={`text-[10px] font-bold mt-1 block ${
                  metrics.reportedDiscussions > 0 ? 'text-rose-300' : 'text-slate-500'
                }`}
              >
                {metrics.reportedDiscussions > 0 ? 'Requires Action' : 'All Clear'}
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-8 border-b border-slate-800 pb-1">
            <button
              onClick={() => setActiveTab('discussions')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'discussions'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              All Discussions ({discussions.length})
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'reports'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              Moderation Reports ({reports.length})
              {metrics.reportedDiscussions > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                  {metrics.reportedDiscussions}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'discussions' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-[#11172e] border border-cyan-900/40 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search discussions by title, author, topic, or keyword..."
                  className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-500/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-slate-900/80 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none"
              >
                <option value="ALL">All Subjects</option>
                {PLATFORM_SUBJECTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="bg-slate-900/80 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open Only</option>
                <option value="CLOSED">Closed Only</option>
              </select>
            </div>

            {/* Discussions Table */}
            <div className="bg-[#11172e] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Discussion</th>
                      <th className="py-3.5 px-4">Subject & Topic</th>
                      <th className="py-3.5 px-4">Author</th>
                      <th className="py-3.5 px-4">Stats</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {discussions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-slate-500">
                          No discussions found.
                        </td>
                      </tr>
                    ) : (
                      discussions.map((disc) => (
                        <tr key={disc.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-4 px-4 max-w-sm">
                            <div className="font-bold text-white line-clamp-1 mb-1">
                              {disc.title}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                                {disc.discussion_type}
                              </span>
                              <span>{timeAgo(disc.created_at)}</span>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <span className="font-semibold text-slate-200 block">
                              {disc.subject_name}
                            </span>
                            <span className="text-[11px] text-slate-400">{disc.topic}</span>
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <UserInitialsBadge
                                name={disc.author_name}
                                size="xs"
                                role={disc.author_role}
                              />
                              <div>
                                <span className="font-medium text-slate-200 block">
                                  {disc.author_name}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  {disc.author_role === 'admin' ? 'Admin' : 'Student'}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3 text-slate-300">
                              <span
                                title="Replies"
                                className="inline-flex items-center gap-1 text-[11px]"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                                {disc.replies_count || 0}
                              </span>
                              <span
                                title="Helpful reactions"
                                className="inline-flex items-center gap-1 text-[11px]"
                              >
                                <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                                {disc.helpful_count || 0}
                              </span>
                              {disc.has_accepted_answer && (
                                <CheckCircle2
                                  className="w-4 h-4 text-emerald-400"
                                  title="Accepted answer present"
                                />
                              )}
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                                disc.status === 'OPEN'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}
                            >
                              {disc.status === 'OPEN' ? (
                                'Open'
                              ) : (
                                <>
                                  <Lock className="w-3 h-3" /> Closed
                                </>
                              )}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() =>
                                  onNavigate('community_detail', { discussionId: disc.id })
                                }
                                className="p-1.5 text-slate-400 hover:text-cyan-300 rounded-lg hover:bg-slate-800 transition-colors"
                                title="View discussion"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>

                              {disc.status === 'OPEN' ? (
                                <button
                                  onClick={() => setSelectedDiscussionForClose(disc)}
                                  className="p-1.5 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-colors"
                                  title="Close discussion"
                                >
                                  <Lock className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleReopenDiscussion(disc)}
                                  className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition-colors"
                                  title="Reopen discussion"
                                >
                                  <Unlock className="w-4 h-4" />
                                </button>
                              )}

                              <button
                                onClick={() => handleDeleteDiscussion(disc)}
                                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                                title="Delete discussion"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* Status Filter */}
            <div className="bg-[#11172e] border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Community Moderation Reports
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Filter status:</span>
                <select
                  value={reportStatusFilter}
                  onChange={(e) => setReportStatusFilter(e.target.value as any)}
                  className="bg-slate-900 border border-slate-800 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none"
                >
                  <option value="ALL">All Reports</option>
                  <option value="OPEN">Open (Requires Review)</option>
                  <option value="REVIEWED">Reviewed</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="DISMISSED">Dismissed</option>
                </select>
              </div>
            </div>

            {/* Reports List */}
            {reports.length === 0 ? (
              <div className="bg-[#11172e]/60 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
                <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No community reports</h3>
                <p className="text-xs text-slate-400">
                  There are no active moderation flags for community content.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className={`bg-[#11172e] border rounded-2xl p-5 sm:p-6 transition-all ${
                      report.status === 'OPEN'
                        ? 'border-rose-500/40 shadow-lg shadow-rose-950/20'
                        : 'border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">
                              Flagged Reason: {report.reason}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                report.status === 'OPEN'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                  : report.status === 'RESOLVED'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {report.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            Reported by <span className="text-slate-200">{report.reporter_name}</span> •{' '}
                            {timeAgo(report.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            onNavigate('community_detail', { discussionId: report.discussion_id })
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-bold transition-colors"
                        >
                          View Content <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 mb-4 text-xs space-y-2">
                      <div>
                        <span className="text-slate-500 block text-[11px] mb-0.5">
                          Target Discussion:
                        </span>
                        <p className="font-semibold text-white">
                          "{report.discussion_title || 'Untitled Discussion'}"
                        </p>
                      </div>
                      {report.notes && (
                        <div>
                          <span className="text-slate-500 block text-[11px] mb-0.5">
                            Reporter Notes:
                          </span>
                          <p className="text-slate-300 italic">"{report.notes}"</p>
                        </div>
                      )}
                    </div>

                    {/* Moderation Actions Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                      <span className="text-slate-400">
                        {report.admin_action_taken
                          ? `Resolution: ${report.admin_action_taken}`
                          : 'Pending admin decision'}
                      </span>

                      <div className="flex items-center gap-2">
                        {report.status === 'OPEN' && (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateReportStatus(
                                  report.id,
                                  'DISMISSED',
                                  'Report reviewed and dismissed as compliant.'
                                )
                              }
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors"
                            >
                              Dismiss Report
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateReportStatus(
                                  report.id,
                                  'RESOLVED',
                                  'Content moderated and flagged issue resolved.'
                                )
                              }
                              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md shadow-emerald-950/40 transition-colors"
                            >
                              Mark Resolved
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Close Discussion Modal */}
      {selectedDiscussionForClose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#11162b] border border-amber-500/40 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-2">Close Community Discussion</h3>
            <p className="text-xs text-slate-400 mb-4">
              Closing prevents further student replies while preserving the thread as read-only.
            </p>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 mb-4 text-xs font-semibold text-white">
              "{selectedDiscussionForClose.title}"
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Reason for Closing
              </label>
              <textarea
                rows={3}
                value={closeReason}
                onChange={(e) => setCloseReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500/50 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedDiscussionForClose(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleCloseDiscussionConfirm}
                className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg"
              >
                Confirm Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
