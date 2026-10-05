export type ContentType = 'note' | 'pdf' | 'video';

export type AccessType = 'FREE' | 'TOKEN' | 'PREMIUM';

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

export interface VideoData {
  duration: string;
  videoUrl: string;
  isEmbed?: boolean;
  resolution?: string;
  chapters?: {
    title: string;
    time: string;
    seconds: number;
  }[];
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
  content_type: ContentType;
  tags: string[];
  content_body?: string;
  file?: File | null;
  file_name?: string;
  file_data_url?: string;
  file_type?: 'pdf' | 'docx' | 'doc' | 'txt' | 'other';
  file_size?: string;
  pages?: PdfPageContent[];
  video_url?: string;
  video_duration?: string;
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
  accessType?: AccessType | 'all';
  sortBy?: 'recent' | 'views' | 'likes';
  status?: 'published' | 'draft' | 'all';
  includeDrafts?: boolean;
}
