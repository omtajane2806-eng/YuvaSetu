import React, { useState, useEffect } from 'react';
import { User } from '../types/user';
import {
  PublishingThresholds,
  DEFAULT_PUBLISHING_THRESHOLDS,
  StudentNoteSubmission,
} from '../types/marketplace';
import { marketplaceService } from '../services/marketplaceService';
import {
  ShieldCheck,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Save,
  RotateCcw,
  Clock,
  Layers,
  Sparkles,
  Coins,
  FileText,
  UserCheck,
  Check,
  X,
  RefreshCw,
  Search,
} from 'lucide-react';

interface AdminMarketplaceManagementViewProps {
  currentUser: User | null;
  onNavigate: (view: string, payload?: any) => void;
}

export const AdminMarketplaceManagementView: React.FC<AdminMarketplaceManagementViewProps> = ({
  currentUser,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'THRESHOLDS' | 'QUEUE'>('THRESHOLDS');

  // Dynamic Thresholds State
  const [thresholds, setThresholds] = useState<PublishingThresholds>(DEFAULT_PUBLISHING_THRESHOLDS);
  const [isSavingThresholds, setIsSavingThresholds] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Submissions Queue State
  const [submissions, setSubmissions] = useState<StudentNoteSubmission[]>([]);
  const [queueFilter, setQueueFilter] = useState<'all' | 'REVIEW_REQUIRED' | 'PUBLISHED' | 'REJECTED'>('REVIEW_REQUIRED');
  const [queueSearch, setQueueSearch] = useState('');
  const [isLoadingQueue, setIsLoadingQueue] = useState(false);
  const [moderatingId, setModeratingId] = useState<string | null>(null);

  const fetchThresholds = async () => {
    try {
      const data = await marketplaceService.getThresholds();
      setThresholds(data);
    } catch (e) {
      console.warn('Failed to load thresholds:', e);
    }
  };

  const fetchQueue = async () => {
    setIsLoadingQueue(true);
    try {
      const data = await marketplaceService.getAdminSubmissions(
        queueFilter === 'all' ? undefined : queueFilter,
        currentUser?.id
      );
      setSubmissions(data);
    } catch (e) {
      console.warn('Failed to load submissions queue:', e);
    } finally {
      setIsLoadingQueue(false);
    }
  };

  useEffect(() => {
    fetchThresholds();
  }, []);

  useEffect(() => {
    if (activeTab === 'QUEUE') {
      fetchQueue();
    }
  }, [activeTab, queueFilter]);

  const handleSaveThresholds = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingThresholds(true);
    try {
      const updated = await marketplaceService.updateThresholds(
        thresholds,
        currentUser?.id || 'admin'
      );
      setThresholds(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save thresholds:', err);
    } finally {
      setIsSavingThresholds(false);
    }
  };

  const handleResetDefaultThresholds = () => {
    setThresholds(DEFAULT_PUBLISHING_THRESHOLDS);
  };

  const handleModerate = async (id: string, action: 'APPROVE_PUBLISH' | 'REJECT', reason?: string) => {
    setModeratingId(id);
    try {
      await marketplaceService.moderateSubmission(id, action, reason, currentUser?.id);
      await fetchQueue();
    } catch (err) {
      console.error('Moderation error:', err);
    } finally {
      setModeratingId(null);
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (!queueSearch.trim()) return true;
    const q = queueSearch.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.studentName.toLowerCase().includes(q) ||
      s.subjectName.toLowerCase().includes(q) ||
      s.fileName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#090d1c] to-[#1e1430] border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase tracking-wider">
                Admin Exclusive
              </span>
              <h1 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
                Student Notes Marketplace Publishing Engine
              </h1>
            </div>
            <p className="text-xs text-slate-300">
              Configure automated publishing thresholds, risk rules, pricing boundaries, and manage the manual review queue.
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-2xl p-1 gap-1">
          <button
            onClick={() => setActiveTab('THRESHOLDS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'THRESHOLDS'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Configurable Thresholds
          </button>
          <button
            onClick={() => setActiveTab('QUEUE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'QUEUE'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Review Queue ({submissions.filter((s) => s.status === 'REVIEW_REQUIRED').length})
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: CONFIGURABLE PUBLISHING THRESHOLDS */}
      {/* ============================================================ */}
      {activeTab === 'THRESHOLDS' && (
        <form onSubmit={handleSaveThresholds} className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#0c1020] border border-slate-800 shadow-xl space-y-6">
            <div>
              <h3 className="text-lg font-black text-white font-['Outfit'] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                Automated Auto-Publish Condition Thresholds
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Submissions meeting ALL minimum criteria below and having LOW copyright/originality risk are automatically published immediately upon student final price selection without manual approval.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Overall Quality Score */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white">Minimum Overall Quality Score</label>
                  <span className="font-mono text-xs font-bold text-cyan-400">
                    {thresholds.minimumOverallQualityScore} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={95}
                  step={5}
                  value={thresholds.minimumOverallQualityScore}
                  onChange={(e) =>
                    setThresholds({ ...thresholds, minimumOverallQualityScore: Number(e.target.value) })
                  }
                  className="w-full accent-cyan-500"
                />
                <p className="text-[11px] text-slate-400">
                  Scores below this trigger <code className="text-amber-400 font-mono">REVIEW_REQUIRED</code> status.
                </p>
              </div>

              {/* Relevance Score */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white">Minimum Category Relevance Score</label>
                  <span className="font-mono text-xs font-bold text-cyan-400">
                    {thresholds.minimumRelevanceScore} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={95}
                  step={5}
                  value={thresholds.minimumRelevanceScore}
                  onChange={(e) =>
                    setThresholds({ ...thresholds, minimumRelevanceScore: Number(e.target.value) })
                  }
                  className="w-full accent-cyan-500"
                />
                <p className="text-[11px] text-slate-400">
                  Ensures the uploaded content strongly aligns with the chosen academic domain.
                </p>
              </div>

              {/* Completeness Score */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white">Minimum Completeness Score</label>
                  <span className="font-mono text-xs font-bold text-cyan-400">
                    {thresholds.minimumCompletenessScore} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={90}
                  step={5}
                  value={thresholds.minimumCompletenessScore}
                  onChange={(e) =>
                    setThresholds({ ...thresholds, minimumCompletenessScore: Number(e.target.value) })
                  }
                  className="w-full accent-cyan-500"
                />
                <p className="text-[11px] text-slate-400">
                  Filters out empty or single-page fragmented lecture notes.
                </p>
              </div>

              {/* AI Confidence */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white">Minimum AI Confidence Level</label>
                  <span className="font-mono text-xs font-bold text-cyan-400">
                    {thresholds.minimumAIConfidence}%
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={95}
                  step={5}
                  value={thresholds.minimumAIConfidence}
                  onChange={(e) =>
                    setThresholds({ ...thresholds, minimumAIConfidence: Number(e.target.value) })
                  }
                  className="w-full accent-cyan-500"
                />
                <p className="text-[11px] text-slate-400">
                  AI pipeline confidence in evaluation accuracy.
                </p>
              </div>
            </div>

            {/* Allowed Risk Rules */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Risk Screening Constraints (High Risk Content ALWAYS Blocks Auto-Publishing)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">Allowed Copyright Risk</p>
                    <p className="text-[11px] text-slate-400">Only LOW risk is allowed for auto-publish</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-mono font-bold">
                    LOW ONLY
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">Allowed Originality Risk</p>
                    <p className="text-[11px] text-slate-400">Only LOW risk is allowed for auto-publish</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-mono font-bold">
                    LOW ONLY
                  </span>
                </div>
              </div>
            </div>

            {/* Price Boundaries */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Server-Enforced Student Selling Price Boundaries (₹ INR)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Platform Minimum Price (₹)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={thresholds.minimumPriceINR}
                    onChange={(e) =>
                      setThresholds({ ...thresholds, minimumPriceINR: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Platform Ceiling Price (₹)
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={2000}
                    value={thresholds.maximumPriceINR}
                    onChange={(e) =>
                      setThresholds({ ...thresholds, maximumPriceINR: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={handleResetDefaultThresholds}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Defaults
              </button>

              <button
                type="submit"
                disabled={isSavingThresholds}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:brightness-110 cursor-pointer"
              >
                {isSavingThresholds ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                {saveSuccess ? 'Thresholds Saved!' : 'Save Publishing Thresholds'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ============================================================ */}
      {/* TAB 2: REVIEW QUEUE & SUBMISSIONS */}
      {/* ============================================================ */}
      {activeTab === 'QUEUE' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-1 text-xs">
              {(['all', 'REVIEW_REQUIRED', 'PUBLISHED', 'REJECTED'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setQueueFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    queueFilter === filter
                      ? 'bg-cyan-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search note or student..."
                value={queueSearch}
                onChange={(e) => setQueueSearch(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-3xl border border-slate-800 bg-[#0c1020] overflow-hidden shadow-2xl">
            {isLoadingQueue ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading submissions...</div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No submissions found in this status queue.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5 pl-5">Note Title & Subject</th>
                    <th className="p-3.5">Student Author</th>
                    <th className="p-3.5">Quality / Relevance</th>
                    <th className="p-3.5">Student Price</th>
                    <th className="p-3.5">AI Rec. Price</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 pr-5 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredSubmissions.map((sub) => {
                    const isBusy = moderatingId === sub.id;
                    return (
                      <tr key={sub.id} className="hover:bg-slate-900/40">
                        <td className="p-3.5 pl-5">
                          <div className="font-bold text-white leading-snug">{sub.title}</div>
                          <div className="text-[11px] text-slate-400">{sub.subjectName} • {sub.pageCount} pages</div>
                          {sub.reviewReason && (
                            <div className="text-[10px] text-amber-300 mt-1 max-w-xs truncate" title={sub.reviewReason}>
                              ⚠️ {sub.reviewReason}
                            </div>
                          )}
                        </td>

                        <td className="p-3.5">
                          <div className="font-bold text-slate-200">{sub.studentName}</div>
                          <div className="text-[11px] text-slate-400">{sub.studentEmail || 'Student'}</div>
                        </td>

                        <td className="p-3.5 font-mono">
                          {sub.aiAnalysis ? (
                            <div>
                              <span className="text-emerald-400 font-bold">{sub.aiAnalysis.overallQualityScore}</span>
                              <span className="text-slate-500"> / </span>
                              <span className="text-cyan-400">{sub.aiAnalysis.relevanceScore}</span>
                            </div>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>

                        <td className="p-3.5 font-mono font-black text-amber-400">
                          ₹{sub.studentSelectedPrice || '—'}
                        </td>

                        <td className="p-3.5 font-mono text-slate-300">
                          ₹{sub.aiRecommendedPrice || '—'}
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                              sub.status === 'PUBLISHED'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                                : sub.status === 'REVIEW_REQUIRED'
                                ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                                : 'bg-rose-950 text-rose-300 border-rose-500/40'
                            }`}
                          >
                            {sub.status.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="p-3.5 pr-5 text-right">
                          {sub.status === 'REVIEW_REQUIRED' ? (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                disabled={isBusy}
                                onClick={() => handleModerate(sub.id, 'APPROVE_PUBLISH')}
                                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3 h-3" />
                                Approve
                              </button>
                              <button
                                disabled={isBusy}
                                onClick={() => handleModerate(sub.id, 'REJECT', 'Flagged content failed manual review.')}
                                className="px-2.5 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-300 border border-rose-700/60 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-500">Processed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
