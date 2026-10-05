import React, { useState, useEffect } from 'react';
import {
  FileText,
  Video,
  Download,
  Bookmark,
  BookmarkCheck,
  Eye,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  BookOpen,
} from 'lucide-react';
import { ContentItem } from '../types/content';
import { contentService } from '../services/contentService';
import { UserInitialsBadge } from './UserInitialsBadge';

export interface StudyMaterialsShowcaseProps {
  onExploreAll: () => void;
  onOpenMaterial?: (item: ContentItem) => void;
  currentUserId?: string;
}

export const StudyMaterialsShowcase: React.FC<StudyMaterialsShowcaseProps> = ({
  onExploreAll,
  onOpenMaterial,
  currentUserId = 'guest',
}) => {
  const [materials, setMaterials] = useState<ContentItem[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load real materials from contentService
    const all = contentService.getAllContent(false);
    setMaterials(all);

    // Load saved IDs if user
    if (currentUserId && currentUserId !== 'guest') {
      const saved = contentService.getSavedContent(currentUserId);
      setSavedIds(new Set(saved.map((s) => s.id)));
    }
  }, [currentUserId]);

  const handleToggleSave = (e: React.MouseEvent, item: ContentItem) => {
    e.stopPropagation();
    if (!currentUserId || currentUserId === 'guest') {
      onExploreAll();
      return;
    }
    const isNowSaved = contentService.toggleSave(currentUserId, item.id);
    const newSaved = new Set(savedIds);
    if (isNowSaved) {
      newSaved.add(item.id);
    } else {
      newSaved.delete(item.id);
    }
    setSavedIds(newSaved);
  };

  const handleDownload = (e: React.MouseEvent, item: ContentItem) => {
    e.stopPropagation();
    if (item.file_url) {
      window.open(item.file_url, '_blank', 'noopener,noreferrer');
    } else if (item.pdf_data?.downloadUrl) {
      window.open(item.pdf_data.downloadUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Create virtual download package
      const element = document.createElement('a');
      const file = new Blob(
        [
          `YuvaSetu Study Material\n\nTitle: ${item.title}\nSubject: ${item.subject_name}\nAuthor: ${item.creator?.name || 'Academic Contributor'}\nType: ${item.content_type}\n\nDescription:\n${item.description}\n\nSamajh Se Safalta Tak`,
        ],
        { type: 'text/plain;charset=utf-8' }
      );
      element.href = URL.createObjectURL(file);
      element.download = `${item.title.replace(/[^a-zA-Z0-9]/g, '_')}_YuvaSetu.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const featured = materials[0];
  const supporting = materials.slice(1, 4);

  const getTypeLabel = (item: ContentItem) => {
    if (item.content_type === 'video') return 'Video Breakdown';
    if (item.content_type === 'pdf') return 'PDF Guide';
    return 'Handwritten Notes';
  };

  const getEstimatedDuration = (item: ContentItem) => {
    if (item.video_data?.duration) return item.video_data.duration;
    if (item.pdf_data?.pageCount) return `${item.pdf_data.pageCount} pages (${item.pdf_data.pageCount * 3} min read)`;
    return '10 min read';
  };

  return (
    <section id="study-materials-showcase-section" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-800/80">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            Curated Academic Repository
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-white tracking-tight">
            Verified Study Materials
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
            Lecture handnotes, formula sheets, and solved question sets reviewed for curriculum alignment and exam readiness.
          </p>
        </div>

        <button
          onClick={onExploreAll}
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-bold transition-all cursor-pointer"
        >
          <span>View All Materials</span>
          <ArrowRight className="w-4 h-4 text-sky-400" />
        </button>
      </div>

      {/* EMPTY STATE */}
      {materials.length === 0 ? (
        <div className="mt-10 p-12 rounded-3xl bg-[#0a0e1c] border border-slate-800 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto">
            <Layers className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No Published Study Materials Yet</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Our academic mentors are curating the latest handwritten notes and semester guides. Check back shortly or explore subjects.
          </p>
          <button
            onClick={onExploreAll}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
          >
            Explore Course Directory
          </button>
        </div>
      ) : (
        /* HIERARCHICAL LAYOUT: 1 FEATURED + 2-3 SUPPORTING */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8 items-stretch">
          {/* FEATURED MATERIAL CARD (Col 1-7) */}
          {featured && (
            <div
              onClick={() => (onOpenMaterial ? onOpenMaterial(featured) : onExploreAll())}
              className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-[#0e162e] via-[#0a0f20] to-[#060812] border border-sky-500/30 p-6 sm:p-8 shadow-2xl flex flex-col justify-between hover:border-sky-500/60 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/40">
                      {getTypeLabel(featured)}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900 text-slate-300 border border-slate-800">
                      {featured.subject_name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleToggleSave(e, featured)}
                      className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
                      title={savedIds.has(featured.id) ? 'Saved' : 'Save for later'}
                    >
                      {savedIds.has(featured.id) ? (
                        <BookmarkCheck className="w-4 h-4 text-sky-400" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/40">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-400">
                    Featured Curriculum Pick
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white mt-1.5 group-hover:text-sky-300 transition-colors">
                    {featured.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-3 line-clamp-3">
                    {featured.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <UserInitialsBadge
                    name={featured.creator?.name || 'Academic Mentor'}
                    size="sm"
                    className="border border-slate-700"
                  />
                  <div className="text-xs">
                    <div className="font-bold text-white">{featured.creator?.name || 'Academic Mentor'}</div>
                    <div className="text-slate-400 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>{getEstimatedDuration(featured)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDownload(e, featured)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={() => (onOpenMaterial ? onOpenMaterial(featured) : onExploreAll())}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-black shadow-lg shadow-sky-500/20 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Read Now</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SMALLER SUPPORTING MATERIAL PREVIEWS (Col 8-12) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {supporting.map((item) => (
              <div
                key={item.id}
                onClick={() => (onOpenMaterial ? onOpenMaterial(item) : onExploreAll())}
                className="p-5 rounded-2xl bg-[#0a0e1c] border border-slate-800/90 hover:border-slate-700 shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                      {item.subject_name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getEstimatedDuration(item)}
                      </span>
                      <button
                        onClick={(e) => handleToggleSave(e, item)}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        {savedIds.has(item.id) ? (
                          <BookmarkCheck className="w-3.5 h-3.5 text-sky-400" />
                        ) : (
                          <Bookmark className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-2 group-hover:text-sky-300 transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <UserInitialsBadge name={item.creator?.name || 'Mentor'} size="xs" />
                    <span className="truncate max-w-[120px] text-slate-300">
                      {item.creator?.name || 'Mentor'}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleDownload(e, item)}
                    className="flex items-center gap-1 text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
