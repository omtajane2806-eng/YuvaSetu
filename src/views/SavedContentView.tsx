import React, { useState } from 'react';
import { User } from '../types/user';
import { ContentItem } from '../types/content';
import { contentService } from '../services/contentService';
import { ContentGrid } from '../components/content/ContentGrid';
import { YuvaSetuLogo } from '../components/YuvaSetuLogo';
import { Bookmark, ArrowLeft, BookOpen, Layers } from 'lucide-react';

export interface SavedContentViewProps {
  currentUser: User;
  onNavigate: (view: string, payload?: any) => void;
}

export const SavedContentView: React.FC<SavedContentViewProps> = ({
  currentUser,
  onNavigate,
}) => {
  const [savedItems, setSavedItems] = useState<ContentItem[]>(() =>
    contentService.getSavedContent(currentUser.id)
  );

  const handleOpenContent = (content: ContentItem) => {
    onNavigate('content_details', { contentId: content.id });
  };

  return (
    <div id="vidyasetu-saved-content-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="w-6 h-6 text-cyan-400 fill-cyan-400/20" />
            <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
              Saved Learning Resources
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Handpicked notes, PDF formula sheets, and video lectures saved for quick revision.
          </p>
        </div>

        <button
          onClick={() => onNavigate('explore')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Explore More Resources</span>
        </button>
      </div>

      {/* Grid of saved items */}
      <ContentGrid
        items={savedItems}
        currentUser={currentUser}
        onOpenContent={handleOpenContent}
        emptyHeading="You haven't saved any resources yet."
        emptySubheading="Bookmark notes and lectures while exploring to access them anytime from your revision stash."
      />
    </div>
  );
};
