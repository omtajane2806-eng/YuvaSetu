import React, { useEffect, useState } from 'react';
import { ContentItem } from '../types/content';
import { User } from '../types/user';
import { contentService } from '../services/contentService';
import { activityService } from '../services/activityService';
import { tokenService } from '../services/tokenService';
import { ContentViewer } from '../components/content/ContentViewer';
import { LikeButton } from '../components/content/LikeButton';
import { SaveButton } from '../components/content/SaveButton';
import { ShareButton } from '../components/content/ShareButton';
import { CreatorPreview } from '../components/content/CreatorPreview';
import { YuvaSetuLogo } from '../components/YuvaSetuLogo';
import { UnlockConfirmModal } from '../components/token/UnlockConfirmModal';
import {
  ArrowLeft,
  Eye,
  Calendar,
  Layers,
  FileText,
  FileCode,
  Video,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  BookOpen,
  Coins,
  Lock,
  Unlock,
  ShoppingBag,
} from 'lucide-react';

export interface ContentDetailsViewProps {
  contentId: string;
  currentUser: User | null;
  onNavigate: (view: string, payload?: any) => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const ContentDetailsView: React.FC<ContentDetailsViewProps> = ({
  contentId,
  currentUser,
  onNavigate,
  onOpenAuth,
}) => {
  const [content, setContent] = useState<ContentItem | undefined>(() =>
    contentService.getContentById(contentId)
  );
  const [viewsCount, setViewsCount] = useState<number>(content?.views || 0);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [unlockedStateVersion, setUnlockedStateVersion] = useState(0);

  const isTokenGated = content?.access_type === 'TOKEN' || (content?.token_price && content.token_price > 0);
  const isUnlocked =
    !isTokenGated ||
    currentUser?.role === 'admin' ||
    (currentUser && content && tokenService.isResourceUnlocked(currentUser.id, content.id));

  // Increment view count on mount
  useEffect(() => {
    if (contentId) {
      const item = contentService.getContentById(contentId);
      setContent(item);
      if (item) {
        const updatedViews = contentService.recordView(contentId, currentUser?.id);
        setViewsCount(updatedViews);
        if (currentUser) {
          activityService.logMaterialViewed(
            currentUser.id,
            currentUser.name,
            currentUser.email,
            item.id,
            item.title,
            item.subject_name,
            item.content_type
          );
        }
      }
    }
  }, [contentId, currentUser?.id, unlockedStateVersion]);

  if (!content) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Resource Not Found</h2>
        <p className="text-sm text-slate-400">The requested learning resource could not be found.</p>
        <button
          onClick={() => onNavigate('explore')}
          className="px-4 py-2 rounded-xl bg-cyan-500 text-white text-xs font-bold"
        >
          Back to Explore
        </button>
      </div>
    );
  }

  // Related content from the same subject
  const relatedContent = contentService
    .searchAndFilter({ subjectId: content.subject_id })
    .filter((c) => c.id !== content.id)
    .slice(0, 3);

  const typeLabels = {
    note: 'Educational Note',
    pdf: 'PDF Document',
    video: 'Video Masterclass',
  };

  const handleRequireAuth = () => {
    if (onOpenAuth) onOpenAuth('login');
  };

  return (
    <div id="vidyasetu-content-details" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* 1. TOP BREADCRUMB & BACK BUTTON */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            id="back-to-explore-btn"
            onClick={() => onNavigate('explore')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Explore</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span
              onClick={() => onNavigate('explore')}
              className="hover:text-cyan-400 cursor-pointer"
            >
              Explore
            </span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-cyan-400 font-semibold">{content.subject_name}</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-200 font-medium truncate max-w-xs">{content.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isTokenGated ? (
            isUnlocked ? (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Unlock className="w-3.5 h-3.5" />
                <span>Unlocked Access</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) {
                    if (onOpenAuth) onOpenAuth('login');
                  } else {
                    setIsUnlockModalOpen(true);
                  }
                }}
                className="px-3.5 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-all"
              >
                <Coins className="w-3.5 h-3.5 text-slate-950" />
                <span>Unlock for {content.token_price || 50} VT</span>
              </button>
            )
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black uppercase tracking-wider">
              100% Free Access
            </span>
          )}
        </div>
      </div>

      {/* 2. RESOURCE TITLE, DESCRIPTION & ACTION BAR */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0b0f1e] border border-slate-800 space-y-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase">
                {typeLabels[content.content_type]}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 text-xs font-semibold">
                {content.subject_name}
              </span>
              {content.isDemo && (
                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                  Curated Sample
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white leading-snug">
              {content.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {content.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {content.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-900/90 text-slate-400 border border-slate-800 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Strip: Views, Like, Save, Share */}
          <div className="flex flex-wrap items-center gap-3 bg-[#070a14] p-3 rounded-2xl border border-slate-800/80 self-start lg:self-center">
            {/* Ask YuvaSetu AI Button */}
            <button
              id="ask-ai-from-material-btn"
              onClick={() => onNavigate('ai_assistant', { materialId: content.id, topic: content.title })}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-cyan-500/10"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Ask YuvaSetu AI</span>
            </button>

            {/* Real Views counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-semibold">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="font-mono">{viewsCount}</span>
              <span className="text-slate-500 text-[11px]">views</span>
            </div>

            {/* Likes Button */}
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <LikeButton
                contentId={content.id}
                initialLikes={content.likes}
                currentUser={currentUser}
                onRequireAuth={handleRequireAuth}
                size="md"
              />
            </div>

            {/* Save Button */}
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <SaveButton
                contentId={content.id}
                currentUser={currentUser}
                onRequireAuth={handleRequireAuth}
                showLabel={true}
                size="md"
              />
            </div>

            {/* Share Button */}
            <ShareButton content={content} size="md" showLabel={true} />
          </div>
        </div>

        {/* Creator Preview Banner */}
        <div className="pt-4 border-t border-slate-800/80">
          <CreatorPreview
            creator={content.creator}
            onViewProfile={(creatorId) => {
              // Navigates or previews student profile
              if (currentUser && currentUser.id === creatorId) {
                onNavigate('profile');
              } else {
                onNavigate('community', { search: content.creator.name });
              }
            }}
          />
        </div>
      </div>

      {/* 3. DEDICATED CONTENT VIEWER OR TOKEN GATED LOCKED VIEW */}
      <div className="space-y-4">
        {isUnlocked ? (
          <ContentViewer content={content} />
        ) : (
          <div
            id="token-locked-content-container"
            className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-amber-500/10 via-[#0d1224] to-[#080c18] border border-amber-500/30 text-center space-y-6 shadow-2xl"
          >
            <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto shadow-xl shadow-amber-950/40">
              <Lock className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                Premium Academic Masterclass
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Unlock Full Access to "{content.title}"
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                This comprehensive deep-dive resource includes complete step-by-step proofs, code implementations, interactive problem sets, and downloadable revision summaries.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#060914] border border-slate-800 max-w-md mx-auto flex items-center justify-between text-xs">
              <div className="text-left">
                <span className="text-slate-400 block">Unlock Cost:</span>
                <span className="text-lg font-black text-amber-400 flex items-center gap-1">
                  <Coins className="w-4 h-4" />
                  {content.token_price || 50} YuvaTokens (VT)
                </span>
              </div>

              {currentUser && (
                <div className="text-right">
                  <span className="text-slate-400 block">Your Wallet:</span>
                  <span className="text-sm font-bold text-white">
                    {tokenService.getUserBalance(currentUser.id)} VT
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) {
                    if (onOpenAuth) onOpenAuth('login');
                  } else {
                    setIsUnlockModalOpen(true);
                  }
                }}
                className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-black transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock for {content.token_price || 50} VT</span>
              </button>

              {currentUser && (
                <button
                  type="button"
                  onClick={() => onNavigate('wallet_buy')}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Buy More Tokens</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-400">
              ⚡ Instant permanent access. Earn free tokens by answering peer questions in the Community.
            </p>
          </div>
        )}
      </div>

      {/* Unlock Confirmation Modal */}
      {content && currentUser && (
        <UnlockConfirmModal
          isOpen={isUnlockModalOpen}
          onClose={() => setIsUnlockModalOpen(false)}
          resourceId={content.id}
          resourceTitle={content.title}
          resourceType="material"
          tokenPrice={content.token_price || 50}
          currentUser={currentUser}
          onUnlockSuccess={() => {
            setUnlockedStateVersion((v) => v + 1);
          }}
          onNavigateToBuy={() => onNavigate('wallet_buy')}
          onNavigateToEarn={() => onNavigate('wallet_earn')}
        />
      )}

      {/* 4. RELATED RESOURCES FROM SAME SUBJECT */}
      {relatedContent.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-['Outfit'] text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>More from {content.subject_name}</span>
              </h3>
              <p className="text-xs text-slate-400">Recommended notes and materials in this subject</p>
            </div>
            <button
              onClick={() => onNavigate('explore')}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer"
            >
              View all in {content.subject_name} →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedContent.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate('content_details', { contentId: item.id })}
                className="p-4 rounded-2xl bg-[#090d1a] border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40 uppercase">
                    {item.content_type}
                  </span>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
                  <span>By {item.creator.name}</span>
                  <span className="text-cyan-400 font-semibold">Open →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
