import React, { useState, useEffect } from 'react';
import { User } from '../types/user';
import {
  TokenPackage,
  TokenTransaction,
  TokenTransactionType,
  ContributorReward,
  RewardRule,
  TokenSettings,
  AdminBalanceAdjustmentDTO,
} from '../types/token';
import { tokenService } from '../services/tokenService';
import { authService } from '../services/authService';
import { UserInitialsBadge } from '../components/UserInitialsBadge';
import {
  Coins,
  ShieldCheck,
  Package,
  Sparkles,
  Sliders,
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Eye,
  Gift,
  Lock,
  Unlock,
  Check,
  X,
} from 'lucide-react';

export interface AdminTokensViewProps {
  currentUser: User;
  onNavigate: (view: string, payload?: any) => void;
}

export const AdminTokensView: React.FC<AdminTokensViewProps> = ({
  currentUser,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'ledger' | 'packages' | 'rewards' | 'rules' | 'settings'>('ledger');
  const [stats, setStats] = useState(() => tokenService.getPlatformTokenStats());
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [packages, setPackages] = useState<TokenPackage[]>([]);
  const [rewards, setRewards] = useState<ContributorReward[]>([]);
  const [rules, setRules] = useState<RewardRule[]>([]);
  const [settings, setSettings] = useState<TokenSettings>(() => tokenService.getSettings());
  const [allStudents, setAllStudents] = useState<User[]>([]);

  // Ledger Filter States
  const [typeFilter, setTypeFilter] = useState<TokenTransactionType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentFilter, setSelectedStudentFilter] = useState('');

  // Modals
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TokenPackage | null>(null);
  const [packageFormData, setPackageFormData] = useState({
    name: '',
    rupee_amount: 10,
    token_amount: 100,
    bonus_tokens: 0,
    active: true,
    badge: '',
    popular: false,
  });

  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [adjustmentTargetUserId, setAdjustmentTargetUserId] = useState('');
  const [adjustmentAmount, setAdjustmentAmount] = useState(50);
  const [adjustmentReason, setAdjustmentReason] = useState('');

  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedTxnForRefund, setSelectedTxnForRefund] = useState<TokenTransaction | null>(null);
  const [refundReason, setRefundReason] = useState('');

  const [isRewardReviewModalOpen, setIsRewardReviewModalOpen] = useState(false);
  const [selectedRewardForReview, setSelectedRewardForReview] = useState<ContributorReward | null>(null);
  const [rewardReviewAction, setRewardReviewAction] = useState<'approve' | 'reject'>('approve');
  const [rewardReviewNotes, setRewardReviewNotes] = useState('');

  const [isRuleEditModalOpen, setIsRuleEditModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<RewardRule | null>(null);
  const [ruleFormData, setRuleFormData] = useState({
    token_amount: 10,
    daily_limit: 5,
    active: true,
    requires_admin_approval: false,
  });

  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const refreshAllData = () => {
    setStats(tokenService.getPlatformTokenStats());
    setTransactions(
      tokenService.getAllTransactions({
        type: typeFilter,
        searchQuery: searchQuery,
        studentId: selectedStudentFilter || undefined,
      })
    );
    setPackages(tokenService.getPackages(false));
    setRewards(tokenService.getContributorRewards());
    setRules(tokenService.getRewardRules(false));
    setSettings(tokenService.getSettings());

    const students = authService.getAllUsers().filter((u) => u.role === 'student');
    setAllStudents(students);
  };

  useEffect(() => {
    refreshAllData();
  }, [typeFilter, searchQuery, selectedStudentFilter]);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4500);
  };

  // ----------------------------------------------------
  // Package Management Handlers
  // ----------------------------------------------------
  const handleOpenAddPackage = () => {
    setEditingPackage(null);
    setPackageFormData({
      name: '',
      rupee_amount: 10,
      token_amount: 100,
      bonus_tokens: 0,
      active: true,
      badge: '',
      popular: false,
    });
    setIsPackageModalOpen(true);
  };

  const handleOpenEditPackage = (pkg: TokenPackage) => {
    setEditingPackage(pkg);
    setPackageFormData({
      name: pkg.name,
      rupee_amount: pkg.rupee_amount,
      token_amount: pkg.token_amount,
      bonus_tokens: pkg.bonus_tokens,
      active: pkg.active,
      badge: pkg.badge || '',
      popular: !!pkg.popular,
    });
    setIsPackageModalOpen(true);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageFormData.name.trim()) {
      showNotification('error', 'Package name is required.');
      return;
    }

    if (editingPackage) {
      tokenService.updatePackage(editingPackage.id, packageFormData);
      showNotification('success', `Updated package "${packageFormData.name}".`);
    } else {
      tokenService.createPackage(packageFormData);
      showNotification('success', `Created new package "${packageFormData.name}".`);
    }

    setIsPackageModalOpen(false);
    refreshAllData();
  };

  const handleDeletePackage = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete package "${name}"?`)) {
      tokenService.deletePackage(id);
      showNotification('success', `Deleted package "${name}".`);
      refreshAllData();
    }
  };

  // ----------------------------------------------------
  // Reward Review Handlers
  // ----------------------------------------------------
  const handleOpenRewardReview = (rew: ContributorReward, action: 'approve' | 'reject') => {
    setSelectedRewardForReview(rew);
    setRewardReviewAction(action);
    setRewardReviewNotes('');
    setIsRewardReviewModalOpen(true);
  };

  const handleExecuteRewardReview = () => {
    if (!selectedRewardForReview) return;

    if (rewardReviewAction === 'approve') {
      const res = tokenService.approveReward(
        selectedRewardForReview.id,
        currentUser,
        rewardReviewNotes || 'Verified academic quality by Admin'
      );
      if (res.success) {
        showNotification('success', `Approved reward (+${selectedRewardForReview.amount} VT) for ${selectedRewardForReview.user_name}.`);
      } else {
        showNotification('error', res.error || 'Failed to approve reward.');
      }
    } else {
      if (!rewardReviewNotes.trim()) {
        showNotification('error', 'A mandatory rejection reason is required.');
        return;
      }
      const res = tokenService.rejectReward(
        selectedRewardForReview.id,
        currentUser,
        rewardReviewNotes.trim()
      );
      if (res.success) {
        showNotification('success', `Rejected reward claim for ${selectedRewardForReview.user_name}.`);
      } else {
        showNotification('error', res.error || 'Failed to reject reward.');
      }
    }

    setIsRewardReviewModalOpen(false);
    refreshAllData();
  };

  // ----------------------------------------------------
  // Admin Balance Adjustment Handlers
  // ----------------------------------------------------
  const handleExecuteAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustmentTargetUserId) {
      showNotification('error', 'Select a student account.');
      return;
    }
    if (!adjustmentReason.trim()) {
      showNotification('error', 'Mandatory audit reason is required for balance adjustments.');
      return;
    }

    const targetStudent = allStudents.find((s) => s.id === adjustmentTargetUserId);
    if (!targetStudent) {
      showNotification('error', 'Student not found.');
      return;
    }

    const dto: AdminBalanceAdjustmentDTO = {
      user_id: adjustmentTargetUserId,
      amount: Number(adjustmentAmount),
      reason: adjustmentReason.trim(),
      admin_id: currentUser.id,
      admin_name: currentUser.name,
    };

    const res = tokenService.adminAdjustBalance(dto, targetStudent);
    if (res.success) {
      showNotification(
        'success',
        `Adjusted balance for ${targetStudent.name} (${dto.amount > 0 ? `+${dto.amount}` : dto.amount} VT).`
      );
      setIsAdjustmentModalOpen(false);
      setAdjustmentReason('');
      refreshAllData();
    } else {
      showNotification('error', res.error || 'Adjustment failed.');
    }
  };

  // ----------------------------------------------------
  // Refund Handler
  // ----------------------------------------------------
  const handleExecuteRefund = () => {
    if (!selectedTxnForRefund) return;
    if (!refundReason.trim()) {
      showNotification('error', 'A mandatory refund reason is required.');
      return;
    }

    const res = tokenService.processRefund(
      selectedTxnForRefund.id,
      currentUser,
      refundReason.trim()
    );

    if (res.success) {
      showNotification('success', `Refund processed for transaction ${selectedTxnForRefund.id}.`);
      setIsRefundModalOpen(false);
      setRefundReason('');
      refreshAllData();
    } else {
      showNotification('error', res.error || 'Failed to process refund.');
    }
  };

  // ----------------------------------------------------
  // Rule Edit Handler
  // ----------------------------------------------------
  const handleOpenEditRule = (rule: RewardRule) => {
    setEditingRule(rule);
    setRuleFormData({
      token_amount: rule.token_amount,
      daily_limit: rule.daily_limit,
      active: rule.active,
      requires_admin_approval: rule.requires_admin_approval,
    });
    setIsRuleEditModalOpen(true);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;

    tokenService.updateRewardRule(editingRule.id, ruleFormData);
    showNotification('success', `Updated reward rule "${editingRule.title}".`);
    setIsRuleEditModalOpen(false);
    refreshAllData();
  };

  // ----------------------------------------------------
  // CSV Export
  // ----------------------------------------------------
  const handleExportCSV = () => {
    const headers = [
      'Transaction ID',
      'Timestamp',
      'Student Name',
      'Student Email',
      'Type',
      'Amount (VT)',
      'Balance After (VT)',
      'Status',
      'Description',
      'Admin Name',
      'Audit Reason',
    ];

    const rows = transactions.map((t) => [
      t.id,
      t.created_at,
      `"${t.user_name}"`,
      t.user_email,
      t.type,
      t.amount,
      t.balance_after,
      t.status,
      `"${t.description.replace(/"/g, '""')}"`,
      t.admin_name ? `"${t.admin_name}"` : '',
      t.admin_reason ? `"${t.admin_reason.replace(/"/g, '""')}"` : '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `YuvaSetu_Token_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('success', 'Exported token ledger CSV report.');
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 pb-20">
      {/* Top Banner */}
      <div className="border-b border-slate-800/80 bg-gradient-to-b from-[#13182e] via-[#0b1022] to-[#070a13]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>YuvaSetu Administrative Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                YuvaTokens Economy & Ledger Audit
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Server-authoritative ledger management, micro-transaction audits, contributor rewards, and package configuration.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAdjustmentModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Adjust Student Balance</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Ledger CSV</span>
              </button>
            </div>
          </div>

          {/* Status Message */}
          {statusMsg && (
            <div
              className={`mt-4 p-3 rounded-xl border text-xs font-semibold flex items-center justify-between animate-fadeIn ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <span>{statusMsg.text}</span>
              <button onClick={() => setStatusMsg(null)} className="p-1 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Economy Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Coins className="w-3 h-3" /> Purchased Tokens
              </span>
              <p className="text-base font-black text-white mt-1">+{stats.totalPurchased} VT</p>
              <p className="text-[10px] text-slate-400">Paid packages</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Earned by Peers
              </span>
              <p className="text-base font-black text-white mt-1">+{stats.totalEarned} VT</p>
              <p className="text-[10px] text-slate-400">Community answers</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <Gift className="w-3 h-3" /> Welcome Grants
              </span>
              <p className="text-base font-black text-white mt-1">+{stats.totalFreeCredited} VT</p>
              <p className="text-[10px] text-slate-400">Onboarding gifts</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                <Unlock className="w-3 h-3" /> Tokens Spent
              </span>
              <p className="text-base font-black text-white mt-1">-{stats.totalSpent} VT</p>
              <p className="text-[10px] text-slate-400">{stats.totalUnlocksCount} unlocked packs</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> In Circulation
              </span>
              <p className="text-base font-black text-white mt-1">
                {stats.totalOutstandingInCirculation} VT
              </p>
              <p className="text-[10px] text-slate-400">Platform liability</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Pending Reviews
              </span>
              <p className="text-base font-black text-white mt-1">
                {stats.pendingRewardsCount}{' '}
                {stats.pendingRewardsCount > 0 && (
                  <span className="text-xs font-bold text-amber-400">Claim(s)</span>
                )}
              </p>
              <p className="text-[10px] text-slate-400">Requires verification</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-6 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('ledger')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'ledger'
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ledger Audit & Transactions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('packages')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'packages'
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Packages ({packages.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rewards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'rewards'
                ? 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Reward Claims</span>
            {stats.pendingRewardsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white">
                {stats.pendingRewardsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Reward Rules Engine</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Economy Settings</span>
          </button>
        </div>

        {/* TAB 1: LEDGER AUDIT */}
        {activeTab === 'ledger' && (
          <div className="space-y-4">
            {/* Filter controls */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                {(
                  [
                    'ALL',
                    'PURCHASE',
                    'EARNED',
                    'SPENT',
                    'FREE_CREDIT',
                    'ADMIN_ADJUSTMENT',
                    'REFUND',
                  ] as const
                ).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTypeFilter(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      typeFilter === t
                        ? 'bg-slate-800 text-white font-bold border border-slate-700'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t === 'ALL'
                      ? 'All'
                      : t === 'PURCHASE'
                      ? 'Purchases'
                      : t === 'EARNED'
                      ? 'Earned'
                      : t === 'SPENT'
                      ? 'Spent'
                      : t === 'FREE_CREDIT'
                      ? 'Free'
                      : t === 'ADMIN_ADJUSTMENT'
                      ? 'Admin Adj.'
                      : 'Refunds'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                  value={selectedStudentFilter}
                  onChange={(e) => setSelectedStudentFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#0a0e1a] border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="">All Students</option>
                  {allStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.email})
                    </option>
                  ))}
                </select>

                <div className="relative w-full md:w-60">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ledger..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#0a0e1a] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Ledger Table */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0b0f1d] text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Txn ID / Time</th>
                      <th className="p-3.5">Student Account</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">Description</th>
                      <th className="p-3.5 text-right">Amount (VT)</th>
                      <th className="p-3.5 text-right">Balance After</th>
                      <th className="p-3.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {transactions.length > 0 ? (
                      transactions.map((txn) => {
                        const isPositive = txn.amount > 0;
                        return (
                          <tr key={txn.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="p-3.5 whitespace-nowrap">
                              <span className="font-mono text-slate-400">{txn.id}</span>
                              <div className="text-[10px] text-slate-500">
                                {new Date(txn.created_at).toLocaleDateString()} {new Date(txn.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>

                            <td className="p-3.5 whitespace-nowrap">
                              <div className="font-bold text-white">{txn.user_name}</div>
                              <div className="text-[11px] text-slate-400">{txn.user_email}</div>
                            </td>

                            <td className="p-3.5 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                                  txn.type === 'EARNED'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    : txn.type === 'PURCHASE'
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                    : txn.type === 'FREE_CREDIT'
                                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                    : txn.type === 'REFUND'
                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                    : txn.type === 'ADMIN_ADJUSTMENT'
                                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                }`}
                              >
                                {txn.type}
                              </span>
                            </td>

                            <td className="p-3.5 max-w-xs truncate text-slate-300">
                              <div>{txn.description}</div>
                              {txn.admin_reason && (
                                <div className="text-[10px] text-amber-300/80 italic">
                                  Audit: {txn.admin_reason}
                                </div>
                              )}
                            </td>

                            <td className="p-3.5 text-right font-black whitespace-nowrap">
                              <span className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>
                                {isPositive ? `+${txn.amount}` : txn.amount} VT
                              </span>
                            </td>

                            <td className="p-3.5 text-right font-bold text-slate-300 whitespace-nowrap">
                              {txn.balance_after} VT
                            </td>

                            <td className="p-3.5 text-center whitespace-nowrap">
                              {txn.status !== 'REVERSED' && (txn.type === 'PURCHASE' || txn.type === 'SPENT') ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedTxnForRefund(txn);
                                    setRefundReason('');
                                    setIsRefundModalOpen(true);
                                  }}
                                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
                                >
                                  Refund
                                </button>
                              ) : txn.status === 'REVERSED' ? (
                                <span className="text-[10px] font-bold text-slate-500">
                                  Reversed
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-600">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500">
                          No transactions matching criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PACKAGES */}
        {activeTab === 'packages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Active Token Packages</h3>
                <p className="text-xs text-slate-400">
                  Configure student token bundles, rupee price points, and bonus multipliers.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddPackage}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Package</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                    pkg.active
                      ? 'bg-slate-900/70 border-slate-800'
                      : 'bg-slate-900/30 border-slate-800/40 opacity-60'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-0.2 rounded text-[10px] font-black uppercase ${
                          pkg.active
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {pkg.active ? 'Active' : 'Disabled'}
                      </span>
                      {pkg.badge && (
                        <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300">
                          {pkg.badge}
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white">{pkg.name}</h4>

                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-white">₹{pkg.rupee_amount}</span>
                      <span className="text-xs text-slate-400">INR</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#080c18] border border-slate-800/80 space-y-1 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Tokens:</span>
                        <span className="font-bold text-white">{pkg.token_amount} VT</span>
                      </div>
                      {pkg.bonus_tokens > 0 && (
                        <div className="flex justify-between text-emerald-400">
                          <span>Bonus:</span>
                          <span className="font-bold">+{pkg.bonus_tokens} VT</span>
                        </div>
                      )}
                      <div className="pt-1 border-t border-slate-800 flex justify-between font-bold text-amber-400">
                        <span>Total:</span>
                        <span>{pkg.token_amount + pkg.bonus_tokens} VT</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-slate-800 mt-4">
                    <button
                      type="button"
                      onClick={() => handleOpenEditPackage(pkg)}
                      className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePackage(pkg.id, pkg.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Package"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REWARD CLAIMS */}
        {activeTab === 'rewards' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  Student Contributor Reward Claims ({rewards.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Review student community solutions, verify academic accuracy, and grant token compensations.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {rewards.map((rew) => (
                <div
                  key={rew.id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{rew.rule_title}</span>
                      <span
                        className={`px-2 py-0.2 rounded text-[10px] font-black uppercase ${
                          rew.status === 'APPROVED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : rew.status === 'PENDING'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {rew.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      Contributor: <strong className="text-white">{rew.user_name}</strong> ({rew.user_email})
                    </p>
                    <p className="text-xs text-slate-400 truncate">Source: {rew.source_title}</p>
                    {rew.notes && (
                      <p className="text-[11px] text-slate-500 italic">Notes: "{rew.notes}"</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-base font-black text-emerald-400">+{rew.amount} VT</span>
                      <div className="text-[10px] text-slate-500">
                        {new Date(rew.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    {rew.status === 'PENDING' && (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenRewardReview(rew, 'approve')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenRewardReview(rew, 'reject')}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: REWARD RULES ENGINE */}
        {activeTab === 'rules' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Learn & Earn Rules Engine</h3>
              <p className="text-xs text-slate-400">
                Configure token award amounts and daily claim throttles for academic engagement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{rule.title}</h4>
                    <span
                      className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                        rule.active
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {rule.active ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{rule.description}</p>

                  <div className="p-3 rounded-xl bg-[#080c18] border border-slate-800/80 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Reward</span>
                      <span className="font-black text-amber-400">+{rule.token_amount} VT</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Daily Limit</span>
                      <span className="font-bold text-white">{rule.daily_limit} / day</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Review</span>
                      <span className="font-bold text-cyan-300">
                        {rule.requires_admin_approval ? 'Manual' : 'Instant'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenEditRule(rule)}
                    className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Configure Rule</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ECONOMY SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Platform Token Economics</h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#080c18] border border-slate-800">
                  <div>
                    <h5 className="font-bold text-slate-200">Welcome Grant for New Students</h5>
                    <p className="text-slate-400">
                      Auto-award 100 VT upon first account creation or wallet activation.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.welcome_tokens_enabled}
                    onChange={(e) => {
                      const updated = tokenService.updateSettings({
                        welcome_tokens_enabled: e.target.checked,
                      });
                      setSettings(updated);
                      showNotification('success', 'Updated welcome token grant status.');
                    }}
                    className="w-4 h-4 rounded text-cyan-500 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#080c18] border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-200">Welcome Grant Amount (VT)</span>
                    <span className="font-bold text-amber-400">{settings.welcome_token_amount} VT</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="25"
                    value={settings.welcome_token_amount}
                    onChange={(e) => {
                      const updated = tokenService.updateSettings({
                        welcome_token_amount: Number(e.target.value),
                      });
                      setSettings(updated);
                    }}
                    className="w-full accent-amber-400"
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#080c18] border border-slate-800 space-y-1">
                  <span className="font-bold text-slate-200">Conversion Rate Baseline</span>
                  <p className="text-slate-400">1 INR = {settings.conversion_rate_inr_to_vt} YuvaTokens (₹10 = 100 VT)</p>
                </div>

                <div className="p-3 rounded-xl bg-[#080c18] border border-slate-800 space-y-1">
                  <span className="font-bold text-slate-200">Payment Gateway Provider</span>
                  <p className="text-slate-400">{settings.active_provider_name}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD / EDIT PACKAGE */}
      {isPackageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-[#0e1324] border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingPackage ? 'Edit Package' : 'Create Token Package'}
              </h3>
              <button
                onClick={() => setIsPackageModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Package Name</label>
                <input
                  type="text"
                  required
                  value={packageFormData.name}
                  onChange={(e) => setPackageFormData({ ...packageFormData, name: e.target.value })}
                  placeholder="e.g. Starter Pack"
                  className="w-full px-3 py-2 rounded-xl bg-[#080c16] border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={packageFormData.rupee_amount}
                    onChange={(e) =>
                      setPackageFormData({
                        ...packageFormData,
                        rupee_amount: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#080c16] border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Token Amount (VT)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={packageFormData.token_amount}
                    onChange={(e) =>
                      setPackageFormData({
                        ...packageFormData,
                        token_amount: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#080c16] border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Bonus Tokens (VT)</label>
                  <input
                    type="number"
                    min="0"
                    value={packageFormData.bonus_tokens}
                    onChange={(e) =>
                      setPackageFormData({
                        ...packageFormData,
                        bonus_tokens: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#080c16] border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={packageFormData.badge}
                    onChange={(e) =>
                      setPackageFormData({ ...packageFormData, badge: e.target.value })
                    }
                    placeholder="e.g. +10% Bonus"
                    className="w-full px-3 py-2 rounded-xl bg-[#080c16] border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-slate-300 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={packageFormData.active}
                    onChange={(e) =>
                      setPackageFormData({ ...packageFormData, active: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-cyan-500"
                  />
                  <span>Active & Visible</span>
                </label>

                <label className="flex items-center gap-2 text-slate-300 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={packageFormData.popular}
                    onChange={(e) =>
                      setPackageFormData({ ...packageFormData, popular: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-cyan-500"
                  />
                  <span>Highlight as Popular</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPackageModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADMIN BALANCE ADJUSTMENT */}
      {isAdjustmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-[#0e1324] border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Manual Balance Adjustment</h3>
              <button
                onClick={() => setIsAdjustmentModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteAdjustment} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Target Student</label>
                <select
                  required
                  value={adjustmentTargetUserId}
                  onChange={(e) => setAdjustmentTargetUserId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#080c16] border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">Select Student...</option>
                  {allStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.email}) — Current Balance: {tokenService.getUserBalance(s.id)} VT
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Adjustment Amount (positive for credit, negative for debit)
                </label>
                <input
                  type="number"
                  required
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#080c16] border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Mandatory Audit Reason
                </label>
                <textarea
                  required
                  rows={3}
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  placeholder="e.g. Compensating student for hackathon peer mentoring session"
                  className="w-full px-3 py-2 rounded-xl bg-[#080c16] border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAdjustmentModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold"
                >
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REWARD REVIEW */}
      {isRewardReviewModalOpen && selectedRewardForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-[#0e1324] border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {rewardReviewAction === 'approve' ? 'Approve Reward Claim' : 'Reject Reward Claim'}
              </h3>
              <button
                onClick={() => setIsRewardReviewModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#080c16] border border-slate-800 space-y-1">
                <div className="text-slate-400">
                  Student: <strong className="text-white">{selectedRewardForReview.user_name}</strong>
                </div>
                <div className="text-slate-400">
                  Rule: <strong className="text-cyan-300">{selectedRewardForReview.rule_title}</strong>
                </div>
                <div className="text-slate-400">
                  Amount:{' '}
                  <strong className="text-emerald-400">+{selectedRewardForReview.amount} VT</strong>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  {rewardReviewAction === 'approve' ? 'Admin Review Note (Optional)' : 'Mandatory Rejection Reason'}
                </label>
                <textarea
                  rows={3}
                  value={rewardReviewNotes}
                  onChange={(e) => setRewardReviewNotes(e.target.value)}
                  placeholder={
                    rewardReviewAction === 'approve'
                      ? 'e.g. Excellent explanation with mathematical proof'
                      : 'e.g. Incomplete solution or duplicated content'
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#080c16] border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRewardReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteRewardReview}
                  className={`px-4 py-2 rounded-xl font-bold ${
                    rewardReviewAction === 'approve'
                      ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
                      : 'bg-rose-500 hover:bg-rose-400 text-white'
                  }`}
                >
                  Confirm {rewardReviewAction === 'approve' ? 'Approval' : 'Rejection'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REFUND CONFIRMATION */}
      {isRefundModalOpen && selectedTxnForRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-[#0e1324] border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Issue Transaction Refund</h3>
              <button
                onClick={() => setIsRefundModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#080c16] border border-slate-800 space-y-1">
                <div className="text-slate-400">
                  Target: <strong className="text-white">{selectedTxnForRefund.user_name}</strong>
                </div>
                <div className="text-slate-400">
                  Original: <strong>{selectedTxnForRefund.description}</strong>
                </div>
                <div className="text-slate-400">
                  Amount to Restore:{' '}
                  <strong className="text-emerald-400">
                    {Math.abs(selectedTxnForRefund.amount)} VT
                  </strong>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Mandatory Refund Reason</label>
                <textarea
                  required
                  rows={3}
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="e.g. Student mistakenly unlocked incorrect module"
                  className="w-full px-3 py-2 rounded-xl bg-[#080c16] border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRefundModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteRefund}
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold"
                >
                  Confirm Refund
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RULE EDIT */}
      {isRuleEditModalOpen && editingRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-[#0e1324] border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Configure Reward Rule</h3>
              <button
                onClick={() => setIsRuleEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="space-y-3.5 text-xs">
              <h4 className="font-bold text-white">{editingRule.title}</h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Token Amount (VT)</label>
                  <input
                    type="number"
                    min="1"
                    value={ruleFormData.token_amount}
                    onChange={(e) =>
                      setRuleFormData({ ...ruleFormData, token_amount: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#080c16] border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Daily Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={ruleFormData.daily_limit}
                    onChange={(e) =>
                      setRuleFormData({ ...ruleFormData, daily_limit: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#080c16] border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <label className="flex items-center gap-2 text-slate-300 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ruleFormData.active}
                    onChange={(e) =>
                      setRuleFormData({ ...ruleFormData, active: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-cyan-500"
                  />
                  <span>Active Rule</span>
                </label>

                <label className="flex items-center gap-2 text-slate-300 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ruleFormData.requires_admin_approval}
                    onChange={(e) =>
                      setRuleFormData({
                        ...ruleFormData,
                        requires_admin_approval: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded text-cyan-500"
                  />
                  <span>Requires Manual Admin Review Before Credit</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRuleEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold"
                >
                  Save Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
