import React, { useState, useMemo, useEffect } from 'react';
import { User } from '../types/user';
import { CommunityDiscussion, DiscussionCategory, DiscussionStatus } from '../types/community';
import { communityService } from '../services/communityService';
import { PLATFORM_SUBJECTS } from '../data/subjectData';
import { CommunityDiscussionCard } from '../components/community/CommunityDiscussionCard';
import { FollowSubjectsModal } from '../components/community/FollowSubjectsModal';
import {
  Users,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Sparkles,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  Tag,
  Radio,
  ArrowRight,
  Flame,
  Clock,
  Layers,
  ChevronRight,
  SlidersHorizontal,
  FolderPlus,
} from 'lucide-react';

interface CommunityViewProps {
  currentUser: User | null;
  onNavigate: (view: string, payload?: any) => void;
  onOpenAuth?: () => void;
  initialTab?: 'all' | 'trending' | 'recent' | 'following' | 'my';
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  currentUser,
  onNavigate,
  onOpenAuth,
  initialTab = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'recent' | 'following' | 'my'>(
    initialTab
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<DiscussionCategory | 'ALL'>('ALL');
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'discussed' | 'trending'>('recent');
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Popular topics and followed subject count
  const popularTopics = useMemo(() => communityService.getPopularTopics(), [reloadKey]);
  const followedSubjectIds = useMemo(
    () => (currentUser ? communityService.getFollowedSubjectIds(currentUser.id) : []),
    [currentUser, reloadKey]
  );

  // Filtered discussions
  const discussions = useMemo(() => {
    return communityService.getDiscussions(
      {
        searchQuery,
        subjectId: selectedSubject,
        topic: selectedTopic,
        discussionType: selectedType,
        sortBy: activeTab === 'trending' ? 'trending' : activeTab === 'recent' ? 'recent' : sortBy,
        onlyFollowing: activeTab === 'following',
        onlyMyDiscussions: activeTab === 'my',
      },
      currentUser?.id
    );
  }, [
    searchQuery,
    selectedSubject,
    selectedTopic,
    selectedType,
    sortBy,
    activeTab,
    currentUser,
    reloadKey,
  ]);

  const handleStartDiscussionClick = () => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    onNavigate('community_create');
  };

  const handleDiscussionCardClick = (id: string) => {
    onNavigate('community_detail', { discussionId: id });
  };

