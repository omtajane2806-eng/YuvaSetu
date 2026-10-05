import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { ContentItem } from '../../types/content';

export interface ShareButtonProps {
  content: ContentItem;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  content,
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const shareUrl = `${window.location.origin}/?contentId=${content.id}`;
    const shareData = {
      title: `${content.title} — YuvaSetu`,
      text: `${content.description.substring(0, 120)}... Discover free peer learning on YuvaSetu.`,
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className="relative inline-block">
      <button
        id={`share-btn-${content.id}`}
        type="button"
        onClick={handleShare}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer select-none ${
          copied
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
            : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
        } ${className}`}
        title="Share resource"
      >
        {copied ? (
          <Check className={`${iconSizes[size]} text-emerald-400`} />
        ) : (
          <Share2 className={`${iconSizes[size]} text-slate-400`} />
        )}
        {showLabel && (
          <span className="text-xs font-bold">
            {copied ? 'Link Copied!' : 'Share'}
          </span>
        )}
      </button>

      {/* Floating confirmation badge */}
      {copied && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg text-[10px] font-black whitespace-nowrap shadow-xl animate-fadeIn z-30">
          Link copied!
        </div>
      )}
    </div>
  );
};
