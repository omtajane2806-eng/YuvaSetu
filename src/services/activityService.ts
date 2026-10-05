import {
  ActivityEvent,
  ActivityEventType,
  ActivityResourceType,
  StudentActivitySummary,
} from '../types/activity';

const ACTIVITY_STORAGE_KEY = 'vidyasetu_activity_events_v5';

// Realistic pre-seeded learning activity history for verified students
const SEED_ACTIVITY_EVENTS: ActivityEvent[] = [
  {
    id: 'act-seed-1',
    user_id: 'user-student-aryan',
    user_name: 'Aryan Sharma',
    user_email: 'aryan@yuvasetu.com',
    event_type: 'USER_REGISTERED',
    resource_type: 'user',
    resource_id: 'user-student-aryan',
    resource_title: 'Aryan Sharma Registered on YuvaSetu',
    metadata: { college: 'IIT Bombay', course: 'B.Tech', branch: 'CSE', year: '2nd Year' },
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: 'act-seed-2',
    user_id: 'user-student-aryan',
    user_name: 'Aryan Sharma',
    user_email: 'aryan@yuvasetu.com',
    event_type: 'MATERIAL_VIEWED',
    resource_type: 'material',
    resource_id: 'material-dsa-searching-sorting',
    resource_title: 'DSA Searching and Sorting (40-Page Handwritten Notes)',
    metadata: { subject: 'Data Structures & Algorithms', contentType: 'pdf', topic: 'Searching & Sorting' },
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: 'act-seed-3',
    user_id: 'user-student-aryan',
    user_name: 'Aryan Sharma',
    user_email: 'aryan@yuvasetu.com',
    event_type: 'PDF_DOWNLOADED',
    resource_type: 'pdf',
    resource_id: 'material-dsa-searching-sorting',
    resource_title: 'DSA Searching and Sorting (40-Page Handwritten Notes)',
    metadata: {
      subject: 'Data Structures & Algorithms',
      fileName: 'DSA_Searching_and_Sorting_Complete_Notes.pdf',
      fileSize: '14.2 MB',
    },
    created_at: new Date(Date.now() - 12 * 86400000 + 45000).toISOString(),
  },
  {
    id: 'act-seed-4',
    user_id: 'user-student-aryan',
    user_name: 'Aryan Sharma',
    user_email: 'aryan@yuvasetu.com',
    event_type: 'MATERIAL_SAVED',
    resource_type: 'material',
    resource_id: 'material-dsa-searching-sorting',
    resource_title: 'DSA Searching and Sorting (40-Page Handwritten Notes)',
    metadata: { subject: 'Data Structures & Algorithms', contentType: 'pdf' },
    created_at: new Date(Date.now() - 11 * 86400000).toISOString(),
  },
  {
    id: 'act-seed-5',
    user_id: 'user-student-aryan',
    user_name: 'Aryan Sharma',
    user_email: 'aryan@yuvasetu.com',
    event_type: 'MATERIAL_LIKED',
    resource_type: 'material',
    resource_id: 'material-dsa-searching-sorting',
    resource_title: 'DSA Searching and Sorting (40-Page Handwritten Notes)',
    metadata: { subject: 'Data Structures & Algorithms' },
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'act-seed-6',
    user_id: 'user-student-aryan',
    user_name: 'Aryan Sharma',
    user_email: 'aryan@yuvasetu.com',
    event_type: 'MATERIAL_VIEWED',
    resource_type: 'material',
    resource_id: 'material-dsa-hashing',
    resource_title: 'DSA Hashing & Hash Tables (25-Page Handwritten Notes)',
    metadata: { subject: 'Data Structures & Algorithms', contentType: 'pdf', topic: 'Hashing' },
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: 'act-seed-7',
    user_id: 'user-student-aryan',
    user_name: 'Aryan Sharma',
    user_email: 'aryan@yuvasetu.com',
    event_type: 'PDF_DOWNLOADED',
    resource_type: 'pdf',
    resource_id: 'material-dsa-hashing',
    resource_title: 'DSA Hashing & Hash Tables (25-Page Handwritten Notes)',
    metadata: {
      subject: 'Data Structures & Algorithms',
      fileName: 'DSA_Hashing_Complete_Handwritten_Notes.pdf',
      fileSize: '10.5 MB',
    },
    created_at: new Date(Date.now() - 6 * 86400000 + 30000).toISOString(),
  },
  {
    id: 'act-seed-8',
    user_id: 'user-student-aryan',
    user_name: 'Aryan Sharma',
    user_email: 'aryan@yuvasetu.com',
    event_type: 'STUDY_ROOM_JOINED',
    resource_type: 'study_room',
    resource_id: 'room-dsa-sprint-1',
    resource_title: 'DSA Deep Focus: QuickSort Partition & Binary Search Invariants',
    metadata: { subject: 'Computer Science (DSA)', topic: 'Sorting & Searching Masterclass' },
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'act-seed-9',
    user_id: 'user-student-aryan',
    user_name: 'Aryan Sharma',
    user_email: 'aryan@yuvasetu.com',
    event_type: 'LIVE_SESSION_JOINED',
    resource_type: 'live_session',
    resource_id: 'session-dsa-hashing-live',
    resource_title: 'DSA Live Doubt Session: Hashing Collisions & LRU Cache Design',
    metadata: {
      subject: 'Computer Science (DSA)',
      sessionUrl: 'https://meet.google.com/vds-dsa-live',
      status: 'LIVE',
    },
    created_at: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: 'act-seed-10',
    user_id: 'user-student-aditi',
    user_name: 'Aditi Sen',
    user_email: 'aditi@yuvasetu.com',
    event_type: 'USER_REGISTERED',
    resource_type: 'user',
    resource_id: 'user-student-aditi',
    resource_title: 'Aditi Sen Registered on YuvaSetu',
    metadata: { college: 'BITS Pilani', course: 'B.Tech', branch: 'ECE', year: '3rd Year' },
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'act-seed-11',
    user_id: 'user-student-aditi',
    user_name: 'Aditi Sen',
    user_email: 'aditi@yuvasetu.com',
    event_type: 'MATERIAL_VIEWED',
    resource_type: 'material',
    resource_id: 'content-dbms-normalization',
    resource_title: 'DBMS Normalization & Relational Schema Design',
    metadata: { subject: 'Database Management Systems', contentType: 'pdf' },
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: 'act-seed-12',
    user_id: 'user-student-aditi',
    user_name: 'Aditi Sen',
    user_email: 'aditi@yuvasetu.com',
    event_type: 'PDF_DOWNLOADED',
    resource_type: 'pdf',
    resource_id: 'content-dbms-normalization',
    resource_title: 'DBMS Normalization & Relational Schema Design',
    metadata: {
      subject: 'Database Management Systems',
      fileName: 'DBMS_Normalization_Complete_Notes.pdf',
      fileSize: '8.4 MB',
    },
    created_at: new Date(Date.now() - 8 * 86400000 + 20000).toISOString(),
  },
  {
    id: 'act-seed-13',
    user_id: 'user-student-aditi',
    user_name: 'Aditi Sen',
    user_email: 'aditi@yuvasetu.com',
    event_type: 'LIVE_SESSION_JOINED',
    resource_type: 'live_session',
    resource_id: 'session-dsa-hashing-live',
    resource_title: 'DSA Live Doubt Session: Hashing Collisions & LRU Cache Design',
    metadata: { subject: 'Computer Science (DSA)', status: 'LIVE' },
    created_at: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'act-seed-14',
    user_id: 'user-student-rohit',
    user_name: 'Rohit Kulkarni',
    user_email: 'rohit@yuvasetu.com',
    event_type: 'USER_REGISTERED',
    resource_type: 'user',
    resource_id: 'user-student-rohit',
    resource_title: 'Rohit Kulkarni Registered on YuvaSetu',
    metadata: { college: 'COEP Tech Pune', course: 'B.Tech', branch: 'Mechanical', year: '1st Year' },
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'act-seed-15',
    user_id: 'user-student-rohit',
    user_name: 'Rohit Kulkarni',
    user_email: 'rohit@yuvasetu.com',
    event_type: 'MATERIAL_VIEWED',
    resource_type: 'material',
    resource_id: 'course-rotational-dynamics',
    resource_title: 'Rotational Dynamics & Moment of Inertia Masterclass',
    metadata: { subject: 'Engineering Physics & Mechanics', contentType: 'video' },
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'act-seed-16',
    user_id: 'user-student-rohit',
    user_name: 'Rohit Kulkarni',
    user_email: 'rohit@yuvasetu.com',
    event_type: 'VIDEO_STARTED',
    resource_type: 'video',
    resource_id: 'course-rotational-dynamics',
    resource_title: 'Rotational Dynamics & Moment of Inertia Masterclass',
    metadata: { subject: 'Engineering Physics & Mechanics', duration: '28 mins', progress: '100%' },
    created_at: new Date(Date.now() - 5 * 86400000 + 10000).toISOString(),
  },
  {
    id: 'act-seed-17',
    user_id: 'user-student-rohit',
    user_name: 'Rohit Kulkarni',
    user_email: 'rohit@yuvasetu.com',
    event_type: 'STUDY_ROOM_JOINED',
    resource_type: 'study_room',
    resource_id: 'room-dsa-sprint-1',
    resource_title: 'DSA Deep Focus: QuickSort Partition & Binary Search Invariants',
    metadata: { subject: 'Computer Science (DSA)' },
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
  },
];

