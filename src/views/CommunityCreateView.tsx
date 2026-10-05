import React, { useState } from 'react';
import { User } from '../types/user';
import { DiscussionCategory, CreateDiscussionDTO } from '../types/community';
import { communityService } from '../services/communityService';
import { PLATFORM_SUBJECTS } from '../data/subjectData';
import {
  ArrowLeft,
  BookOpen,
  Send,
  Upload,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Tag,
  FileText,
  X,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';

interface CommunityCreateViewProps {
  currentUser: User | null;
  onNavigate: (view: string, payload?: any) => void;
}

const CATEGORIES: DiscussionCategory[] = [
  'CONCEPT DISCUSSION',
  'EXAM PREPARATION',
  'CAREER / LEARNING',
  'PROJECT DISCUSSION',
  'RESOURCE DISCUSSION',
  'GENERAL DISCUSSION',
];

export const CommunityCreateView: React.FC<CommunityCreateViewProps> = ({
  currentUser,
  onNavigate,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subjectId, setSubjectId] = useState(PLATFORM_SUBJECTS[0]?.id || 'dsa');
  const [topic, setTopic] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [discussionType, setDiscussionType] = useState<DiscussionCategory>('CONCEPT DISCUSSION');
  const [attachment, setAttachment] = useState<{
    file_name: string;
    file_url: string;
    file_type: 'image' | 'pdf' | 'screenshot';
    file_size: string;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('Attachment exceeds 5MB limit.');
      return;
    }

    // Check type: images or pdf
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';

    if (!isImage && !isPdf) {
      setError('Only image files (PNG, JPG, WebP) and PDF documents are supported as attachments.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      setAttachment({
        file_name: file.name,
        file_url: result,
        file_type: isPdf ? 'pdf' : 'image',
        file_size: sizeStr,
      });
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Please log in to start a community discussion.');
      return;
    }

    if (title.trim().length < 8) {
      setError('Discussion title must be at least 8 characters long.');
      return;
    }

    if (content.trim().length < 15) {
      setError('Please provide more detailed context in your discussion content (at least 15 characters).');
      return;
    }

    if (!topic.trim()) {
      setError('Please provide a specific academic topic name (e.g. Dynamic Programming, Normalization, OSI Model).');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const selectedSubjectObj = PLATFORM_SUBJECTS.find((s) => s.id === subjectId);
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const created = communityService.createDiscussion(currentUser, {
        title,
        content,
        subject_id: subjectId,
        subject_name: selectedSubjectObj?.name || 'Computer Science',
        topic,
        tags: tags.length > 0 ? tags : [selectedSubjectObj?.name || 'Engineering'],
        discussion_type: discussionType,
        attachment: attachment || undefined,
      });

      onNavigate('community_detail', { discussionId: created.id });
    } catch (err: any) {
      setError(err?.message || 'Failed to publish discussion.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d1a] text-slate-100 pb-20 font-['Outfit',sans-serif]">
      {/* Top Bar */}
      <div className="bg-[#11172e] border-b border-cyan-900/30 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('community')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Community
          </button>

          <span className="text-xs text-cyan-400 font-semibold">Start New Discussion</span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-[#11172e] border border-cyan-900/40 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Start an Academic Discussion
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Ask questions, discuss theoretical trade-offs, or share exam preparation insights.
            </p>
          </div>

          {/* Academic Integrity Notice */}
          <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-xl p-4 mb-6 flex items-start gap-3 text-xs text-cyan-200">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white mb-0.5">YuvaSetu Peer Learning Guidelines</p>
              <p className="text-slate-300 leading-relaxed">
                Official curriculum notes and video lectures remain verified and curated by platform
                Administrators. Student discussions provide collaborative peer support and academic
                exchange.
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 mb-6 flex items-center gap-3 text-xs text-rose-300">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Discussion Category <span className="text-cyan-400">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setDiscussionType(cat)}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      discussionType === cat
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-950/40'
                        : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:bg-slate-800/80 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject and Topic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Subject <span className="text-cyan-400">*</span>
                </label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-800 text-xs text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500/50"
                >
                  {PLATFORM_SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Topic / Sub-Concept <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Dynamic Programming, Normalization, OSI Model"
                  className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                  required
                />
              </div>
            </div>

            {/* Discussion Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Discussion Title <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Clear, specific title summarizing your question or discussion point..."
                className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                required
              />
            </div>

            {/* Discussion Content */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Detailed Context & Explanation <span className="text-cyan-400">*</span>
              </label>
              <textarea
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe your reasoning, specific formula, code snippet context, or exam question background in detail..."
                className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-y"
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Tags (Comma-separated)
              </label>
              <div className="relative">
                <Tag className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. Recursion, Space Complexity, Semester 4, GATE CSE"
                  className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-500/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                />
              </div>
            </div>

            {/* Attachment */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Optional Screenshot / Diagram / PDF
              </label>

              {attachment ? (
                <div className="flex items-center justify-between p-3.5 bg-cyan-500/10 border border-cyan-500/40 rounded-xl">
                  <div className="flex items-center gap-3">
                    {attachment.file_type === 'pdf' ? (
                      <FileText className="w-5 h-5 text-cyan-400" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-cyan-400" />
                    )}
                    <div>
                      <p className="text-xs font-bold text-white">{attachment.file_name}</p>
                      <p className="text-[10px] text-cyan-300">{attachment.file_size}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachment(null)}
                    className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-6 border border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-all">
                  <Upload className="w-6 h-6 text-slate-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-300">
                    Click to attach diagram, code screenshot, or reference PDF
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">
                    PNG, JPG, WebP, PDF (Max 5MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Submit Bar */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => onNavigate('community')}
                className="px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-950/60 transition-all active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Publishing...' : 'Publish Discussion'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
