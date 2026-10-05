import {
  AppNotification,
  NotificationType,
  NotificationRelatedType,
  NotificationPreference,
  NotificationCategory,
} from '../types/notification';
import { User } from '../types/user';

const NOTIFICATIONS_STORAGE_KEY = 'vidyasetu_notifications_v6';
const PREFERENCES_STORAGE_KEY = 'vidyasetu_notification_preferences_v6';

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  // Student Aryan notifications
  {
    id: 'notif-stu-1',
    user_id: 'user-student-aryan',
    recipient_role: 'student',
    type: 'DOUBT_ANSWERED',
    title: 'Your doubt was answered',
    message: 'Om Tajane (Admin) answered your question "How does binary search work in sorted arrays?".',
    related_type: 'doubt',
    related_id: 'doubt-dsa-binary-search',
    is_read: false,
    created_at: new Date(Date.now() - 25 * 60000).toISOString(),
    metadata: {
      subject: 'Data Structures & Algorithms',
      doubtTitle: 'How does binary search work in sorted arrays?',
    },
  },
  {
    id: 'notif-stu-2',
    user_id: 'user-student-aryan',
    recipient_role: 'student',
    type: 'SESSION_STARTING',
    title: 'Your live session starts soon',
    message: 'DSA Masterclass: Searching, Sorting & Two-Pointer Patterns starts in 30 minutes.',
    related_type: 'live_session',
    related_id: 'session-dsa-hashing-live',
    is_read: false,
    created_at: new Date(Date.now() - 45 * 60000).toISOString(),
    metadata: {
      sessionTitle: 'DSA Masterclass: Searching, Sorting & Two-Pointer Patterns',
      subject: 'Data Structures & Algorithms',
    },
  },
  {
    id: 'notif-stu-3',
    user_id: 'user-student-aryan',
    recipient_role: 'student',
    type: 'NEW_STUDY_MATERIAL',
    title: 'New study material published',
    message: 'DSA Searching and Sorting (40-Page Handwritten Notes) has been published in Computer Science.',
    related_type: 'material',
    related_id: 'material-dsa-searching-sorting',
    is_read: true,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    metadata: {
      materialTitle: 'DSA Searching and Sorting Notes',
      subject: 'Data Structures & Algorithms',
    },
  },
  {
    id: 'notif-stu-4',
    user_id: 'user-student-aryan',
    recipient_role: 'student',
    type: 'ROOM_LIVE',
    title: 'A study room you joined is now live',
    message: 'DSA Deep Focus: QuickSort Partition & Binary Search Invariants room is now open.',
    related_type: 'study_room',
    related_id: 'room-dsa-sprint-1',
    is_read: true,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    metadata: {
      subject: 'Computer Science (DSA)',
    },
  },

  // Student Priya notifications
  {
    id: 'notif-stu-5',
    user_id: 'user-student-priya',
    recipient_role: 'student',
    type: 'DOUBT_ANSWERED',
    title: 'Your doubt was answered',
    message: 'Om Tajane (Admin) posted a step-by-step resolution to "Hashing Collision Resolution: Open Addressing vs Separate Chaining".',
    related_type: 'doubt',
    related_id: 'doubt-dsa-hashing-collision',
    is_read: false,
    created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    metadata: {
      subject: 'Data Structures & Algorithms',
    },
  },
  {
    id: 'notif-stu-6',
    user_id: 'user-student-priya',
    recipient_role: 'student',
    type: 'NEW_STUDY_MATERIAL',
    title: 'New study material published',
    message: 'DBMS Normalization & Relational Schema Design (28-Page Notes) is now available.',
    related_type: 'material',
    related_id: 'content-dbms-normalization',
    is_read: true,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },

  // Admin Broadcast / Dedicated Notifications
  {
    id: 'notif-adm-1',
    user_id: 'admin',
    recipient_role: 'admin',
    type: 'NEW_DOUBT',
    title: 'New doubt requires attention',
    message: 'Aryan Sharma submitted a conceptual doubt: "How does binary search work in sorted arrays?".',
    related_type: 'doubt',
    related_id: 'doubt-dsa-binary-search',
    is_read: false,
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
    metadata: {
      studentName: 'Aryan Sharma',
      subject: 'Data Structures & Algorithms',
    },
  },
  {
    id: 'notif-adm-2',
    user_id: 'admin',
    recipient_role: 'admin',
    type: 'STUDENT_REGISTERED',
    title: 'New student registered',
    message: 'Rohit Kulkarni (rohit@yuvasetu.com) joined YuvaSetu from COEP Tech Pune.',
    related_type: 'student',
    related_id: 'user-student-rohit',
    is_read: false,
    created_at: new Date(Date.now() - 40 * 60000).toISOString(),
    metadata: {
      studentName: 'Rohit Kulkarni',
      studentEmail: 'rohit@yuvasetu.com',
    },
  },
  {
    id: 'notif-adm-3',
    user_id: 'admin',
    recipient_role: 'admin',
    type: 'DOUBT_REPORTED',
    title: 'New doubt report submitted',
    message: 'Student flagged question "Understanding Dijkstra vs Bellman-Ford" for Inappropriate Content. Requires moderation review.',
    related_type: 'report',
    related_id: 'report-1',
    is_read: false,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    metadata: {
      reason: 'Inappropriate Content',
    },
  },
  {
    id: 'notif-adm-4',
    user_id: 'admin',
    recipient_role: 'admin',
    type: 'SESSION_LIVE',
    title: 'A live session has started',
    message: 'DSA Live Doubt Session: Hashing Collisions & LRU Cache Design is currently streaming.',
    related_type: 'live_session',
    related_id: 'session-dsa-hashing-live',
    is_read: true,
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: 'notif-adm-5',
    user_id: 'admin',
    recipient_role: 'admin',
    type: 'MATERIAL_PUBLISHED',
    title: 'Study material was published',
    message: 'Rotational Dynamics & Moment of Inertia Masterclass was successfully published and indexed.',
    related_type: 'material',
    related_id: 'course-rotational-dynamics',
    is_read: true,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

const DEFAULT_STUDENT_PREFERENCES: NotificationPreference[] = [
  {
    id: 'pref-stu-doubts',
    user_id: '',
    category: 'doubts',
    label: 'Doubt Answers & Resolutions',
    description: 'Receive alerts when educators answer your doubts or when your solutions get accepted.',
    enabled: true,
    role: 'student',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pref-stu-sessions',
    user_id: '',
    category: 'live_sessions',
    label: 'Live Sessions & Reminders',
    description: 'Get notified when upcoming live interactive sessions are scheduled or starting.',
    enabled: true,
    role: 'student',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pref-stu-rooms',
    user_id: '',
    category: 'study_rooms',
    label: 'Study Room Alerts',
    description: 'Get notified when study rooms you saved or joined go live.',
    enabled: true,
    role: 'student',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pref-stu-materials',
    user_id: '',
    category: 'study_materials',
    label: 'New Study Materials',
    description: 'Alerts when verified handwritten notes, question papers, and roadmaps are published.',
    enabled: true,
    role: 'student',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pref-stu-account',
    user_id: '',
    category: 'account',
    label: 'Account & Security Updates',
    description: 'Important notifications regarding your enrollment, credentials, and verification.',
    enabled: true,
    role: 'student',
    updated_at: new Date().toISOString(),
  },
];

const DEFAULT_ADMIN_PREFERENCES: NotificationPreference[] = [
  {
    id: 'pref-adm-students',
    user_id: '',
    category: 'student_activity',
    label: 'Student Registrations & Onboarding',
    description: 'Alerts when new students enroll or require verification.',
    enabled: true,
    role: 'admin',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pref-adm-doubts',
    user_id: '',
    category: 'doubts',
    label: 'Academic Doubts & Questions',
    description: 'Notifications when students submit new doubts requiring educator resolution.',
    enabled: true,
    role: 'admin',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pref-adm-reports',
    user_id: '',
    category: 'reports',
    label: 'Moderation & Abuse Reports',
    description: 'Instant alerts when content or users are flagged for community review.',
    enabled: true,
    role: 'admin',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pref-adm-sessions',
    user_id: '',
    category: 'live_sessions',
    label: 'Live Sessions & Study Rooms',
    description: 'Updates on live session schedules, room participation, and stream statuses.',
    enabled: true,
    role: 'admin',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pref-adm-materials',
    user_id: '',
    category: 'study_materials',
    label: 'Study Materials & Engagement',
    description: 'Alerts on content publications, download milestones, and material edits.',
    enabled: true,
    role: 'admin',
    updated_at: new Date().toISOString(),
  },
];

class NotificationService {
  private getStoredNotifications(): AppNotification[] {
    try {
      const data = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
        return INITIAL_NOTIFICATIONS;
      }
      const parsed: AppNotification[] = JSON.parse(data);
      if (!parsed || parsed.length === 0) {
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
        return INITIAL_NOTIFICATIONS;
      }
      return parsed;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  }

  private saveStoredNotifications(notifs: AppNotification[]): void {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifs));
    } catch (e) {
      console.error('Failed to persist notifications', e);
    }
  }

  // Get notifications filtered strictly by user role and identity
  public getUserNotifications(user: User | null | undefined): AppNotification[] {
    if (!user) return [];
    const all = this.getStoredNotifications();
    const isAdmin = user.role === 'admin';

    let userNotifs: AppNotification[] = [];

    if (isAdmin) {
      // Admins see notifications targeted directly to their user ID OR broadcast 'admin'
      userNotifs = all.filter(
        (n) => n.user_id === user.id || n.user_id === 'admin' || n.recipient_role === 'admin'
      );
    } else {
      // Students see ONLY notifications targeted directly to their user ID (never admin broadcasts)
      userNotifs = all.filter(
        (n) => n.user_id === user.id && n.recipient_role !== 'admin'
      );
    }

    return userNotifs.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  // Get all Admin notifications
  public getAdminNotifications(): AppNotification[] {
    const all = this.getStoredNotifications();
    return all
      .filter((n) => n.user_id === 'admin' || n.recipient_role === 'admin')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  // Get count of unread notifications for a user
  public getUnreadCount(user: User | null | undefined): number {
    if (!user) return 0;
    return this.getUserNotifications(user).filter((n) => !n.is_read).length;
  }

  // Mark single notification as read
  public markAsRead(notificationId: string): void {
    const all = this.getStoredNotifications();
    const updated = all.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n));
    this.saveStoredNotifications(updated);
  }

  // Mark all notifications as read for a user
  public markAllAsRead(user: User | null | undefined): void {
    if (!user) return;
    const all = this.getStoredNotifications();
    const isAdmin = user.role === 'admin';

    const updated = all.map((n) => {
      if (isAdmin) {
        if (n.user_id === user.id || n.user_id === 'admin' || n.recipient_role === 'admin') {
          return { ...n, is_read: true };
        }
      } else {
        if (n.user_id === user.id) {
          return { ...n, is_read: true };
        }
      }
      return n;
    });

    this.saveStoredNotifications(updated);
  }

  // Delete notification
  public deleteNotification(notificationId: string): void {
    const all = this.getStoredNotifications();
    const filtered = all.filter((n) => n.id !== notificationId);
    this.saveStoredNotifications(filtered);
  }

  // Add a notification with duplicate prevention
  public addNotification(
    data: Omit<AppNotification, 'id' | 'created_at' | 'is_read'>
  ): AppNotification | null {
    const all = this.getStoredNotifications();

    // Duplicate prevention: check if identical notification was created within last 10 minutes
    const tenMinutesAgo = Date.now() - 10 * 60000;
    const isDuplicate = all.some((n) => {
      const isSameUser = n.user_id === data.user_id;
      const isSameType = n.type === data.type;
      const isSameResource = n.related_id && data.related_id ? n.related_id === data.related_id : true;
      const isRecent = new Date(n.created_at).getTime() > tenMinutesAgo;
      return isSameUser && isSameType && isSameResource && isRecent;
    });

    if (isDuplicate) {
      return null;
    }

    const newNotif: AppNotification = {
      ...data,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    all.unshift(newNotif);
    // Keep max 500 notifications in storage
    const trimmed = all.slice(0, 500);
    this.saveStoredNotifications(trimmed);
    return newNotif;
  }

  // ==========================================
  // DOMAIN DISPATCH EVENT HELPERS
  // ==========================================

  // 1. Doubt Answered -> Notify Student
  public notifyDoubtAnswered(
    studentId: string,
    doubtId: string,
    doubtTitle: string,
    authorName: string
  ): void {
    this.addNotification({
      user_id: studentId,
      recipient_role: 'student',
      type: 'DOUBT_ANSWERED',
      title: 'Your doubt was answered',
      message: `${authorName} posted an answer to your doubt "${doubtTitle}".`,
      related_type: 'doubt',
      related_id: doubtId,
      metadata: { doubtTitle, authorName },
    });
  }

  // 2. Answer Accepted -> Notify Answer Author
  public notifyAnswerAccepted(
    authorId: string,
    doubtId: string,
    doubtTitle: string
  ): void {
    this.addNotification({
      user_id: authorId,
      recipient_role: 'student',
      type: 'ANSWER_ACCEPTED',
      title: 'Your answer was accepted',
      message: `Your answer on "${doubtTitle}" was marked as the accepted solution!`,
      related_type: 'doubt',
      related_id: doubtId,
      metadata: { doubtTitle },
    });
  }

  // 3. Doubt Resolved -> Notify Student
  public notifyDoubtResolved(
    studentId: string,
    doubtId: string,
    doubtTitle: string
  ): void {
    this.addNotification({
      user_id: studentId,
      recipient_role: 'student',
      type: 'DOUBT_RESOLVED',
      title: 'Your doubt was marked resolved',
      message: `Your doubt "${doubtTitle}" has been resolved.`,
      related_type: 'doubt',
      related_id: doubtId,
      metadata: { doubtTitle },
    });
  }

  // 4. Doubt Closed by Admin -> Notify Student
  public notifyDoubtClosed(
    studentId: string,
    doubtId: string,
    doubtTitle: string,
    reason?: string
  ): void {
    this.addNotification({
      user_id: studentId,
      recipient_role: 'student',
      type: 'DOUBT_CLOSED',
      title: 'Your doubt was closed by an Admin',
      message: `Your doubt "${doubtTitle}" was closed${reason ? `: ${reason}` : '.'}`,
      related_type: 'doubt',
      related_id: doubtId,
      metadata: { doubtTitle, reason },
    });
  }

  // 5. New Doubt Created -> Notify Admins
  public notifyNewDoubtForAdmins(
    doubtId: string,
    doubtTitle: string,
    studentName: string,
    subjectName: string
  ): void {
    this.addNotification({
      user_id: 'admin',
      recipient_role: 'admin',
      type: 'NEW_DOUBT',
      title: 'New doubt requires attention',
      message: `${studentName} asked "${doubtTitle}" in ${subjectName}.`,
      related_type: 'doubt',
      related_id: doubtId,
      metadata: { doubtTitle, studentName, subject: subjectName },
    });
  }

  // 6. Doubt Reported -> Notify Admins
  public notifyDoubtReportedForAdmins(
    reportId: string,
    doubtId: string,
    doubtTitle: string,
    reason: string
  ): void {
    this.addNotification({
      user_id: 'admin',
      recipient_role: 'admin',
      type: 'DOUBT_REPORTED',
      title: 'New doubt report submitted',
      message: `A question "${doubtTitle}" was reported for "${reason}". Requires review.`,
      related_type: 'report',
      related_id: reportId,
      metadata: { doubtId, doubtTitle, reason },
    });
  }

  // 7. Live Session Scheduled -> Broadcast to Students interested
  public notifySessionScheduled(
    sessionId: string,
    sessionTitle: string,
    subject?: string
  ): void {
    // Notify demo active students
    const targetStudents = ['user-student-aryan', 'user-student-priya', 'user-student-aditi'];
    targetStudents.forEach((studentId) => {
      this.addNotification({
        user_id: studentId,
        recipient_role: 'student',
        type: 'SESSION_SCHEDULED',
        title: 'A new live session has been scheduled',
        message: `"${sessionTitle}"${subject ? ` (${subject})` : ''} is scheduled. Add to your learning plan.`,
        related_type: 'live_session',
        related_id: sessionId,
        metadata: { sessionTitle, subject },
      });
    });
  }

  public notifySessionStarting(
    sessionId: string,
    sessionTitle: string,
    hostName?: string
  ): void {
    const targetStudents = ['user-student-aryan', 'user-student-priya', 'user-student-aditi'];
    targetStudents.forEach((studentId) => {
      this.addNotification({
        user_id: studentId,
        recipient_role: 'student',
        type: 'SESSION_STARTING',
        title: 'Your live session is starting',
        message: `"${sessionTitle}" hosted by ${hostName || 'Educator'} is now live and streaming!`,
        related_type: 'live_session',
        related_id: sessionId,
        metadata: { sessionTitle, hostName },
      });
    });
  }

  public notifySessionLive(
    sessionId: string,
    sessionTitle: string,
    subject?: string
  ): void {
    const targetStudents = ['user-student-aryan', 'user-student-priya', 'user-student-aditi'];
    targetStudents.forEach((studentId) => {
      this.addNotification({
        user_id: studentId,
        recipient_role: 'student',
        type: 'SESSION_LIVE',
        title: 'A live session is streaming',
        message: `"${sessionTitle}"${subject ? ` (${subject})` : ''} is currently live. Join now to participate in Q&A.`,
        related_type: 'live_session',
        related_id: sessionId,
        metadata: { sessionTitle, subject },
      });
    });
  }

  // 8. Study Material Published -> Broadcast to Students
  public notifyNewStudyMaterial(
    materialId: string,
    materialTitle: string,
    subject: string
  ): void {
    // Notify demo active students
    const targetStudents = ['user-student-aryan', 'user-student-priya', 'user-student-aditi', 'user-student-rohit'];
    targetStudents.forEach((studentId) => {
      this.addNotification({
        user_id: studentId,
        recipient_role: 'student',
        type: 'NEW_STUDY_MATERIAL',
        title: 'New study material has been published',
        message: `"${materialTitle}" is now available in ${subject}.`,
        related_type: 'material',
        related_id: materialId,
        metadata: { materialTitle, subject },
      });
    });

    // Notify admin
    this.addNotification({
      user_id: 'admin',
      recipient_role: 'admin',
      type: 'MATERIAL_PUBLISHED',
      title: 'Study material was published',
      message: `"${materialTitle}" (${subject}) has been published to the student explore library.`,
      related_type: 'material',
      related_id: materialId,
      metadata: { materialTitle, subject },
    });
  }

  // 9. Student Registered -> Notify Admins
  public notifyStudentRegistered(
    studentId: string,
    studentName: string,
    studentEmail: string
  ): void {
    this.addNotification({
      user_id: 'admin',
      recipient_role: 'admin',
      type: 'STUDENT_REGISTERED',
      title: 'New student registered',
      message: `${studentName} (${studentEmail}) registered on YuvaSetu.`,
      related_type: 'student',
      related_id: studentId,
      metadata: { studentName, studentEmail },
    });
  }

  // 10. Student Deactivated / Activated -> Notify Student & Admins
  public notifyStudentStatusChanged(
    studentId: string,
    studentName: string,
    status: 'ACTIVE' | 'DEACTIVATED'
  ): void {
    if (status === 'DEACTIVATED') {
      this.addNotification({
        user_id: studentId,
        recipient_role: 'student',
        type: 'STUDENT_DEACTIVATED',
        title: 'Your account was deactivated',
        message: 'Your YuvaSetu student access was suspended. Please contact platform administration.',
        related_type: 'account',
        related_id: studentId,
      });

      this.addNotification({
        user_id: 'admin',
        recipient_role: 'admin',
        type: 'STUDENT_DEACTIVATED',
        title: 'Student account was deactivated',
        message: `Student account for ${studentName} was set to deactivated.`,
        related_type: 'student',
        related_id: studentId,
        metadata: { studentName },
      });
    } else {
      this.addNotification({
        user_id: studentId,
        recipient_role: 'student',
        type: 'ACCOUNT_UPDATED',
        title: 'Your account was updated',
        message: 'Your YuvaSetu student account has been reactivated.',
        related_type: 'account',
        related_id: studentId,
      });
    }
  }

  // ==========================================
  // MODULE 9: COMMUNITY NOTIFICATIONS
  // ==========================================

  // 11. Community Discussion Replied -> Notify Author & Participants
  public notifyCommunityReplied(
    authorId: string,
    discussionId: string,
    discussionTitle: string,
    replierName: string
  ): void {
    this.addNotification({
      user_id: authorId,
      recipient_role: 'student',
      type: 'DISCUSSION_REPLIED',
      title: 'New reply on your discussion',
      message: `${replierName} replied to your discussion "${discussionTitle}".`,
      related_type: 'community_discussion',
      related_id: discussionId,
      metadata: { discussionTitle, replierName },
    });
  }

  // 12. Community Reply Marked Accepted -> Notify Reply Author
  public notifyCommunityReplyAccepted(
    replierId: string,
    discussionId: string,
    discussionTitle: string
  ): void {
    this.addNotification({
      user_id: replierId,
      recipient_role: 'student',
      type: 'REPLY_ACCEPTED',
      title: 'Your reply was marked as accepted answer',
      message: `Your answer on "${discussionTitle}" was marked as the accepted solution!`,
      related_type: 'community_discussion',
      related_id: discussionId,
      metadata: { discussionTitle },
    });
  }

  // 13. Discussion Marked Helpful -> Notify Author
  public notifyCommunityHelpful(
    authorId: string,
    discussionId: string,
    discussionTitle: string,
    likerName: string
  ): void {
    this.addNotification({
      user_id: authorId,
      recipient_role: 'student',
      type: 'DISCUSSION_HELPFUL',
      title: 'Someone found your discussion helpful',
      message: `${likerName} found your academic post "${discussionTitle}" helpful.`,
      related_type: 'community_discussion',
      related_id: discussionId,
      metadata: { discussionTitle, likerName },
    });
  }

  // 14. Discussion Reported -> Notify Admins
  public notifyCommunityReportedForAdmins(
    reportId: string,
    discussionId: string,
    discussionTitle: string,
    reason: string
  ): void {
    this.addNotification({
      user_id: 'admin',
      recipient_role: 'admin',
      type: 'DISCUSSION_REPORTED',
      title: 'Community discussion reported',
      message: `Discussion "${discussionTitle}" was flagged for "${reason}". Requires moderation review.`,
      related_type: 'report',
      related_id: reportId,
      metadata: { discussionId, discussionTitle, reason },
    });
  }

  // 15. Discussion Moderated -> Notify Author
  public notifyCommunityModerated(
    authorId: string,
    discussionId: string,
    discussionTitle: string,
    action: string,
    reason?: string
  ): void {
    this.addNotification({
      user_id: authorId,
      recipient_role: 'student',
      type: 'DISCUSSION_MODERATED',
      title: `Your discussion was ${action}`,
      message: `Your discussion "${discussionTitle}" was ${action} by an Admin${reason ? `: ${reason}` : '.'}`,
      related_type: 'community_discussion',
      related_id: discussionId,
      metadata: { discussionTitle, action, reason },
    });
  }

  // ==========================================
  // NOTIFICATION PREFERENCES
  // ==========================================

  public getUserPreferences(userId: string, role: 'student' | 'admin'): NotificationPreference[] {
    try {
      const data = localStorage.getItem(`${PREFERENCES_STORAGE_KEY}_${userId}`);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }

    const defaults = role === 'admin' ? DEFAULT_ADMIN_PREFERENCES : DEFAULT_STUDENT_PREFERENCES;
    const userDefaults = defaults.map((d) => ({
      ...d,
      id: `pref-${userId}-${d.category}`,
      user_id: userId,
    }));

    try {
      localStorage.setItem(`${PREFERENCES_STORAGE_KEY}_${userId}`, JSON.stringify(userDefaults));
    } catch {
      // ignore
    }

    return userDefaults;
  }

  public updatePreference(
    userId: string,
    role: 'student' | 'admin',
    category: NotificationCategory,
    enabled: boolean
  ): NotificationPreference[] {
    const current = this.getUserPreferences(userId, role);
    const updated = current.map((p) =>
      p.category === category ? { ...p, enabled, updated_at: new Date().toISOString() } : p
    );

    try {
      localStorage.setItem(`${PREFERENCES_STORAGE_KEY}_${userId}`, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update preference', e);
    }

    return updated;
  }

  // ==========================================
  // TOKEN & REWARD NOTIFICATIONS
  // ==========================================

  public notifyTokenCredited(userId: string, amount: number, reason: string): AppNotification | null {
    return this.addNotification({
      user_id: userId,
      recipient_role: 'student',
      type: 'TOKEN_CREDITED',
      title: `${amount} VidyaTokens added to your wallet`,
      message: `${amount} VT have been credited to your YuvaSetu wallet for: ${reason}.`,
      related_type: 'token_wallet',
      metadata: {
        amount,
        reason,
      },
    });
  }

  public notifyTokenSpent(userId: string, amount: number, resourceTitle: string): AppNotification | null {
    return this.addNotification({
      user_id: userId,
      recipient_role: 'student',
      type: 'TOKEN_SPENT',
      title: `You unlocked ${resourceTitle}`,
      message: `You spent ${amount} VT to unlock "${resourceTitle}". It is now permanently accessible in your account.`,
      related_type: 'material',
      metadata: {
        amount,
        resourceTitle,
      },
    });
  }

  public notifyRewardApproved(userId: string, amount: number, rewardTitle: string): AppNotification | null {
    return this.addNotification({
      user_id: userId,
      recipient_role: 'student',
      type: 'REWARD_APPROVED',
      title: `Contributor reward approved: +${amount} VT`,
      message: `Your community contribution "${rewardTitle}" was verified and approved by the academic team. +${amount} VT added to your balance.`,
      related_type: 'token_reward',
      metadata: {
        amount,
        rewardTitle,
      },
    });
  }

  public notifyRewardRejected(userId: string, rewardTitle: string, reason?: string): AppNotification | null {
    return this.addNotification({
      user_id: userId,
      recipient_role: 'student',
      type: 'REWARD_REJECTED',
      title: `Contributor reward claim update`,
      message: `Your reward submission for "${rewardTitle}" could not be approved.${reason ? ` Note: ${reason}` : ''}`,
      related_type: 'token_reward',
      metadata: {
        rewardTitle,
        reason,
      },
    });
  }

  public notifyPurchaseSuccess(
    userId: string,
    amountPaid: number,
    tokensAdded: number,
    transactionId: string
  ): AppNotification | null {
    return this.addNotification({
      user_id: userId,
      recipient_role: 'student',
      type: 'PURCHASE_SUCCESS',
      title: `Token purchase verified: +${tokensAdded} VT`,
      message: `Payment of ₹${amountPaid} verified successfully. ${tokensAdded} VidyaTokens have been credited to your wallet (Ref: ${transactionId}).`,
      related_type: 'token_transaction',
      metadata: {
        amountPaid,
        tokensAdded,
        transactionId,
      },
    });
  }

  public notifyRefundProcessed(
    userId: string,
    tokensRestored: number,
    reason?: string
  ): AppNotification | null {
    return this.addNotification({
      user_id: userId,
      recipient_role: 'student',
      type: 'REFUND_PROCESSED',
      title: `Refund processed: +${tokensRestored} VT`,
      message: `A refund of ${tokensRestored} VidyaTokens has been processed back into your wallet.${reason ? ` Reason: ${reason}` : ''}`,
      related_type: 'token_wallet',
      metadata: {
        tokensRestored,
        reason,
      },
    });
  }
}

export const notificationService = new NotificationService();
