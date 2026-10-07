export type ContentType = 'note' | 'pdf' | 'video';

export type VideoSource = 'upload' | 'youtube';

export type AccessType = 'FREE' | 'TOKEN' | 'PREMIUM';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface SubjectItem {
  id: string;
  name: string;
  slug: string;
  iconName?: string;
  description: string;
  color?: string;
}

export interface ContentCreator {
  id: string;
  name: string;
  avatar: string;
  role: string;
  college?: string;
  reputation?: number;
  followersCount?: number;
}

export interface PdfPageContent {
  pageNumber: number;
  title: string;
  heading?: string;
  topicBadge?: string;
  content: string;
  keyPoints?: string[];
  contentNotes?: string[];
  diagramText?: string;
  diagramAscii?: string;
  codeSnippet?: string;
  keyFormulas?: string[];
  examTips?: string;
}

export interface PdfData {
  fileName: string;
  fileSize?: string;
  pageCount: number;
  downloadUrl?: string;
  previewPages?: string[];
  pages?: PdfPageContent[];
  fileDataUrl?: string;
  fileType?: 'pdf' | 'docx' | 'doc' | 'txt' | 'other';
  mimeType?: string;
}

export interface VideoChapter {
  title: string;
  time: string;
  seconds: number;
}

export interface VideoData {
  videoSource: VideoSource; // 'upload' for YuvaSetu hosted video, 'youtube' for YouTube video
  videoUrl: string; // File URL/path or YouTube canonical URL
  youtubeVideoId?: string; // e.g. "dQw4w9WgXcQ"
  embedUrl?: string; // e.g. "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
  duration: string; // e.g. "12:45" or "28 mins"
  durationSeconds?: number;
  fileName?: string; // Original filename for uploaded video
  fileSize?: string; // e.g. "24.5 MB"
  mimeType?: string; // e.g. "video/mp4", "video/webm", "video/quicktime"
  storagePath?: string;
  resolution?: string;
  difficulty?: DifficultyLevel;
  language?: string; // e.g. "English", "Hindi", "Hinglish", "Marathi"
  semester?: string;
  branch?: string;
  facultyName?: string;
  chapters?: VideoChapter[];
  isEmbed?: boolean;
}

export interface ContentItem {
  id: string;
  creator_id: string;
  created_by?: string;
  creator: ContentCreator;
  title: string;
  description: string;
  subject_id: string;
  subject_name: string;
  topic?: string;
  semester?: string;
  branch?: string;
  faculty_name?: string;
  difficulty?: DifficultyLevel;
  language?: string;
  content_type: ContentType;
  thumbnail: string;
  thumbnail_url?: string;
  content_url?: string;
  file_url?: string;
  content_body?: string; // Rich markdown or formatted educational text
  pdf_data?: PdfData;
  video_data?: VideoData;
  tags: string[];
  access_type: AccessType; // Currently 'FREE'
  price: number; // 0
  token_price: number; // 0 for future Vidya Tokens
  views: number;
  likes: number;
  created_at: string;
  updated_at: string;
  isDemo?: boolean;
  status: 'published' | 'draft';
  is_admin_published?: boolean;
}

export interface CreateContentDTO {
  title: string;
  description: string;
  subject_id: string;
  topic?: string;
  semester?: string;
  branch?: string;
  faculty_name?: string;
  difficulty?: DifficultyLevel;
  language?: string;
  content_type: ContentType;
  tags: string[];
  content_body?: string;
  file?: File | null;
  file_name?: string;
  file_data_url?: string;
  file_type?: 'pdf' | 'docx' | 'doc' | 'txt' | 'other';
  file_size?: string;
  pages?: PdfPageContent[];
  // Video specific attributes
  video_source?: VideoSource;
  video_url?: string;
  youtube_video_id?: string;
  video_duration?: string;
  video_file?: File | null;
  video_file_name?: string;
  video_file_size?: string;
  video_mime_type?: string;
  chapters?: VideoChapter[];
  thumbnail_url?: string;
  status?: 'published' | 'draft';
  is_admin_published?: boolean;
  page_count?: number;
  access_type?: AccessType;
  token_price?: number;
}

export interface ContentFilterOptions {
  searchQuery?: string;
  subjectId?: string;
  topic?: string;
  contentType?: ContentType | 'all';
  videoSource?: VideoSource | 'all';
  accessType?: AccessType | 'all';
  semester?: string;
  branch?: string;
  difficulty?: DifficultyLevel | 'all';
  language?: string;
  sortBy?: 'recent' | 'views' | 'likes';
  status?: 'published' | 'draft' | 'all';
  includeDrafts?: boolean;
}
