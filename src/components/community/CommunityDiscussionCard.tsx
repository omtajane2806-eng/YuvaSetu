import React from 'react';
import { CommunityDiscussion } from '../../types/community';
import { UserInitialsBadge } from '../UserInitialsBadge';
import {
  MessageSquare,
  ThumbsUp,
  CheckCircle2,
  Lock,
  Tag,
  Clock,
  Sparkles,
  ArrowRight,
  FileText,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

interface CommunityDiscussionCardProps {
  discussion: CommunityDiscussion;
  onClick: (id: string) => void;
  isHelpful?: boolean;
  onToggleHelpful?: (e: React.MouseEvent, id: string) => void;
}

export const CommunityDiscussionCard: React.FC<CommunityDiscussionCardProps> = ({
  discussion,
  onClick,
  isHelpful = false,
  onToggleHelpful,
}) => {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'CONCEPT DISCUSSION':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'EXAM PREPARATION':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'CAREER / LEARNING':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'PROJECT DISCUSSION':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'RESOURCE DISCUSSION':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/30';
      default:
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    }
  };

  const timeAgo = (isoDate: string) => {
    const diff = Date.now() - new Date(isoDate).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  return (
    <div
      id={`community-card-${discussion.id}`}
      onClick={() => onClick(discussion.id)}
      className="group relative bg-[#13192e]/90 hover:bg-[#18203b] border border-cyan-900/30 hover:border-cyan-500/50 rounded-2xl p-5 md:p-6 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-cyan-950/40 flex flex-col justify-between"
    >
      <div>
        {/* Top Badges & Meta */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getCategoryColor(
                discussion.discussion_type
              )}`}
            >
              {discussion.discussion_type}
            </span>

            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">
              {discussion.subject_name}
            </span>

            {discussion.is_trending && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <TrendingUp className="w-3 h-3 text-amber-400" />
                Trending
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            {discussion.status === 'CLOSED' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700 text-[11px] font-medium">
                <Lock className="w-3 h-3" /> Closed
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {timeAgo(discussion.created_at)}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 mb-2 leading-snug">
          {discussion.title}
        </h3>

        {/* Content Snippet */}
        <p className="text-sm text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {discussion.content}
        </p>

        {/* Tags */}
        {discussion.tags && discussion.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            {discussion.tags.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-800"
              >
                <Tag className="w-2.5 h-2.5 text-slate-500" />
                {tag}
              </span>
            ))}
            {discussion.tags.length > 4 && (
              <span className="text-[11px] text-slate-500 font-medium">
                +{discussion.tags.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Info & Counts */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Author info (Zero profile pictures rule -> UserInitialsBadge only) */}
        <div className="flex items-center gap-2.5">
          <UserInitialsBadge
            name={discussion.author_name}
            size="sm"
            role={discussion.author_role}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-200">{discussion.author_name}</span>
              {discussion.author_role === 'admin' && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  Admin
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">{discussion.topic}</p>
          </div>
        </div>

        {/* Reaction Stats */}
        <div className="flex items-center gap-4">
          {discussion.has_accepted_answer && (
            <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/30 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Accepted Solution
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleHelpful) onToggleHelpful(e, discussion.id);
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors border ${
              isHelpful
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:border-slate-700 bg-slate-900/50'
            }`}
            title="Mark as helpful"
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${isHelpful ? 'text-cyan-400 fill-cyan-400/30' : ''}`} />
            <span>{discussion.helpful_count || 0}</span>
          </button>

          <span className="inline-flex items-center gap-1.5 text-slate-400">
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>{discussion.replies_count || 0} replies</span>
          </span>

          <div className="hidden sm:flex items-center text-cyan-400 group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
