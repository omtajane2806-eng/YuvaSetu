import React, { useState } from 'react';
import { YuvaSetuLogo } from '../components/YuvaSetuLogo';
import { PLATFORM_SUBJECTS } from '../data/subjectData';
import { ContentType, CreateContentDTO, ContentItem } from '../types/content';
import { User } from '../types/user';
import { contentService } from '../services/contentService';
import {
  FileText,
  FileCode,
  Video,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Layers,
  Tag,
  ShieldCheck,
  Eye,
  Clock,
  Save,
} from 'lucide-react';

export interface AdminAddMaterialViewProps {
  currentUser: User | null;
  onNavigate: (view: string, payload?: any) => void;
  initialData?: ContentItem;
  onSuccess?: () => void;
}

export const AdminAddMaterialView: React.FC<AdminAddMaterialViewProps> = ({
  currentUser,
  onNavigate,
  initialData,
  onSuccess,
}) => {
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title || '');
  const [subjectId, setSubjectId] = useState(initialData?.subject_id || 'dsa');
  const [topic, setTopic] = useState(initialData?.topic || '');
  const [contentType, setContentType] = useState<ContentType>(
    initialData?.content_type || 'pdf'
  );
  const [description, setDescription] = useState(initialData?.description || '');
  const [contentBody, setContentBody] = useState(initialData?.content_body || '');
  const [videoUrl, setVideoUrl] = useState(initialData?.video_data?.videoUrl || '');
  const [videoDuration, setVideoDuration] = useState(
    initialData?.video_data?.duration || '30 mins'
  );
  const [fileName, setFileName] = useState(
    initialData?.pdf_data?.fileName || 'DSA_Handwritten_Notes.pdf'
  );
  const [fileSize, setFileSize] = useState<string>(
    initialData?.pdf_data?.fileSize || '3.5 MB'
  );
  const [fileType, setFileType] = useState<'pdf' | 'docx' | 'doc' | 'txt' | 'other'>(
    initialData?.pdf_data?.fileType || (initialData?.pdf_data?.fileName?.toLowerCase().endsWith('.docx') ? 'docx' : 'pdf')
  );
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(
    initialData?.pdf_data?.fileDataUrl || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [pageCount, setPageCount] = useState<number>(
    initialData?.pdf_data?.pageCount || 25
  );
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags?.join(', ') || 'Data Structures, Algorithms, Exam Prep'
  );
  const [status, setStatus] = useState<'published' | 'draft'>(
    initialData?.status || 'published'
  );

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileProcess = (file: File) => {
    setSelectedFile(file);
    setFileName(file.name);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    setFileSize(`${sizeMb} MB`);

    const lower = file.name.toLowerCase();
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

    if (file.size > 0) {
      const est = Math.max(1, Math.min(60, Math.round(file.size / (150 * 1024))));
      setPageCount(est || 12);
    }
  };

  const handleSubmit = (targetStatus?: 'published' | 'draft') => {
    setErrorMsg('');
    setSuccessMsg('');

    const finalStatus = targetStatus || status;

    if (!title.trim()) {
      setErrorMsg('Please provide a descriptive title.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please provide a meaningful description of the study material.');
      return;
    }
    if (!subjectId) {
      setErrorMsg('Please select a subject category.');
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const dto: CreateContentDTO = {
      title: title.trim(),
      description: description.trim(),
      subject_id: subjectId,
      topic: topic.trim() || title.trim(),
      content_type: contentType,
      content_body: contentBody || undefined,
      video_url: contentType === 'video' ? videoUrl : undefined,
      video_duration: contentType === 'video' ? videoDuration : undefined,
      file_name: contentType === 'pdf' ? fileName : undefined,
      file_data_url: contentType === 'pdf' ? (fileDataUrl || undefined) : undefined,
      file_size: contentType === 'pdf' ? fileSize : undefined,
      file_type: contentType === 'pdf' ? fileType : undefined,
      page_count: contentType === 'pdf' ? Number(pageCount) : undefined,
      tags: tagsArray,
      status: finalStatus,
    };

    setIsSubmitting(true);

    try {
      if (isEditing && initialData) {
        contentService.adminUpdateMaterial(initialData.id, {
          title: dto.title,
          description: dto.description,
          subject_id: dto.subject_id,
          topic: dto.topic,
          content_type: dto.content_type,
          content_body: dto.content_body,
          tags: dto.tags,
          status: finalStatus,
          pdf_data:
            dto.content_type === 'pdf'
              ? {
                  ...initialData.pdf_data,
                  fileName: dto.file_name || 'Document.pdf',
                  fileSize: dto.file_size || initialData.pdf_data?.fileSize || '12.4 MB',
                  fileDataUrl: dto.file_data_url || initialData.pdf_data?.fileDataUrl,
                  fileType: dto.file_type || initialData.pdf_data?.fileType || 'pdf',
                  pageCount: dto.page_count || 20,
                  previewPages: initialData.pdf_data?.previewPages || [],
                }
              : undefined,
          video_data:
            dto.content_type === 'video'
              ? {
                  duration: dto.video_duration || '20 mins',
                  videoUrl: dto.video_url || '',
                  isEmbed: true,
                  resolution: '1080p',
                  chapters: initialData.video_data?.chapters || [],
                }
              : undefined,
        });

        setSuccessMsg('Study material updated successfully!');
      } else {
        const adminUser = currentUser
          ? { id: currentUser.id, name: currentUser.name, avatar: currentUser.profileImage }
          : { id: 'user-admin-om', name: 'Om Tajane (Admin)', avatar: undefined };

        contentService.adminAddMaterial(adminUser, dto);
        setSuccessMsg(
          finalStatus === 'published'
            ? 'Study material published successfully and is now accessible to all students!'
            : 'Study material saved as draft! It is hidden from students until published.'
        );
      }

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          onNavigate('admin');
        }
      }, 900);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save study material.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="admin-add-material-view"
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('admin')}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
            title="Back to Admin Portal"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
                {isEditing ? 'Edit Study Material' : 'Add New Study Material'}
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Official YuvaSetu curriculum resource publishing workflow
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>Save as Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('published')}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isEditing ? 'Update & Publish' : 'Publish to Students'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Form Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Material Title */}
          <div className="p-6 rounded-3xl bg-[#0c1020] border border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Material Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. DSA Searching and Sorting or DBMS Normalization Complete"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-semibold placeholder:text-slate-500"
              />
            </div>

            {/* Subject and Topic Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Academic Subject <span className="text-rose-400">*</span>
                </label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                >
                  {PLATFORM_SUBJECTS.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Topic / Sub-unit <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Searching and Sorting, Hashing, BCNF"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Overview & Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what concepts, theorems, problems, and diagrams are covered in this handout..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 placeholder:text-slate-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Content Type Selector */}
          <div className="p-6 rounded-3xl bg-[#0c1020] border border-slate-800 space-y-4">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Content Format & Type <span className="text-rose-400">*</span>
            </label>

            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  id: 'pdf',
                  label: 'PDF Document',
                  sub: 'Handwritten & Slides',
                  icon: FileCode,
                  color: 'amber',
                },
                {
                  id: 'note',
                  label: 'Digital Note',
                  sub: 'Formatted Markdown',
                  icon: FileText,
                  color: 'cyan',
                },
                {
                  id: 'video',
                  label: 'Video Lecture',
                  sub: 'HD Interactive Stream',
                  icon: Video,
                  color: 'purple',
                },
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = contentType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setContentType(t.id as ContentType)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-md'
                        : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 mb-2 ${
                        isSelected ? 'text-cyan-400' : 'text-slate-500'
                      }`}
                    />
                    <div className="text-xs font-bold">{t.label}</div>
                    <div className="text-[10px] text-slate-400">{t.sub}</div>
                  </button>
                );
              })}
            </div>

            {/* Type Specific Fields */}
            {contentType === 'pdf' && (
              <div className="pt-3 space-y-4 border-t border-slate-800/80">
                {/* File Upload Zone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Upload PDF or Word Document (.pdf, .docx, .doc, .txt)
                  </label>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragActive(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleFileProcess(e.dataTransfer.files[0]);
                      }
                    }}
                    className={`p-5 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center space-y-3 ${
                      dragActive
                        ? 'border-cyan-400 bg-cyan-950/20'
                        : 'border-slate-700 bg-slate-950/60 hover:border-slate-600'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Upload className="w-6 h-6" />
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-200">
                        Drag and drop your file here, or{' '}
                        <label className="text-cyan-400 hover:underline cursor-pointer">
                          <span>browse from device</span>
                          <input
                            type="file"
                            accept=".pdf,.docx,.doc,.txt"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileProcess(e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Supports PDF, Microsoft Word (.docx), and text documents up to 50MB
                      </p>
                    </div>

                    {/* Currently Attached Indicator */}
                    <div className="w-full max-w-md p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="font-mono text-slate-200 truncate">{fileName}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-[10px] text-cyan-300 font-mono font-bold uppercase">
                          {fileType}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">{fileSize}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Display File Name
                    </label>
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="e.g. DSA_Searching_and_Sorting_Unit1.pdf"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Estimated Page Count
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={300}
                      value={pageCount}
                      onChange={(e) => setPageCount(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Document Core Content Notes & Summary */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Document Key Points & Study Summary (Displays full content in reader)
                  </label>
                  <textarea
                    rows={4}
                    value={contentBody}
                    onChange={(e) => setContentBody(e.target.value)}
                    placeholder="Enter key concepts, formulas, or summaries covered in this document so students see detailed notes even before downloading..."
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    YuvaSetu allows students to read interactive multi-page summaries and download the original file directly to PC or mobile.
                  </p>
                </div>
              </div>
            )}

            {contentType === 'note' && (
              <div className="pt-3 space-y-2 border-t border-slate-800/80">
                <label className="block text-xs font-semibold text-slate-300">
                  Note Content Body (Supports Markdown #, ##, code blocks)
                </label>
                <textarea
                  rows={8}
                  value={contentBody}
                  onChange={(e) => setContentBody(e.target.value)}
                  placeholder="# Unit Overview&#10;&#10;Write comprehensive explanations here..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>
            )}

            {contentType === 'video' && (
              <div className="pt-3 space-y-4 border-t border-slate-800/80">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Video Stream or YouTube Embed URL
                    </label>
                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/embed/..."
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Lecture Duration
                    </label>
                    <input
                      type="text"
                      value={videoDuration}
                      onChange={(e) => setVideoDuration(e.target.value)}
                      placeholder="e.g. 28 mins"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="p-6 rounded-3xl bg-[#0c1020] border border-slate-800 space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              <span>Search Tags & Metadata (comma separated)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="DSA, Searching, Sorting, Big-O, Quick Sort, Semester Exam"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tagsInput
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
                .map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-cyan-300 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Publishing status, preview card */}
        <div className="space-y-6">
          {/* Status Settings Card */}
          <div className="p-6 rounded-3xl bg-[#0c1020] border border-slate-800 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Publishing Status</span>
            </h3>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setStatus('published')}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  status === 'published'
                    ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center ${
                    status === 'published'
                      ? 'border-emerald-400 bg-emerald-500'
                      : 'border-slate-600'
                  }`}
                >
                  {status === 'published' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Published</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-black">
                      Live
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Instantly visible and searchable to all students across YuvaSetu.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStatus('draft')}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  status === 'draft'
                    ? 'bg-amber-950/40 border-amber-500/80 text-amber-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center ${
                    status === 'draft'
                      ? 'border-amber-400 bg-amber-500'
                      : 'border-slate-600'
                  }`}
                >
                  {status === 'draft' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Draft (Admin Only)</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 font-black">
                      Hidden
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Stored securely in Admin catalog. Hidden from student search and explore.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Card Preview */}
          <div className="p-6 rounded-3xl bg-[#0c1020] border border-slate-800 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Student Card Preview</span>
            </h3>

            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-[11px]">
                <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/40 font-bold">
                  {PLATFORM_SUBJECTS.find((s) => s.id === subjectId)?.name || 'Subject'}
                </span>
                <span className="font-mono text-[10px] text-slate-500 uppercase">
                  {contentType}
                </span>
              </div>

              <h4 className="text-sm font-black text-white line-clamp-1">
                {title || 'Material Title Preview'}
              </h4>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {description || 'Comprehensive curriculum handout notes description...'}
              </p>

              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
                <span>By Alok Verma (Admin)</span>
                <span className="text-emerald-400 font-bold">FREE Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
