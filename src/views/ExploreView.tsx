import React, { useState, useMemo } from 'react';
import { YuvaSetuLogo } from '../components/YuvaSetuLogo';
import { SearchBar } from '../components/content/SearchBar';
import { SubjectFilter } from '../components/content/SubjectFilter';
import { ContentFilter } from '../components/content/ContentFilter';
import { ContentGrid } from '../components/content/ContentGrid';
import { PLATFORM_SUBJECTS } from '../data/subjectData';
import { ContentItem, ContentType, AccessType } from '../types/content';
import { User } from '../types/user';
import { contentService } from '../services/contentService';
import {
  Sparkles,
  Plus,
  Compass,
  BookOpen,
  Layers,
  Upload,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<ContentType | 'all'>('all');
  const [selectedVideoSource, setSelectedVideoSource] = useState<'all' | 'upload' | 'youtube'>('all');
  const [selectedAccess, setSelectedAccess] = useState<AccessType | 'all'>('all');
  const [selectedSort, setSelectedSort] = useState<'recent' | 'views' | 'likes'>('recent');

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
  }, [searchQuery, selectedSubjectId, selectedType, selectedVideoSource, selectedAccess, selectedSort]);

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
      onNavigate('upload_content');
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
              Explore Learning
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Discover notes, videos, and resources shared by students like you. Guiding you through deep conceptual understanding (<span className="text-cyan-400 font-semibold">Samajh</span>) to academic and career success (<span className="text-orange-400 font-semibold">Safalta</span>).
          </p>
        </div>

        {/* Action Button: Admin only */}
        {currentUser?.role === 'admin' && (
          <div className="flex items-center gap-3">
            <button
              id="explore-admin-manage-btn"
              onClick={() => onNavigate('admin')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-rose-600/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Admin: Manage Materials</span>
            </button>
          </div>
        )}
      </div>

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
    </div>
  );
};
