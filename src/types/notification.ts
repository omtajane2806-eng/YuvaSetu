export type NotificationType =
  | 'DOUBT_ANSWERED'
  | 'ANSWER_ACCEPTED'
  | 'DOUBT_RESOLVED'
  | 'DOUBT_CLOSED'
  | 'DOUBT_REPORTED'
  | 'NEW_DOUBT'
  | 'SESSION_SCHEDULED'
  | 'SESSION_STARTING'
  | 'SESSION_LIVE'
  | 'SESSION_CANCELLED'
  | 'ROOM_LIVE'
  | 'ROOM_CANCELLED'
  | 'NEW_STUDY_MATERIAL'
  | 'STUDENT_REGISTERED'
  | 'STUDENT_DEACTIVATED'
  | 'MATERIAL_PUBLISHED'
  | 'MATERIAL_ENGAGEMENT'
  | 'ACCOUNT_UPDATED'
  | 'DISCUSSION_REPLIED'
  | 'REPLY_ACCEPTED'
  | 'DISCUSSION_HELPFUL'
  | 'DISCUSSION_REPORTED'
  | 'DISCUSSION_MODERATED'
  | 'TOKEN_CREDITED'
  | 'TOKEN_EARNED'
  | 'TOKEN_SPENT'
  | 'REWARD_APPROVED'
  | 'REWARD_REJECTED'
  | 'PURCHASE_SUCCESS'
  | 'PURCHASE_FAILED'
  | 'REFUND_PROCESSED';

export type NotificationRelatedType =
  | 'doubt'
  | 'answer'
  | 'live_session'
  | 'study_room'
  | 'material'
  | 'student'
  | 'report'
  | 'account'
  | 'system'
  | 'community_discussion'
  | 'community_reply'
  | 'token_wallet'
  | 'token_transaction'
  | 'token_reward';

export interface AppNotification {
  id: string;
  user_id: string; // Recipient user_id or 'admin' broadcast
  recipient_role?: 'student' | 'admin';
  type: NotificationType;
  title: string;
  message: string;
  related_type?: NotificationRelatedType;
  related_id?: string;
  is_read: boolean;
  created_at: string;
  action_url?: string;
  metadata?: {
    subject?: string;
    topic?: string;
    studentName?: string;
    studentEmail?: string;
    materialTitle?: string;
    sessionTitle?: string;
    doubtTitle?: string;
    [key: string]: any;
  };
}

export type NotificationCategory =
  | 'doubts'
  | 'community'
  | 'live_sessions'
  | 'study_rooms'
  | 'study_materials'
  | 'student_activity'
  | 'reports'
  | 'account';

export interface NotificationPreference {
  id: string;
  user_id: string;
  category: NotificationCategory;
  label: string;
  description: string;
  enabled: boolean;
  role: 'student' | 'admin' | 'all';
  updated_at: string;
}
