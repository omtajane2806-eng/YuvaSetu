import React from 'react';
import { ContentCreator } from '../../types/content';
import { UserCheck, Sparkles, ExternalLink } from 'lucide-react';
import { UserInitialsBadge } from '../UserInitialsBadge';

export interface CreatorPreviewProps {
  creator: ContentCreator;
  onViewProfile?: (creatorId: string) => void;
  className?: string;
}

export const CreatorPreview: React.FC<CreatorPreviewProps> = ({
  creator,
  onViewProfile,
  className = '',
}) => {
  return (
    <div
      id={`creator-preview-${creator.id}`}
      className={`flex items-center justify-between p-3.5 rounded-2xl bg-[#0a0e1c] border border-slate-800/80 hover:border-cyan-500/30 transition-all ${className}`}
    >
      <div className="flex items-center gap-3">
        <UserInitialsBadge name={creator.name} size="md" />
        <div>
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
              {creator.name}
            </h4>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
              Peer Creator
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
            {creator.college || 'Student Contributor'} • {creator.role || 'Student Creator'}
          </p>
        </div>
      </div>

      {onViewProfile && (
        <button
          id={`view-creator-profile-${creator.id}`}
          type="button"
          onClick={() => onViewProfile(creator.id)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-cyan-400 hover:text-cyan-300 text-xs font-bold transition-all cursor-pointer"
        >
          <span>View Profile</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

