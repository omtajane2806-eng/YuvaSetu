import React, { useState, useRef } from 'react';
import { User } from '../types/user';
import { doubtService } from '../services/doubtService';
import { PLATFORM_SUBJECTS } from '../data/subjectData';
import {
  HelpCircle,
  ArrowLeft,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Tag,
  Info,
} from 'lucide-react';

export interface AskDoubtViewProps {
  currentUser: User | null;
  onNavigate: (view: string, payload?: any) => void;
  onOpenAuth: () => void;
}

export const AskDoubtView: React.FC<AskDoubtViewProps> = ({
  currentUser,
  onNavigate,
  onOpenAuth,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState(PLATFORM_SUBJECTS[0].id);
  const [topic, setTopic] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [attachment, setAttachment] = useState<{
    file_name: string;
    file_url: string;
    file_type: 'image' | 'pdf' | 'screenshot';
    file_size: string;
  } | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-xl">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black font-['Outfit'] text-white">
          Sign In to Ask a Doubt
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          YuvaSetu Doubt Solving is completely free for all verified students. Log in or create an account to get answers from educators.
        </p>
        <button
          onClick={() => onOpenAuth()}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all"
        >
          Sign In to Continue
        </button>
      </div>
    );
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, attachment: 'File size must be under 5 MB.' }));
      return;
    }

    // Check type: images or pdf
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        attachment: 'Only images (PNG, JPG, WEBP) or PDFs are allowed. No executable files.',
      }));
      return;
    }

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.attachment;
      return copy;
    });

    const isPdf = file.type === 'application/pdf';
    const isScreenshot = file.name.toLowerCase().includes('screenshot');

    const reader = new FileReader();
    reader.onload = () => {
      setAttachment({
        file_name: file.name,
        file_url: reader.result as string,
        file_type: isPdf ? 'pdf' : isScreenshot ? 'screenshot' : 'image',
        file_size: `${(file.size / 1024).toFixed(1)} KB`,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Question title is required.';
    } else if (title.trim().length < 8) {
      newErrors.title = 'Question title must be at least 8 characters.';
    }

    if (!description.trim()) {
      newErrors.description = 'Please provide a detailed question description.';
    } else if (description.trim().length < 15) {
      newErrors.description = 'Description must be at least 15 characters to provide clear context.';
    }

    if (!subjectId) {
      newErrors.subjectId = 'Please select a subject.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const selectedSubject = PLATFORM_SUBJECTS.find((s) => s.id === subjectId);
      const created = doubtService.createDoubt(currentUser, {
        title,
        description,
        subject_id: subjectId,
        subject_name: selectedSubject ? selectedSubject.name : 'General',
        topic: topic || undefined,
        tags: tags.length > 0 ? tags : [selectedSubject?.name || 'Academic Doubt'],
        attachment: attachment || undefined,
      });

      setTimeout(() => {
        setIsSubmitting(false);
        onNavigate('doubt_detail', { doubtId: created.id });
      }, 500);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrors((prev) => ({ ...prev, form: err.message || 'Failed to submit doubt' }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('doubts')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Doubts
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          100% Free Academic Help
        </div>
      </div>

      {/* Main Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0b0f1e] border border-cyan-500/20 shadow-2xl space-y-6">
        <div className="border-b border-slate-800 pb-5 space-y-1">
          <h1 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
            Ask an Academic Doubt
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Be specific with your questions, algorithms, formulas, or code. YuvaSetu administrators and verified educators answer student questions.
          </p>
        </div>

        {errors.form && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Title */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Question Title <span className="text-rose-400">*</span></span>
              <span className="text-[11px] text-slate-500 lowercase font-normal">e.g. How does binary search work?</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What is your specific question or conceptual obstacle?"
              className={`w-full px-4 py-3 rounded-2xl bg-slate-900/90 border text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none transition-all ${
                errors.title ? 'border-rose-500 focus:border-rose-400' : 'border-slate-800 focus:border-cyan-500'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Subject & Topic Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Subject */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Subject <span className="text-rose-400">*</span>
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
              >
                {PLATFORM_SUBJECTS.map((sub) => (
                  <option key={sub.id} value={sub.id} className="bg-slate-900 text-slate-200">
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic (Optional) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Topic (Optional)
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Searching, Normalization, TCP"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Question Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Question Description & Context <span className="text-rose-400">*</span></span>
              <span className="text-[11px] text-slate-500 font-normal">Supports paragraphs and code blocks</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Describe where you are stuck, what you have tried, or the specific step that is confusing..."
              className={`w-full px-4 py-3 rounded-2xl bg-slate-900/90 border text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none transition-all leading-relaxed ${
                errors.description ? 'border-rose-500 focus:border-rose-400' : 'border-slate-800 focus:border-cyan-500'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Tags (Optional) */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Tags (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="e.g. BinarySearch, TimeComplexity (Press Enter or Add)"
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
              >
                Add Tag
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold bg-cyan-500/10 border border-cyan-500/20 text-cyan-300"
                  >
                    <Tag className="w-3 h-3" />
                    {t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-cyan-400 hover:text-white ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Attachment Upload (Optional) */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Optional Attachment (Image, Screenshot or PDF)</span>
              <span className="text-[11px] text-slate-500">Max size 5 MB</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {!attachment ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-4 rounded-2xl border border-dashed border-slate-700 hover:border-cyan-500/50 bg-slate-900/40 hover:bg-slate-900/80 transition-all flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center text-cyan-400">
                  <Paperclip className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-300">Click to attach screenshot or diagram</p>
                  <p className="text-[11px] text-slate-500">PNG, JPG, WEBP or PDF up to 5 MB</p>
                </div>
              </button>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-cyan-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    {attachment.file_type === 'pdf' ? (
                      <FileText className="w-5 h-5" />
                    ) : (
                      <ImageIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200 truncate max-w-xs sm:max-w-md">
                      {attachment.file_name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {attachment.file_type.toUpperCase()} • {attachment.file_size}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveAttachment}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Remove attachment"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {errors.attachment && (
              <p className="text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.attachment}
              </p>
            )}
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onNavigate('doubts')}
              className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white text-xs font-black shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Doubt...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Question</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
