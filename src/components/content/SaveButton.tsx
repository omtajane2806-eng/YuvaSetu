import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { contentService } from '../../services/contentService';
import { activityService } from '../../services/activityService';
import { User } from '../../types/user';

export interface SaveButtonProps {
  contentId: string;
  currentUser: User | null;
  onRequireAuth?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  onSaveChange?: (isSaved: boolean) => void;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  contentId,
  currentUser,
  onRequireAuth,
  size = 'md',
  showLabel = false,
  className = '',
  onSaveChange,
}) => {
  const [isSaved, setIsSaved] = useState<boolean>(() => {
    return currentUser ? contentService.isContentSaved(currentUser.id, contentId) : false;
  });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setIsSaved(contentService.isContentSaved(currentUser.id, contentId));
    } else {
      setIsSaved(false);
    }
  }, [currentUser, contentId]);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!currentUser) {
      if (onRequireAuth) onRequireAuth();
      return;
    }

    try {
      setIsAnimating(true);
      const savedStatus = contentService.toggleSave(currentUser.id, contentId);
      setIsSaved(savedStatus);
      if (savedStatus) {
        const item = contentService.getContentById(contentId);
        activityService.logMaterialSaved(
          currentUser.id,
          currentUser.name,
          currentUser.email,
          contentId,
          item?.title || 'Study Material',
          item?.subject_name
        );
      }
      if (onSaveChange) {
        onSaveChange(savedStatus);
      }
      setTimeout(() => setIsAnimating(false), 300);
    } catch (err) {
      console.error('Failed to toggle save', err);
    }
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      id={`save-btn-${contentId}`}
      type="button"
      onClick={handleToggleSave}
      className={`inline-flex items-center gap-1.5 rounded-xl transition-all cursor-pointer select-none ${
        isSaved
          ? 'text-cyan-400 hover:text-cyan-300'
          : 'text-slate-400 hover:text-cyan-400'
      } ${className}`}
      title={isSaved ? 'Remove from Saved' : 'Save to My Content'}
    >
      <Bookmark
        className={`${iconSizes[size]} transition-transform ${
          isSaved ? 'fill-cyan-400 text-cyan-400' : ''
        } ${isAnimating ? 'scale-125 duration-200' : 'scale-100'}`}
      />
      {showLabel && (
        <span className="text-xs font-bold">
          {isSaved ? 'Saved' : 'Save Resource'}
        </span>
      )}
    </button>
  );
};
