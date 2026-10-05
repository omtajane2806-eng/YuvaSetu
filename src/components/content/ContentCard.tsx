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
  const typeIcons = {
    note: <FileText className="w-3.5 h-3.5" />,
    pdf: <FileCode className="w-3.5 h-3.5" />,
    video: <Video className="w-3.5 h-3.5" />,
  };

  const typeLabels = {
    note: 'Note',
    pdf: 'PDF',
    video: 'Video',
  };

  const typeColors = {
    note: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    pdf: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    video: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  };

  const isTokenGated = content.access_type === 'TOKEN' || (content.token_price && content.token_price > 0);
  const isUnlocked = currentUser?.role === 'admin' || (currentUser && tokenService.isResourceUnlocked(currentUser.id, content.id));

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
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-black border backdrop-blur-md shadow-md ${typeColors[content.content_type]}`}
            >
              {typeIcons[content.content_type]}
              <span>{typeLabels[content.content_type]}</span>
            </span>

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

          {/* Bottom Left: Demo Badge if sample */}
          {content.isDemo && (
            <div className="absolute bottom-2 left-3 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[9px] font-semibold text-slate-400 border border-slate-800">
              Sample Resource
            </div>
          )}
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
                {content.creator.college || content.creator.role || 'Student Creator'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Views, Likes, Open Button */}
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
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/10 transition-all cursor-pointer"
        >
          <span>Open</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
