export type DiscussionCategory =
  | 'GENERAL DISCUSSION'
  | 'CONCEPT DISCUSSION'
  | 'EXAM PREPARATION'
  | 'CAREER / LEARNING'
  | 'PROJECT DISCUSSION'
  | 'RESOURCE DISCUSSION';

export type DiscussionStatus = 'OPEN' | 'CLOSED' | 'REMOVED';

export type ReplyStatus = 'ACTIVE' | 'REMOVED';

export type CommunityReportReason =
  | 'Spam'
  | 'Inappropriate Content'
  | 'Harassment'
  | 'Misleading Information'
  | 'Duplicate'
  | 'Off-topic'
  | 'Other';

export type CommunityReportStatus = 'OPEN' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';

export interface CommunityAttachment {
  id: string;
  discussion_id?: string;
  file_url: string;
  file_name: string;
  file_type: 'image' | 'pdf' | 'screenshot';
  file_size: string;
  created_at: string;
}

export interface CommunityReply {
  id: string;
  discussion_id: string;
  parent_reply_id?: string; // For 2-level threaded discussion
  author_id: string;
  author_name: string;
  author_role: 'student' | 'admin';
  author_email?: string;
  content: string;
  helpful_count: number;
  is_accepted: boolean;
  status: ReplyStatus;
  created_at: string;
  updated_at: string;
  replies?: CommunityReply[]; // Nested sub-replies
}

export interface CommunityDiscussion {
  id: string;
  author_id: string;
  author_name: string;
  author_role: 'student' | 'admin';
  author_email?: string;
  title: string;
  content: string;
  subject_id: string;
  subject_name: string;
  topic: string;
  tags: string[];
  discussion_type: DiscussionCategory;
  status: DiscussionStatus;
  replies_count: number;
  helpful_count: number;
  has_accepted_answer: boolean;
  accepted_reply_id?: string;
  views: number;
  attachments?: CommunityAttachment[];
  replies?: CommunityReply[];
  is_trending?: boolean;
  closed_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface DiscussionHelpful {
  id: string;
  discussion_id: string;
  user_id: string;
  created_at: string;
}

export interface ReplyHelpful {
  id: string;
  reply_id: string;
  user_id: string;
  created_at: string;
}

export interface AcceptedAnswerRecord {
  id: string;
  discussion_id: string;
  reply_id: string;
  accepted_by: string;
  created_at: string;
}

export interface SubjectFollow {
  id: string;
  user_id: string;
  subject_id: string;
  created_at: string;
}

export interface CommunityReport {
  id: string;
  reporter_id: string;
  reporter_name: string;
  reporter_email?: string;
  content_type: 'discussion' | 'reply';
  content_id: string;
  discussion_id: string;
  discussion_title?: string;
  content_snippet?: string;
  reason: CommunityReportReason;
  notes?: string;
  status: CommunityReportStatus;
  created_at: string;
  resolved_at?: string;
  admin_action_taken?: string;
}

export interface CreateDiscussionDTO {
  title: string;
  content: string;
  subject_id: string;
  subject_name: string;
  topic: string;
  tags: string[];
  discussion_type: DiscussionCategory;
  attachment?: {
    file_name: string;
    file_url: string;
    file_type: 'image' | 'pdf' | 'screenshot';
    file_size: string;
  };
}

export interface EditDiscussionDTO {
  title: string;
  content: string;
  subject_id: string;
  subject_name: string;
  topic: string;
  tags: string[];
  discussion_type: DiscussionCategory;
}

export interface CreateReplyDTO {
  content: string;
  parent_reply_id?: string;
}

export interface CommunityFilterOptions {
  searchQuery?: string;
  subjectId?: string;
  topic?: string;
  discussionType?: DiscussionCategory | 'ALL';
  status?: DiscussionStatus | 'ALL';
  sortBy?: 'recent' | 'helpful' | 'discussed' | 'trending';
  onlyFollowing?: boolean;
  onlyMyDiscussions?: boolean;
}

export interface CommunityMetricsSummary {
  totalDiscussions: number;
  newDiscussions: number;
  totalReplies: number;
  helpfulReactions: number;
  acceptedAnswers: number;
  reportedDiscussions: number;
  closedDiscussions: number;
  activeDiscussions: number;
  mostDiscussedSubjects: Array<{
    subjectId: string;
    subjectName: string;
    count: number;
  }>;
  mostActiveTopics: Array<{
    topic: string;
    subjectName: string;
    count: number;
  }>;
  mostHelpfulDiscussions: Array<{
    id: string;
    title: string;
    subjectName: string;
    helpfulCount: number;
    repliesCount: number;
  }>;
}
