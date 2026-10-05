import React, { useState, useEffect } from 'react';
import { User } from '../types/user';
import { DoubtItem } from '../types/doubt';
import { doubtService } from '../services/doubtService';
import { DoubtCard } from '../components/doubts/DoubtCard';
import { PLATFORM_SUBJECTS } from '../data/subjectData';
import {
  HelpCircle,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  BookOpen,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Clock,
  Flame,
  AlertCircle,
  Radio,
} from 'lucide-react';

export interface DoubtsViewProps {
  currentUser: User | null;
  onNavigate: (view: string, payload?: any) => void;
  onOpenAuth: () => void;
  initialTab?: 'recent' | 'popular' | 'my_doubts' | 'unanswered';
}

export const DoubtsView: React.FC<DoubtsViewProps> = ({
  currentUser,
  onNavigate,
  onOpenAuth,
  initialTab = 'recent',
}) => {
  const [activeTab, setActiveTab] = useState<'recent' | 'popular' | 'my_doubts' | 'unanswered'>(
    initialTab
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState<'recent' | 'answered' | 'helpful'>('recent');

  const [doubts, setDoubts] = useState<DoubtItem[]>([]);

  const refreshDoubts = () => {
    const fetched = doubtService.getAllDoubts({
      tab: activeTab,
      search: searchQuery,
      subjectId: selectedSubject,
      status: selectedStatus,
      sortBy,
      studentId: currentUser?.id,
    });
    setDoubts(fetched);
  };

  useEffect(() => {
    refreshDoubts();
  }, [activeTab, searchQuery, selectedSubject, selectedStatus, sortBy, currentUser]);

  const doubtMetrics = doubtService.getDoubtMetrics();

  const handleAskDoubtClick = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    onNavigate('ask_doubt');
  };

  return (
    <div id="vidyasetu-doubts-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* 1. HERO HEADER WITH HEADING & SUBTITLE */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d1428] via-[#090d1c] to-[#140e26] border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Academic Doubt Resolution • 100% Free
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-['Outfit'] text-white tracking-tight">
            Clear Your Doubts
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Ask questions, understand concepts, and learn better. Get comprehensive answers and verified explanations from educators.
          </p>
        </div>

        {/* Large + Ask a Doubt Action Button */}
        <button
          onClick={handleAskDoubtClick}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-cyan-500/25 transition-all duration-200 flex items-center justify-center gap-2.5 shrink-0 cursor-pointer transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>+ Ask a Doubt</span>
        </button>
      </div>

      {/* 2. STATS BAR & QUICK METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#0b0f1d] border border-slate-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-lg sm:text-xl font-black text-white">{doubtMetrics.totalDoubts}</p>
            <p className="text-xs text-slate-400 font-medium">Total Doubts</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b0f1d] border border-slate-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-lg sm:text-xl font-black text-white">{doubtMetrics.resolvedDoubts}</p>
            <p className="text-xs text-slate-400 font-medium">Resolved</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b0f1d] border border-slate-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-lg sm:text-xl font-black text-white">{doubtMetrics.unansweredDoubts}</p>
            <p className="text-xs text-slate-400 font-medium">Awaiting Answer</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b0f1d] border border-slate-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-lg sm:text-xl font-black text-white">{doubtMetrics.totalAnswers}</p>
            <p className="text-xs text-slate-400 font-medium">Verified Solutions</p>
          </div>
        </div>
      </div>

      {/* 3. TABS: Recent Doubts, Popular Doubts, My Doubts, Unanswered Doubts */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'recent'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Recent Doubts
          </button>
          <button
            onClick={() => setActiveTab('popular')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'popular'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Popular Doubts
          </button>
          <button
            onClick={() => {
              if (!currentUser) {
                onOpenAuth();
                return;
              }
              setActiveTab('my_doubts');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'my_doubts'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            My Doubts
          </button>
          <button
            onClick={() => setActiveTab('unanswered')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'unanswered'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Unanswered Doubts
          </button>
        </div>

        {/* Total matching items label */}
        <span className="text-xs text-slate-400 font-medium">
          Showing {doubts.length} {doubts.length === 1 ? 'question' : 'questions'}
        </span>
      </div>

      {/* 4. SEARCH & FILTER CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
        {/* Search Bar */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, description, subject, topic or tags (e.g. binary search)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0b0f1d] border border-slate-800 text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-slate-300"
            >
              ✕
            </button>
          )}
        </div>

        {/* Subject Filter */}
        <div className="md:col-span-3">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-[#0b0f1d] border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Subjects</option>
            {PLATFORM_SUBJECTS.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter & Sort Dropdown */}
        <div className="md:col-span-3 flex gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-1/2 px-3 py-2.5 rounded-2xl bg-[#0b0f1d] border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Status</option>
            <option value="OPEN">OPEN</option>
            <option value="ANSWERED">ANSWERED</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-1/2 px-3 py-2.5 rounded-2xl bg-[#0b0f1d] border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="recent">Most Recent</option>
            <option value="answered">Most Answered</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* 5. DOUBTS LIST / CARDS FEED */}
      {doubts.length > 0 ? (
        <div className="space-y-4">
          {doubts.map((item) => (
            <DoubtCard
              key={item.id}
              doubt={item}
              isOwner={currentUser?.id === item.student_id}
              onOpen={(d) => onNavigate('doubt_detail', { doubtId: d.id })}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 rounded-3xl bg-[#0b0f1d] border border-slate-800 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-slate-500 flex items-center justify-center mx-auto">
            <HelpCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Doubts Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {activeTab === 'my_doubts'
                ? "You haven't asked any doubts yet. Click below to ask your first academic question."
                : 'No academic questions matched your active filters or search terms.'}
            </p>
          </div>
          <button
            onClick={handleAskDoubtClick}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Ask a Doubt</span>
          </button>
        </div>
      )}
    </div>
  );
};