class ActivityService {
  private getStoredEvents(): ActivityEvent[] {
    try {
      const data = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(SEED_ACTIVITY_EVENTS));
        return SEED_ACTIVITY_EVENTS;
      }
      const parsed: ActivityEvent[] = JSON.parse(data);
      if (!parsed || parsed.length === 0) {
        localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(SEED_ACTIVITY_EVENTS));
        return SEED_ACTIVITY_EVENTS;
      }
      return parsed;
    } catch {
      return SEED_ACTIVITY_EVENTS;
    }
  }

  private saveStoredEvents(events: ActivityEvent[]): void {
    try {
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.error('Failed to persist activity events', e);
    }
  }

  // Log any activity event
  public logEvent(event: {
    user_id: string;
    user_name?: string;
    user_email?: string;
    event_type: ActivityEventType;
    resource_type: ActivityResourceType;
    resource_id: string;
    resource_title?: string;
    metadata?: Record<string, any>;
  }): ActivityEvent {
    const events = this.getStoredEvents();
    const newEvent: ActivityEvent = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      user_id: event.user_id,
      user_name: event.user_name || 'YuvaSetu Student',
      user_email: event.user_email || '',
      event_type: event.event_type,
      resource_type: event.resource_type,
      resource_id: event.resource_id,
      resource_title: event.resource_title || 'Learning Resource',
      metadata: event.metadata || {},
      created_at: new Date().toISOString(),
    };

    events.unshift(newEvent);
    // Keep last 1000 events
    const trimmed = events.slice(0, 1000);
    this.saveStoredEvents(trimmed);
    return newEvent;
  }

  // Quick logging helpers
  public logMaterialViewed(
    userId: string,
    userName: string,
    userEmail: string,
    materialId: string,
    materialTitle: string,
    subject?: string,
    contentType?: string
  ): void {
    this.logEvent({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      event_type: 'MATERIAL_VIEWED',
      resource_type: 'material',
      resource_id: materialId,
      resource_title: materialTitle,
      metadata: { subject, contentType },
    });
  }

  public logPdfDownloaded(
    userId: string,
    userName: string,
    userEmail: string,
    materialId: string,
    materialTitle: string,
    fileName?: string,
    fileSize?: string,
    subject?: string
  ): void {
    this.logEvent({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      event_type: 'PDF_DOWNLOADED',
      resource_type: 'pdf',
      resource_id: materialId,
      resource_title: materialTitle,
      metadata: { fileName, fileSize, subject },
    });
  }

  public logVideoStarted(
    userId: string,
    userName: string,
    userEmail: string,
    videoId: string,
    videoTitle: string,
    subject?: string,
    duration?: string
  ): void {
    this.logEvent({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      event_type: 'VIDEO_STARTED',
      resource_type: 'video',
      resource_id: videoId,
      resource_title: videoTitle,
      metadata: { subject, duration, progress: 'Started' },
    });
  }

  public logMaterialSaved(
    userId: string,
    userName: string,
    userEmail: string,
    materialId: string,
    materialTitle: string,
    subject?: string
  ): void {
    this.logEvent({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      event_type: 'MATERIAL_SAVED',
      resource_type: 'material',
      resource_id: materialId,
      resource_title: materialTitle,
      metadata: { subject },
    });
  }

  public logMaterialLiked(
    userId: string,
    userName: string,
    userEmail: string,
    materialId: string,
    materialTitle: string,
    subject?: string
  ): void {
    this.logEvent({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      event_type: 'MATERIAL_LIKED',
      resource_type: 'material',
      resource_id: materialId,
      resource_title: materialTitle,
      metadata: { subject },
    });
  }

  public logStudyRoomJoined(
    userId: string,
    userName: string,
    userEmail: string,
    roomId: string,
    roomName: string,
    subject?: string
  ): void {
    this.logEvent({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      event_type: 'STUDY_ROOM_JOINED',
      resource_type: 'study_room',
      resource_id: roomId,
      resource_title: roomName,
      metadata: { subject },
    });
  }

  public logLiveSessionJoined(
    userId: string,
    userName: string,
    userEmail: string,
    sessionId: string,
    sessionTitle: string,
    subject?: string,
    sessionUrl?: string
  ): void {
    this.logEvent({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      event_type: 'LIVE_SESSION_JOINED',
      resource_type: 'live_session',
      resource_id: sessionId,
      resource_title: sessionTitle,
      metadata: { subject, sessionUrl, status: 'LIVE' },
    });
  }

  public logAIQuestionAsked(
    userId: string,
    userName: string,
    userEmail: string,
    questionText: string,
    conversationId: string,
    materialId?: string,
    materialTitle?: string,
    subject?: string
  ): void {
    this.logEvent({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      event_type: 'AI_QUESTION_ASKED',
      resource_type: 'ai_assistant',
      resource_id: conversationId,
      resource_title: questionText.slice(0, 80),
      metadata: {
        conversationId,
        materialId,
        materialTitle,
        subject,
        sourceGrounded: !!materialId,
      },
    });
  }

  public logAIAnswerGenerated(
    userId: string,
    userName: string,
    userEmail: string,
    conversationId: string,
    isSourceGrounded: boolean,
    materialId?: string,
    materialTitle?: string,
    subject?: string
  ): void {
    this.logEvent({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      event_type: 'AI_ANSWER_GENERATED',
      resource_type: 'ai_assistant',
      resource_id: conversationId,
      resource_title: materialTitle ? `AI Response grounded on ${materialTitle}` : 'AI Response',
      metadata: {
        conversationId,
        materialId,
        materialTitle,
        subject,
        sourceGrounded: isSourceGrounded,
      },
    });
  }

  public logAISummaryGenerated(
    userId: string,
    userName: string,
    userEmail: string,
    materialId: string,
    materialTitle: string,
    subject?: string
  ): void {
    this.logEvent({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      event_type: 'AI_SUMMARY_GENERATED',
      resource_type: 'material',
      resource_id: materialId,
      resource_title: `Summary generated for ${materialTitle}`,
      metadata: { materialId, materialTitle, subject },
    });
  }

  public logAIQuizGenerated(
    userId: string,
    userName: string,
    userEmail: string,
    materialId: string | undefined,
    materialTitle: string,
    questionCount: number,
    difficulty: string,
    topic: string
  ): void {
    this.logEvent({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      event_type: 'AI_QUIZ_GENERATED',
      resource_type: 'ai_quiz',
      resource_id: materialId || 'quiz-general',
      resource_title: `Quiz Generated: ${topic} (${difficulty.toUpperCase()})`,
      metadata: {
        materialId,
        materialTitle,
        questionCount,
        difficulty,
        topic,
      },
    });
  }

  public logAIQuizCompleted(
    userId: string,
    userName: string,
    userEmail: string,
    quizAttemptId: string,
    score: number,
    totalQuestions: number,
    materialTitle?: string,
    topic?: string
  ): void {
    this.logEvent({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      event_type: 'AI_QUIZ_COMPLETED',
      resource_type: 'ai_quiz',
      resource_id: quizAttemptId,
      resource_title: `Quiz Completed: ${score}/${totalQuestions} in ${topic || 'General'}`,
      metadata: {
        score,
        totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
        materialTitle,
        topic,
      },
    });
  }

  public logAIFeedback(
    userId: string,
    userName: string,
    userEmail: string,
    messageId: string,
    helpful: boolean,
    reason?: string
  ): void {
    this.logEvent({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      event_type: helpful ? 'AI_HELPFUL' : 'AI_NOT_HELPFUL',
      resource_type: 'ai_assistant',
      resource_id: messageId,
      resource_title: helpful ? 'AI Response Marked Helpful' : 'AI Response Marked Not Helpful',
      metadata: { messageId, helpful, reason },
    });
  }

  // ==========================================
  // MODULE 9: COMMUNITY ACTIVITY LOGGING
  // ==========================================

  public logDiscussionCreated(
    userId: string,
    userName: string,
    userEmail: string,
    discussionId: string,
    discussionTitle: string,
    subject?: string,
    topic?: string,
    category?: string
  ): void {
    this.logEvent({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      event_type: 'DISCUSSION_CREATED',
      resource_type: 'community_discussion',
      resource_id: discussionId,
      resource_title: discussionTitle,
      metadata: { subject, topic, category },
    });
  }

  public logDiscussionViewed(
    userId: string,
    userName: string,
    userEmail: string,
    discussionId: string,
    discussionTitle: string,
    subject?: string
  ): void {
    this.logEvent({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      event_type: 'DISCUSSION_VIEWED',
      resource_type: 'community_discussion',
      resource_id: discussionId,
      resource_title: discussionTitle,
      metadata: { subject },
    });
  }

  public logDiscussionReplied(
    userId: string,
    userName: string,
    userEmail: string,
    replyId: string,
    discussionId: string,
    discussionTitle: string,
    subject?: string
  ): void {
    this.logEvent({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      event_type: 'DISCUSSION_REPLIED',
      resource_type: 'community_reply',
      resource_id: replyId,
      resource_title: `Replied to "${discussionTitle}"`,
      metadata: { discussionId, discussionTitle, subject },
    });
  }

  public logDiscussionHelpful(
    userId: string,
    userName: string,
    userEmail: string,
    discussionId: string,
    discussionTitle: string,
    subject?: string
  ): void {
    this.logEvent({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      event_type: 'DISCUSSION_HELPFUL',
      resource_type: 'community_discussion',
      resource_id: discussionId,
      resource_title: `Marked "${discussionTitle}" as helpful`,
      metadata: { subject },
    });
  }

  public logCommunityAnswerAccepted(
    userId: string,
    userName: string,
    userEmail: string,
    replyId: string,
    discussionId: string,
    discussionTitle: string
  ): void {
    this.logEvent({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      event_type: 'COMMUNITY_ANSWER_ACCEPTED',
      resource_type: 'community_reply',
      resource_id: replyId,
      resource_title: `Accepted answer on "${discussionTitle}"`,
      metadata: { discussionId, replyId },
    });
  }

  public logSubjectFollowed(
    userId: string,
    userName: string,
    userEmail: string,
    subjectId: string,
    subjectName: string
  ): void {
    this.logEvent({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      event_type: 'SUBJECT_FOLLOWED',
      resource_type: 'subject',
      resource_id: subjectId,
      resource_title: `Followed Subject: ${subjectName}`,
      metadata: { subjectId, subjectName },
    });
  }

  public logDiscussionReported(
    userId: string,
    userName: string,
    userEmail: string,
    discussionId: string,
    discussionTitle: string,
    reason: string
  ): void {
    this.logEvent({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      event_type: 'DISCUSSION_REPORTED',
      resource_type: 'community_report',
      resource_id: discussionId,
      resource_title: `Reported discussion: "${discussionTitle}"`,
      metadata: { reason },
    });
  }

  // Get all activity events (Admin stream)
  public getAllEvents(limit: number = 50): ActivityEvent[] {
    const events = this.getStoredEvents();
    return events.slice(0, limit);
  }

  // Get events by user ID
  public getEventsByUserId(userId: string): ActivityEvent[] {
    const events = this.getStoredEvents();
    return events.filter((e) => e.user_id === userId);
  }

  // Get last activity timestamp for a user
  public getLastActivity(userId: string): string | null {
    const userEvents = this.getEventsByUserId(userId);
    if (userEvents.length === 0) return null;
    return userEvents[0].created_at;
  }

  // Get complete student learning summary for Student Detail Page
  public getStudentSummary(userId: string): StudentActivitySummary {
    const events = this.getEventsByUserId(userId);

    const viewedEvents = events.filter((e) => e.event_type === 'MATERIAL_VIEWED');
    const downloadedEvents = events.filter((e) => e.event_type === 'PDF_DOWNLOADED');
    const videoEvents = events.filter((e) => e.event_type === 'VIDEO_STARTED' || e.event_type === 'VIDEO_COMPLETED');
    const savedEvents = events.filter((e) => e.event_type === 'MATERIAL_SAVED');
    const likedEvents = events.filter((e) => e.event_type === 'MATERIAL_LIKED');
    const liveEvents = events.filter((e) => e.event_type === 'LIVE_SESSION_JOINED');
    const roomEvents = events.filter((e) => e.event_type === 'STUDY_ROOM_JOINED');

    // Deduplicate or list records
    const viewedMaterials = viewedEvents.map((e) => ({
      id: e.resource_id,
      title: e.resource_title || 'Study Material',
      subject: e.metadata?.subject || 'General',
      contentType: e.metadata?.contentType || 'Note',
      viewedAt: e.created_at,
    }));

    const downloadedPdfs = downloadedEvents.map((e) => ({
      id: e.resource_id,
      title: e.resource_title || 'PDF Document',
      fileName: e.metadata?.fileName || `${e.resource_title || 'Notes'}.pdf`,
      subject: e.metadata?.subject || 'General',
      downloadedAt: e.created_at,
    }));

    const watchedVideos = videoEvents.map((e) => ({
      id: e.resource_id,
      title: e.resource_title || 'Lecture Video',
      subject: e.metadata?.subject || 'General',
      duration: e.metadata?.duration || '25 mins',
      progress: e.metadata?.progress || 'Completed',
      watchedAt: e.created_at,
    }));

    const savedMaterials = savedEvents.map((e) => ({
      id: e.resource_id,
      title: e.resource_title || 'Saved Material',
      subject: e.metadata?.subject || 'General',
      contentType: e.metadata?.contentType || 'Note',
      savedAt: e.created_at,
    }));

    const likedMaterials = likedEvents.map((e) => ({
      id: e.resource_id,
      title: e.resource_title || 'Liked Material',
      subject: e.metadata?.subject || 'General',
      likedAt: e.created_at,
    }));

    const liveSessions = liveEvents.map((e) => ({
      id: e.resource_id,
      title: e.resource_title || 'Live Session',
      subject: e.metadata?.subject || 'General',
      date: new Date(e.created_at).toLocaleDateString(),
      joinedAt: e.created_at,
      status: e.metadata?.status || 'Attended',
    }));

    const studyRooms = roomEvents.map((e) => ({
      id: e.resource_id,
      name: e.resource_title || 'Study Room',
      subject: e.metadata?.subject || 'General',
      joinedAt: e.created_at,
      status: 'Participated',
    }));

    return {
      materialsViewedCount: viewedMaterials.length,
      pdfsDownloadedCount: downloadedPdfs.length,
      videosWatchedCount: watchedVideos.length,
      materialsSavedCount: savedMaterials.length,
      materialsLikedCount: likedMaterials.length,
      liveSessionsJoinedCount: liveSessions.length,
      studyRoomsJoinedCount: studyRooms.length,
      viewedMaterials,
      downloadedPdfs,
      watchedVideos,
      savedMaterials,
      likedMaterials,
      liveSessions,
      studyRooms,
      timeline: events,
    };
  }

  // Get total platform metrics from real activity logs
  public getPlatformActivityMetrics(): {
    totalPdfDownloads: number;
    totalMaterialViews: number;
    totalVideosWatched: number;
    totalMaterialSaves: number;
    totalMaterialsLiked: number;
    totalLiveSessionJoins: number;
    totalStudyRoomJoins: number;
  } {
    const events = this.getStoredEvents();
    const totalPdfDownloads = events.filter((e) => e.event_type === 'PDF_DOWNLOADED').length;
    const totalMaterialViews = events.filter((e) => e.event_type === 'MATERIAL_VIEWED').length;
    const totalVideosWatched = events.filter(
      (e) => e.event_type === 'VIDEO_STARTED' || e.event_type === 'VIDEO_COMPLETED'
    ).length;
    const totalMaterialSaves = events.filter((e) => e.event_type === 'MATERIAL_SAVED').length;
    const totalMaterialsLiked = events.filter((e) => e.event_type === 'MATERIAL_LIKED').length;
    const totalLiveSessionJoins = events.filter((e) => e.event_type === 'LIVE_SESSION_JOINED').length;
    const totalStudyRoomJoins = events.filter((e) => e.event_type === 'STUDY_ROOM_JOINED').length;

    return {
      totalPdfDownloads,
      totalMaterialViews,
      totalVideosWatched,
      totalMaterialSaves,
      totalMaterialsLiked,
      totalLiveSessionJoins,
      totalStudyRoomJoins,
    };
  }
}

export const activityService = new ActivityService();
