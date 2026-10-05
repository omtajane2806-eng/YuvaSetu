import React, { useState, useEffect } from 'react';
import { User } from '../types/user';
import { DoubtItem, DoubtReport, DoubtStatus, DoubtReportStatus } from '../types/doubt';
import { doubtService } from '../services/doubtService';
import { PLATFORM_SUBJECTS } from '../data/subjectData';
import { UserInitialsBadge } from '../components/UserInitialsBadge';
import {
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MessageSquare,
  AlertCircle,
  Flag,
  Search,
  Filter,
  Eye,
  Trash2,
  Lock,
  Unlock,
  Copy,
  ExternalLink,
  Plus,
  Send,
  X,
  Tag,
  Check,
} from 'lucide-react';

export interface AdminDoubtManagementViewProps {
  currentUser: User | null;
  onNavigate: (view: string, payload?: any) => void;
  defaultTab?: 'doubts' | 'reports';
}

export const AdminDoubtManagementView: React.FC<AdminDoubtManagementViewProps> = ({
  currentUser,
  onNavigate,
  defaultTab = 'doubts',
}) => {
  const [activeTab, setActiveTab] = useState<'doubts' | 'reports'>(defaultTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');

  // Reports filters
  const [reportStatusFilter, setReportStatusFilter] = useState('ALL');

  // Quick answer modal
  const [answeringDoubt, setAnsweringDoubt] = useState<DoubtItem | null>(null);
  const [quickAnswerText, setQuickAnswerText] = useState('');
  const [isSubmittingQuickAnswer, setIsSubmittingQuickAnswer] = useState(false);

  // Close modal
  const [closingDoubt, setClosingDoubt] = useState<DoubtItem | null>(null);
  const [closeReason, setCloseReason] = useState('Closed by platform administrator');

  // Toast / notification feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const doubts = doubtService.getAllDoubts({
    search: searchQuery,
    status: selectedStatus,
    subjectId: selectedSubject,
  });

  const reports = doubtService.getReports(reportStatusFilter);
  const metrics = doubtService.getDoubtMetrics();

  // Handlers
  const handleOpenAnswerModal = (doubt: DoubtItem) => {
    setAnsweringDoubt(doubt);
    setQuickAnswerText('');
  };

  const handlePostQuickAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !answeringDoubt || !quickAnswerText.trim()) return;

    setIsSubmittingQuickAnswer(true);
    try {
      doubtService.addAnswer(currentUser, answeringDoubt.id, {
        answer_text: quickAnswerText,
      });
      setIsSubmittingQuickAnswer(false);
      setAnsweringDoubt(null);
      setQuickAnswerText('');
      showToast('Answer successfully published to student question.');
    } catch (err: any) {
      setIsSubmittingQuickAnswer(false);
      alert(err.message || 'Failed to post answer');
    }
  };

  const handleCloseDoubt = () => {
    if (!currentUser || !closingDoubt) return;
    try {
      doubtService.closeDoubt(closingDoubt.id, currentUser.id, closeReason);
      setClosingDoubt(null);
      showToast(`Question #${closingDoubt.id} closed.`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReopenDoubt = (doubt: DoubtItem) => {
    if (!currentUser) return;
    try {
      doubtService.reopenDoubt(doubt.id, currentUser.id, true);
      showToast(`Question #${doubt.id} reopened.`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteDoubt = (doubt: DoubtItem) => {
    if (!currentUser) return;
    if (
      window.confirm(
        `Are you sure you want to permanently delete doubt "${doubt.title}"? This cannot be undone.`
      )
    ) {
      try {
        doubtService.deleteDoubt(doubt.id, currentUser.id, true);
        showToast('Question deleted permanently.');
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleMarkDuplicate = (doubt: DoubtItem) => {
    if (!currentUser) return;
    const dupId = window.prompt('Enter original question ID or reference notes:');
    if (dupId !== null) {
      try {
        doubtService.markDuplicate(doubt.id, currentUser.id, dupId);
        showToast('Marked question as duplicate.');
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleReportAction = (
    report: DoubtReport,
    action: 'DISMISS' | 'REMOVE_CONTENT' | 'CLOSE_REPORT'
  ) => {
    if (!currentUser) return;
    try {
      if (action === 'DISMISS') {
        doubtService.updateReportStatus(
          report.id,
          'RESOLVED',
          'Dismissed after administrative review (No violation found).',
          'DISMISSED'
        );
        showToast('Report marked as reviewed and dismissed.');
      } else if (action === 'REMOVE_CONTENT') {
        if (window.confirm('Delete the reported content from the platform?')) {
          if (report.content_type === 'question') {
            doubtService.deleteDoubt(report.doubt_id, currentUser.id, true);
          }
          doubtService.updateReportStatus(
            report.id,
            'RESOLVED',
            'Reported content was permanently removed by administrator.',
            'CONTENT_REMOVED'
          );
          showToast('Reported content removed from platform.');
        }
      } else if (action === 'CLOSE_REPORT') {
        doubtService.updateReportStatus(report.id, 'RESOLVED', 'Report resolved.', 'CLOSED');
        showToast('Report closed.');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div id="vidyasetu-admin-doubts" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-500 text-white text-xs font-bold shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. ADMIN HEADER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d1428] via-[#090d1c] to-[#160e26] border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Moderation & Academic Quality Desk
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
            Doubt Solving & Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Monitor, answer, verify, and moderate academic questions submitted by YuvaSetu students.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('admin')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold transition-all"
          >
            ← Admin Dashboard
          </button>
        </div>
      </div>

      {/* 2. ATTENTION CALLOUT BANNER (if unanswered questions exist) */}
      {metrics.unansweredDoubts > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {metrics.unansweredDoubts} {metrics.unansweredDoubts === 1 ? 'doubt needs' : 'doubts need'} attention
              </h3>
              <p className="text-xs text-slate-400">
                Students are actively waiting for verified solutions in Computer Networks, DBMS, and Data Structures.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveTab('doubts');
              setSelectedStatus('OPEN');
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black shadow-md transition-all shrink-0 cursor-pointer"
          >
            Review Unanswered Questions
          </button>
        </div>
      )}

      {/* 3. METRIC CARDS (Total, Open, Unanswered, Answered, Resolved, Closed, Reports) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#0b0f1d] border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Doubts</p>
          <p className="text-2xl font-black text-white">{metrics.totalDoubts}</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b0f1d] border border-amber-500/30 space-y-1">
          <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">Open (Unanswered)</p>
          <p className="text-2xl font-black text-amber-300">{metrics.unansweredDoubts}</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b0f1d] border border-cyan-500/30 space-y-1">
          <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Answered</p>
          <p className="text-2xl font-black text-cyan-300">{metrics.answeredDoubts}</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b0f1d] border border-emerald-500/30 space-y-1">
          <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Resolved</p>
          <p className="text-2xl font-black text-emerald-300">{metrics.resolvedDoubts}</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b0f1d] border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Closed</p>
          <p className="text-2xl font-black text-slate-400">{metrics.closedDoubts}</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b0f1d] border border-rose-500/30 space-y-1">
          <p className="text-xs text-rose-400 font-bold uppercase tracking-wider">Open Reports</p>
          <p className="text-2xl font-black text-rose-300">{metrics.openReports}</p>
        </div>
      </div>

      {/* 4. TABS: DOUBTS TABLE vs MODERATION REPORTS */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('doubts')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'doubts'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Student Doubts ({doubts.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reports'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Moderation Reports ({reports.length})</span>
            {metrics.openReports > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black">
                {metrics.openReports}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: ALL STUDENT DOUBTS MANAGEMENT */}
      {activeTab === 'doubts' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student doubts by title, description or student name..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0b0f1d] border border-slate-800 text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#0b0f1d] border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="All">All Subjects</option>
                {PLATFORM_SUBJECTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#0b0f1d] border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="All">All Statuses</option>
                <option value="OPEN">OPEN (Unanswered)</option>
                <option value="ANSWERED">ANSWERED</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
          </div>

          {/* Doubts Table */}
          <div className="rounded-3xl bg-[#0b0f1d] border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-4">Question</th>
                    <th className="px-5 py-4">Student</th>
                    <th className="px-5 py-4">Subject</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Answers</th>
                    <th className="px-5 py-4">Created Date</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-medium">
                  {doubts.length > 0 ? (
                    doubts.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="px-5 py-4 max-w-xs sm:max-w-md">
                          <div className="space-y-1">
                            <p
                              onClick={() => onNavigate('doubt_detail', { doubtId: d.id })}
                              className="font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer line-clamp-1"
                            >
                              {d.title}
                            </p>
                            <p className="text-[11px] text-slate-400 line-clamp-1">{d.description}</p>
                          </div>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <UserInitialsBadge name={d.student_name} role="student" size="sm" />
                            <div>
                              <p className="font-bold text-slate-200">{d.student_name}</p>
                              <p className="text-[10px] text-slate-500">{d.student_email || 'Verified Student'}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-900 text-cyan-300 border border-slate-800">
                            {d.subject_name}
                          </span>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                              d.status === 'RESOLVED'
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : d.status === 'ANSWERED'
                                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                                : d.status === 'CLOSED'
                                ? 'bg-slate-800 text-slate-400 border-slate-700'
                                : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            {d.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="font-bold text-slate-300">
                            {d.answers_count}
                          </span>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap text-slate-500">
                          {new Date(d.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap text-right space-x-1.5">
                          <button
                            onClick={() => onNavigate('doubt_detail', { doubtId: d.id })}
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-colors"
                            title="View question details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleOpenAnswerModal(d)}
                            className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 transition-colors"
                            title="Write answer solution"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          {d.status === 'CLOSED' ? (
                            <button
                              onClick={() => handleReopenDoubt(d)}
                              className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 transition-colors"
                              title="Reopen doubt"
                            >
                              <Unlock className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => setClosingDoubt(d)}
                              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
                              title="Close doubt"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => handleMarkDuplicate(d)}
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
                            title="Mark as duplicate"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteDoubt(d)}
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete question"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                        No student doubts found for the active search and filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MODERATION REPORTS (/admin/doubt-reports) */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Filter Status:</span>
              {['ALL', 'OPEN', 'RESOLVED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setReportStatusFilter(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    reportStatusFilter === st
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-[#0b0f1d] border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-4">Reported Content</th>
                    <th className="px-5 py-4">Reporter</th>
                    <th className="px-5 py-4">Reason</th>
                    <th className="px-5 py-4">Notes</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Report Date</th>
                    <th className="px-5 py-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-medium">
                  {reports.length > 0 ? (
                    reports.map((rep) => (
                      <tr key={rep.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="px-5 py-4 max-w-xs">
                          <div className="space-y-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-300 uppercase">
                              {rep.content_type}
                            </span>
                            <p
                              onClick={() => onNavigate('doubt_detail', { doubtId: rep.doubt_id })}
                              className="font-bold text-white hover:text-cyan-300 cursor-pointer line-clamp-1"
                            >
                              {rep.doubt_title || `Item #${rep.content_id}`}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap font-bold text-slate-200">
                          {rep.reporter_name}
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-900 text-amber-300 border border-slate-800">
                            {rep.reason}
                          </span>
                        </td>

                        <td className="px-5 py-4 max-w-xs text-slate-400 truncate">
                          {rep.notes || '—'}
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              rep.status === 'RESOLVED'
                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {rep.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap text-slate-500">
                          {new Date(rep.created_at).toLocaleDateString()}
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap text-right space-x-1.5">
                          {rep.status === 'OPEN' ? (
                            <>
                              <button
                                onClick={() => handleReportAction(rep, 'DISMISS')}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                              >
                                Dismiss
                              </button>
                              <button
                                onClick={() => handleReportAction(rep, 'REMOVE_CONTENT')}
                                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
                              >
                                Remove Content
                              </button>
                            </>
                          ) : (
                            <span className="text-[11px] text-slate-500 font-bold">
                              {rep.admin_action_taken || 'RESOLVED'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                        No moderation reports submitted.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ANSWER MODAL */}
      {answeringDoubt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl rounded-3xl bg-[#0d1222] border border-cyan-500/30 shadow-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white">Answer Student Question</h3>
                <p className="text-xs text-slate-400 truncate max-w-lg">
                  "{answeringDoubt.title}"
                </p>
              </div>
              <button
                onClick={() => setAnsweringDoubt(null)}
                className="text-slate-500 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostQuickAnswer} className="space-y-4">
              <textarea
                value={quickAnswerText}
                onChange={(e) => setQuickAnswerText(e.target.value)}
                rows={6}
                placeholder="Write clear, step-by-step academic explanation..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 leading-relaxed"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAnsweringDoubt(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingQuickAnswer || !quickAnswerText.trim()}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-black shadow-md shadow-cyan-500/20 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingQuickAnswer ? 'Publishing...' : 'Publish Answer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLOSE DOUBT REASON MODAL */}
      {closingDoubt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-[#0d1222] border border-slate-700 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-black text-white">Close Question #{closingDoubt.id}</h3>
            <p className="text-xs text-slate-400">
              Provide reason for closing "{closingDoubt.title.substring(0, 35)}..."
            </p>
            <textarea
              value={closeReason}
              onChange={(e) => setCloseReason(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setClosingDoubt(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCloseDoubt}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-600"
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
