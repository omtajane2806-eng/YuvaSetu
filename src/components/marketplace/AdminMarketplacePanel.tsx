import React, { useState, useEffect } from 'react';
import {
  StudentNoteSubmission,
  PublishingThresholds,
  DEFAULT_PUBLISHING_THRESHOLDS,
  RiskLevel,
} from '../../types/marketplace';
import { marketplaceService } from '../../services/marketplaceService';
import {
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Save,
  Eye,
  FileText,
  DollarSign,
  TrendingUp,
  Check,
  ChevronRight,
  Sparkles,
  Info,
} from 'lucide-react';

export interface AdminMarketplacePanelProps {
  onShowToast: (msg: string) => void;
}

export const AdminMarketplacePanel: React.FC<AdminMarketplacePanelProps> = ({ onShowToast }) => {
  const [submissions, setSubmissions] = useState<StudentNoteSubmission[]>([]);
  const [thresholds, setThresholds] = useState<PublishingThresholds>(DEFAULT_PUBLISHING_THRESHOLDS);
  const [loading, setLoading] = useState(true);
  const [savingThresholds, setSavingThresholds] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<StudentNoteSubmission | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  // Price confirmation in audit modal
  const [editFinalPrice, setEditFinalPrice] = useState<number>(25);
  const [isSubmittingPrice, setIsSubmittingPrice] = useState(false);
  const [priceSuccessMsg, setPriceSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (selectedSubmission) {
      const initPrice =
        selectedSubmission.student_selected_price ||
        selectedSubmission.ai_recommended_price ||
        25;
      setEditFinalPrice(initPrice);
      setPriceSuccessMsg(null);
    }
  }, [selectedSubmission]);

  const handleConfirmStudentPrice = async () => {
    if (!selectedSubmission || isSubmittingPrice) return;
    setIsSubmittingPrice(true);
    setPriceSuccessMsg(null);
    try {
      const res = await fetch(`/api/student-notes/${selectedSubmission.id}/confirm-price`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': selectedSubmission.student_id,
        },
        body: JSON.stringify({
          finalPrice: Number(editFinalPrice),
          studentPrice: Number(editFinalPrice),
          rightsDeclarationAccepted: true,
          listingInfoAccepted: true,
          customTitle: selectedSubmission.title,
          customDescription: selectedSubmission.description,
          customSubjectId: selectedSubmission.subject_id,
          customSubjectName: selectedSubmission.subject_name,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to confirm price');
      }

      onShowToast(`Price set to ₹${editFinalPrice} and note published successfully!`);
      setPriceSuccessMsg(`Published at ₹${editFinalPrice}!`);
      await loadData();
      setSelectedSubmission((prev) =>
        prev
          ? {
              ...prev,
              status: 'PUBLISHED',
              student_selected_price: Number(editFinalPrice),
            }
          : null
      );
    } catch (err: any) {
      onShowToast(err?.message || 'Failed to confirm price');
    } finally {
      setIsSubmittingPrice(false);
    }
  };

  // Form threshold edits
  const [editThresholds, setEditThresholds] = useState<PublishingThresholds>(DEFAULT_PUBLISHING_THRESHOLDS);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tRes, sRes] = await Promise.all([
        marketplaceService.getThresholds(),
        marketplaceService.getAllSubmissions(),
      ]);
      setThresholds(tRes);
      setEditThresholds(tRes);
      setSubmissions(sRes);
    } catch (err: any) {
      onShowToast(err?.message || 'Failed to load marketplace data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveThresholds = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingThresholds(true);
    try {
      const updated = await marketplaceService.updateThresholds(editThresholds);
      setThresholds(updated);
      setEditThresholds(updated);
      onShowToast('Publishing thresholds successfully updated and applied.');
    } catch (err: any) {
      onShowToast(err?.message || 'Failed to update thresholds.');
    } finally {
      setSavingThresholds(false);
    }
  };

  const handleAdminApprove = async (sub: StudentNoteSubmission) => {
    setApprovingId(sub.id);
    try {
      await marketplaceService.adminApproveSubmission(sub.id);
      onShowToast(`Approved and published "${sub.title}" to Study Materials!`);
      await loadData();
      if (selectedSubmission?.id === sub.id) {
        setSelectedSubmission((prev) => (prev ? { ...prev, status: 'PUBLISHED' } : null));
      }
    } catch (err: any) {
      onShowToast(err?.message || 'Failed to approve note.');
    } finally {
      setApprovingId(null);
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        s.title.toLowerCase().includes(q) ||
        s.student_name.toLowerCase().includes(q) ||
        s.subject_name.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const autoPublishedCount = submissions.filter((s) => s.status === 'PUBLISHED').length;
  const reviewRequiredCount = submissions.filter((s) => s.status === 'REVIEW_REQUIRED').length;
  const rejectedCount = submissions.filter((s) => s.status === 'REJECTED').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. HEADER & KPI CARDS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] flex items-center gap-2.5">
            <Sliders className="w-6 h-6 text-amber-400" />
            Student Notes Marketplace & AI Publishing Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated quality verification, configurable policy thresholds, and rapid review queue.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Submissions</span>
          <p className="text-2xl font-black text-white mt-1">{submissions.length}</p>
          <span className="text-[11px] text-slate-400">All student PDF uploads</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Auto-Published</span>
          <p className="text-2xl font-black text-emerald-300 mt-1">{autoPublishedCount}</p>
          <span className="text-[11px] text-emerald-400/80">Passed all policies</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Review Required</span>
          <p className="text-2xl font-black text-amber-300 mt-1">{reviewRequiredCount}</p>
          <span className="text-[11px] text-amber-400/80">Pending admin review</span>
        </div>

        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">High Risk / Blocked</span>
          <p className="text-2xl font-black text-rose-300 mt-1">{rejectedCount}</p>
          <span className="text-[11px] text-rose-400/80">Filtered by AI safety</span>
        </div>
      </div>

      {/* 2. CONFIGURABLE PUBLISHING THRESHOLDS */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Automated Publishing Policy Thresholds
            </h3>
            <p className="text-xs text-slate-400">
              Notes meeting or exceeding all thresholds are automatically published when the student confirms their final price.
            </p>
          </div>
          <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-800/60 self-start sm:self-auto">
            Configurable Platform Policy
          </span>
        </div>

        <form onSubmit={handleSaveThresholds} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 block">
                Min. Overall Quality Score (0–100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={editThresholds.minimumOverallQualityScore}
                onChange={(e) =>
                  setEditThresholds({
                    ...editThresholds,
                    minimumOverallQualityScore: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[10px] text-slate-500">Suggested default: 70</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 block">
                Min. Relevance Score (0–100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={editThresholds.minimumRelevanceScore}
                onChange={(e) =>
                  setEditThresholds({
                    ...editThresholds,
                    minimumRelevanceScore: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[10px] text-slate-500">Suggested default: 70</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 block">
                Min. Completeness Score (0–100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={editThresholds.minimumCompletenessScore}
                onChange={(e) =>
                  setEditThresholds({
                    ...editThresholds,
                    minimumCompletenessScore: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[10px] text-slate-500">Suggested default: 60</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 block">
                Min. AI Confidence (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={editThresholds.minimumAIConfidence}
                onChange={(e) =>
                  setEditThresholds({
                    ...editThresholds,
                    minimumAIConfidence: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[10px] text-slate-500">Suggested default: 75%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 block">
                Min. Selling Price (₹ INR)
              </label>
              <input
                type="number"
                min="0"
                value={editThresholds.minimumPriceINR}
                onChange={(e) =>
                  setEditThresholds({
                    ...editThresholds,
                    minimumPriceINR: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[10px] text-slate-500">Suggested default: ₹10</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 block">
                Max. Selling Price (₹ INR)
              </label>
              <input
                type="number"
                min="10"
                value={editThresholds.maximumPriceINR}
                onChange={(e) =>
                  setEditThresholds({
                    ...editThresholds,
                    maximumPriceINR: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[10px] text-slate-500">Suggested default: ₹2000</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <label className="text-[11px] font-bold text-slate-300 block">
                Allowed Copyright Risk
              </label>
              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editThresholds.allowedCopyrightRisk.includes('LOW')}
                    onChange={(e) => {
                      const cur = [...editThresholds.allowedCopyrightRisk];
                      if (e.target.checked) cur.push('LOW');
                      else {
                        const i = cur.indexOf('LOW');
                        if (i >= 0) cur.splice(i, 1);
                      }
                      setEditThresholds({ ...editThresholds, allowedCopyrightRisk: cur });
                    }}
                    className="rounded text-cyan-500 bg-slate-900 border-slate-700"
                  />
                  <span>LOW</span>
                </label>
                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editThresholds.allowedCopyrightRisk.includes('MEDIUM')}
                    onChange={(e) => {
                      const cur = [...editThresholds.allowedCopyrightRisk];
                      if (e.target.checked) cur.push('MEDIUM');
                      else {
                        const i = cur.indexOf('MEDIUM');
                        if (i >= 0) cur.splice(i, 1);
                      }
                      setEditThresholds({ ...editThresholds, allowedCopyrightRisk: cur });
                    }}
                    className="rounded text-cyan-500 bg-slate-900 border-slate-700"
                  />
                  <span>MEDIUM</span>
                </label>
              </div>
              <p className="text-[10px] text-slate-500">HIGH risk always blocks auto-publish</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <label className="text-[11px] font-bold text-slate-300 block">
                Allowed Originality Risk
              </label>
              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editThresholds.allowedOriginalityRisk.includes('LOW')}
                    onChange={(e) => {
                      const cur = [...editThresholds.allowedOriginalityRisk];
                      if (e.target.checked) cur.push('LOW');
                      else {
                        const i = cur.indexOf('LOW');
                        if (i >= 0) cur.splice(i, 1);
                      }
                      setEditThresholds({ ...editThresholds, allowedOriginalityRisk: cur });
                    }}
                    className="rounded text-cyan-500 bg-slate-900 border-slate-700"
                  />
                  <span>LOW</span>
                </label>
                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editThresholds.allowedOriginalityRisk.includes('MEDIUM')}
                    onChange={(e) => {
                      const cur = [...editThresholds.allowedOriginalityRisk];
                      if (e.target.checked) cur.push('MEDIUM');
                      else {
                        const i = cur.indexOf('MEDIUM');
                        if (i >= 0) cur.splice(i, 1);
                      }
                      setEditThresholds({ ...editThresholds, allowedOriginalityRisk: cur });
                    }}
                    className="rounded text-cyan-500 bg-slate-900 border-slate-700"
                  />
                  <span>MEDIUM</span>
                </label>
              </div>
              <p className="text-[10px] text-slate-500">HIGH risk always blocks auto-publish</p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingThresholds}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:brightness-110 cursor-pointer"
            >
              {savingThresholds ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Saving Policy...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save Policy Thresholds
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 3. SUBMISSIONS TABLE & REVIEW QUEUE */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by title, student, or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Statuses ({submissions.length})</option>
              <option value="PUBLISHED">Published ({autoPublishedCount})</option>
              <option value="REVIEW_REQUIRED">Review Required ({reviewRequiredCount})</option>
              <option value="REJECTED">Rejected ({rejectedCount})</option>
              <option value="AWAITING_STUDENT_PRICE">Awaiting Price</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/40">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3.5 pl-4">Note Title & Student</th>
                <th className="p-3.5">Subject & Category</th>
                <th className="p-3.5">AI Quality Score</th>
                <th className="p-3.5">AI Recommended Price</th>
                <th className="p-3.5">Student Final Price</th>
                <th className="p-3.5">Current Publication Status</th>
                <th className="p-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No note submissions found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => {
                  let analysis: any = null;
                  try {
                    analysis = typeof sub.ai_analysis === 'string' ? JSON.parse(sub.ai_analysis) : sub.ai_analysis;
                  } catch {}

                  return (
                    <tr key={sub.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3.5 pl-4">
                        <div className="font-bold text-white line-clamp-1">{sub.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {sub.student_name} • {sub.page_count} pgs • {sub.file_size}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="text-slate-200 font-semibold">{sub.subject_name}</div>
                        <div className="text-[11px] text-slate-400">{sub.category}</div>
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white font-mono">{analysis?.overallQualityScore ?? '-'}/100</span>
                          <span className="text-[10px] text-slate-400">({analysis?.aiConfidence ?? '-'}% conf)</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Tier: <strong className="text-purple-300 font-semibold">{analysis?.polishCategory || sub.publishing_eligibility_status || 'PREMIUM'}</strong>
                        </div>
                      </td>

                      <td className="p-3.5 font-mono">
                        <span className="font-bold text-slate-200">
                          ₹{sub.ai_recommended_price ?? analysis?.priceRecommendation?.recommendedPrice ?? 25}
                        </span>
                      </td>

                      <td className="p-3.5 font-mono">
                        {sub.student_selected_price ? (
                          <span className="font-black text-emerald-400">
                            ₹{sub.student_selected_price}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px] italic">Not set</span>
                        )}
                      </td>

                      <td className="p-3.5">
                        {sub.status === 'PUBLISHED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            PUBLISHED
                          </span>
                        ) : sub.status === 'REVIEW_REQUIRED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-500/40">
                            <Clock className="w-3 h-3 text-amber-400" />
                            REVIEW_REQUIRED
                          </span>
                        ) : sub.status === 'REJECTED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-950/80 text-rose-300 border border-rose-500/40">
                            <XCircle className="w-3 h-3 text-rose-400" />
                            REJECTED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900 text-slate-300 border border-slate-700">
                            AWAITING_STUDENT_PRICE
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 pr-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedSubmission(sub)}
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                            title="Inspect Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {sub.status === 'REVIEW_REQUIRED' && (
                            <button
                              onClick={() => handleAdminApprove(sub)}
                              disabled={approvingId === sub.id}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 font-bold text-[11px] flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              Approve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. SUBMISSION INSPECTION MODAL */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#0c1020] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Note Submission Audit & AI Analysis
              </h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800/60">
                    {selectedSubmission.subject_name} • {selectedSubmission.branch || selectedSubmission.category || 'General Academic'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                    ID: {selectedSubmission.id}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                    Student ID: {selectedSubmission.student_id}
                  </span>
                </div>
                <h4 className="text-lg font-black text-white">{selectedSubmission.title}</h4>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <p>
                    Uploaded by <strong className="text-slate-200">{selectedSubmission.student_name}</strong> ({selectedSubmission.student_email || 'No email'})
                  </p>
                  <span>•</span>
                  <span>{new Date(selectedSubmission.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {selectedSubmission.description || 'No description provided.'}
              </div>

              {/* Metrics */}
              {selectedSubmission.ai_analysis && (
                (() => {
                  let analysis: any = {};
                  try {
                    analysis = typeof selectedSubmission.ai_analysis === 'string'
                      ? JSON.parse(selectedSubmission.ai_analysis)
                      : selectedSubmission.ai_analysis;
                  } catch {}

                  return (
                    <div className="space-y-3">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        AI Quality & Risk Evaluation
                      </h5>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <p className="text-[10px] text-slate-400 uppercase">Quality</p>
                          <p className="text-base font-black text-white">{analysis.overallQualityScore}/100</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <p className="text-[10px] text-slate-400 uppercase">Relevance</p>
                          <p className="text-base font-black text-white">{analysis.relevanceScore}/100</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <p className="text-[10px] text-slate-400 uppercase">Completeness</p>
                          <p className="text-base font-black text-white">{analysis.completenessScore}/100</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <p className="text-[10px] text-slate-400 uppercase">Confidence</p>
                          <p className="text-base font-black text-white">{analysis.aiConfidence}%</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                          <span className="text-slate-400">Copyright Risk:</span>
                          <span className="font-bold text-emerald-400">{analysis.copyrightRisk || 'LOW'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                          <span className="text-slate-400">Originality Risk:</span>
                          <span className="font-bold text-emerald-400">{analysis.originalityRisk || 'LOW'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}

              {/* Price comparison & Editable Final Price */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">AI RECOMMENDATION</span>
                    <p className="text-xl font-black text-cyan-400">₹{selectedSubmission.ai_recommended_price || 25}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">CURRENT STATUS</span>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      selectedSubmission.status === 'PUBLISHED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : selectedSubmission.status === 'AWAITING_STUDENT_PRICE'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {selectedSubmission.status}
                    </span>
                  </div>
                </div>

                {/* EDITABLE PRICE INPUT (Matching Screenshot 2 Requirements) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-emerald-400">
                      STUDENT FINAL PRICE
                    </label>
                    <span className="text-[10px] text-slate-400">
                      Platform Range: ₹10 – ₹250
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 font-black text-lg">
                        ₹
                      </span>
                      <input
                        type="number"
                        min={10}
                        max={250}
                        step={1}
                        value={editFinalPrice}
                        onChange={(e) => setEditFinalPrice(Number(e.target.value))}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-black text-lg focus:outline-none focus:border-cyan-400"
                        placeholder="25"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setEditFinalPrice(selectedSubmission.ai_recommended_price || 25)}
                      className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-cyan-300 text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      Use AI (₹{selectedSubmission.ai_recommended_price || 25})
                    </button>
                  </div>

                  {/* Verbatim Helper Text */}
                  <p className="text-[11px] text-slate-400 italic">
                    "The AI price is a recommendation. You can change it before confirming."
                  </p>

                  {/* Preset quick buttons */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[10, 15, 20, 25, 30, 35, 49, 79].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setEditFinalPrice(amt)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          editFinalPrice === amt
                            ? 'bg-cyan-500 text-slate-950 font-black'
                            : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        ₹{amt}
                        {amt === (selectedSubmission.ai_recommended_price || 25) && ' (AI)'}
                      </button>
                    ))}
                  </div>

                  {/* Live Comparison */}
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">AI Recommended Price:</span>
                      <span className="font-bold text-slate-200 ml-1">₹{selectedSubmission.ai_recommended_price || 25}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-cyan-400 uppercase">Your Final Price:</span>
                      <span className="font-black text-emerald-400 ml-1">₹{editFinalPrice}</span>
                    </div>
                  </div>

                  {priceSuccessMsg && (
                    <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{priceSuccessMsg}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedSubmission.review_reason && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-300">
                  <p className="font-bold">Review Reason:</p>
                  <p className="mt-0.5">{selectedSubmission.review_reason}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleConfirmStudentPrice}
                  disabled={isSubmittingPrice}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingPrice ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Confirming & Publishing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm Price & Publish</span>
                    </>
                  )}
                </button>

                {selectedSubmission.status === 'REVIEW_REQUIRED' && (
                  <button
                    onClick={() => handleAdminApprove(selectedSubmission)}
                    disabled={approvingId === selectedSubmission.id}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve & Auto-Publish Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
