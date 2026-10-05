import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { contentService } from '../../services/contentService';
import { activityService } from '../../services/activityService';
import { User } from '../../types/user';

export interface LikeButtonProps {
  contentId: string;
  initialLikes: number;
  currentUser: User | null;
  onRequireAuth?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
  onLikeChange?: (isLiked: boolean, newCount: number) => void;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  contentId,
  initialLikes,
  currentUser,
  onRequireAuth,
  size = 'md',
  showCount = true,
  className = '',
  onLikeChange,
}) => {
  const [isLiked, setIsLiked] = useState<boolean>(() => {
    return currentUser ? contentService.isContentLiked(currentUser.id, contentId) : false;
  });
  const [likesCount, setLikesCount] = useState<number>(initialLikes);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!currentUser) {
      if (onRequireAuth) onRequireAuth();
      return;
    }

    try {
      setIsAnimating(true);
      const result = contentService.toggleLike(currentUser.id, contentId);
      setIsLiked(result.isLiked);
      setLikesCount(result.likesCount);
      if (result.isLiked) {
        const item = contentService.getContentById(contentId);
        activityService.logMaterialLiked(
          currentUser.id,
          currentUser.name,
          currentUser.email,
          contentId,
          item?.title || 'Study Material',
          item?.subject_name
        );
      }
      if (onLikeChange) {
        onLikeChange(result.isLiked, result.likesCount);
      }
      setTimeout(() => setIsAnimating(false), 400);
    } catch (err) {
      console.error('Failed to toggle like', err);
    }
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      id={`like-btn-${contentId}`}
      type="button"
      onClick={handleToggleLike}
      className={`inline-flex items-center gap-1.5 rounded-xl transition-all cursor-pointer select-none ${
        isLiked
          ? 'text-rose-400 hover:text-rose-300'
          : 'text-slate-400 hover:text-rose-400'
      } ${className}`}
      title={isLiked ? 'Unlike resource' : 'Like resource'}
    >
      <Heart
        className={`${iconSizes[size]} transition-transform ${
          isLiked ? 'fill-rose-500 text-rose-500' : ''
        } ${isAnimating ? 'scale-125 duration-200' : 'scale-100'}`}
      />
      {showCount && (
        <span className="text-xs font-bold font-mono">
          {likesCount}
        </span>
      )}
    </button>
  );
};
