import React from 'react';
import { ContentItem } from '../../types/content';
import { User } from '../../types/user';
import { LikeButton } from './LikeButton';
import { SaveButton } from './SaveButton';
import { UserInitialsBadge } from '../UserInitialsBadge';
import { tokenService } from '../../services/tokenService';
import {
  FileText,
  FileCode,
  Video,
  Eye,
  ArrowRight,
  Sparkles,
  Layers,
  Coins,
  Lock,
  Unlock,
} from 'lucide-react';

export interface ContentCardProps {
  content: ContentItem;
  currentUser: User | null;
  onOpen: (content: ContentItem) => void;
  onRequireAuth?: () => void;
  className?: string;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  content,
  currentUser,
  onOpen,
  onRequireAuth,
  className = '',
}) => {
  const isVideo = content.content_type === 'video';
  const isYouTube =
    isVideo &&
    (content.video_data?.videoSource === 'youtube' || Boolean(content.video_data?.youtubeVideoId));

  const isTokenGated = content.access_type === 'TOKEN' || (content.token_price && content.token_price > 0);
  const isUnlocked = currentUser?.role === 'admin' || (currentUser && tokenService.isResourceUnlocked(currentUser.id, content.id));

  // Render content type badge
  const renderTypeBadge = () => {
    if (isYouTube) {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-black border backdrop-blur-md shadow-md bg-red-500/20 text-red-300 border-red-500/50">
          <svg className="w-3.5 h-3.5 fill-current text-red-400" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          <span>YouTube</span>
        </span>
      );
    }

    if (isVideo) {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-black border backdrop-blur-md shadow-md bg-purple-500/20 text-purple-300 border-purple-500/50">
          <Video className="w-3.5 h-3.5 text-purple-400" />
          <span>VIDEO</span>
        </span>
      );
    }

    if (content.content_type === 'pdf') {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-black border backdrop-blur-md shadow-md bg-amber-500/20 text-amber-300 border-amber-500/50">
          <FileCode className="w-3.5 h-3.5 text-amber-400" />
          <span>PDF</span>
        </span>
      );
    }

    return (
      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-black border backdrop-blur-md shadow-md bg-cyan-500/20 text-cyan-300 border-cyan-500/50">
        <FileText className="w-3.5 h-3.5 text-cyan-400" />
        <span>NOTE</span>
      </span>
    );
  };

  return (
    <div
      id={`content-card-${content.id}`}
      onClick={() => onOpen(content)}
      className={`group rounded-3xl bg-[#0c1020] border border-slate-800/90 hover:border-cyan-500/40 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer ${className}`}
    >
      <div>
        {/* Thumbnail Header with Badges */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-950">
          <img
            src={content.thumbnail}
            alt={content.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
            loading="lazy"
          />

          {/* Gradient Shadow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1020] via-transparent to-black/50" />

          {/* Top Left: Content Type & Subject */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
            {renderTypeBadge()}

            <span className="px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md text-[11px] font-bold text-slate-200 border border-slate-700/80 shadow-md">
              {content.subject_name}
            </span>
          </div>

          {/* Top Right: Free/Token Badge & Save Button */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {isTokenGated ? (
              isUnlocked ? (
                <span className="px-2.5 py-1 rounded-xl bg-emerald-500/90 text-white font-black text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                  <Unlock className="w-3 h-3" />
                  <span>UNLOCKED</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                  <Coins className="w-3 h-3 text-slate-950" />
                  <span>{content.token_price || 50} VT</span>
                </span>
              )
            ) : (
              <span className="px-2.5 py-1 rounded-xl bg-emerald-500/90 text-white font-black text-[10px] tracking-wider uppercase shadow-md shadow-emerald-950/40">
                FREE
              </span>
            )}

            <div className="p-1 rounded-xl bg-black/75 backdrop-blur-md border border-slate-700/60 shadow-md">
              <SaveButton
                contentId={content.id}
                currentUser={currentUser}
                onRequireAuth={onRequireAuth}
                size="sm"
              />
            </div>
          </div>

          {/* Bottom Left: Duration pill for Video or Page count for PDF */}
          <div className="absolute bottom-2.5 left-3 flex items-center gap-2">
            {isVideo && content.video_data?.duration && (
              <span className="px-2.5 py-0.5 rounded-lg bg-black/85 backdrop-blur-md text-[10px] font-mono font-bold text-purple-200 border border-purple-500/30 flex items-center gap-1 shadow-md">
                <Video className="w-3 h-3 text-purple-400" />
                <span>Duration: {content.video_data.duration}</span>
              </span>
            )}

            {!isVideo && content.pdf_data?.pageCount && (
              <span className="px-2 py-0.5 rounded-lg bg-black/85 backdrop-blur-md text-[10px] font-mono text-slate-300 border border-slate-700 flex items-center gap-1 shadow-md">
                <FileCode className="w-3 h-3 text-amber-400" />
                <span>{content.pdf_data.pageCount} Pages</span>
              </span>
            )}

            {content.isDemo && (
              <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[9px] font-semibold text-slate-400 border border-slate-800">
                Sample
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          <h3 className="text-base font-black text-white leading-snug group-hover:text-cyan-300 transition-colors line-clamp-2">
            {content.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {content.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {content.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Creator Attribution */}
          <div className="pt-3 flex items-center gap-2.5 border-t border-slate-800/70">
            <UserInitialsBadge name={content.creator.name} size="xs" />
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-slate-200 truncate">
                By {content.creator.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {content.creator.college || content.creator.role || 'YuvaSetu Faculty'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Views, Likes, Open/Watch Button */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono text-[11px]">{content.views}</span>
          </span>

          <LikeButton
            contentId={content.id}
            initialLikes={content.likes}
            currentUser={currentUser}
            onRequireAuth={onRequireAuth}
            size="sm"
          />
        </div>

        <button
          id={`open-content-btn-${content.id}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(content);
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs shadow-md transition-all cursor-pointer ${
            isVideo
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-500/20'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/10'
          }`}
        >
          {isVideo ? (
            <>
              <span>WATCH VIDEO</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          ) : content.content_type === 'pdf' ? (
            <>
              <span>READ PDF</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>OPEN NOTES</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
