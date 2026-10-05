import React from 'react';
import { ContentItem } from '../../types/content';
import { User } from '../../types/user';
import { ContentCard } from './ContentCard';
import { BookOpen, SearchX, RefreshCw } from 'lucide-react';

export interface ContentGridProps {
  items: ContentItem[];
  currentUser: User | null;
  onOpenContent: (content: ContentItem) => void;
  onRequireAuth?: () => void;
  onResetFilters?: () => void;
  emptyHeading?: string;
  emptySubheading?: string;
  className?: string;
}

export const ContentGrid: React.FC<ContentGridProps> = ({
  items,
  currentUser,
  onOpenContent,
  onRequireAuth,
  onResetFilters,
  emptyHeading = 'No learning resources found.',
  emptySubheading = 'Try another keyword or explore a different subject.',
  className = '',
}) => {
  if (items.length === 0) {
    return (
      <div
        id="content-grid-empty-state"
        className="p-12 sm:p-16 rounded-3xl bg-[#090d1a] border border-slate-800 text-center space-y-4 max-w-xl mx-auto my-8"
      >
        <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
          <SearchX className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg sm:text-xl font-bold font-['Outfit'] text-white">
            {emptyHeading}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {emptySubheading}
          </p>
        </div>

        {onResetFilters && (
          <div className="pt-2">
            <button
              id="empty-reset-filters-btn"
              onClick={onResetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Reset Search & Filters</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      id="content-grid-container"
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {items.map((item) => (
        <ContentCard
          key={item.id}
          content={item}
          currentUser={currentUser}
          onOpen={onOpenContent}
          onRequireAuth={onRequireAuth}
        />
      ))}
    </div>
  );
};
