export type DateRangePreset = 'today' | '7d' | '30d' | '90d' | 'all' | 'custom';

export interface DateRangeFilter {
  preset: DateRangePreset;
  startDate?: string;
  endDate?: string;
}

export interface PlatformOverviewMetrics {
  totalStudents: number;
  newStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  totalMaterials: number;
  publishedMaterials: number;
  draftMaterials: number;
  totalPdfDownloads: number;
  totalMaterialViews: number;
  totalMaterialSaves: number;
  totalMaterialLikes: number;
  totalLiveSessions: number;
  scheduledSessions: number;
  liveSessions: number;
  endedSessions: number;
  cancelledSessions: number;
  totalSessionJoins: number;
  uniqueStudentsInSessions: number;
  totalStudyRooms: number;
  activeStudyRooms: number;
  completedStudyRooms: number;
  totalStudyRoomJoins: number;
  uniqueStudentsInRooms: number;
  totalDoubts: number;
  openDoubts: number;
  answeredDoubts: number;
  resolvedDoubts: number;
  closedDoubts: number;
  avgDoubtResponseTimeMinutes: number | null; // null if insufficient data
}

export interface StudentGrowthPoint {
  date: string;
  label: string;
  registrations: number;
  cumulative: number;
}

export interface ActivityCategoryBreakdown {
  category: 'Content Activity' | 'Live Learning' | 'Doubt Activity' | 'Study Room Activity' | 'Administrative';
  count: number;
  color: string;
}

export interface ActivityTrendPoint {
  date: string;
  label: string;
  content: number;
  live: number;
  doubts: number;
  rooms: number;
  total: number;
}

export interface MaterialPopularityItem {
  id: string;
  title: string;
  subject: string;
  contentType: string;
  status: string;
  views: number;
  downloads: number;
  saves: number;
  likes: number;
  engagementScore: number; // Views + Downloads + Saves + Likes
  createdAt: string;
}

export interface SubjectAnalyticsItem {
  subject: string;
  views: number;
  downloads: number;
  saves: number;
  doubts: number;
  sessionParticipation: number;
  totalActivity: number;
}

export interface VideoAnalyticsSummary {
  videosStarted: number;
  videosCompleted: number;
  totalVideoViews: number;
  isCompletionTrackingAvailable: boolean;
  mostWatchedVideos: Array<{
    id: string;
    title: string;
    subject: string;
    views: number;
    duration: string;
  }>;
}

export interface LiveSessionAnalyticsItem {
  id: string;
  title: string;
  subject: string;
  date: string;
  status: string;
  participants: number;
  duration: string;
}

export interface StudyRoomAnalyticsItem {
  id: string;
  name: string;
  subject: string;
  status: string;
  participants: number;
  sessionsCount: number;
  createdAt: string;
}

export interface DoubtSubjectAnalyticsItem {
  subject: string;
  count: number;
  resolvedCount: number;
}

export interface AdminActivityCountItem {
  actionType: string;
  description: string;
  count: number;
}

export interface StudentEngagementItem {
  id: string;
  name: string;
  email: string;
  college: string;
  course: string;
  year: string;
  status: string;
  materialsViewed: number;
  downloads: number;
  sessionsJoined: number;
  studyRoomsJoined: number;
  doubtsAsked: number;
  doubtsResolved: number;
  totalActions: number;
  lastActivity: string | null;
  registrationDate: string;
}

export type ReportCategory =
  | 'students'
  | 'materials'
  | 'live_sessions'
  | 'study_rooms'
  | 'doubts'
  | 'activity';

export interface ReportFilterOptions {
  category: ReportCategory;
  dateRange: DateRangeFilter;
  searchQuery?: string;
  subjectFilter?: string;
  statusFilter?: string;
  courseFilter?: string;
  yearFilter?: string;
}
