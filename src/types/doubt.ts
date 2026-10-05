export type DoubtStatus = 'OPEN' | 'ANSWERED' | 'RESOLVED' | 'CLOSED';

export type DoubtReportReason =
  | 'Spam'
  | 'Inappropriate Content'
  | 'Incorrect/Irrelevant'
  | 'Duplicate'
  | 'Other';

export type DoubtReportStatus = 'OPEN' | 'REVIEWED' | 'RESOLVED';

export type DoubtContentType = 'question' | 'answer' | 'attachment';

export interface DoubtAttachment {
  id: string;
  doubt_id?: string;
  answer_id?: string;
  file_url: string;
  file_name: string;
  file_type: 'image' | 'pdf' | 'screenshot';
  file_size: string;
  created_at: string;
}

export interface DoubtReply {
  id: string;
  answer_id: string;
  user_id: string;
  user_name: string;
  user_role?: string;
  text: string;
  created_at: string;
}

export interface DoubtAnswer {
  id: string;
  doubt_id: string;
  admin_id: string;
  author_name: string;
  author_role: string;
  author_email?: string;
  answer_text: string;
  helpful_count: number;
  unhelpful_count?: number;
  is_accepted: boolean;
  attachments?: DoubtAttachment[];
  replies?: DoubtReply[];
  created_at: string;
  updated_at: string;
}

export interface DoubtItem {
  id: string;
  student_id: string;
  student_name: string;
  student_email?: string;
  title: string;
  description: string;
  subject_id: string;
  subject_name: string;
  topic?: string;
  tags: string[];
  status: DoubtStatus;
  answers_count: number;
  has_accepted_answer: boolean;
  views: number;
  attachments?: DoubtAttachment[];
  answers?: DoubtAnswer[];
  is_duplicate?: boolean;
  duplicate_of_id?: string;
  closed_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface DoubtReport {
  id: string;
  reporter_id: string;
  reporter_name: string;
  content_type: DoubtContentType;
  content_id: string;
  doubt_id: string;
  doubt_title?: string;
  reason: DoubtReportReason;
  notes?: string;
  status: DoubtReportStatus;
  created_at: string;
  resolved_at?: string;
  admin_action_taken?: string;
}

export interface HelpfulVote {
  id: string;
  answer_id: string;
  user_id: string;
  type: 'helpful' | 'not_helpful';
  created_at: string;
}

export interface CreateDoubtDTO {
  title: string;
  description: string;
  subject_id: string;
  subject_name: string;
  topic?: string;
  tags: string[];
  attachment?: {
    file_name: string;
    file_url: string;
    file_type: 'image' | 'pdf' | 'screenshot';
    file_size: string;
  };
}

export interface CreateAnswerDTO {
  answer_text: string;
  attachment?: {
    file_name: string;
    file_url: string;
    file_type: 'image' | 'pdf' | 'screenshot';
    file_size: string;
  };
}

export interface DoubtNotification {
  id: string;
  user_id: string;
  type: 'ANSWER_RECEIVED' | 'ANSWER_ACCEPTED' | 'DOUBT_RESOLVED' | 'DOUBT_CLOSED' | 'LIVE_SESSION_SCHEDULED';
  title: string;
  message: string;
  doubt_id?: string;
  read: boolean;
  created_at: string;
}