  const handleToggleHelpful = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    communityService.toggleHelpfulDiscussion(id, currentUser);
    setReloadKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#0a0d1a] text-slate-100 pb-20 font-['Outfit',sans-serif]">
      {/* Top Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111833] via-[#0d1226] to-[#0a0d1a] border-b border-cyan-900/30 pt-10 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_50%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-wide uppercase mb-3">
                <Users className="w-3.5 h-3.5" />
                YuvaSetu Community
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Learn Together
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Discuss academic concepts, share engineering insights, and collaborate with verified
                peers and mentors across YuvaSetu.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {currentUser && (
                <button
                  type="button"
                  onClick={() => setIsFollowModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all shadow-md"
                >
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  Followed Subjects ({followedSubjectIds.length})
                </button>
              )}

              <button
                type="button"
                onClick={handleStartDiscussionClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-lg shadow-cyan-950/60 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Start Discussion
              </button>
            </div>
          </div>

          {/* Quick Tabs */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-1 border-b border-slate-800/80">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              All Discussions
            </button>

            <button
              onClick={() => setActiveTab('trending')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'trending'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Trending Discussions
            </button>

            <button
              onClick={() => setActiveTab('recent')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'recent'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Recent Discussions
            </button>

            {currentUser && (
              <>
                <button
                  onClick={() => setActiveTab('following')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'following'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Followed Subjects ({followedSubjectIds.length})
                </button>

                <button
                  onClick={() => setActiveTab('my')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'my'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  My Discussions
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Feed (3 Cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search & Filter Bar */}
            <div className="bg-[#11172e] border border-cyan-900/40 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search discussions by keyword, topic, or subject..."
                    className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-500/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-slate-500 hover:text-white text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedSubject}
                    onChange={(e) => {
                      setSelectedSubject(e.target.value);
                      setSelectedTopic('ALL');
                    }}
                    className="bg-slate-900/80 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500/50 max-w-[180px]"
                  >
                    <option value="ALL">All Subjects</option>
                    {PLATFORM_SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as any)}
                    className="bg-slate-900/80 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500/50 max-w-[180px]"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="CONCEPT DISCUSSION">Concept Discussion</option>
                    <option value="EXAM PREPARATION">Exam Preparation</option>
                    <option value="CAREER / LEARNING">Career / Learning</option>
                    <option value="PROJECT DISCUSSION">Project Discussion</option>
                    <option value="RESOURCE DISCUSSION">Resource Discussion</option>
                    <option value="GENERAL DISCUSSION">General Discussion</option>
                  </select>
                </div>
              </div>

              {/* Secondary Filter Chips */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-300">
                    Showing {discussions.length} discussion{discussions.length === 1 ? '' : 's'}
                  </span>
                  {selectedTopic !== 'ALL' && (
                    <span className="inline-flex items-center gap-1 bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded-md border border-cyan-500/30">
                      Topic: {selectedTopic}
                      <button
                        onClick={() => setSelectedTopic('ALL')}
                        className="hover:text-white font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="helpful">Most Helpful</option>
                    <option value="discussed">Most Discussed</option>
                    <option value="trending">Trending Score</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Discussions Feed */}
            {discussions.length === 0 ? (
              <div className="bg-[#11172e]/60 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                  <HelpCircle className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No discussions found</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
                  {activeTab === 'following'
                    ? 'You have not followed any subjects yet or there are no discussions in your followed subjects.'
                    : 'Be the first to start an academic discussion on this topic.'}
                </p>
                {activeTab === 'following' ? (
                  <button
                    onClick={() => setIsFollowModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-950/40"
                  >
                    <BookOpen className="w-4 h-4" />
                    Manage Followed Subjects
                  </button>
                ) : (
                  <button
                    onClick={handleStartDiscussionClick}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-950/40"
                  >
                    <Plus className="w-4 h-4" />
                    Start Discussion
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {discussions.map((disc) => (
                  <CommunityDiscussionCard
                    key={disc.id}
                    discussion={disc}
                    onClick={handleDiscussionCardClick}
                    isHelpful={communityService.isDiscussionHelpful(disc.id, currentUser?.id)}
                    onToggleHelpful={handleToggleHelpful}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar (1 Col) */}
          <div className="space-y-6">
            {/* Start Discussion CTA Box */}
            <div className="bg-gradient-to-br from-[#141b36] to-[#0e1429] border border-cyan-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Have an academic query?</h3>
              </div>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Post questions, discuss exam concepts, and learn with peers on verified engineering subjects.
              </p>
              <button
                onClick={handleStartDiscussionClick}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-950/40 text-center"
              >
                + Start Discussion
              </button>
            </div>

            {/* Popular Topics Box */}
            <div className="bg-[#11172e] border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-cyan-400" />
                  Popular Topics
                </h3>
                {selectedTopic !== 'ALL' && (
                  <button
                    onClick={() => setSelectedTopic('ALL')}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {popularTopics.length === 0 ? (
                  <p className="text-xs text-slate-500">No active topics recorded yet.</p>
                ) : (
                  popularTopics.slice(0, 6).map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedTopic(item.topic);
                        setSelectedSubject(item.subjectId);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs text-left transition-all ${
                        selectedTopic === item.topic
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                          : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <span className="block truncate">{item.topic}</span>
                        <span className="text-[10px] text-slate-500">{item.subjectName}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800 shrink-0">
                        {item.count}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* YuvaSetu AI Assistant Callout */}
            <div className="bg-gradient-to-br from-indigo-950/60 via-[#131938] to-[#0c1024] border border-indigo-500/30 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-2">
                <Sparkles className="w-4 h-4 text-indigo-300" />
                YuvaSetu AI Assistant
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">Need instant revision notes?</h4>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                Ground your study with verified YuvaSetu curriculum notes and get instant step-by-step
                explanations.
              </p>
              <button
                onClick={() => onNavigate('ai_assistant')}
                className="w-full py-2 px-3 bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl transition-all border border-indigo-400/30 inline-flex items-center justify-center gap-1.5 shadow-md shadow-indigo-950/50"
              >
                Open AI Assistant <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Community Standards Box */}
            <div className="bg-[#0f1429] border border-slate-800/80 rounded-2xl p-5 text-xs text-slate-400 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-slate-200 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Academic Community Rules
              </div>
              <ul className="space-y-1.5 list-disc pl-4 text-[11px] text-slate-400 leading-relaxed">
                <li>Keep discussions focused purely on academic & engineering concepts.</li>
                <li>Be respectful and constructive in peer reviews.</li>
                <li>Mark accepted answers to assist other students.</li>
                <li>Official curriculum materials are curated by verified Administrators.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Follow Subjects Modal */}
      <FollowSubjectsModal
        isOpen={isFollowModalOpen}
        onClose={() => setIsFollowModalOpen(false)}
        currentUser={currentUser}
        onFollowsChanged={() => setReloadKey((prev) => prev + 1)}
      />
    </div>
  );
};
