import React, { useState, useEffect } from 'react';
import { YuvaSetuLogo } from '../components/YuvaSetuLogo';
import { PLATFORM_SUBJECTS } from '../data/subjectData';
import {
  ContentType,
  VideoSource,
  CreateContentDTO,
  ContentItem,
  DifficultyLevel,
} from '../types/content';
import { User } from '../types/user';
import { contentService } from '../services/contentService';
import {
  extractYouTubeVideoId,
  buildYouTubeEmbedUrl,
  buildYouTubeWatchUrl,
  getYouTubeThumbnail,
  validateVideoFile,
  ALLOWED_VIDEO_EXTENSIONS,
  MAX_VIDEO_FILE_SIZE_BYTES,
} from '../utils/videoHelper';
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
  Play,
  ExternalLink,
  Film,
  HardDrive,
  Info,
  Check,
  Loader2,
  AlertTriangle,
  GraduationCap,
  Globe,
  BarChart,
  UserCheck,
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

  // Basic Information
  const [title, setTitle] = useState(initialData?.title || '');
  const [subjectId, setSubjectId] = useState(initialData?.subject_id || 'dsa');
  const [topic, setTopic] = useState(initialData?.topic || '');
  const [contentType, setContentType] = useState<ContentType>(
    initialData?.content_type || 'pdf'
  );
  const [description, setDescription] = useState(initialData?.description || '');
  const [contentBody, setContentBody] = useState(initialData?.content_body || '');

  // Academic Taxonomy
  const [semester, setSemester] = useState(initialData?.semester || 'Semester 3');
  const [branch, setBranch] = useState(
    initialData?.branch || 'Computer Science & Engineering'
  );
  const [facultyName, setFacultyName] = useState(
    initialData?.faculty_name ||
      initialData?.video_data?.facultyName ||
      (currentUser ? currentUser.name : 'YuvaSetu Academic Lead')
  );
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(
    (initialData?.difficulty ||
      initialData?.video_data?.difficulty ||
      'Intermediate') as DifficultyLevel
  );
  const [language, setLanguage] = useState(
    initialData?.language || initialData?.video_data?.language || 'English'
  );

  // Video Specific State
  const [videoSource, setVideoSource] = useState<VideoSource>(
    initialData?.video_data?.videoSource ||
      (initialData?.video_data?.youtubeVideoId ||
      initialData?.video_data?.videoUrl?.includes('youtu')
        ? 'youtube'
        : 'upload')
  );
  const [videoUrl, setVideoUrl] = useState(initialData?.video_data?.videoUrl || '');
  const [youtubeInputUrl, setYoutubeInputUrl] = useState(
    initialData?.video_data?.videoSource === 'youtube' ||
    initialData?.video_data?.youtubeVideoId
      ? initialData?.video_data?.videoUrl ||
        (initialData?.video_data?.youtubeVideoId
          ? `https://www.youtube.com/watch?v=${initialData.video_data.youtubeVideoId}`
          : '')
      : ''
  );
  const [youtubeVideoId, setYoutubeVideoId] = useState(
    initialData?.video_data?.youtubeVideoId ||
      extractYouTubeVideoId(initialData?.video_data?.videoUrl) ||
      ''
  );
  const [videoDuration, setVideoDuration] = useState(
    initialData?.video_data?.duration || '30 mins'
  );
  const [videoFileName, setVideoFileName] = useState(
    initialData?.video_data?.fileName || ''
  );
  const [videoFileSize, setVideoFileSize] = useState(
    initialData?.video_data?.fileSize || ''
  );
  const [videoMimeType, setVideoMimeType] = useState(
    initialData?.video_data?.mimeType || 'video/mp4'
  );
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [videoDragActive, setVideoDragActive] = useState(false);

  // PDF Specific State
  const [fileName, setFileName] = useState(
    initialData?.pdf_data?.fileName || 'DSA_Handwritten_Notes.pdf'
  );
  const [fileSize, setFileSize] = useState<string>(
    initialData?.pdf_data?.fileSize || '3.5 MB'
  );
  const [fileType, setFileType] = useState<'pdf' | 'docx' | 'doc' | 'txt' | 'other'>(
    initialData?.pdf_data?.fileType ||
      (initialData?.pdf_data?.fileName?.toLowerCase().endsWith('.docx') ? 'docx' : 'pdf')
  );
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(
    initialData?.pdf_data?.fileDataUrl || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [pageCount, setPageCount] = useState<number>(
    initialData?.pdf_data?.pageCount || 25
  );

  // Common Metadata
  const [customThumbnailUrl, setCustomThumbnailUrl] = useState(
    initialData?.thumbnail_url || initialData?.thumbnail || ''
  );
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags?.join(', ') || 'Data Structures, Algorithms, Exam Prep'
  );
  const [status, setStatus] = useState<'published' | 'draft'>(
    initialData?.status || 'published'
  );
  const [copyrightConfirmed, setCopyrightConfirmed] = useState(isEditing ? true : false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time parse YouTube ID on URL input
  const handleYouTubeUrlInput = (rawUrl: string) => {
    setYoutubeInputUrl(rawUrl);
    setErrorMsg('');
    const id = extractYouTubeVideoId(rawUrl);
    if (id) {
      setYoutubeVideoId(id);
      setVideoUrl(`https://www.youtube.com/watch?v=${id}`);
      if (!customThumbnailUrl || customThumbnailUrl.includes('img.youtube.com')) {
        setCustomThumbnailUrl(getYouTubeThumbnail(id));
      }
    } else {
      setYoutubeVideoId('');
      if (rawUrl.trim().length > 10) {
        setErrorMsg('Please enter a valid YouTube video URL (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...)');
      }
    }
  };

  // Video File Process and Upload
  const handleVideoFileSelect = async (file: File) => {
    setErrorMsg('');
    const validation = validateVideoFile(file);
    if (!validation.valid) {
      setErrorMsg(validation.error || 'Invalid video file.');
      return;
    }

    setVideoFile(file);
    setVideoFileName(file.name);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    setVideoFileSize(`${sizeMb} MB`);
    setVideoMimeType(file.type || 'video/mp4');

    // Create temporary object URL for local playback preview
    const localBlobUrl = URL.createObjectURL(file);
    setVideoUrl(localBlobUrl);

    // Read duration if metadata loads
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = localBlobUrl;
    tempVideo.onloadedmetadata = () => {
      if (tempVideo.duration && !isNaN(tempVideo.duration)) {
        const mins = Math.floor(tempVideo.duration / 60);
        const secs = Math.floor(tempVideo.duration % 60);
        setVideoDuration(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    };

    // Upload to server endpoint /api/admin/videos/upload
    setIsVideoUploading(true);
    try {
      const formData = new FormData();
      formData.append('video', file);

      const headers: Record<string, string> = {
        'x-user-role': 'admin',
        'x-user-id': currentUser?.id || 'user-admin-om',
      };

      const res = await fetch('/api/admin/videos/upload', {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Server rejected video file upload.');
      }

      setVideoUrl(data.videoUrl);
      setVideoFileName(data.fileName);
      setVideoFileSize(data.fileSize);
      setVideoMimeType(data.mimeType);
      setSuccessMsg('Video uploaded to persistent server storage successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.warn('Video upload notice:', err);
      // Even if server upload fails due to network, local preview URL is maintained
      setErrorMsg(`Upload notice: ${err.message || 'File staged locally'}`);
    } finally {
      setIsVideoUploading(false);
    }
  };

  // PDF File Process
  const handlePdfProcess = (file: File) => {
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
      setErrorMsg('Please provide a descriptive title for this study material.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please provide a meaningful description of what students will learn.');
      return;
    }
    if (!subjectId) {
      setErrorMsg('Please select an academic subject category.');
      return;
    }

    // Video Specific Validation
    if (contentType === 'video') {
      if (videoSource === 'youtube') {
        const validId = youtubeVideoId || extractYouTubeVideoId(youtubeInputUrl);
        if (!validId) {
          setErrorMsg('Please provide a valid YouTube video URL or 11-character video ID.');
          return;
        }
      } else {
        // Uploaded video validation
        if (!videoUrl && !videoFile) {
          setErrorMsg('Please select or upload an educational video file (MP4, WebM, or MOV).');
          return;
        }
      }
    }

    // Copyright / Academic policy confirmation for publishing
    if (finalStatus === 'published' && !copyrightConfirmed) {
      setErrorMsg('Please confirm that you have the right to publish/share this educational content.');
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const finalThumbnail =
      customThumbnailUrl ||
      (contentType === 'video' && youtubeVideoId
        ? getYouTubeThumbnail(youtubeVideoId)
        : undefined);

    const dto: CreateContentDTO = {
      title: title.trim(),
      description: description.trim(),
      subject_id: subjectId,
      topic: topic.trim() || title.trim(),
      semester,
      branch,
      faculty_name: facultyName,
      difficulty,
      language,
      content_type: contentType,
      content_body: contentBody || undefined,
      thumbnail_url: finalThumbnail,
      // Video specific
      video_source: contentType === 'video' ? videoSource : undefined,
      video_url: contentType === 'video' ? videoUrl : undefined,
      youtube_video_id:
        contentType === 'video' && videoSource === 'youtube'
          ? (youtubeVideoId || extractYouTubeVideoId(youtubeInputUrl) || undefined)
          : undefined,
      video_duration: contentType === 'video' ? videoDuration : undefined,
      video_file_name: contentType === 'video' ? videoFileName : undefined,
      video_file_size: contentType === 'video' ? videoFileSize : undefined,
      video_mime_type: contentType === 'video' ? videoMimeType : undefined,
      // PDF specific
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
          semester: dto.semester,
          branch: dto.branch,
          faculty_name: dto.faculty_name,
          difficulty: dto.difficulty,
          language: dto.language,
          content_type: dto.content_type,
          content_body: dto.content_body,
          thumbnail: finalThumbnail || initialData.thumbnail,
          thumbnail_url: finalThumbnail || initialData.thumbnail_url,
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
                  videoSource: dto.video_source || 'youtube',
                  videoUrl: dto.video_url || '',
                  youtubeVideoId: dto.youtube_video_id,
                  embedUrl:
                    dto.video_source === 'youtube' && dto.youtube_video_id
                      ? buildYouTubeEmbedUrl(dto.youtube_video_id)
                      : undefined,
                  duration: dto.video_duration || '20 mins',
                  fileName: dto.video_file_name,
                  fileSize: dto.video_file_size,
                  mimeType: dto.video_mime_type,
                  difficulty: dto.difficulty,
                  language: dto.language,
                  semester: dto.semester,
                  branch: dto.branch,
                  facultyName: dto.faculty_name,
                  resolution: '1080p',
                  chapters: initialData.video_data?.chapters || [
                    { title: '00:00 - Introduction & Concept Overview', time: '00:00', seconds: 0 },
                    { title: '08:00 - Step-by-Step Proof & Tracing', time: '08:00', seconds: 480 },
                    { title: '18:30 - University Exam Questions & Summary', time: '18:30', seconds: 1110 },
                  ],
                }
              : undefined,
        });

        setSuccessMsg('Educational study material updated successfully!');
      } else {
        const adminUser = currentUser
          ? { id: currentUser.id, name: currentUser.name, avatar: currentUser.profileImage }
          : { id: 'user-admin-om', name: 'Om Tajane (Admin)', avatar: undefined };

        contentService.adminAddMaterial(adminUser, dto);
        setSuccessMsg(
          finalStatus === 'published'
            ? 'Educational material published successfully! Students can now access it.'
            : 'Study material saved as draft. It is private to administrators.'
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
      setErrorMsg(err.message || 'Failed to save educational material.');
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
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
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
                {isEditing ? 'Edit Study Material' : 'Add Study Material'}
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Official YuvaSetu Curriculum Publishing • Only Administrators Can Publish
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={isSubmitting || isVideoUploading}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>Save as Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('published')}
            disabled={isSubmitting || isVideoUploading}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
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
          {/* 1. CONTENT TYPE SELECTOR */}
          <div className="p-6 rounded-3xl bg-[#0c1020] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                1. Select Content Type <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Choose resource category</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'pdf',
                  label: 'PDF Document',
                  sub: 'Handwritten & Slides',
                  icon: FileCode,
                  accentColor: 'border-amber-500 text-amber-400',
                },
                {
                  id: 'video',
                  label: 'Educational Video',
                  sub: 'Uploaded or YouTube',
                  icon: Video,
                  accentColor: 'border-purple-500 text-purple-400',
                },
                {
                  id: 'note',
                  label: 'Digital Note',
                  sub: 'Interactive Markdown',
                  icon: FileText,
                  accentColor: 'border-cyan-500 text-cyan-400',
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
                        ? 'bg-slate-900 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400/50'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
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

            {/* VIDEO SOURCE SELECTION (When Video is selected) */}
            {contentType === 'video' && (
              <div className="pt-4 border-t border-slate-800/80 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Video Source <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] text-purple-400 font-semibold">
                    Support for uploaded media & external embeds
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVideoSource('upload')}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                      videoSource === 'upload'
                        ? 'bg-purple-950/40 border-purple-500 text-white ring-1 ring-purple-500/40'
                        : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        videoSource === 'upload'
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-white">Upload Video</div>
                      <div className="text-[10px] text-slate-400">MP4, WebM, MOV files</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVideoSource('youtube')}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                      videoSource === 'youtube'
                        ? 'bg-red-950/40 border-red-500 text-white ring-1 ring-red-500/40'
                        : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        videoSource === 'youtube'
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <svg className="w-4 h-4 fill-current text-red-400" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-white">YouTube Link</div>
                      <div className="text-[10px] text-slate-400">Official YouTube Embed</div>
                    </div>
                  </button>
                </div>

                {/* A. YUVASETU UPLOADED VIDEO FORM */}
                {videoSource === 'upload' && (
                  <div className="space-y-4 pt-2 animate-fadeIn">
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setVideoDragActive(true);
                      }}
                      onDragLeave={() => setVideoDragActive(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setVideoDragActive(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleVideoFileSelect(e.dataTransfer.files[0]);
                        }
                      }}
                      className={`p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center space-y-3 ${
                        videoDragActive
                          ? 'border-purple-400 bg-purple-950/20'
                          : 'border-slate-700 bg-slate-950/60 hover:border-slate-600'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        {isVideoUploading ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <Film className="w-6 h-6" />
                        )}
                      </div>

                      <div>
                        <div className="text-xs font-bold text-slate-200">
                          {isVideoUploading
                            ? 'Uploading video to server storage...'
                            : 'Drag and drop your educational video here, or '}
                          {!isVideoUploading && (
                            <label className="text-purple-400 hover:underline cursor-pointer">
                              <span>browse files</span>
                              <input
                                type="file"
                                accept=".mp4,.webm,.mov,video/mp4,video/webm,video/quicktime"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleVideoFileSelect(e.target.files[0]);
                                  }
                                }}
                              />
                            </label>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Supported formats: MP4 (.mp4), WebM (.webm), QuickTime (.mov) up to 100MB
                        </p>
                      </div>

                      {/* Attached video indicator */}
                      {videoFileName && (
                        <div className="w-full max-w-md p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 truncate">
                            <Video className="w-4 h-4 text-purple-400 shrink-0" />
                            <span className="font-mono text-slate-200 truncate">
                              {videoFileName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="px-1.5 py-0.5 rounded bg-purple-950 text-[10px] text-purple-300 font-mono font-bold uppercase">
                              {videoMimeType.split('/')[1] || 'mp4'}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {videoFileSize}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* HTML5 Live Video Preview in Admin */}
                    {videoUrl && (
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-300 flex items-center gap-1.5">
                            <Play className="w-3.5 h-3.5 text-purple-400" />
                            <span>Uploaded Video Playback Preview</span>
                          </span>
                          <span className="text-[11px] font-mono text-purple-300">
                            Duration: {videoDuration}
                          </span>
                        </div>
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800">
                          <video
                            src={videoUrl}
                            controls
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    )}

                    {/* Persistent Storage Notice */}
                    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2.5">
                      <HardDrive className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block font-semibold mb-0.5">
                          Persistent Media Storage Architecture:
                        </strong>
                        <span>
                          Uploaded educational videos are safely saved to persistent disk storage (<code>/data/uploads/videos</code>) and streamed using HTTP Range requests. In scalable multi-container cloud deployments (e.g. Render ephemeral instances), attach an S3 / Google Cloud Storage volume for multi-gigabyte persistence.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* B. YOUTUBE LINK FORM */}
                {videoSource === 'youtube' && (
                  <div className="space-y-4 pt-2 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        YouTube Video URL or Video ID <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={youtubeInputUrl}
                          onChange={(e) => handleYouTubeUrlInput(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/..."
                          className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-red-400 placeholder:text-slate-500"
                        />
                        {youtubeVideoId && (
                          <span className="absolute right-3 top-2.5 px-2 py-1 rounded bg-red-950 text-red-300 border border-red-500/40 text-[10px] font-bold font-mono">
                            ID: {youtubeVideoId}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Accepts standard watch links, youtu.be short links, and YouTube Shorts. YuvaSetu will embed the official player and will NOT download or redistribute the video.
                      </p>
                    </div>

                    {/* Live YouTube 16:9 Embedded Player Preview */}
                    {youtubeVideoId ? (
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-200 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 fill-current text-red-400" viewBox="0 0 24 24">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            <span>Official YouTube Embedded Player Live Preview</span>
                          </span>
                          <a
                            href={buildYouTubeWatchUrl(youtubeVideoId)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-400 hover:underline flex items-center gap-1 text-[11px]"
                          >
                            <span>Test on YouTube</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800">
                          <iframe
                            src={buildYouTubeEmbedUrl(youtubeVideoId)}
                            title="YouTube Preview"
                            className="w-full h-full border-0 absolute inset-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                          <span>
                            If an author has disabled embedding on this video, students are provided a clean notice: <em>"This video cannot be embedded. Please watch it on YouTube."</em> with a direct link.
                          </span>
                        </div>
                      </div>
                    ) : (
                      youtubeInputUrl.length > 5 && (
                        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Could not extract an 11-character video ID from the provided URL. Please paste a valid YouTube link.</span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            )}

            {/* PDF UPLOAD ZONE (When PDF is selected) */}
            {contentType === 'pdf' && (
              <div className="pt-3 space-y-4 border-t border-slate-800/80">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Upload Curriculum PDF or Document (.pdf, .docx, .doc, .txt)
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
                        handlePdfProcess(e.dataTransfer.files[0]);
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
                                handlePdfProcess(e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Supports PDF, Microsoft Word (.docx), and text documents up to 50MB
                      </p>
                    </div>

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
              </div>
            )}

            {/* DIGITAL NOTE BODY (When Note is selected) */}
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
          </div>

          {/* 2. CORE RESOURCE METADATA */}
          <div className="p-6 rounded-3xl bg-[#0c1020] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                2. Resource Details & Curriculum Taxonomy <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Title, Subject, Topic & Academic Branch</span>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {contentType === 'video' ? 'Video Title' : 'Material Title'}{' '}
                <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  contentType === 'video'
                    ? 'e.g. Hashing & Collision Handling Masterclass'
                    : 'e.g. DSA Searching and Sorting Handwritten Notes'
                }
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
                  placeholder="e.g. Hashing, Linear Probing, Merge Sort, Normalization"
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
                placeholder="Describe what concepts, proofs, problems, algorithms, or examination questions are covered in this session..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 placeholder:text-slate-500 leading-relaxed"
              />
            </div>

            {/* Semester, Branch, Faculty Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Semester</span>
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
                >
                  {[
                    'Semester 1',
                    'Semester 2',
                    'Semester 3',
                    'Semester 4',
                    'Semester 5',
                    'Semester 6',
                    'Semester 7',
                    'Semester 8',
                    'All Semesters',
                  ].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Engineering Branch</span>
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
                >
                  {[
                    'Computer Science & Engineering',
                    'Information Technology',
                    'Electronics & Telecommunication',
                    'Artificial Intelligence & Data Science',
                    'Mechanical Engineering',
                    'Civil Engineering',
                    'General Engineering',
                  ].map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Faculty / Creator Name</span>
                </label>
                <input
                  type="text"
                  value={facultyName}
                  onChange={(e) => setFacultyName(e.target.value)}
                  placeholder="e.g. Prof. Om Tajane"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Duration, Difficulty, Language Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{contentType === 'video' ? 'Video Duration' : 'Estimated Read Time'}</span>
                </label>
                <input
                  type="text"
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(e.target.value)}
                  placeholder="e.g. 18:45 or 30 mins"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <BarChart className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Difficulty Level</span>
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Language</span>
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Bilingual">Bilingual (English + Hindi)</option>
                </select>
              </div>
            </div>

            {/* Custom Thumbnail URL */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Thumbnail Image URL (Optional)
              </label>
              <input
                type="text"
                value={customThumbnailUrl}
                onChange={(e) => setCustomThumbnailUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or auto-populated from YouTube"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-400"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                For YouTube links, YuvaSetu automatically pulls high-definition thumbnails if left blank.
              </p>
            </div>
          </div>

          {/* 3. TAGS & SEARCH KEYWORDS */}
          <div className="p-6 rounded-3xl bg-[#0c1020] border border-slate-800 space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              <span>Search Tags & Curriculum Keywords (comma separated)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="DSA, Searching, Sorting, Big-O, Quick Sort, Semester Exam, Algorithms"
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

        {/* Right 1 Col: Publishing Status, Rights Confirmation, Card Preview */}
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
                    Visible immediately in Explore, Subject feeds, and search.
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
                    Stored in catalog, hidden from student search and explore.
                  </p>
                </div>
              </button>
            </div>

            {/* Copyright & Academic Rights Confirmation Checkbox */}
            <div className="pt-3 border-t border-slate-800/80">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 leading-snug">
                <input
                  type="checkbox"
                  checked={copyrightConfirmed}
                  onChange={(e) => setCopyrightConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer accent-cyan-500"
                />
                <span className="text-[11px] text-slate-300">
                  I confirm that I have the rights to upload/share this educational content and it complies with YuvaSetu's academic policies.
                </span>
              </label>
            </div>
          </div>

          {/* Student Card Live Preview */}
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
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                    contentType === 'video'
                      ? videoSource === 'youtube'
                        ? 'bg-red-950 text-red-300'
                        : 'bg-purple-950 text-purple-300'
                      : contentType === 'pdf'
                      ? 'bg-amber-950 text-amber-300'
                      : 'bg-cyan-950 text-cyan-300'
                  }`}
                >
                  {contentType === 'video'
                    ? videoSource === 'youtube'
                      ? 'YOUTUBE'
                      : 'VIDEO'
                    : contentType.toUpperCase()}
                </span>
              </div>

              <h4 className="text-sm font-black text-white line-clamp-2">
                {title || 'Material Title Preview'}
              </h4>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {description || 'Curriculum handout description preview...'}
              </p>

              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{videoDuration || '20 mins'}</span>
                <span>•</span>
                <span>{semester}</span>
              </div>

              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-400">
                <span>By {facultyName || 'YuvaSetu Lead'}</span>
                <span className="text-emerald-400 font-bold">FREE Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
