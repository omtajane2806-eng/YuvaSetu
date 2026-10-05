import React, { useState } from 'react';
import { User } from '../types/user';
import { ContentType, CreateContentDTO } from '../types/content';
import { PLATFORM_SUBJECTS } from '../data/subjectData';
import { contentService } from '../services/contentService';
import { YuvaSetuLogo } from '../components/YuvaSetuLogo';
import {
  Upload,
  FileText,
  FileCode,
  Video,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Lock,
  X,
  Plus,
  Info,
} from 'lucide-react';

export interface UploadContentViewProps {
  currentUser: User;
  onNavigate: (view: string, payload?: any) => void;
  onUploadSuccess?: () => void;
}

export const UploadContentView: React.FC<UploadContentViewProps> = ({
  currentUser,
  onNavigate,
  onUploadSuccess,
}) => {
  // If user is not an Admin, show Admin Exclusive Publishing notice
  if (currentUser.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black font-['Outfit'] text-white">
            Admin Exclusive Publishing
          </h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            For quality assurance and verified academic accuracy, study materials on YuvaSetu are currently curated and published directly by official administrators.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0c1020] border border-slate-800 text-xs text-slate-400 max-w-md mx-auto">
          Students can browse, search, read, like, bookmark, and download all verified study notes for 100% free. Student creator publishing will open in an upcoming release!
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('explore')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20"
          >
            Explore Free Materials
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:text-white"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState(
    currentUser.learningSubjects?.[0]
      ? PLATFORM_SUBJECTS.find((s) => s.name === currentUser.learningSubjects[0])?.id || 'dsa'
      : 'dsa'
  );
  const [contentType, setContentType] = useState<ContentType>('note');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['PeerNotes', 'SemesterExams']);
  const [contentBody, setContentBody] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDuration, setVideoDuration] = useState('15 mins');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'pdf' | 'docx' | 'doc' | 'txt' | 'other'>('pdf');
  const [dragOver, setDragOver] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Tag helpers
  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const clean = tagInput.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // PDF / Document File drop / selection handler with validation
  const handleFileChange = (file: File) => {
    setErrorMessage(null);
    const lower = file.name.toLowerCase();
    const isDoc =
      lower.endsWith('.pdf') ||
      lower.endsWith('.docx') ||
      lower.endsWith('.doc') ||
      lower.endsWith('.txt');

    if (!isDoc && file.type !== 'application/pdf') {
      setErrorMessage('Please select a document file (.pdf, .docx, .doc, or .txt format).');
      setSelectedFile(null);
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage('Document file size exceeds the 50MB limit. Please choose a smaller file.');
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);

    let type: 'pdf' | 'docx' | 'doc' | 'txt' | 'other' = 'pdf';
    if (lower.endsWith('.docx')) type = 'docx';
    else if (lower.endsWith('.doc')) type = 'doc';
    else if (lower.endsWith('.txt')) type = 'txt';
    setFileType(type);

    const reader = new FileReader();
    reader.onload = () => {
      setFileDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side Validation (Requirement #12)
    if (!title.trim() || title.trim().length < 4) {
      setErrorMessage('Please enter a descriptive title (at least 4 characters).');
      return;
    }

    if (!description.trim() || description.trim().length < 10) {
      setErrorMessage('Please provide a helpful description (at least 10 characters).');
      return;
    }

    if (!subjectId) {
      setErrorMessage('Please select a subject category.');
      return;
    }

    if (contentType === 'note' && (!contentBody.trim() || contentBody.trim().length < 20)) {
      setErrorMessage('Please write your educational notes or summary content (at least 20 characters).');
      return;
    }

    if (contentType === 'pdf' && !selectedFile) {
      setErrorMessage('Please select a PDF file to upload.');
      return;
    }

    if (contentType === 'video' && (!videoUrl.trim() || videoUrl.trim().length < 5)) {
      setErrorMessage('Please enter a valid video lecture URL or YouTube embed link.');
      return;
    }

    try {
      setIsSubmitting(true);

      const creatorPayload = {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.profileImage,
        role: 'Student Creator',
        college: currentUser.college,
        reputation: currentUser.reputation,
        followersCount: currentUser.followersCount,
      };

      const uploadDTO: CreateContentDTO = {
        title,
        description,
        subject_id: subjectId,
        content_type: contentType,
        tags,
        content_body: contentType === 'note' ? contentBody : undefined,
        file: selectedFile,
        file_name: selectedFile ? selectedFile.name : undefined,
        file_data_url: fileDataUrl || undefined,
        file_type: fileType,
        video_url: contentType === 'video' ? videoUrl : undefined,
        video_duration: contentType === 'video' ? videoDuration : undefined,
      };

      // Artificial small latency for smooth feel
      await new Promise((r) => setTimeout(r, 600));

      const created = contentService.uploadContent(currentUser.id, creatorPayload, uploadDTO);

      setUploadSuccess(true);
      if (onUploadSuccess) onUploadSuccess();

      // Redirect after 1.2s to the uploaded content details
      setTimeout(() => {
        onNavigate('content_details', { contentId: created.id });
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to upload content. Please check the form.');
      setIsSubmitting(false);
    }
  };

  return (
    <div id="vidyasetu-upload-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <button
          onClick={() => onNavigate('explore')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Explore
        </button>

        <div className="flex items-center gap-2">
          <YuvaSetuLogo variant="horizontal" size="xs" showTagline={false} />
          <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
            Peer Contributor
          </span>
        </div>
      </div>

      {/* Main Upload Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[#0a0e1c] border border-slate-800 shadow-2xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
            Upload Learning Content
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Share high-yield lecture notes, problem-solving derivations, formula sheets, or video lessons to help peer students bridge their learning (<span className="text-cyan-400 font-semibold">Samajh Se Safalta Tak</span>).
          </p>
        </div>

        {/* Free Access Notice Banner (Requirement #11, #18) */}
        <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-3 text-xs text-cyan-200">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-white">Access Model: 100% FREE</p>
            <p className="text-slate-300">
              All peer contributions on YuvaSetu are freely accessible to students. <em>Premium content tiers and VidyaTokens rewards are coming soon in future modules.</em>
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-800/60 flex items-center gap-3 text-xs text-rose-200 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {uploadSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-800/60 flex items-center gap-3 text-xs text-emerald-200 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-bold">Content published successfully! Redirecting to resource...</span>
          </div>
        )}

        {/* UPLOAD FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Title */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Content Title <span className="text-cyan-400">*</span>
            </label>
            <input
              id="upload-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. DBMS Normalization — 1NF, 2NF, 3NF & BCNF Complete Notes"
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          {/* 2. Description */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Description <span className="text-cyan-400">*</span>
            </label>
            <textarea
              id="upload-description-input"
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summarize key topics covered, exam relevance, and core takeaways..."
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-500 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* 3. Subject Selection & Content Type (2 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subject Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Subject <span className="text-cyan-400">*</span>
              </label>
              <select
                id="upload-subject-select"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none transition-colors cursor-pointer"
              >
                {PLATFORM_SUBJECTS.map((subj) => (
                  <option key={subj.id} value={subj.id}>
                    {subj.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Content Type Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Content Type <span className="text-cyan-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  id="type-note-btn"
                  onClick={() => setContentType('note')}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                    contentType === 'note'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4 mb-1" />
                  <span>Note</span>
                </button>

                <button
                  type="button"
                  id="type-pdf-btn"
                  onClick={() => setContentType('pdf')}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                    contentType === 'pdf'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/10'
                      : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <FileCode className="w-4 h-4 mb-1" />
                  <span>PDF</span>
                </button>

                <button
                  type="button"
                  id="type-video-btn"
                  onClick={() => setContentType('video')}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                    contentType === 'video'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-md shadow-purple-500/10'
                      : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <Video className="w-4 h-4 mb-1" />
                  <span>Video</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4. Type-Specific Input Areas */}
          {contentType === 'note' && (
            <div className="space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Notes Content (Markdown & Text) <span className="text-cyan-400">*</span>
                </label>
                <span className="text-[11px] text-slate-400">Supports # Headings, Lists & \`\`\`Code</span>
              </div>
              <textarea
                id="upload-notes-body-input"
                rows={10}
                required
                value={contentBody}
                onChange={(e) => setContentBody(e.target.value)}
                placeholder="# 1. Core Intuition\n\nExplain the concept clearly with steps and formulas..."
                className="w-full bg-[#070a14] border border-slate-800 focus:border-cyan-500 rounded-2xl p-4 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition-colors"
              />
            </div>
          )}

          {contentType === 'pdf' && (
            <div className="space-y-2 animate-fadeIn">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Upload PDF Document <span className="text-amber-400">*</span>
              </label>

              {/* Drag & Drop Area */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileChange(e.dataTransfer.files[0]);
                  }
                }}
                className={`p-8 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
                  dragOver
                    ? 'border-amber-400 bg-amber-950/20'
                    : selectedFile
                    ? 'border-emerald-500/50 bg-emerald-950/10'
                    : 'border-slate-800 bg-[#070a14] hover:border-slate-700'
                }`}
                onClick={() => {
                  document.getElementById('pdf-file-input')?.click();
                }}
              >
                <input
                  id="pdf-file-input"
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />

                {selectedFile ? (
                  <div className="flex flex-col items-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    <p className="text-sm font-bold text-white">{selectedFile.name}</p>
                    <p className="text-xs text-slate-400 font-mono">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to publish
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="text-xs text-rose-400 hover:text-rose-300 font-semibold underline mt-1"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <FileCode className="w-10 h-10 text-amber-400/80" />
                    <p className="text-sm font-bold text-white">
                      Drag & Drop your PDF notes here or <span className="text-amber-400 underline">Browse Files</span>
                    </p>
                    <p className="text-xs text-slate-500">
                      Standard PDF documents up to 25MB supported
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {contentType === 'video' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Video URL / YouTube Lecture Link <span className="text-purple-400">*</span>
                </label>
                <input
                  id="upload-video-url-input"
                  type="url"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or lecture stream"
                  className="w-full bg-slate-900/90 border border-slate-800 focus:border-purple-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Estimated Duration
                </label>
                <input
                  type="text"
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(e.target.value)}
                  placeholder="e.g. 25 mins"
                  className="w-full sm:w-60 bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white"
                />
              </div>
            </div>
          )}

          {/* 5. Tags */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Tags (Optional)
            </label>
            <div className="flex items-center gap-2">
              <input
                id="upload-tags-input"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type tag name and press Enter (e.g. Normalization, GATE, PYQ)"
                className="flex-1 bg-slate-900/90 border border-slate-800 focus:border-cyan-500 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
              >
                Add
              </button>
            </div>

            {/* Tag Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-xl bg-slate-900 text-slate-300 border border-slate-800"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="p-0.5 text-slate-500 hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onNavigate('explore')}
              className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              id="submit-content-upload-btn"
              type="submit"
              disabled={isSubmitting || uploadSuccess}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm shadow-xl shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <span>Publishing to YuvaSetu...</span>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Publish FREE Content</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
