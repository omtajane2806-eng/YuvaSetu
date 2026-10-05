import React from 'react';
import { ContentType, AccessType } from '../../types/content';
import {
  FileText,
  FileCode,
  Video,
  Filter,
  ArrowUpDown,
  Sparkles,
  Lock,
  CheckCircle2,
} from 'lucide-react';

export interface ContentFilterProps {
  selectedType: ContentType | 'all';
  onChangeType: (type: ContentType | 'all') => void;
  selectedAccess: AccessType | 'all';
  onChangeAccess: (access: AccessType | 'all') => void;
  selectedSort: 'recent' | 'views' | 'likes';
  onChangeSort: (sort: 'recent' | 'views' | 'likes') => void;
  className?: string;
}

export const ContentFilter: React.FC<ContentFilterProps> = ({
  selectedType,
  onChangeType,
  selectedAccess,
  onChangeAccess,
  selectedSort,
  onChangeSort,
  className = '',
}) => {
  return (
    <div
      id="vidyasetu-content-filter-bar"
      className={`flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#090d1a] border border-slate-800/80 ${className}`}
    >
      {/* 1. Content Type Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 mr-1.5 flex items-center gap-1">
          <Filter className="w-3 h-3 text-cyan-400" /> Type:
        </span>

        <button
          id="filter-type-all"
          onClick={() => onChangeType('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedType === 'all'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          All Types
        </button>

        <button
          id="filter-type-note"
          onClick={() => onChangeType('note')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedType === 'note'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Notes</span>
        </button>

        <button
          id="filter-type-pdf"
          onClick={() => onChangeType('pdf')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedType === 'pdf'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>PDFs</span>
        </button>

        <button
          id="filter-type-video"
          onClick={() => onChangeType('video')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedType === 'video'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-sm'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Videos</span>
        </button>
      </div>

      {/* 2. Access Tier & Sorting Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Access Tier */}
        <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          <button
            id="filter-access-free"
            onClick={() => onChangeAccess('FREE')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedAccess === 'FREE' || selectedAccess === 'all'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Free (100%)</span>
          </button>

          <button
            id="filter-access-premium"
            title="Premium tier and Vidya Tokens coming soon in future modules"
            onClick={() => {
              // Inform user premium is coming soon
              onChangeAccess('all');
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-500 cursor-not-allowed hover:text-slate-400 transition-all opacity-80"
          >
            <Lock className="w-3 h-3" />
            <span>Premium (Soon)</span>
          </button>
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          <select
            id="filter-sort-select"
            value={selectedSort}
            onChange={(e) => onChangeSort(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
          >
            <option value="recent">Most Recent</option>
            <option value="views">Most Viewed</option>
            <option value="likes">Most Liked</option>
          </select>
        </div>
      </div>
    </div>
  );
};
