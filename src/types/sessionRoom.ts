export type RoomStatus = 'UPCOMING' | 'LIVE' | 'ENDED' | 'CANCELLED';
export type SessionStatus = 'SCHEDULED' | 'LIVE' | 'ENDED' | 'CANCELLED';
export type RoomType = 'PUBLIC' | 'PRIVATE';

export interface StudyRoomItem {
  id: string;
  name: string;
  subject: string;
  topic: string;
  description: string;
  hostName: string;
  hostId: string;
  scheduledDate: string;
  startTime: string;
  duration: string;
  capacity: number;
  roomType: RoomType;
  status: RoomStatus;
  isPublished: boolean;
  activeParticipants: number;
  liveSessionUrl?: string;
  relatedMaterialId?: string;
  relatedMaterialTitle?: string;
  tags: string[];
  createdAt: string;
}

export interface LiveSessionItem {
  id: string;
  title: string;
  description: string;
  subject: string;
  topic: string;
  hostName: string;
  hostId: string;
  roomId?: string;
  date: string;
  startTime: string;
  duration: string;
  sessionUrl: string;
  relatedMaterialId?: string;
  relatedMaterialTitle?: string;
  status: SessionStatus;
  isPublished: boolean;
  attendeeCount: number;
  tags: string[];
  createdAt: string;
}

export interface SessionParticipant {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  college?: string;
  roomId?: string;
  sessionId?: string;
  joinedAt: string;
  status: 'ACTIVE' | 'LEFT' | 'COMPLETED';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'session' | 'room' | 'system';
  linkView?: string;
  payload?: any;
}
