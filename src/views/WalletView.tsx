import React, { useState, useEffect } from 'react';
import { User } from '../types/user';
import {
  TokenPackage,
  TokenTransaction,
  TokenTransactionType,
  TokenUnlock,
  ContributorReward,
  TokenWalletSummary,
} from '../types/token';
import { tokenService } from '../services/tokenService';
import { contentService } from '../services/contentService';
import { ContentItem } from '../types/content';
import { TokenCheckoutModal } from '../components/token/TokenCheckoutModal';
import { UserInitialsBadge } from '../components/UserInitialsBadge';
import {
  Coins,
  Wallet,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  ShoppingBag,
  Gift,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  Search,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Award,
  HelpCircle,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';

export interface WalletViewProps {
  currentUser: User;
  onNavigate: (view: string, payload?: any) => void;
  initialTab?: 'overview' | 'buy' | 'earn' | 'unlocked';
}

export const WalletView: React.FC<WalletViewProps> = ({
  currentUser,
  onNavigate,
  initialTab = 'overview',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'buy' | 'earn' | 'unlocked'>(initialTab);
  const [summary, setSummary] = useState<TokenWalletSummary>(() =>
    tokenService.getWalletSummary(currentUser)
  );
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [packages, setPackages] = useState<TokenPackage[]>([]);
  const [rewards, setRewards] = useState<ContributorReward[]>([]);
  const [unlockedItems, setUnlockedItems] = useState<{ unlock: TokenUnlock; material?: ContentItem }[]>(
    []
  );

  // Filters
  const [typeFilter, setTypeFilter] = useState<TokenTransactionType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Checkout modal
  const [selectedPkgForCheckout, setSelectedPkgForCheckout] = useState<TokenPackage | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const refreshWalletData = () => {
    const sum = tokenService.getWalletSummary(currentUser);
    setSummary(sum);

    const txns = tokenService.getUserTransactions(currentUser.id, typeFilter);
    setTransactions(txns);

    const pkgs = tokenService.getPackages(true);
    setPackages(pkgs);

    const rew = tokenService.getContributorRewards(currentUser.id);
    setRewards(rew);

    const userUnlocks = tokenService.getUserUnlockedResources(currentUser.id);
    const allMaterials = contentService.getAllContent(true);
    const mapped = userUnlocks.map((u) => ({
      unlock: u,
      material: allMaterials.find((m) => m.id === u.resource_id),
    }));
    setUnlockedItems(mapped);
  };

  useEffect(() => {
    refreshWalletData();
  }, [currentUser.id, typeFilter]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleOpenBuyModal = (pkg: TokenPackage) => {
    setSelectedPkgForCheckout(pkg);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = () => {
    refreshWalletData();
  };

  const filteredTransactions = transactions.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      t.description.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q) ||
      t.amount.toString().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 pb-20">
      {/* Top Header Banner */}
      <div className="border-b border-slate-800/80 bg-gradient-to-b from-[#0e1428] via-[#090d1c] to-[#070a13]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Coins className="w-4 h-4" />
                <span>YuvaSetu Student Wallet</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                YuvaTokens & Academic Rewards
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Earn tokens by solving doubts and helping peers. Use tokens to unlock advanced masterclasses and exam playbooks.
              </p>
            </div>

            {/* Quick Balance Hero Card */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900/90 to-slate-900/90 border border-amber-500/30 shadow-xl shadow-amber-950/20">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Available Balance
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-white">{summary.available_balance}</span>
                  <span className="text-sm font-bold text-amber-400">VT</span>
                </div>
              </div>
              <div className="pl-4 border-l border-slate-800 flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('buy')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Get Tokens</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('earn')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Learn & Earn</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> Total Earned
              </span>
              <p className="text-lg font-black text-white mt-1">+{summary.total_earned} VT</p>
              <p className="text-[10px] text-slate-400">From verified contributions</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <Gift className="w-3 h-3" /> Welcome Bonus
              </span>
              <p className="text-lg font-black text-white mt-1">+{summary.total_free_received} VT</p>
              <p className="text-[10px] text-slate-400">Awarded for joining</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <ShoppingBag className="w-3 h-3" /> Total Purchased
              </span>
              <p className="text-lg font-black text-white mt-1">+{summary.total_purchased} VT</p>
              <p className="text-[10px] text-slate-400">Via UPI / cards</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                <Unlock className="w-3 h-3" /> Unlocked Materials
              </span>
              <p className="text-lg font-black text-white mt-1">
                {summary.total_unlocked_resources}{' '}
                <span className="text-xs font-normal text-slate-400">({summary.total_spent} VT)</span>
              </p>
              <p className="text-[10px] text-slate-400">Permanent account access</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-6 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Ledger & History</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('buy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'buy'
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Buy Tokens</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-400">
              ₹10+
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('earn')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'earn'
                ? 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Learn & Earn Rewards</span>
            {rewards.filter((r) => r.status === 'PENDING').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('unlocked')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'unlocked'
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>My Unlocked Items ({unlockedItems.length})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW / TRANSACTION LEDGER */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                {(['ALL', 'PURCHASE', 'EARNED', 'SPENT', 'FREE_CREDIT', 'REFUND'] as const).map(
                  (type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTypeFilter(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        typeFilter === type
                          ? 'bg-slate-800 text-white font-bold border border-slate-700'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {type === 'ALL'
                        ? 'All'
                        : type === 'PURCHASE'
                        ? 'Purchases'
                        : type === 'EARNED'
                        ? 'Earned'
                        : type === 'SPENT'
                        ? 'Spent'
                        : type === 'FREE_CREDIT'
                        ? 'Free Bonus'
                        : 'Refunds'}
                    </button>
                  )
                )}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter transactions..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#0a0e1a] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Transactions List */}
            {filteredTransactions.length > 0 ? (
              <div className="space-y-2.5">
                {filteredTransactions.map((txn) => {
                  const isPositive = txn.amount > 0;
                  return (
                    <div
                      key={txn.id}
                      className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                            txn.type === 'EARNED'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : txn.type === 'PURCHASE'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                              : txn.type === 'FREE_CREDIT'
                              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                              : txn.type === 'REFUND'
                              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                          }`}
                        >
                          {txn.type === 'EARNED' && <Sparkles className="w-5 h-5" />}
                          {txn.type === 'PURCHASE' && <ShoppingBag className="w-5 h-5" />}
                          {txn.type === 'FREE_CREDIT' && <Gift className="w-5 h-5" />}
                          {txn.type === 'REFUND' && <ArrowDownLeft className="w-5 h-5" />}
                          {txn.type === 'SPENT' && <Unlock className="w-5 h-5" />}
                          {txn.type === 'ADMIN_ADJUSTMENT' && <ShieldCheck className="w-5 h-5" />}
                        </div>

                        <div className="min-w-0 space-y-0.5">
                          <p className="text-xs sm:text-sm font-bold text-white truncate">
                            {txn.description}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <span className="font-mono text-slate-500">{txn.id}</span>
                            <span>•</span>
                            <span>{new Date(txn.created_at).toLocaleDateString()} {new Date(txn.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {txn.status === 'COMPLETED' && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Verified
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div
                          className={`text-sm sm:text-base font-black ${
                            isPositive ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isPositive ? `+${txn.amount}` : txn.amount} VT
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Balance: {txn.balance_after} VT
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
                <Coins className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-300">No transactions found</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Your token ledger is clean. Participate in the community or purchase packages to see activity here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BUY TOKENS */}
        {activeTab === 'buy' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                  Micro-Pricing Guarantee
                </span>
                <h3 className="text-base font-bold text-white">Affordable Academic Credits</h3>
                <p className="text-xs text-slate-400 max-w-xl">
                  Packages start at just ₹10. YuvaSetu tokens are permanent and never expire.
                </p>
              </div>
              <ShieldCheck className="w-8 h-8 text-amber-400 hidden sm:block opacity-80" />
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {packages.map((pkg) => {
                const total = pkg.token_amount + (pkg.bonus_tokens || 0);
                return (
                  <div
                    key={pkg.id}
                    className={`relative p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                      pkg.popular
                        ? 'bg-gradient-to-b from-amber-500/10 via-slate-900/90 to-[#0d1222] border-amber-500/50 shadow-lg shadow-amber-950/30 scale-[1.02]'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {pkg.badge && (
                      <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm">
                        {pkg.badge}
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">
                          {pkg.popular ? 'Most Popular' : 'Token Pack'}
                        </span>
                        <h4 className="text-base font-bold text-white">{pkg.name}</h4>
                      </div>

                      <div className="flex items-baseline gap-1 py-1">
                        <span className="text-3xl font-black text-white">₹{pkg.rupee_amount}</span>
                        <span className="text-xs text-slate-400">INR</span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#080c16] border border-slate-800/80 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Tokens:</span>
                          <span className="font-bold text-white">{pkg.token_amount} VT</span>
                        </div>
                        {pkg.bonus_tokens > 0 && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-emerald-400 font-semibold">Bonus:</span>
                            <span className="font-bold text-emerald-400">+{pkg.bonus_tokens} VT</span>
                          </div>
                        )}
                        <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-xs">
                          <span className="font-bold text-amber-400">Total Credits:</span>
                          <span className="font-black text-amber-400">{total} VT</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenBuyModal(pkg)}
                      className={`w-full mt-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        pkg.popular
                          ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-500/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Buy for ₹{pkg.rupee_amount}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Fair Learning Pledge */}
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2 text-xs text-slate-400">
              <h5 className="font-bold text-slate-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                YuvaSetu Fair Learning Pledge & Transparency
              </h5>
              <p>
                Core educational content, standard lecture notes, live sessions, and doubt rooms are 100% free and open for all enrolled students. Tokens are reserved strictly for specialized advanced masterclasses, mock exam blueprint dossiers, and compensating dedicated peer mentors.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: LEARN & EARN */}
        {activeTab === 'earn' && (
          <div className="space-y-6">
            {/* Contributor Profile Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-slate-900/90 to-[#0d1222] border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <UserInitialsBadge name={currentUser.name} role={currentUser.role} size="lg" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{currentUser.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Peer Scholar Contributor
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Total Contributor Rewards Earned: <strong className="text-emerald-400">+{summary.total_earned} VT</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('community')}
                className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Go to Community & Answer Questions</span>
              </button>
            </div>

            {/* Earning Opportunities (Reward Rules) */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                How to Earn YuvaTokens
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Accepted Solution</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      +10 VT
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Write thorough, accurate solutions to peer questions in the YuvaSetu Community. When marked as accepted, tokens are credited automatically.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">High-Impact Insight</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-black bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      +2 VT
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Earn tokens when your explanations receive 5+ helpful upvotes from students across engineering colleges.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Admin-Curated Guide</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-black bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      +25 VT
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Submit outstanding study notes, cheat-sheets, or derivations. Once reviewed and verified by academic admins, receive high reward bonuses.
                  </p>
                </div>
              </div>
            </div>

            {/* Student's Reward History */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                Your Contributor Rewards History ({rewards.length})
              </h4>

              {rewards.length > 0 ? (
                <div className="space-y-2">
                  {rewards.map((rew) => (
                    <div
                      key={rew.id}
                      className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white truncate">
                            {rew.rule_title}
                          </span>
                          <span
                            className={`px-2 py-0.2 rounded text-[10px] font-bold border ${
                              rew.status === 'APPROVED'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : rew.status === 'PENDING'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}
                          >
                            {rew.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate">Source: {rew.source_title}</p>
                        {rew.notes && (
                          <p className="text-[11px] text-slate-500 italic">"{rew.notes}"</p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-black text-emerald-400">+{rew.amount} VT</span>
                        <p className="text-[10px] text-slate-500">
                          {new Date(rew.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center rounded-xl bg-slate-900/30 border border-slate-800 text-xs text-slate-400">
                  You haven't claimed any contributor rewards yet. Start by answering peer questions in the Community!
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: UNLOCKED RESOURCES */}
        {activeTab === 'unlocked' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                All Unlocked Study Materials ({unlockedItems.length})
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('explore')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <span>Browse All Explore Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {unlockedItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unlockedItems.map(({ unlock, material }) => (
                  <div
                    key={unlock.id}
                    className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-4 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Unlocked
                        </span>
                        <span className="text-[11px] font-bold text-amber-400">
                          {unlock.token_price} VT
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white line-clamp-2">
                        {unlock.resource_title}
                      </h4>

                      {material && (
                        <p className="text-xs text-slate-400 line-clamp-2">{material.description}</p>
                      )}

                      <div className="text-[11px] text-slate-500">
                        Unlocked on {new Date(unlock.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigate('content_details', { contentId: unlock.resource_id })}
                      className="w-full py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Open Study Material</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
                <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-300">No unlocked materials yet</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Explore our advanced masterclass monographs in the Explore section and use your YuvaTokens to unlock them.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('explore')}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Masterclasses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <TokenCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        pkg={selectedPkgForCheckout}
        currentUser={currentUser}
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  );
};
