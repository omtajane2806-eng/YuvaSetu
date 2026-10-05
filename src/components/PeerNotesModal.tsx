import React, { useState } from 'react';
import {
  X,
  Search,
  BookOpen,
  FileText,
  Play,
  Download,
  Star,
  CheckCircle2,
  Filter,
  Eye,
  Sparkles,
  Share2,
} from 'lucide-react';
import { mockPeerResources, PeerResource } from '../data/platformData';

export interface PeerNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onSelectResource?: (resource: PeerResource) => void;
}

export const PeerNotesModal: React.FC<PeerNotesModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  onSelectResource,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [previewItem, setPreviewItem] = useState<PeerResource | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const subjects = [
    'All',
    'Computer Science',
    'Applied Mathematics',
    'Mechanical Engineering',
    'Electrical & ECE',
    'Information Technology',
  ];

  const filteredResources = mockPeerResources.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.authorCollege.toLowerCase().includes(searchTerm.toLowerCase());

    const matchSubject = selectedSubject === 'All' || item.subject === selectedSubject;
    const matchType = selectedType === 'all' || item.resourceType === selectedType;

    return matchSearch && matchSubject && matchType;
  });

  const handleDownload = (item: PeerResource, e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadSuccess(item.id);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div
      id="peer-notes-finder-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0a0e1c] border border-cyan-500/40 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-[#0e1326]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black font-['Outfit'] text-white">Find Peer Notes & Videos</h3>
              <p className="text-xs text-slate-400">
                Created and verified by university toppers across India • 100% Free
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="p-6 border-b border-slate-800/80 bg-slate-950/60 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by topic, course code, algorithm name, or college..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Subject Filters */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {subjects.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                    selectedSubject === sub
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Resource Type Filters */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedType === 'all' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedType('notes')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedType === 'notes' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                Notes
              </button>
              <button
                onClick={() => setSelectedType('video')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedType === 'video' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                Videos
              </button>
              <button
                onClick={() => setSelectedType('cheatsheet')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedType === 'cheatsheet' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                Cheat Sheets
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS FEED */}
        <div className="p-6 overflow-y-auto max-h-[55vh] space-y-4">
          {filteredResources.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-300 font-bold">No exact match found for "{searchTerm}"</p>
              <p className="text-xs text-slate-500">Try searching for generic terms like "Graph", "Fourier", "Notes", or select another subject tab.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSubject('All');
                  setSelectedType('all');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-200 hover:text-white"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredResources.map((res) => {
              const isVideo = res.resourceType === 'video';
              const isCheatSheet = res.resourceType === 'cheatsheet';
              return (
                <div
                  key={res.id}
                  id={`peer-resource-card-${res.id}`}
                  onClick={() => {
                    setPreviewItem(res);
                    if (onSelectResource) onSelectResource(res);
                  }}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${
                          isVideo
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            : isCheatSheet
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                        }`}
                      >
                        {isVideo ? <Play className="w-6 h-6 fill-amber-400" /> : <FileText className="w-6 h-6" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              isVideo
                                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                : isCheatSheet
                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                            }`}
                          >
                            {res.resourceType.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">{res.courseCode}</span>
                          <span className="text-xs text-slate-400">• {res.semester}</span>
                        </div>

                        <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {res.title}
                        </h4>

                        <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">{res.description}</p>

                        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
                          <span className="font-semibold text-slate-300">{res.authorName} ({res.authorCollege})</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-amber-400">
                            <Star className="w-3.5 h-3.5 fill-amber-400" /> {res.rating}
                          </span>
                          <span>•</span>
                          <span>{isVideo ? res.duration : `${res.pageCount} Pages`}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 gap-2">
                      <button
                        onClick={(e) => handleDownload(res, e)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          downloadSuccess === res.id
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200'
                        }`}
                      >
                        {downloadSuccess === res.id ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Saved!</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>{isVideo ? 'Watch Clip' : 'Download PDF'}</span>
                          </>
                        )}
                      </button>
                      <span className="text-[11px] text-slate-500">{res.downloads.toLocaleString()} student downloads</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 px-6 border-t border-slate-800 bg-[#0c1020] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Have your own class notes? Earn reputation by uploading to YuvaSetu.</span>
          </div>
          <button onClick={onClose} className="font-bold text-slate-200 hover:text-white">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
