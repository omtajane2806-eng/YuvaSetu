import {
  DateRangeFilter,
  DateRangePreset,
  PlatformOverviewMetrics,
  StudentGrowthPoint,
  ActivityCategoryBreakdown,
  ActivityTrendPoint,
  MaterialPopularityItem,
  SubjectAnalyticsItem,
  VideoAnalyticsSummary,
  LiveSessionAnalyticsItem,
  StudyRoomAnalyticsItem,
  DoubtSubjectAnalyticsItem,
  AdminActivityCountItem,
  StudentEngagementItem,
  ReportFilterOptions,
} from '../types/analytics';
import { authService } from './authService';
import { activityService } from './activityService';
import { contentService } from './contentService';
import { sessionRoomService } from './sessionRoomService';
import { doubtService } from './doubtService';
import { ActivityEvent } from '../types/activity';
import { User } from '../types/user';

class AnalyticsService {
  /**
   * Resolve DateRangeFilter to concrete start and end Date objects
   */
  public getDateWindow(filter: DateRangeFilter): { start: Date; end: Date; label: string } {
    const now = new Date();
    const end = new Date(now.getTime());
    let start = new Date(0); // Epoch
    let label = 'All Time';

    switch (filter.preset) {
      case 'today': {
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        label = 'Today';
        break;
      }
      case '7d': {
        start = new Date(now.getTime() - 7 * 86400000);
        label = 'Last 7 Days';
        break;
      }
      case '30d': {
        start = new Date(now.getTime() - 30 * 86400000);
        label = 'Last 30 Days';
        break;
      }
      case '90d': {
        start = new Date(now.getTime() - 90 * 86400000);
        label = 'Last 90 Days';
        break;
      }
      case 'all': {
        start = new Date(2023, 0, 1);
        label = 'All Time';
        break;
      }
      case 'custom': {
        if (filter.startDate) {
          start = new Date(filter.startDate);
          start.setHours(0, 0, 0, 0);
        } else {
          start = new Date(now.getTime() - 30 * 86400000);
        }
        if (filter.endDate) {
          end.setTime(new Date(filter.endDate).getTime());
          end.setHours(23, 59, 59, 999);
        }
        label = `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
        break;
      }
      default:
        start = new Date(now.getTime() - 30 * 86400000);
        label = 'Last 30 Days';
    }

    return { start, end, label };
  }

  /**
   * Filter an array of items by date range
   */
  private filterByDate<T extends { created_at?: string; createdAt?: string; joinedAt?: string }>(
    items: T[],
    start: Date,
    end: Date
  ): T[] {
    const startTime = start.getTime();
    const endTime = end.getTime();
    return items.filter((item) => {
      const dateStr = item.created_at || item.createdAt || item.joinedAt;
      if (!dateStr) return true;
      const t = new Date(dateStr).getTime();
      return !isNaN(t) && t >= startTime && t <= endTime;
    });
  }

  /**
   * Get filtered Activity Events within the date window
   */
  public getFilteredEvents(filter: DateRangeFilter): ActivityEvent[] {
    const { start, end } = this.getDateWindow(filter);
    const allEvents = activityService.getAllEvents(3000);
    return this.filterByDate(allEvents, start, end);
  }

  /**
   * PLATFORM OVERVIEW METRICS
   * Real calculated metrics strictly based on existing data models and events.
   */
  public getPlatformOverview(filter: DateRangeFilter): PlatformOverviewMetrics {
    const { start, end } = this.getDateWindow(filter);
    const allStudents = authService.getStudents();
    const filteredEvents = this.getFilteredEvents(filter);

    // Students registered in date range
    const newStudents = allStudents.filter((s) => {
      if (!s.createdAt) return false;
      const t = new Date(s.createdAt).getTime();
      return t >= start.getTime() && t <= end.getTime();
    }).length;

    // Active students: students who had at least 1 meaningful tracked event in range
    const activeStudentIds = new Set(
      filteredEvents
        .filter((e) => e.user_id && e.user_id !== 'admin' && !e.user_id.startsWith('user-admin'))
        .map((e) => e.user_id)
    );
    const activeStudents = activeStudentIds.size;
    const inactiveStudents = Math.max(0, allStudents.length - activeStudents);

    // Study Materials
    const allMaterials = contentService.getAllContent(true);
    const publishedMaterials = allMaterials.filter((m) => m.status === 'published').length;
    const draftMaterials = allMaterials.filter((m) => m.status === 'draft').length;

    // Real event counts in date window
    const totalPdfDownloads = filteredEvents.filter((e) => e.event_type === 'PDF_DOWNLOADED').length;
    const totalMaterialViews = filteredEvents.filter((e) => e.event_type === 'MATERIAL_VIEWED').length;
    const totalMaterialSaves = filteredEvents.filter((e) => e.event_type === 'MATERIAL_SAVED').length;
    const totalMaterialLikes = filteredEvents.filter((e) => e.event_type === 'MATERIAL_LIKED').length;

    // Live Sessions
    const allSessions = sessionRoomService.getLiveSessions(true);
    const filteredSessions = this.filterByDate(allSessions, start, end);
    const scheduledSessions = filteredSessions.filter((s) => s.status === 'SCHEDULED').length;
    const liveSessions = filteredSessions.filter((s) => s.status === 'LIVE').length;
    const endedSessions = filteredSessions.filter((s) => s.status === 'ENDED').length;
    const cancelledSessions = filteredSessions.filter((s) => s.status === 'CANCELLED').length;
    const sessionJoins = filteredEvents.filter((e) => e.event_type === 'LIVE_SESSION_JOINED');
    const totalSessionJoins = sessionJoins.length;
    const uniqueStudentsInSessions = new Set(sessionJoins.map((e) => e.user_id)).size;

    // Study Rooms
    const allRooms = sessionRoomService.getStudyRooms(true);
    const filteredRooms = this.filterByDate(allRooms, start, end);
    const activeStudyRooms = filteredRooms.filter((r) => r.status === 'LIVE' || r.status === 'UPCOMING').length;
    const completedStudyRooms = filteredRooms.filter((r) => r.status === 'ENDED').length;
    const roomJoins = filteredEvents.filter((e) => e.event_type === 'STUDY_ROOM_JOINED');
    const totalStudyRoomJoins = roomJoins.length;
    const uniqueStudentsInRooms = new Set(roomJoins.map((e) => e.user_id)).size;

    // Doubts
    const allDoubts = doubtService.getAllDoubts();
    const filteredDoubts = this.filterByDate(allDoubts, start, end);
    const totalDoubts = filteredDoubts.length;
    const openDoubts = filteredDoubts.filter((d) => d.status === 'OPEN').length;
    const answeredDoubts = filteredDoubts.filter((d) => d.status === 'ANSWERED').length;
    const resolvedDoubts = filteredDoubts.filter((d) => d.status === 'RESOLVED').length;
    const closedDoubts = filteredDoubts.filter((d) => d.status === 'CLOSED').length;

    // Average Doubt Response Time Calculation (in minutes)
    // Only calculated for doubts where DOUBT_CREATED and ANSWER_CREATED timestamps exist
    let totalResponseTimeMs = 0;
    let responsePairsCount = 0;

    filteredDoubts.forEach((doubt) => {
      if (doubt.answers && doubt.answers.length > 0) {
        const doubtCreated = new Date(doubt.created_at).getTime();
        const validAnswers = doubt.answers
          .map((a) => new Date(a.created_at).getTime())
          .filter((t) => !isNaN(t) && t >= doubtCreated)
          .sort((a, b) => a - b);

        if (validAnswers.length > 0) {
          const firstAnswerTime = validAnswers[0];
          totalResponseTimeMs += firstAnswerTime - doubtCreated;
          responsePairsCount += 1;
        }
      }
    });

    const avgDoubtResponseTimeMinutes =
      responsePairsCount > 0 ? Math.round(totalResponseTimeMs / responsePairsCount / 60000) : null;

    return {
      totalStudents: allStudents.length,
      newStudents,
      activeStudents,
      inactiveStudents,
      totalMaterials: allMaterials.length,
      publishedMaterials,
      draftMaterials,
      totalPdfDownloads,
      totalMaterialViews,
      totalMaterialSaves,
      totalMaterialLikes,
      totalLiveSessions: filteredSessions.length,
      scheduledSessions,
      liveSessions,
      endedSessions,
      cancelledSessions,
      totalSessionJoins,
      uniqueStudentsInSessions,
      totalStudyRooms: filteredRooms.length,
      activeStudyRooms,
      completedStudyRooms,
      totalStudyRoomJoins,
      uniqueStudentsInRooms,
      totalDoubts,
      openDoubts,
      answeredDoubts,
      resolvedDoubts,
      closedDoubts,
      avgDoubtResponseTimeMinutes,
    };
  }

  /**
   * STUDENT GROWTH OVER TIME
   */
  public getStudentGrowthData(
    filter: DateRangeFilter,
    granularity: 'daily' | 'weekly' | 'monthly' = 'daily'
  ): StudentGrowthPoint[] {
    const { start, end } = this.getDateWindow(filter);
    const students = authService.getStudents();

    if (students.length === 0) {
      return [];
    }

    // Sort students by creation date
    const sorted = [...students].sort(
      (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
    );

    // Grouping by date buckets
    const bucketMap = new Map<string, { label: string; count: number; date: string }>();

    // Generate intervals
    const current = new Date(start.getTime());
    while (current <= end) {
      let key = current.toISOString().split('T')[0];
      let label = current.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

      if (granularity === 'weekly') {
        const weekNum = Math.ceil(current.getDate() / 7);
        key = `${current.getFullYear()}-W${current.getMonth() + 1}-${weekNum}`;
        label = `Wk ${weekNum}, ${current.toLocaleDateString(undefined, { month: 'short' })}`;
      } else if (granularity === 'monthly') {
        key = `${current.getFullYear()}-${current.getMonth() + 1}`;
        label = current.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
      }

      if (!bucketMap.has(key)) {
        bucketMap.set(key, { label, count: 0, date: current.toISOString() });
      }

      if (granularity === 'daily') {
        current.setDate(current.getDate() + 1);
      } else if (granularity === 'weekly') {
        current.setDate(current.getDate() + 7);
      } else {
        current.setMonth(current.getMonth() + 1);
      }
    }

    // Count registrations
    sorted.forEach((s) => {
      const t = new Date(s.createdAt || 0);
      if (t >= start && t <= end) {
        let key = t.toISOString().split('T')[0];
        if (granularity === 'weekly') {
          const weekNum = Math.ceil(t.getDate() / 7);
          key = `${t.getFullYear()}-W${t.getMonth() + 1}-${weekNum}`;
        } else if (granularity === 'monthly') {
          key = `${t.getFullYear()}-${t.getMonth() + 1}`;
        }

        if (bucketMap.has(key)) {
          const item = bucketMap.get(key)!;
          item.count += 1;
        }
      }
    });

    // Compute cumulative counts
    let runningCumulative = sorted.filter((s) => new Date(s.createdAt || 0) < start).length;
    const result: StudentGrowthPoint[] = [];

    bucketMap.forEach((val) => {
      runningCumulative += val.count;
      result.push({
        date: val.date,
        label: val.label,
        registrations: val.count,
        cumulative: runningCumulative,
      });
    });

    return result;
  }

  /**
   * ACTIVITY CATEGORY BREAKDOWN
   */
  public getActivityCategories(filter: DateRangeFilter): ActivityCategoryBreakdown[] {
    const events = this.getFilteredEvents(filter);

    let contentCount = 0;
    let liveCount = 0;
    let doubtCount = 0;
    let roomCount = 0;
    let adminCount = 0;

    events.forEach((e) => {
      switch (e.event_type) {
        case 'MATERIAL_VIEWED':
        case 'PDF_DOWNLOADED':
        case 'VIDEO_STARTED':
        case 'VIDEO_COMPLETED':
        case 'MATERIAL_SAVED':
        case 'MATERIAL_LIKED':
          contentCount++;
          break;
        case 'LIVE_SESSION_JOINED':
        case 'LIVE_SESSION_LEFT':
          liveCount++;
          break;
        case 'DOUBT_CREATED':
        case 'ANSWER_CREATED':
        case 'DOUBT_RESOLVED':
        case 'ANSWER_ACCEPTED':
          doubtCount++;
          break;
        case 'STUDY_ROOM_JOINED':
        case 'STUDY_ROOM_LEFT':
          roomCount++;
          break;
        case 'USER_REGISTERED':
        case 'STUDENT_ADDED':
        case 'STUDENT_EDITED':
        case 'STUDENT_DEACTIVATED':
        case 'STUDENT_ACTIVATED':
        case 'DOUBT_REPORTED':
          adminCount++;
          break;
        default:
          contentCount++;
      }
    });

    return [
      { category: 'Content Activity', count: contentCount, color: '#06b6d4' }, // Cyan
      { category: 'Live Learning', count: liveCount, color: '#3b82f6' }, // Blue
      { category: 'Doubt Activity', count: doubtCount, color: '#f59e0b' }, // Amber
      { category: 'Study Room Activity', count: roomCount, color: '#a855f7' }, // Purple
      { category: 'Administrative', count: adminCount, color: '#ec4899' }, // Pink
    ];
  }

  /**
   * ACTIVITY TREND OVER TIME
   */
  public getActivityTrend(filter: DateRangeFilter): ActivityTrendPoint[] {
    const { start, end } = this.getDateWindow(filter);
    const events = this.getFilteredEvents(filter);

    const map = new Map<string, ActivityTrendPoint>();
    const current = new Date(start.getTime());

    while (current <= end) {
      const key = current.toISOString().split('T')[0];
      map.set(key, {
        date: key,
        label: current.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        content: 0,
        live: 0,
        doubts: 0,
        rooms: 0,
        total: 0,
      });
      current.setDate(current.getDate() + 1);
    }

    events.forEach((e) => {
      const key = new Date(e.created_at).toISOString().split('T')[0];
      if (map.has(key)) {
        const point = map.get(key)!;
        point.total += 1;
        if (
          e.event_type === 'MATERIAL_VIEWED' ||
          e.event_type === 'PDF_DOWNLOADED' ||
          e.event_type === 'MATERIAL_SAVED' ||
          e.event_type === 'MATERIAL_LIKED' ||
          e.event_type === 'VIDEO_STARTED'
        ) {
          point.content += 1;
        } else if (e.event_type === 'LIVE_SESSION_JOINED' || e.event_type === 'LIVE_SESSION_LEFT') {
          point.live += 1;
        } else if (e.event_type === 'DOUBT_CREATED' || e.event_type === 'ANSWER_CREATED' || e.event_type === 'DOUBT_RESOLVED') {
          point.doubts += 1;
        } else if (e.event_type === 'STUDY_ROOM_JOINED' || e.event_type === 'STUDY_ROOM_LEFT') {
          point.rooms += 1;
        }
      }
    });

    return Array.from(map.values());
  }

  /**
   * STUDY MATERIAL POPULARITY & ENGAGEMENT
   */
  public getMaterialPopularity(filter: DateRangeFilter): {
    mostViewed: MaterialPopularityItem[];
    mostDownloaded: MaterialPopularityItem[];
    mostSaved: MaterialPopularityItem[];
    mostEngaged: MaterialPopularityItem[];
  } {
    const materials = contentService.getAllContent(true);
    const events = this.getFilteredEvents(filter);

    // Compute real metrics per material
    const items: MaterialPopularityItem[] = materials.map((m) => {
      const mEvents = events.filter((e) => e.resource_id === m.id);
      const views = mEvents.filter((e) => e.event_type === 'MATERIAL_VIEWED').length;
      const downloads = mEvents.filter((e) => e.event_type === 'PDF_DOWNLOADED').length;
      const saves = mEvents.filter((e) => e.event_type === 'MATERIAL_SAVED').length;
      const likes = mEvents.filter((e) => e.event_type === 'MATERIAL_LIKED').length;
      const engagementScore = views + downloads + saves + likes;

      return {
        id: m.id,
        title: m.title,
        subject: m.subject_name || 'General',
        contentType: m.content_type || 'note',
        status: m.status,
        views,
        downloads,
        saves,
        likes,
        engagementScore,
        createdAt: m.created_at,
      };
    });

    const mostViewed = [...items].sort((a, b) => b.views - a.views);
    const mostDownloaded = [...items].sort((a, b) => b.downloads - a.downloads);
    const mostSaved = [...items].sort((a, b) => b.saves - a.saves);
    const mostEngaged = [...items].sort((a, b) => b.engagementScore - a.engagementScore);

    return { mostViewed, mostDownloaded, mostSaved, mostEngaged };
  }

  /**
   * SUBJECT ANALYTICS
   */
  public getSubjectAnalytics(filter: DateRangeFilter): SubjectAnalyticsItem[] {
    const events = this.getFilteredEvents(filter);
    const doubts = doubtService.getAllDoubts();
    const { start, end } = this.getDateWindow(filter);
    const filteredDoubts = this.filterByDate(doubts, start, end);

    const subjectMap = new Map<string, SubjectAnalyticsItem>();

    const getOrCreate = (subName: string): SubjectAnalyticsItem => {
      const cleanName = subName.trim();
      if (!subjectMap.has(cleanName)) {
        subjectMap.set(cleanName, {
          subject: cleanName,
          views: 0,
          downloads: 0,
          saves: 0,
          doubts: 0,
          sessionParticipation: 0,
          totalActivity: 0,
        });
      }
      return subjectMap.get(cleanName)!;
    };

    // Events aggregation
    events.forEach((e) => {
      const sub = e.metadata?.subject || 'General Engineering';
      const item = getOrCreate(sub);
      if (e.event_type === 'MATERIAL_VIEWED') {
        item.views += 1;
        item.totalActivity += 1;
      } else if (e.event_type === 'PDF_DOWNLOADED') {
        item.downloads += 1;
        item.totalActivity += 1;
      } else if (e.event_type === 'MATERIAL_SAVED') {
        item.saves += 1;
        item.totalActivity += 1;
      } else if (e.event_type === 'LIVE_SESSION_JOINED' || e.event_type === 'STUDY_ROOM_JOINED') {
        item.sessionParticipation += 1;
        item.totalActivity += 1;
      }
    });

    // Doubts aggregation
    filteredDoubts.forEach((d) => {
      const sub = d.subject_name || 'General';
      const item = getOrCreate(sub);
      item.doubts += 1;
      item.totalActivity += 1;
    });

    return Array.from(subjectMap.values()).sort((a, b) => b.totalActivity - a.totalActivity);
  }

  /**
   * VIDEO ANALYTICS
   */
  public getVideoAnalytics(filter: DateRangeFilter): VideoAnalyticsSummary {
    const events = this.getFilteredEvents(filter);
    const videoStartedEvents = events.filter((e) => e.event_type === 'VIDEO_STARTED');
    const videoCompletedEvents = events.filter((e) => e.event_type === 'VIDEO_COMPLETED');

    const videoCounts = new Map<string, { title: string; subject: string; count: number; duration: string }>();

    videoStartedEvents.forEach((e) => {
      const vidId = e.resource_id;
      if (!videoCounts.has(vidId)) {
        videoCounts.set(vidId, {
          title: e.resource_title || 'Video Lecture',
          subject: e.metadata?.subject || 'Engineering',
          count: 0,
          duration: e.metadata?.duration || '25 mins',
        });
      }
      videoCounts.get(vidId)!.count += 1;
    });

    const mostWatchedVideos = Array.from(videoCounts.entries())
      .map(([id, info]) => ({
        id,
        title: info.title,
        subject: info.subject,
        views: info.count,
        duration: info.duration,
      }))
      .sort((a, b) => b.views - a.views);

    return {
      videosStarted: videoStartedEvents.length,
      videosCompleted: videoCompletedEvents.length,
      totalVideoViews: videoStartedEvents.length,
      isCompletionTrackingAvailable: false, // Per prompt: "Video completion tracking is not available yet."
      mostWatchedVideos,
    };
  }

  /**
   * LIVE LEARNING ANALYTICS
   */
  public getLiveSessionAnalytics(filter: DateRangeFilter): {
    sessions: LiveSessionAnalyticsItem[];
    averageAttendance: number | null;
  } {
    const { start, end } = this.getDateWindow(filter);
    const allSessions = sessionRoomService.getLiveSessions(true);
    const filteredSessions = this.filterByDate(allSessions, start, end);
    const events = this.getFilteredEvents(filter);

    const items: LiveSessionAnalyticsItem[] = filteredSessions.map((s) => {
      const joins = events.filter(
        (e) => e.event_type === 'LIVE_SESSION_JOINED' && e.resource_id === s.id
      ).length;

      return {
        id: s.id,
        title: s.title,
        subject: s.subject,
        date: s.date,
        status: s.status,
        participants: Math.max(s.attendeeCount || 0, joins),
        duration: s.duration,
      };
    });

    items.sort((a, b) => b.participants - a.participants);

    const totalParticipants = items.reduce((acc, curr) => acc + curr.participants, 0);
    const averageAttendance = items.length > 0 ? Math.round(totalParticipants / items.length) : null;

    return { sessions: items, averageAttendance };
  }

  /**
   * STUDY ROOM ANALYTICS
   */
  public getStudyRoomAnalytics(filter: DateRangeFilter): StudyRoomAnalyticsItem[] {
    const { start, end } = this.getDateWindow(filter);
    const allRooms = sessionRoomService.getStudyRooms(true);
    const filteredRooms = this.filterByDate(allRooms, start, end);
    const events = this.getFilteredEvents(filter);

    const items: StudyRoomAnalyticsItem[] = filteredRooms.map((r) => {
      const joins = events.filter(
        (e) => e.event_type === 'STUDY_ROOM_JOINED' && e.resource_id === r.id
      ).length;

      return {
        id: r.id,
        name: r.name,
        subject: r.subject,
        status: r.status,
        participants: Math.max(r.activeParticipants || 0, joins),
        sessionsCount: 1,
        createdAt: r.createdAt,
      };
    });

    return items.sort((a, b) => b.participants - a.participants);
  }

  /**
   * DOUBTS BY SUBJECT
   */
  public getDoubtsBySubject(filter: DateRangeFilter): DoubtSubjectAnalyticsItem[] {
    const { start, end } = this.getDateWindow(filter);
    const doubts = doubtService.getAllDoubts();
    const filtered = this.filterByDate(doubts, start, end);

    const map = new Map<string, { count: number; resolvedCount: number }>();

    filtered.forEach((d) => {
      const sub = d.subject_name || 'General';
      if (!map.has(sub)) {
        map.set(sub, { count: 0, resolvedCount: 0 });
      }
      const item = map.get(sub)!;
      item.count += 1;
      if (d.status === 'RESOLVED') {
        item.resolvedCount += 1;
      }
    });

    return Array.from(map.entries())
      .map(([subject, counts]) => ({
        subject,
        count: counts.count,
        resolvedCount: counts.resolvedCount,
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * ADMIN ACTIVITY AUDIT ANALYTICS
   */
  public getAdminActivityAnalytics(filter: DateRangeFilter): AdminActivityCountItem[] {
    const events = this.getFilteredEvents(filter);
    const materials = contentService.getAllContent(true);
    const rooms = sessionRoomService.getStudyRooms(true);
    const sessions = sessionRoomService.getLiveSessions(true);
    const doubts = doubtService.getAllDoubts();
    const students = authService.getStudents();

    const { start, end } = this.getDateWindow(filter);

    const materialsPublished = this.filterByDate(materials, start, end).filter((m) => m.status === 'published').length;
    const sessionsScheduled = this.filterByDate(sessions, start, end).length;
    const roomsCreated = this.filterByDate(rooms, start, end).length;
    const doubtsAnswered = this.filterByDate(doubts, start, end).filter(
      (d) => d.status === 'ANSWERED' || d.status === 'RESOLVED'
    ).length;
    const studentsAdded = this.filterByDate(students, start, end).length;
    const studentsDeactivated = events.filter((e) => e.event_type === 'STUDENT_DEACTIVATED').length;

    return [
      { actionType: 'MATERIALS_PUBLISHED', description: 'Curated Study Materials Published', count: materialsPublished },
      { actionType: 'SESSIONS_SCHEDULED', description: 'Live Doubt Clearing Sessions Scheduled', count: sessionsScheduled },
      { actionType: 'ROOMS_CREATED', description: 'Focus Study Rooms Provisioned', count: roomsCreated },
      { actionType: 'DOUBTS_ANSWERED', description: 'Academic Doubts Answered by Faculty', count: doubtsAnswered },
      { actionType: 'STUDENTS_ONBOARDED', description: 'Verified Student Profiles Onboarded', count: studentsAdded },
      { actionType: 'STUDENTS_DEACTIVATED', description: 'Account Moderation & Deactivations', count: studentsDeactivated },
    ];
  }

  /**
   * STUDENT ENGAGEMENT RANKINGS
   */
  public getStudentEngagementRankings(filter: DateRangeFilter): StudentEngagementItem[] {
    const students = authService.getStudents();
    const events = this.getFilteredEvents(filter);
    const doubts = doubtService.getAllDoubts();

    const items: StudentEngagementItem[] = students.map((s) => {
      const userEvents = events.filter((e) => e.user_id === s.id);
      const materialsViewed = userEvents.filter((e) => e.event_type === 'MATERIAL_VIEWED').length;
      const downloads = userEvents.filter((e) => e.event_type === 'PDF_DOWNLOADED').length;
      const sessionsJoined = userEvents.filter((e) => e.event_type === 'LIVE_SESSION_JOINED').length;
      const studyRoomsJoined = userEvents.filter((e) => e.event_type === 'STUDY_ROOM_JOINED').length;

      const userDoubts = doubts.filter((d) => d.student_id === s.id);
      const doubtsAsked = userDoubts.length;
      const doubtsResolved = userDoubts.filter((d) => d.status === 'RESOLVED').length;

      const totalActions = materialsViewed + downloads + sessionsJoined + studyRoomsJoined + doubtsAsked;
      const lastActivity = activityService.getLastActivity(s.id);

      return {
        id: s.id,
        name: s.name,
        email: s.email,
        college: s.college || 'Engineering Institute',
        course: s.course || 'B.Tech',
        year: s.year || '2nd Year',
        status: s.status,
        materialsViewed,
        downloads,
        sessionsJoined,
        studyRoomsJoined,
        doubtsAsked,
        doubtsResolved,
        totalActions,
        lastActivity,
        registrationDate: s.createdAt || new Date().toISOString(),
      };
    });

    // Handle ties properly: sort by totalActions desc, then by name asc
    return items.sort((a, b) => {
      if (b.totalActions !== a.totalActions) {
        return b.totalActions - a.totalActions;
      }
      return a.name.localeCompare(b.name);
    });
  }

  /**
   * CSV EXPORTER ENGINE
   */
  public generateCsvContent(headers: string[], rows: (string | number)[][]): string {
    const escapeCell = (cell: string | number | null | undefined): string => {
      if (cell === null || cell === undefined) return '""';
      const str = String(cell).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headerLine = headers.map(escapeCell).join(',');
    const dataLines = rows.map((row) => row.map(escapeCell).join(',')).join('\n');
    return `${headerLine}\n${dataLines}`;
  }

  /**
   * TRIGGER DIRECT CSV DOWNLOAD IN BROWSER
   */
  public downloadCsv(filename: string, csvContent: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const analyticsService = new AnalyticsService();
