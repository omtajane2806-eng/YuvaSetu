import React, { useState, useEffect, useMemo } from 'react';
import { User } from '../types/user';
import { CommunityDiscussion, CommunityReply, CommunityReportReason } from '../types/community';
import { communityService } from '../services/communityService';
import { contentService } from '../services/contentService';
import { sessionRoomService } from '../services/sessionRoomService';
import { UserInitialsBadge } from '../components/UserInitialsBadge';
import { ReportModal } from '../components/community/ReportModal';
import {
  ArrowLeft,
  ThumbsUp,
  MessageSquare,
  Share2,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Clock,
  Tag,
  BookOpen,
  Radio,
  FileText,
  Lock,
  Unlock,
  Trash2,
  CornerDownRight,
  Send,
  ExternalLink,
  ShieldCheck,
  Check,
  AlertCircle,
  HelpCircle,
  Eye,
  Paperclip,
} from 'lucide-react';

interface CommunityDetailViewProps {
  discussionId: string;
  currentUser: User | null;
  onNavigate: (view: string, payload?: any) => void;
  onOpenAuth?: () => void;
}

export const CommunityDetailView: React.FC<CommunityDetailViewProps> = ({
  discussionId,
  currentUser,
  onNavigate,
  onOpenAuth,
}) => {
  const [discussion, setDiscussion] = useState<CommunityDiscussion | null>(null);
  const [replies, setReplies] = useState<CommunityReply[]>([]);
  const [replyContent, setReplyContent] = useState('');
  const [replyingToParentId, setReplyingToParentId] = useState<string | null>(null);
  const [childReplyContent, setChildReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{
    type: 'discussion' | 'reply';
    id: string;
    title: string;
  } | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Load discussion
  useEffect(() => {
    const disc = communityService.getDiscussionById(discussionId, true);
    if (disc) {
      setDiscussion(disc);
      setReplies(communityService.getReplies(discussionId));
    }
  }, [discussionId, reloadKey]);

  // Related study materials
  const relatedMaterials = useMemo(() => {
    if (!discussion) return [];
    const all = contentService.getAllContent(false);
    return all
      .filter(
        (m) =>
          m.subject_name?.toLowerCase() === discussion.subject_name?.toLowerCase() ||
          m.subject_id?.toLowerCase() === discussion.subject_id?.toLowerCase()
      )
      .slice(0, 3);
  }, [discussion]);

  // Related live sessions
  const relatedLiveSessions = useMemo(() => {
    if (!discussion) return [];
    const all = sessionRoomService.getLiveSessions();
    return all.filter((s) => s.status === 'LIVE' || s.status === 'SCHEDULED').slice(0, 2);
  }, [discussion]);

  if (!discussion) {
    return (
      <div className="min-h-screen bg-[#0a0d1a] text-slate-100 flex flex-col items-center justify-center p-6 text-center font-['Outfit',sans-serif]">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Discussion not found or removed</h2>
        <p className="text-xs text-slate-400 max-w-sm mb-6">
          This community discussion may have been removed or does not exist.
        </p>
        <button
          onClick={() => onNavigate('community')}
          className="px-5 py-2.5 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-950/50"
        >
          Return to Community Hub
        </button>
      </div>
    );
  }

  const isAuthor = currentUser?.id === discussion.author_id;
  const isAdmin = currentUser?.role === 'admin';
  const isHelpful = communityService.isDiscussionHelpful(discussion.id, currentUser?.id);

  const handleToggleDiscussionHelpful = () => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    communityService.toggleHelpfulDiscussion(discussion.id, currentUser);
    setReloadKey((prev) => prev + 1);
  };

  const handleToggleReplyHelpful = (replyId: string) => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    communityService.toggleHelpfulReply(replyId, currentUser);
    setReloadKey((prev) => prev + 1);
  };

  const handleToggleAcceptedAnswer = (replyId: string) => {
    if (!currentUser) return;
    try {
      communityService.toggleAcceptedAnswer(discussion.id, replyId, currentUser);
      setReloadKey((prev) => prev + 1);
    } catch (err: any) {
      setStatusMessage(err?.message || 'Action failed.');
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleCreateReply = (e: React.FormEvent, parentReplyId?: string) => {
    e.preventDefault();
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    const text = parentReplyId ? childReplyContent : replyContent;
    if (!text.trim()) return;

    setIsSubmittingReply(true);
    try {
      communityService.createReply(currentUser, discussion.id, {
        content: text.trim(),
        parent_reply_id: parentReplyId,
      });
      if (parentReplyId) {
        setChildReplyContent('');
        setReplyingToParentId(null);
      } else {
        setReplyContent('');
      }
      setReloadKey((prev) => prev + 1);
    } catch (err: any) {
      setStatusMessage(err?.message || 'Failed to post reply.');
      setTimeout(() => setStatusMessage(null), 4000);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleDeleteReply = (replyId: string) => {
    if (!currentUser) return;
    if (window.confirm('Are you sure you want to delete this reply?')) {
      communityService.deleteReply(replyId, currentUser);
      setReloadKey((prev) => prev + 1);
    }
  };

  const handleDeleteDiscussion = () => {
    if (!currentUser) return;
    if (window.confirm('Are you sure you want to delete this discussion?')) {
      communityService.deleteDiscussion(discussion.id, currentUser);
      onNavigate('community');
    }
  };

  const handleToggleClose = () => {
    if (!currentUser || !isAdmin) return;
    if (discussion.status === 'CLOSED') {
      communityService.reopenDiscussion(discussion.id, currentUser);
    } else {
      communityService.closeDiscussion(discussion.id, currentUser, 'Closed by Administrator.');
    }
    setReloadKey((prev) => prev + 1);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    }
  };

  const handleReport = (type: 'discussion' | 'reply', id: string, title: string) => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    setReportTarget({ type, id, title });
    setReportModalOpen(true);
  };

  const handleReportSubmit = (reason: CommunityReportReason, notes: string) => {
    if (!currentUser || !reportTarget) return;
    communityService.reportContent(currentUser, {
      contentType: reportTarget.type,
      contentId: reportTarget.id,
      discussionId: discussion.id,
      discussionTitle: discussion.title,
      reason,
      notes,
    });
    setStatusMessage('Report submitted for administrator moderation review.');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleAskAI = () => {
    onNavigate('ai_assistant', {
      topic: `${discussion.subject_name}: ${discussion.topic} - ${discussion.title}`,
    });
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
    <div className="min-h-screen bg-[#0a0d1a] text-slate-100 pb-20 font-['Outfit',sans-serif]">
      {/* Top Header */}
      <div className="bg-[#11172e] border-b border-cyan-900/30 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('community')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Community Feed
          </button>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400">{discussion.subject_name}</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400 font-semibold">{discussion.topic}</span>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="max-w-6xl mx-auto px-4 mt-4">
          <div className="bg-cyan-500/15 border border-cyan-500/40 rounded-xl p-3.5 flex items-center gap-3 text-xs text-cyan-200">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Discussion Thread (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Primary Discussion Card */}
            <article className="bg-[#11172e] border border-cyan-900/40 rounded-2xl p-6 sm:p-8 shadow-xl">
              {/* Header Badges & Meta */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    {discussion.discussion_type}
                  </span>
                  <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                    {discussion.subject_name}
                  </span>
                  {discussion.status === 'CLOSED' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-bold">
                      <Lock className="w-3 h-3" /> Closed
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{timeAgo(discussion.created_at)}</span>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    {discussion.views || 1} views
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 leading-snug tracking-tight">
                {discussion.title}
              </h1>

              {/* Author Row (Zero profile pictures -> UserInitialsBadge only) */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <UserInitialsBadge
                    name={discussion.author_name}
                    size="md"
                    role={discussion.author_role}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">
                        {discussion.author_name}
                      </span>
                      {discussion.author_role === 'admin' ? (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                          <ShieldCheck className="w-3 h-3" /> Admin
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Student Peer</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{discussion.topic}</p>
                  </div>
                </div>

                {/* Admin / Author controls */}
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button
                      onClick={handleToggleClose}
                      className="p-2 text-xs font-semibold text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title={discussion.status === 'CLOSED' ? 'Reopen discussion' : 'Close discussion'}
                    >
                      {discussion.status === 'CLOSED' ? (
                        <Unlock className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  {(isAuthor || isAdmin) && (
                    <button
                      onClick={handleDeleteDiscussion}
                      className="p-2 text-xs font-semibold text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Delete discussion"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Body Content */}
              <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-line mb-6 font-normal">
                {discussion.content}
              </div>

              {/* Attachments if any */}
              {discussion.attachments && discussion.attachments.length > 0 && (
                <div className="mb-6 p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
                    Attached Reference Materials
                  </span>
                  {discussion.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-3 bg-slate-800/60 border border-slate-700 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-cyan-400" />
                        <div>
                          <p className="text-xs font-bold text-white">{att.file_name}</p>
                          <p className="text-[10px] text-slate-400">{att.file_size}</p>
                        </div>
                      </div>
                      <a
                        href={att.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                      >
                        View Attachment <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* Tags */}
              {discussion.tags && discussion.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  {discussion.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
                    >
                      <Tag className="w-3 h-3 text-cyan-400" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Bar */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleDiscussionHelpful}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      isHelpful
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-950/40'
                        : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <ThumbsUp
                      className={`w-4 h-4 ${isHelpful ? 'text-slate-950 fill-slate-950' : ''}`}
                    />
                    Helpful ({discussion.helpful_count || 0})
                  </button>

                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    {copiedToast ? 'Link Copied!' : 'Share'}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAskAI}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/40 transition-colors shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Explain with AI
                  </button>

                  <button
                    onClick={() => handleReport('discussion', discussion.id, discussion.title)}
                    className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-900 transition-colors"
                    title="Report discussion"
                  >
                    <ShieldAlert className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>

            {/* Replies Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  Community Replies ({replies.length})
                </h2>
                <span className="text-xs text-slate-400">
                  {discussion.has_accepted_answer
                    ? 'Accepted solution highlighted'
                    : 'Awaiting accepted answer'}
                </span>
              </div>

              {/* Replies List */}
              {replies.length === 0 ? (
                <div className="bg-[#11172e]/60 border border-dashed border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
                  No replies yet. Be the first to share your academic explanation or answer!
                </div>
              ) : (
                <div className="space-y-4">
                  {replies.map((reply) => {
                    const isReplyAuthor = currentUser?.id === reply.author_id;
                    const isReplyHelpful = communityService.isReplyHelpful(
                      reply.id,
                      currentUser?.id
                    );

                    return (
                      <div
                        key={reply.id}
                        className={`bg-[#11172e] border rounded-2xl p-5 sm:p-6 transition-all ${
                          reply.is_accepted
                            ? 'border-emerald-500/50 bg-[#0d1a29]/90 shadow-lg shadow-emerald-950/20'
                            : 'border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        {/* Accepted Solution Banner */}
                        {reply.is_accepted && (
                          <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            Verified Accepted Solution
                          </div>
                        )}

                        {/* Reply Author */}
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/60">
                          <div className="flex items-center gap-2.5">
                            <UserInitialsBadge
                              name={reply.author_name}
                              size="sm"
                              role={reply.author_role}
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-white">
                                  {reply.author_name}
                                </span>
                                {reply.author_role === 'admin' && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                                    <ShieldCheck className="w-2.5 h-2.5" />
                                    Admin
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400">
                                {timeAgo(reply.created_at)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Mark Accepted Answer Button (Author or Admin) */}
                            {(isAuthor || isAdmin) && (
                              <button
                                onClick={() => handleToggleAcceptedAnswer(reply.id)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                                  reply.is_accepted
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                    : 'bg-slate-900 text-slate-400 hover:text-emerald-400 border-slate-800 hover:border-emerald-500/40'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5" />
                                {reply.is_accepted ? 'Accepted' : 'Mark Solution'}
                              </button>
                            )}

                            {(isReplyAuthor || isAdmin) && (
                              <button
                                onClick={() => handleDeleteReply(reply.id)}
                                className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                                title="Delete reply"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line mb-4">
                          {reply.content}
                        </div>

                        {/* Reply Action Footer */}
                        <div className="flex items-center justify-between pt-2 text-xs">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleReplyHelpful(reply.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors border ${
                                isReplyHelpful
                                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                                  : 'text-slate-400 hover:text-slate-200 border-slate-800 bg-slate-900/50'
                              }`}
                            >
                              <ThumbsUp
                                className={`w-3.5 h-3.5 ${
                                  isReplyHelpful ? 'text-cyan-400 fill-cyan-400/30' : ''
                                }`}
                              />
                              <span>{reply.helpful_count || 0}</span>
                            </button>

                            {discussion.status !== 'CLOSED' && (
                              <button
                                onClick={() => {
                                  if (!currentUser && onOpenAuth) {
                                    onOpenAuth();
                                    return;
                                  }
                                  setReplyingToParentId(
                                    replyingToParentId === reply.id ? null : reply.id
                                  );
                                }}
                                className="inline-flex items-center gap-1 text-slate-400 hover:text-cyan-400 px-2 py-1 rounded-lg hover:bg-slate-900 transition-colors font-semibold"
                              >
                                <CornerDownRight className="w-3.5 h-3.5" />
                                Reply
                              </button>
                            )}
                          </div>

                          <button
                            onClick={() =>
                              handleReport('reply', reply.id, `Reply by ${reply.author_name}`)
                            }
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                            title="Report reply"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Sub-Replies (Level 2 Thread) */}
                        {reply.replies && reply.replies.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-slate-800/60 pl-4 sm:pl-6 space-y-3">
                            {reply.replies.map((child) => (
                              <div
                                key={child.id}
                                className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3.5"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <UserInitialsBadge
                                      name={child.author_name}
                                      size="xs"
                                      role={child.author_role}
                                    />
                                    <span className="font-bold text-xs text-slate-200">
                                      {child.author_name}
                                    </span>
                                    {child.author_role === 'admin' && (
                                      <span className="px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-bold">
                                        Admin
                                      </span>
                                    )}
                                    <span className="text-[10px] text-slate-500">
                                      {timeAgo(child.created_at)}
                                    </span>
                                  </div>

                                  {(currentUser?.id === child.author_id || isAdmin) && (
                                    <button
                                      onClick={() => handleDeleteReply(child.id)}
                                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                                <p className="text-xs text-slate-300 whitespace-pre-line">
                                  {child.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Inline Reply Input for Nested Thread */}
                        {replyingToParentId === reply.id && (
                          <form
                            onSubmit={(e) => handleCreateReply(e, reply.id)}
                            className="mt-4 pt-3 border-t border-slate-800/80 flex gap-2"
                          >
                            <input
                              type="text"
                              value={childReplyContent}
                              onChange={(e) => setChildReplyContent(e.target.value)}
                              placeholder={`Reply to ${reply.author_name}...`}
                              className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="submit"
                              disabled={isSubmittingReply || !childReplyContent.trim()}
                              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all disabled:opacity-50"
                            >
                              Post
                            </button>
                            <button
                              type="button"
                              onClick={() => setReplyingToParentId(null)}
                              className="px-3 py-2 text-xs text-slate-400 hover:text-white"
                            >
                              Cancel
                            </button>
                          </form>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Main Reply Box */}
              {discussion.status === 'CLOSED' ? (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-400">
                  <Lock className="w-5 h-5 text-slate-500 mx-auto mb-2" />
                  This discussion has been closed by administration and is no longer accepting
                  replies.
                </div>
              ) : (
                <form
                  onSubmit={(e) => handleCreateReply(e)}
                  className="bg-[#11172e] border border-cyan-900/40 rounded-2xl p-5 sm:p-6 shadow-xl space-y-3"
                >
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Post an Academic Reply
                  </label>
                  <textarea
                    rows={4}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Provide your step-by-step reasoning, mathematical proof, or clear code clarification..."
                    className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-500/50 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-y"
                    required
                  />

                  <div className="flex items-center justify-between pt-1">
                    <p className="text-[11px] text-slate-500">
                      Keep answers constructive and academic.
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmittingReply || !replyContent.trim()}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-cyan-950/50 transition-all disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {isSubmittingReply ? 'Posting...' : 'Post Reply'}
                    </button>
                  </div>
                </form>
              )}
            </section>
          </div>

          {/* Right Sidebar (1 Col) */}
          <div className="space-y-6">
            {/* Discussion Stats Card */}
            <div className="bg-[#11172e] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Discussion Meta
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Subject</span>
                  <span className="font-semibold text-white">{discussion.subject_name}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Status</span>
                  <span
                    className={`font-bold ${
                      discussion.status === 'OPEN' ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {discussion.status}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Helpful Reactions</span>
                  <span className="font-semibold text-cyan-400">{discussion.helpful_count || 0}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Total Replies</span>
                  <span className="font-semibold text-white">{replies.length}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">Solution Status</span>
                  <span
                    className={`font-semibold ${
                      discussion.has_accepted_answer ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {discussion.has_accepted_answer ? 'Accepted Solution' : 'Pending Answer'}
                  </span>
                </div>
              </div>
            </div>

            {/* Related Admin Study Materials */}
            {relatedMaterials.length > 0 && (
              <div className="bg-[#11172e] border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    Related Study Materials
                  </h3>
                </div>
                <div className="space-y-2.5">
                  {relatedMaterials.map((mat) => (
                    <div
                      key={mat.id}
                      onClick={() => onNavigate('content_details', { contentId: mat.id })}
                      className="p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-xl cursor-pointer transition-all"
                    >
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                        {mat.content_type}
                      </span>
                      <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                        {mat.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Live Sessions */}
            {relatedLiveSessions.length > 0 && (
              <div className="bg-[#11172e] border border-slate-800 rounded-2xl p-5 shadow-lg">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-3">
                  <Radio className="w-3.5 h-3.5 text-rose-400" />
                  Upcoming Live Sessions
                </h3>
                <div className="space-y-2.5">
                  {relatedLiveSessions.map((sess) => (
                    <div
                      key={sess.id}
                      onClick={() => onNavigate('live_sessions', { sessionId: sess.id })}
                      className="p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/40 rounded-xl cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="font-bold text-rose-400">{sess.startTime}</span>
                        <span className="text-slate-400">{sess.date}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{sess.title}</h4>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Assistant Quick Callout */}
            <div className="bg-gradient-to-br from-indigo-950/70 to-[#0e142b] border border-indigo-500/30 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs mb-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Ask YuvaSetu AI
              </div>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                Need an immediate pedagogical explanation or summary of this topic based on
                curriculum notes?
              </p>
              <button
                onClick={handleAskAI}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Explain with AI Assistant
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onSubmit={handleReportSubmit}
        itemTitle={reportTarget?.title}
        contentType={reportTarget?.type || 'discussion'}
      />
    </div>
  );
};
