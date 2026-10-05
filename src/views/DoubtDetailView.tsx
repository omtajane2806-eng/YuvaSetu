import React, { useState, useEffect, useRef } from 'react';
import { DoubtItem, DoubtAnswer, DoubtAttachment } from '../types/doubt';
import { User } from '../types/user';
import { doubtService } from '../services/doubtService';
import { UserInitialsBadge } from '../components/UserInitialsBadge';
import { ReportModal } from '../components/doubts/ReportModal';
import { PLATFORM_SUBJECTS } from '../data/subjectData';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
  Share2,
  Flag,
  Edit,
  Trash2,
  AlertCircle,
  Send,
  BookOpen,
  Radio,
  FileText,
  Tag,
  ShieldCheck,
  Check,
  CornerDownRight,
  ExternalLink,
  Lock,
  Unlock,
  Copy,
  Sparkles,
} from 'lucide-react';

export interface DoubtDetailViewProps {
  doubtId: string;
  currentUser: User | null;
  onNavigate: (view: string, payload?: any) => void;
  onOpenAuth: () => void;
}

export const DoubtDetailView: React.FC<DoubtDetailViewProps> = ({
  doubtId,
  currentUser,
  onNavigate,
  onOpenAuth,
}) => {
  const [doubt, setDoubt] = useState<DoubtItem | undefined>(() =>
    doubtService.getDoubtById(doubtId, true, currentUser || undefined)
  );

  // Edit question state
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTopic, setEditTopic] = useState('');

  // Write Answer state (Admin)
  const [answerText, setAnswerText] = useState('');
  const [answerAttachment, setAnswerAttachment] = useState<{
    file_name: string;
    file_url: string;
    file_type: 'image' | 'pdf' | 'screenshot';
    file_size: string;
  } | null>(null);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [answerError, setAnswerError] = useState('');
  const answerFileInputRef = useRef<HTMLInputElement>(null);

  // Reply state per answer
  const [activeReplyAnswerId, setActiveReplyAnswerId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Report Modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{
    type: 'question' | 'answer' | 'attachment';
    id: string;
    title?: string;
  }>({
    type: 'question',
    id: doubtId,
    title: doubt?.title,
  });

  // Admin moderation modal
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [closeReason, setCloseReason] = useState('Closed by platform administrator');

  // Copy share toast
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fresh = doubtService.getDoubtById(doubtId, true, currentUser || undefined);
    setDoubt(fresh);
    if (fresh) {
      setEditTitle(fresh.title);
      setEditDescription(fresh.description);
      setEditTopic(fresh.topic || '');
    }
  }, [doubtId, currentUser]);

  const refreshDoubt = () => {
    const updated = doubtService.getDoubtById(doubtId);
    setDoubt(updated);
  };

  if (!doubt) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black font-['Outfit'] text-white">Doubt Question Not Found</h2>
        <p className="text-sm text-slate-400">
          The requested question might have been removed or does not exist.
        </p>
        <button
          onClick={() => onNavigate('doubts')}
          className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
        >
          Return to Doubts Feed
        </button>
      </div>
    );
  }

  const isAuthor = currentUser?.id === doubt.student_id;
  const isAdmin = currentUser?.role === 'admin';
  const relatedMaterials = doubtService.getRelatedStudyMaterials(doubt.subject_id, doubt.topic);
  const relatedSessions = doubtService.getRelatedLiveSessions(doubt.subject_id);

  // Format created date
  const createdDate = new Date(doubt.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Handlers
  const handleSaveEditQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      doubtService.updateDoubt(
        doubt.id,
        currentUser.id,
        {
          title: editTitle,
          description: editDescription,
          topic: editTopic,
        },
        isAdmin
      );
      setIsEditingQuestion(false);
      refreshDoubt();
    } catch (err: any) {
      alert(err.message || 'Failed to update doubt');
    }
  };

  const handleDeleteQuestion = () => {
    if (!currentUser) return;
    if (window.confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      try {
        doubtService.deleteDoubt(doubt.id, currentUser.id, isAdmin);
        onNavigate('doubts');
      } catch (err: any) {
        alert(err.message || 'Failed to delete doubt');
      }
    }
  };

  const handleResolveQuestion = () => {
    if (!currentUser) return;
    try {
      doubtService.resolveDoubt(doubt.id, currentUser.id, isAdmin);
      refreshDoubt();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReopenQuestion = () => {
    if (!currentUser) return;
    try {
      doubtService.reopenDoubt(doubt.id, currentUser.id, isAdmin);
      refreshDoubt();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCloseQuestion = () => {
    if (!currentUser || !isAdmin) return;
    try {
      doubtService.closeDoubt(doubt.id, currentUser.id, closeReason);
      setShowCloseModal(false);
      refreshDoubt();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!answerText.trim()) {
      setAnswerError('Answer text cannot be empty.');
      return;
    }

    setIsSubmittingAnswer(true);
    setAnswerError('');
    try {
      doubtService.addAnswer(currentUser, doubt.id, {
        answer_text: answerText,
        attachment: answerAttachment || undefined,
      });
      setAnswerText('');
      setAnswerAttachment(null);
      setIsSubmittingAnswer(false);
      refreshDoubt();
    } catch (err: any) {
      setIsSubmittingAnswer(false);
      setAnswerError(err.message || 'Failed to post answer.');
    }
  };

  const handleAcceptAnswer = (answerId: string) => {
    if (!currentUser) return;
    try {
      doubtService.acceptAnswer(doubt.id, answerId, currentUser.id);
      refreshDoubt();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteAnswer = (answerId: string) => {
    if (!currentUser || !isAdmin) return;
    if (window.confirm('Delete this answer?')) {
      doubtService.deleteAnswer(doubt.id, answerId, currentUser.id);
      refreshDoubt();
    }
  };

  const handleVote = (answerId: string, type: 'helpful' | 'not_helpful') => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    doubtService.voteAnswerHelpful(answerId, currentUser.id, type);
    refreshDoubt();
  };

  const handleReplySubmit = (answerId: string) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!replyText.trim()) return;

    try {
      doubtService.addReply(answerId, currentUser, replyText);
      setReplyText('');
      setActiveReplyAnswerId(null);
      refreshDoubt();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReportSubmit = (reason: any, notes?: string) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    doubtService.reportContent(currentUser, {
      contentType: reportTarget.type,
      contentId: reportTarget.id,
      doubtId: doubt.id,
      reason,
      notes,
    });
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAnswerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setAnswerError('File size must be under 5 MB.');
      return;
    }
    const isPdf = file.type === 'application/pdf';
    const reader = new FileReader();
    reader.onload = () => {
      setAnswerAttachment({
        file_name: file.name,
        file_url: reader.result as string,
        file_type: isPdf ? 'pdf' : 'image',
        file_size: `${(file.size / 1024).toFixed(1)} KB`,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('doubts')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Doubts Feed
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
            title="Copy share link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
          </button>

          <button
            onClick={() => {
              setReportTarget({ type: 'question', id: doubt.id, title: doubt.title });
              setReportModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 text-xs font-bold transition-all cursor-pointer"
            title="Report inappropriate content"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Report</span>
          </button>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
              {doubt.status === 'CLOSED' ? (
                <button
                  onClick={handleReopenQuestion}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-bold transition-all"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  Reopen
                </button>
              ) : (
                <button
                  onClick={() => setShowCloseModal(true)}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-bold transition-all"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Close Doubt
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Left Question & Answers (Cols 1-8), Right Context & Related (Cols 9-12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: QUESTION & ANSWERS THREAD */}
        <div className="lg:col-span-8 space-y-6">
          {/* QUESTION CARD */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0b0f1d] border border-cyan-500/20 shadow-xl space-y-6">
            {/* Status & Subject Pill */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                  {doubt.subject_name}
                </span>
                {doubt.topic && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300">
                    {doubt.topic}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {doubt.status === 'RESOLVED' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    RESOLVED
                  </span>
                )}
                {doubt.status === 'ANSWERED' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    ANSWERED
                  </span>
                )}
                {doubt.status === 'OPEN' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    <Clock className="w-4 h-4 text-amber-400" />
                    OPEN (Awaiting Answer)
                  </span>
                )}
                {doubt.status === 'CLOSED' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-slate-800 text-slate-400 border border-slate-700">
                    <Lock className="w-4 h-4" />
                    CLOSED
                  </span>
                )}
              </div>
            </div>

            {/* If Editing Mode */}
            {isEditingQuestion ? (
              <form onSubmit={handleSaveEditQuestion} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">Topic</label>
                  <input
                    type="text"
                    value={editTopic}
                    onChange={(e) => setEditTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">Description</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={5}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingQuestion(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* Question Title */}
                <h1 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white leading-snug">
                  {doubt.title}
                </h1>

                {/* Description Body */}
                <div className="text-sm sm:text-base text-slate-300 leading-relaxed space-y-3 whitespace-pre-line font-normal">
                  {doubt.description}
                </div>

                {/* Attached Files (Image preview or PDF download) */}
                {doubt.attachments && doubt.attachments.length > 0 && (
                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
                      Attached Reference ({doubt.attachments.length})
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {doubt.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 max-w-sm"
                        >
                          {att.file_type === 'pdf' ? (
                            <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                          ) : (
                            <a
                              href={att.file_url}
                              target="_blank"
                              rel="noreferrer"
                              className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700 block"
                            >
                              <img
                                src={att.file_url}
                                alt={att.file_name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </a>
                          )}
                          <div className="truncate text-xs">
                            <p className="font-bold text-slate-200 truncate">{att.file_name}</p>
                            <p className="text-[10px] text-slate-500">{att.file_size}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {doubt.tags && doubt.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {doubt.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
                      >
                        <Tag className="w-3 h-3 text-slate-500" />
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Author Footer (No Profile Photos) & Student Owner Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <UserInitialsBadge name={doubt.student_name} role="student" size="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{doubt.student_name}</span>
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                      Student
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Asked on {createdDate}</p>
                </div>
              </div>

              {/* Owner Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  id="ask-ai-from-doubt-btn"
                  onClick={() =>
                    onNavigate('ai_assistant', {
                      materialId: doubt.related_material_id,
                      topic: `${doubt.title} (${doubt.subject_name})`,
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-cyan-500/10"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ask YuvaSetu AI</span>
                </button>

                {(isAuthor || isAdmin) && !isEditingQuestion && (
                  <>
                    <button
                      onClick={() => setIsEditingQuestion(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all"
                    >
                      <Edit className="w-3.5 h-3.5 text-cyan-400" />
                      Edit
                    </button>
                    <button
                      onClick={handleDeleteQuestion}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 text-xs font-semibold transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </>
                )}

                {isAuthor && doubt.status !== 'RESOLVED' && (
                  <button
                    onClick={handleResolveQuestion}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ANSWERS SECTION HEADER */}
          <div className="flex items-center justify-between pt-4">
            <h2 className="text-lg font-black font-['Outfit'] text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <span>
                {doubt.answers_count} {doubt.answers_count === 1 ? 'Answer' : 'Answers'}
              </span>
            </h2>
            <span className="text-xs text-slate-400">
              Verified Academic Mentorship
            </span>
          </div>

          {/* WRITE ANSWER BOX (ADMIN) */}
          {isAdmin ? (
            <div className="p-6 rounded-3xl bg-[#0d1222] border border-cyan-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-black font-['Outfit'] text-white">
                    Write Academic Solution as Administrator
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-cyan-300 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                  Admin Authority
                </span>
              </div>

              {answerError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{answerError}</span>
                </div>
              )}

              <form onSubmit={handleAnswerSubmit} className="space-y-4">
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  rows={6}
                  placeholder="Provide step-by-step mathematical, algorithmic, or conceptual derivation. Supports markdown, code snippets, and key takeaways..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-500 leading-relaxed"
                />

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div>
                    <input
                      ref={answerFileInputRef}
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleAnswerFileChange}
                      className="hidden"
                    />
                    {!answerAttachment ? (
                      <button
                        type="button"
                        onClick={() => answerFileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
                        Attach Reference Diagram / PDF
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-xs bg-slate-900 px-3 py-1.5 rounded-xl border border-cyan-500/30 text-cyan-300">
                        <span>{answerAttachment.file_name}</span>
                        <button
                          type="button"
                          onClick={() => setAnswerAttachment(null)}
                          className="hover:text-rose-400 text-slate-500 font-bold"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingAnswer}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white text-xs font-black shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingAnswer ? 'Posting Answer...' : 'Post Solution'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-300">
                    YuvaSetu Academic Lead & Educator Verified Answering
                  </p>
                  <p className="text-[11px] text-slate-500">
                    In this initial release, answers are provided by verified educators and administrators to maintain highest standard of academic quality.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ANSWERS LIST */}
          <div className="space-y-6">
            {doubt.answers && doubt.answers.length > 0 ? (
              doubt.answers.map((ans) => {
                const ansDate = new Date(ans.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
                const userVote = currentUser ? doubtService.getUserVote(ans.id, currentUser.id) : null;

                return (
                  <div
                    key={ans.id}
                    className={`p-6 sm:p-7 rounded-3xl border transition-all duration-200 space-y-5 ${
                      ans.is_accepted
                        ? 'bg-[#08151f] border-emerald-500/40 shadow-emerald-500/5 shadow-xl'
                        : 'bg-[#0b0f1d] border-slate-800/90 shadow-lg'
                    }`}
                  >
                    {/* Answer Header: Author info, Role, Accepted Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <UserInitialsBadge name={ans.author_name} role="admin" size="md" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{ans.author_name}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                              {ans.author_role}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">Answered on {ansDate}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {ans.is_accepted && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ✓ Accepted Answer
                          </span>
                        )}

                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteAnswer(ans.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition-colors"
                            title="Delete Answer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Answer Body */}
                    <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line space-y-3 font-normal">
                      {ans.answer_text}
                    </div>

                    {/* Answer Attachment */}
                    {ans.attachments && ans.attachments.length > 0 && (
                      <div className="pt-2">
                        {ans.attachments.map((att) => (
                          <div
                            key={att.id}
                            className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3 max-w-sm"
                          >
                            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                              {att.file_type === 'pdf' ? <FileText className="w-5 h-5" /> : <Paperclip className="w-5 h-5" />}
                            </div>
                            <div className="truncate text-xs">
                              <p className="font-bold text-slate-200 truncate">{att.file_name}</p>
                              <p className="text-[10px] text-slate-500">{att.file_size}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Answer Footer: Helpful / Not Helpful Votes, Accept Button, Reply Toggle */}
                    <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        {/* Helpful Button */}
                        <button
                          onClick={() => handleVote(ans.id, 'helpful')}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            userVote === 'helpful'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>Helpful ({ans.helpful_count})</span>
                        </button>

                        {/* Not Helpful Button */}
                        <button
                          onClick={() => handleVote(ans.id, 'not_helpful')}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            userVote === 'not_helpful'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400'
                          }`}
                          title="Not helpful"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Reply Button */}
                        <button
                          onClick={() =>
                            setActiveReplyAnswerId(activeReplyAnswerId === ans.id ? null : ans.id)
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-bold transition-colors cursor-pointer ml-1"
                        >
                          <CornerDownRight className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Reply ({ans.replies?.length || 0})</span>
                        </button>

                        {/* Report Answer */}
                        <button
                          onClick={() => {
                            setReportTarget({
                              type: 'answer',
                              id: ans.id,
                              title: `Answer by ${ans.author_name}`,
                            });
                            setReportModalOpen(true);
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg transition-colors text-xs"
                          title="Report this answer"
                        >
                          <Flag className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Student Accept Answer Action */}
                      {isAuthor && !ans.is_accepted && (
                        <button
                          onClick={() => handleAcceptAnswer(ans.id)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/30 text-emerald-300 text-xs font-black transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Accept as Solution</span>
                        </button>
                      )}
                    </div>

                    {/* DISCUSSION / REPLIES THREAD (Question -> Answer -> Reply) */}
                    <div className="space-y-3 pt-2">
                      {ans.replies && ans.replies.length > 0 && (
                        <div className="pl-4 sm:pl-6 border-l-2 border-slate-800 space-y-2.5">
                          {ans.replies.map((rep) => (
                            <div
                              key={rep.id}
                              className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-200">
                                  {rep.user_name}
                                  {rep.user_role === 'admin' && (
                                    <span className="text-[10px] text-cyan-400 font-bold ml-1.5">
                                      [Admin]
                                    </span>
                                  )}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  {new Date(rep.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-slate-300 leading-relaxed">{rep.text}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Input Box */}
                      {activeReplyAnswerId === ans.id && (
                        <div className="pl-4 sm:pl-6 border-l-2 border-cyan-500/40 pt-2 flex gap-2">
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write a follow-up clarification or reply..."
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleReplySubmit(ans.id);
                            }}
                            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-cyan-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleReplySubmit(ans.id)}
                            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors cursor-pointer"
                          >
                            Reply
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 rounded-3xl bg-[#0b0f1d] border border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-slate-500 flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">No Answers Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  This academic doubt has been posted. Our verified academic mentors and admins will review and answer shortly.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: RELATED STUDY MATERIAL & LIVE SESSIONS */}
        <div className="lg:col-span-4 space-y-6">
          {/* SECTION 1: RELATED STUDY MATERIAL */}
          <div className="p-6 rounded-3xl bg-[#0b0f1d] border border-slate-800/80 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-black font-['Outfit'] text-white">
                  Related Study Notes
                </h3>
              </div>
              <span className="text-[10px] font-bold text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                Curriculum
              </span>
            </div>

            <div className="space-y-3">
              {relatedMaterials.length > 0 ? (
                relatedMaterials.map((mat) => (
                  <div
                    key={mat.id}
                    onClick={() => onNavigate('content_details', { contentId: mat.id })}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                      <span className="truncate">{mat.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{mat.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
                      <span>{mat.content_type.toUpperCase()} • {mat.subject_name}</span>
                      <span className="text-cyan-400 font-bold flex items-center gap-0.5">
                        View Notes <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-3 text-center">
                  No direct study notes linked for this topic yet.
                </p>
              )}
            </div>

            <button
              onClick={() => onNavigate('explore')}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-300 text-xs font-bold transition-all text-center cursor-pointer"
            >
              Browse All Study Materials →
            </button>
          </div>

          {/* SECTION 2: RELATED LIVE SESSION */}
          <div className="p-6 rounded-3xl bg-[#0b0f1d] border border-rose-500/20 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-400" />
                <h3 className="text-base font-black font-['Outfit'] text-white">
                  Related Live Session
                </h3>
              </div>
              <span className="text-[10px] font-bold text-rose-300 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">
                Live Q&A
              </span>
            </div>

            <div className="space-y-3">
              {relatedSessions.length > 0 ? (
                relatedSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => onNavigate('live_sessions', { sessionId: session.id })}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                      <span className="truncate">{session.title}</span>
                      <span className="text-[10px] text-rose-400 uppercase font-black">
                        {session.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{session.topic}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
                      <span>{session.date} • {session.startTime}</span>
                      <span className="text-rose-400 font-bold">View Session →</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-3 text-center">
                  No upcoming live session scheduled for this subject today.
                </p>
              )}
            </div>

            <button
              onClick={() => onNavigate('live_sessions')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-400 text-white text-xs font-black shadow-md transition-all text-center cursor-pointer"
            >
              View Live Sessions Calendar
            </button>
          </div>

          {/* SECTION 3: ACADEMIC GUIDELINES */}
          <div className="p-5 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-2 text-xs text-slate-400">
            <h4 className="font-bold text-slate-200">YuvaSetu Doubt Policy</h4>
            <p className="leading-relaxed text-[11px]">
              Questions should be focused on specific curriculum concepts. Respect peer learning and maintain clear academic standards.
            </p>
          </div>
        </div>
      </div>

      {/* REPORT MODAL */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onSubmit={handleReportSubmit}
        contentType={reportTarget.type}
        contentTitle={reportTarget.title}
      />

      {/* CLOSE DOUBT ADMIN MODAL */}
      {showCloseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-[#0d1222] border border-slate-700 shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-black text-white">Close Doubt Question</h3>
            <p className="text-xs text-slate-400">
              Provide a reason for closing this doubt (e.g. solved externally, inappropriate, or duplicate).
            </p>
            <textarea
              value={closeReason}
              onChange={(e) => setCloseReason(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCloseModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCloseQuestion}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-600"
              >
                Confirm Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
