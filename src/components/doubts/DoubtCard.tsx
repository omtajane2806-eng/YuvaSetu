import React from 'react';
import { DoubtItem } from '../../types/doubt';
import { UserInitialsBadge } from '../UserInitialsBadge';
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  Paperclip,
  Tag,
  ThumbsUp,
  AlertCircle,
  Eye,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export interface DoubtCardProps {
  doubt: DoubtItem;
  onOpen: (doubt: DoubtItem) => void;
  isOwner?: boolean;
}

export const DoubtCard: React.FC<DoubtCardProps> = ({ doubt, onOpen, isOwner }) => {
  const getStatusBadge = (status: DoubtItem['status']) => {
    switch (status) {
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            RESOLVED
          </span>
        );
      case 'ANSWERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            <MessageSquare className="w-3.5 h-3.5" />
            ANSWERED
          </span>
        );
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-slate-700/50 text-slate-400 border border-slate-700">
            <AlertCircle className="w-3.5 h-3.5" />
            CLOSED
          </span>
        );
      case 'OPEN':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            OPEN
          </span>
        );
    }
  };

  const formattedDate = new Date(doubt.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const helpfulCount = doubt.answers?.reduce((acc, a) => acc + (a.helpful_count || 0), 0) || 0;

  return (
    <div
      id={`doubt-card-${doubt.id}`}
      onClick={() => onOpen(doubt)}
      className="group p-5 sm:p-6 rounded-3xl bg-[#0b0f1d] border border-slate-800/80 hover:border-cyan-500/40 hover:bg-[#0e1426] transition-all duration-200 shadow-lg hover:shadow-cyan-500/5 cursor-pointer flex flex-col justify-between space-y-4"
    >
      <div className="space-y-3">
        {/* Top bar: Subject, Topic & Status */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-900 border border-slate-700 text-cyan-300">
              {doubt.subject_name}
            </span>
            {doubt.topic && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900/60 border border-slate-800 text-slate-300">
                {doubt.topic}
              </span>
            )}
            {isOwner && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                YOUR QUESTION
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {doubt.has_accepted_answer && (
              <span
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                title="Question has a verified accepted answer"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Accepted Answer
              </span>
            )}
            {getStatusBadge(doubt.status)}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold font-['Outfit'] text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
          {doubt.title}
        </h3>

        {/* Short preview description */}
        <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
          {doubt.description}
        </p>

        {/* Tags */}
        {doubt.tags && doubt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {doubt.tags.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-800"
              >
                <Tag className="w-2.5 h-2.5 text-slate-500" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer info: Asked by name (No Photos), Date, Answers count, Views */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2.5">
          <UserInitialsBadge name={doubt.student_name} role="student" size="sm" />
          <div>
            <span className="font-semibold text-slate-200 block sm:inline">
              {doubt.student_name}
            </span>
            <span className="text-slate-500 text-[11px] ml-1 sm:ml-2">
              Asked on {formattedDate}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {doubt.attachments && doubt.attachments.length > 0 && (
            <span className="flex items-center gap-1 text-slate-400" title="Includes Attachment">
              <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
              <span>{doubt.attachments.length}</span>
            </span>
          )}

          {helpfulCount > 0 && (
            <span className="flex items-center gap-1 text-emerald-400" title="Helpful Votes">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{helpfulCount}</span>
            </span>
          )}

          <span
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-bold ${
              doubt.answers_count > 0
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                : 'bg-slate-900 text-slate-500 border border-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{doubt.answers_count} {doubt.answers_count === 1 ? 'Answer' : 'Answers'}</span>
          </span>

          <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
};
