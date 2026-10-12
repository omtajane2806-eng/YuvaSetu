import React, { useState, useMemo, useEffect } from 'react';
import { YuvaSetuLogo } from '../components/YuvaSetuLogo';
import { SearchBar } from '../components/content/SearchBar';
import { SubjectFilter } from '../components/content/SubjectFilter';
import { ContentFilter } from '../components/content/ContentFilter';
import { ContentGrid } from '../components/content/ContentGrid';
import { PLATFORM_SUBJECTS } from '../data/subjectData';
import { ContentItem, ContentType, AccessType } from '../types/content';
import { User } from '../types/user';
import { contentService } from '../services/contentService';
import { StudentPublishNoteModal } from '../components/marketplace/StudentPublishNoteModal';
import { StudentSetPriceModal } from '../components/marketplace/StudentSetPriceModal';
import {
  Sparkles,
  Plus,
  Compass,
  BookOpen,
  Layers,
  Upload,
  Coins,
  ArrowRight,
  FileText,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export interface ExploreViewProps {
  currentUser: User | null;
  onNavigate: (view: string, payload?: any) => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  currentUser,
  onNavigate,
  onOpenAuth,
}) => {
  const [studentPublishModalOpen, setStudentPublishModalOpen] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<ContentType | 'all'>('all');
  const [selectedVideoSource, setSelectedVideoSource] = useState<'all' | 'upload' | 'youtube'>('all');
  const [selectedAccess, setSelectedAccess] = useState<AccessType | 'all'>('all');
  const [selectedSort, setSelectedSort] = useState<'recent' | 'views' | 'likes'>('recent');

  // Study Materials internal view mode: 'browse' (all materials) or 'my_notes' (student's uploaded notes & pricing)
  const [studyMaterialsTab, setStudyMaterialsTab] = useState<'browse' | 'my_notes'>('browse');
  const [mySubmissions, setMySubmissions] = useState<any[]>([]);
  const [loadingMySubmissions, setLoadingMySubmissions] = useState(false);
  const [inspectingNote, setInspectingNote] = useState<any | null>(null);

  // Track if current student has any unpriced notes awaiting publication
  const [pendingNoteForPrice, setPendingNoteForPrice] = useState<any | null>(null);
  const [isSetPriceModalOpen, setIsSetPriceModalOpen] = useState(false);

  useEffect(() => {
    if (!currentUser || currentUser.role === 'admin') {
      setPendingNoteForPrice(null);
      setMySubmissions([]);
      return;
    }

    const fetchStudentNotes = async () => {
      try {
        setLoadingMySubmissions(true);
        const res = await fetch(`/api/marketplace/notes?studentId=${currentUser.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.notes)) {
            setMySubmissions(data.notes);
            const pending = data.notes.find((n: any) => n.status === 'AWAITING_STUDENT_PRICE');
            setPendingNoteForPrice(pending || null);
          }
        }
      } catch (err) {
        console.warn('Could not check student notes in ExploreView:', err);
      } finally {
        setLoadingMySubmissions(false);
      }
    };

    fetchStudentNotes();
  }, [currentUser?.id, refreshCount]);

  // Listen for newly published content events
  useEffect(() => {
    const handleUpdate = () => setRefreshCount((c) => c + 1);
    window.addEventListener('vidyasetu_content_updated', handleUpdate);
    return () => window.removeEventListener('vidyasetu_content_updated', handleUpdate);
  }, []);

  // Trigger search and filter through contentService
  const filteredContent = useMemo(() => {
    return contentService.searchAndFilter({
      searchQuery,
      subjectId: selectedSubjectId,
      contentType: selectedType,
      videoSource: selectedVideoSource,
      accessType: selectedAccess,
      sortBy: selectedSort,
    });
  }, [searchQuery, selectedSubjectId, selectedType, selectedVideoSource, selectedAccess, selectedSort, refreshCount]);

  const handleOpenContent = (content: ContentItem) => {
    onNavigate('content_details', { contentId: content.id });
  };

  const handleRequireAuth = () => {
    if (onOpenAuth) onOpenAuth('login');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSubjectId('all');
    setSelectedType('all');
    setSelectedVideoSource('all');
    setSelectedAccess('all');
    setSelectedSort('recent');
  };

  const handleUploadClick = () => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth('login');
    } else {
      setStudentPublishModalOpen(true);
    }
  };

  return (
    <div id="vidyasetu-explore-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <YuvaSetuLogo variant="icon" size="sm" />
            <h1 className="text-2xl sm:text-4xl font-black font-['Outfit'] text-white">
              Study Materials
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Discover peer notes, educational summaries, videos, and learning resources. Guiding you through deep conceptual understanding (<span className="text-cyan-400 font-semibold">Samajh</span>) to academic and career success (<span className="text-orange-400 font-semibold">Safalta</span>).
          </p>
        </div>

        {/* Action Buttons: Student Add Material / Add My Notes + Admin Manage Materials */}
        <div className="flex flex-wrap items-center gap-3">
          {currentUser && (
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setStudyMaterialsTab('browse')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  studyMaterialsTab === 'browse'
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Browse Materials</span>
              </button>

              <button
                type="button"
                onClick={() => setStudyMaterialsTab('my_notes')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  studyMaterialsTab === 'my_notes'
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>My Uploads ({mySubmissions.length})</span>
                {pendingNoteForPrice && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
            </div>
          )}

          <button
            id="explore-student-add-material-btn"
            onClick={handleUploadClick}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-xl shadow-cyan-500/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-cyan-200" />
            <span>+ Add Material</span>
          </button>

          {currentUser?.role === 'admin' && (
            <button
              id="explore-admin-manage-btn"
              onClick={() => onNavigate('admin')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Admin: Materials</span>
            </button>
          )}
        </div>
      </div>

      {/* ACTION REQUIRED BANNER: Unpriced note awaiting student price */}
      {pendingNoteForPrice && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/50 border-2 border-amber-500/60 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Coins className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  ACTION REQUIRED — SET YOUR PRICE
                </span>
                <span className="text-xs font-bold text-white line-clamp-1">
                  {pendingNoteForPrice.title}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                AI Quality: <strong className="text-cyan-400 font-mono">{pendingNoteForPrice.aiAnalysis?.overallQualityScore ?? 93}/100</strong> • Recommended: <strong className="text-emerald-400 font-mono">₹{pendingNoteForPrice.aiRecommendedPrice ?? 25}</strong>. Set your selling price to automatically publish into Study Materials.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSetPriceModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:brightness-110 text-white font-black text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer whitespace-nowrap"
          >
            <Coins className="w-4 h-4" />
            <span>Set My Price</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* CONDITIONAL CONTENT: BROWSE ALL MATERIALS VS MY UPLOADED NOTES */}
      {studyMaterialsTab === 'browse' ? (
        <>
          {/* 2. PROMINENT SEARCH BAR */}
          <div className="max-w-3xl mx-auto">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search notes, videos, subjects..."
              className="shadow-2xl"
            />
          </div>

          {/* 3. HORIZONTAL SUBJECT CATEGORY FILTERS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Browse by Academic Subject</span>
              </span>
              <span>{filteredContent.length} resources found</span>
            </div>
            <SubjectFilter
              subjects={PLATFORM_SUBJECTS}
              selectedSubjectId={selectedSubjectId}
              onSelectSubject={setSelectedSubjectId}
            />
          </div>

          {/* 4. CONTENT TYPE, ACCESS & SORT CONTROLS */}
          <ContentFilter
            selectedType={selectedType}
            onChangeType={setSelectedType}
            selectedVideoSource={selectedVideoSource}
            onChangeVideoSource={setSelectedVideoSource}
            selectedAccess={selectedAccess}
            onChangeAccess={setSelectedAccess}
            selectedSort={selectedSort}
            onChangeSort={setSelectedSort}
          />

          {/* 5. CONTENT GRID & CARDS */}
          <div className="pt-2">
            <ContentGrid
              items={filteredContent}
              currentUser={currentUser}
              onOpenContent={handleOpenContent}
              onRequireAuth={handleRequireAuth}
              onResetFilters={handleResetFilters}
              emptyHeading="No learning resources found."
              emptySubheading="Try another keyword or explore a different subject."
            />
          </div>
        </>
      ) : (
        /* MY UPLOADED NOTES & AI PRICING STATUS (Inside Study Materials) */
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-[#090d1c] border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black font-['Outfit'] text-white">
                  My Uploaded Notes & AI Pricing Workflow
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
                  {mySubmissions.length} Submissions
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-2xl">
                Track your student-uploaded notes, view real AI quality scores, select your final selling price, and monitor instant publication status.
              </p>
            </div>

            <button
              onClick={handleUploadClick}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:brightness-110 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Material</span>
            </button>
          </div>

          {loadingMySubmissions ? (
            <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Loading your uploaded notes...</span>
            </div>
          ) : mySubmissions.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto">
                <FileText className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h4 className="text-base font-bold text-white">No uploaded notes yet</h4>
                <p className="text-xs text-slate-400">
                  Upload your handwritten or typed notes. Our AI evaluates quality, suggests prices, and automatically publishes them to peers.
                </p>
              </div>
              <button
                onClick={handleUploadClick}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 hover:brightness-110 cursor-pointer"
              >
                + Upload Your First Notes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mySubmissions.map((sub) => {
                const qualityScore = sub.aiAnalysis?.overallQualityScore ?? sub.overall_quality_score ?? 93;
                const polishTier = sub.aiAnalysis?.polishCategory ?? sub.publishing_eligibility_status ?? 'PREMIUM';
                const aiPrice = sub.aiRecommendedPrice ?? sub.ai_recommended_price ?? 25;
                const finalPrice = sub.studentSelectedPrice ?? sub.student_selected_price;

                return (
                  <div
                    key={sub.id}
                    className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/60">
                              {sub.subjectName || sub.subject_name} • {sub.branch || sub.category || 'General Academic'}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                              ID: {sub.id}
                            </span>
                          </div>
                          <h4 className="text-base font-black text-white leading-snug line-clamp-2">
                            {sub.title}
                          </h4>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0">
                          {sub.status === 'PUBLISHED' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              PUBLISHED
                            </span>
                          ) : sub.status === 'AWAITING_STUDENT_PRICE' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-500/40 animate-pulse">
                              <Coins className="w-3 h-3 text-amber-400" />
                              AWAITING PRICE
                            </span>
                          ) : sub.status === 'REVIEW_REQUIRED' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-950/80 text-purple-300 border border-purple-500/40">
                              <Clock className="w-3 h-3 text-purple-400" />
                              UNDER REVIEW
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-300">
                              {sub.status}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {sub.description || 'Verified student notes.'}
                      </p>

                      {/* Metrics strip */}
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-center text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Quality</span>
                          <span className="text-sm font-black text-cyan-400 font-mono">{qualityScore}/100</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">AI Rec Price</span>
                          <span className="text-sm font-bold text-slate-200 font-mono">₹{aiPrice}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Final Price</span>
                          <span className="text-sm font-black text-emerald-300 font-mono">
                            {finalPrice ? `₹${finalPrice}` : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <span className="text-[11px] text-slate-500">
                        {new Date(sub.created_at || sub.createdAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-2">
                        {sub.status === 'AWAITING_STUDENT_PRICE' ? (
                          <button
                            onClick={() => setInspectingNote(sub)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:brightness-110 text-white font-black text-xs shadow-md shadow-amber-500/20 cursor-pointer"
                          >
                            <Coins className="w-3.5 h-3.5" />
                            <span>Set Price & Publish</span>
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => setInspectingNote(sub)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 font-bold text-xs cursor-pointer"
                              title="Inspect Note Submission Audit & AI Analysis"
                            >
                              <Eye className="w-3.5 h-3.5 text-cyan-400" />
                              <span>View AI Audit</span>
                            </button>

                            {sub.status === 'PUBLISHED' && (
                              <button
                                onClick={() => onNavigate('content_details', { contentId: `mat-marketplace-${sub.id}` })}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs hover:brightness-110 cursor-pointer"
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>View in Study Materials</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {currentUser && (
        <StudentPublishNoteModal
          isOpen={studentPublishModalOpen}
          onClose={() => setStudentPublishModalOpen(false)}
          currentUser={currentUser}
          onNavigate={onNavigate}
          onPublishedSuccess={() => setRefreshCount((c) => c + 1)}
        />
      )}

      {currentUser && pendingNoteForPrice && (
        <StudentSetPriceModal
          isOpen={isSetPriceModalOpen}
          onClose={() => setIsSetPriceModalOpen(false)}
          submission={pendingNoteForPrice}
          currentUser={currentUser}
          onNavigate={onNavigate}
          onSuccess={() => {
            setIsSetPriceModalOpen(false);
            setPendingNoteForPrice(null);
            setRefreshCount((c) => c + 1);
          }}
        />
      )}
    </div>
  );
};
