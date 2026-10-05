export type ActivityEventType =
  | 'MATERIAL_VIEWED'
  | 'PDF_DOWNLOADED'
  | 'VIDEO_STARTED'
  | 'VIDEO_COMPLETED'
  | 'MATERIAL_SAVED'
  | 'MATERIAL_LIKED'
  | 'STUDY_ROOM_JOINED'
  | 'STUDY_ROOM_LEFT'
  | 'LIVE_SESSION_JOINED'
  | 'LIVE_SESSION_LEFT'
  | 'USER_REGISTERED'
  | 'STUDENT_ADDED'
  | 'STUDENT_EDITED'
  | 'STUDENT_DEACTIVATED'
  | 'STUDENT_ACTIVATED'
  | 'DOUBT_CREATED'
  | 'DOUBT_VIEWED'
  | 'ANSWER_CREATED'
  | 'ANSWER_ACCEPTED'
  | 'DOUBT_RESOLVED'
  | 'DOUBT_REPORTED'
  | 'AI_QUESTION_ASKED'
  | 'AI_ANSWER_GENERATED'
  | 'AI_SUMMARY_GENERATED'
  | 'AI_QUIZ_GENERATED'
  | 'AI_QUIZ_COMPLETED'
  | 'AI_HELPFUL'
  | 'AI_NOT_HELPFUL'
  | 'DISCUSSION_CREATED'
  | 'DISCUSSION_VIEWED'
  | 'DISCUSSION_REPLIED'
  | 'DISCUSSION_HELPFUL'
  | 'COMMUNITY_ANSWER_ACCEPTED'
  | 'SUBJECT_FOLLOWED'
  | 'SUBJECT_UNFOLLOWED'
  | 'DISCUSSION_REPORTED'
  | 'DISCUSSION_CLOSED'
  | 'DISCUSSION_REOPENED'
  | 'TOKEN_PURCHASED'
  | 'TOKEN_EARNED'
  | 'TOKEN_SPENT'
  | 'TOKEN_REFUNDED'
  | 'TOKEN_ADJUSTED'
  | 'RESOURCE_UNLOCKED'
  | 'REWARD_APPROVED'
  | 'REWARD_REJECTED';

export type ActivityResourceType =
  | 'material'
  | 'pdf'
  | 'video'
  | 'study_room'
  | 'live_session'
  | 'user'
  | 'system'
  | 'doubt'
  | 'answer'
  | 'ai_assistant'
  | 'ai_conversation'
  | 'ai_quiz'
  | 'community_discussion'
  | 'community_reply'
  | 'community_report'
  | 'subject'
  | 'token_wallet'
  | 'token_package'
  | 'token_transaction'
  | 'token_reward'
  | 'token_unlock';

export interface ActivityEvent {
  id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  event_type: ActivityEventType;
  resource_type: ActivityResourceType;
  resource_id: string;
  resource_title?: string;
  metadata?: {
    subject?: string;
    topic?: string;
    contentType?: string;
    fileName?: string;
    fileSize?: string;
    videoDuration?: string;
    watchProgress?: string;
    sessionUrl?: string;
    ipOrLocation?: string;
    [key: string]: any;
  };
  created_at: string;
}

export interface StudentActivitySummary {
  materialsViewedCount: number;
  pdfsDownloadedCount: number;
  videosWatchedCount: number;
  materialsSavedCount: number;
  materialsLikedCount: number;
  liveSessionsJoinedCount: number;
  studyRoomsJoinedCount: number;
  
  viewedMaterials: Array<{
    id: string;
    title: string;
    subject: string;
    contentType: string;
    viewedAt: string;
  }>;
  
  downloadedPdfs: Array<{
    id: string;
    title: string;
    fileName: string;
    subject: string;
    downloadedAt: string;
  }>;
  
  watchedVideos: Array<{
    id: string;
    title: string;
    subject: string;
    duration: string;
    progress: string;
    watchedAt: string;
  }>;
  
  savedMaterials: Array<{
    id: string;
    title: string;
    subject: string;
    contentType: string;
    savedAt: string;
  }>;
  
  likedMaterials: Array<{
    id: string;
    title: string;
    subject: string;
    likedAt: string;
  }>;
  
  liveSessions: Array<{
    id: string;
    title: string;
    subject: string;
    date: string;
    joinedAt: string;
    leftAt?: string;
    duration?: string;
    status: string;
  }>;
  
  studyRooms: Array<{
    id: string;
    name: string;
    subject: string;
    joinedAt: string;
    leftAt?: string;
    status: string;
  }>;
  
  timeline: ActivityEvent[];
}
