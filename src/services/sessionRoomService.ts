import {
  StudyRoomItem,
  LiveSessionItem,
  SessionParticipant,
  AppNotification,
  RoomStatus,
  SessionStatus,
} from '../types/sessionRoom';
import { activityService } from './activityService';
import { notificationService } from './notificationService';
import { apiGet, apiPost, apiPut, apiDelete } from './api';

const STUDY_ROOMS_KEY = 'vidyasetu_study_rooms_v4';
const LIVE_SESSIONS_KEY = 'vidyasetu_live_sessions_v4';
const PARTICIPANTS_KEY = 'vidyasetu_session_participants_v4';
const NOTIFICATIONS_KEY = 'vidyasetu_notifications_v4';

const INITIAL_STUDY_ROOMS: StudyRoomItem[] = [
  {
    id: 'room-dsa-sprint-1',
    name: 'DSA Deep Focus: QuickSort Partition & Binary Search Invariants',
    subject: 'Computer Science (DSA)',
    topic: 'Sorting & Searching Masterclass with Real Exam Proofs',
    description:
      'Collaborative deep focus room for solving asymptotic sorting proofs, 3-way Dutch National Flag partition, and lower-bound search problems.',
    hostName: 'Om Tajane',
    hostId: 'user-admin-om',
    scheduledDate: new Date().toISOString().split('T')[0],
    startTime: '06:00 PM',
    duration: '90 mins',
    capacity: 100,
    roomType: 'PUBLIC',
    status: 'LIVE',
    isPublished: true,
    activeParticipants: 42,
    liveSessionUrl: 'https://meet.google.com/vds-dsa-live',
    relatedMaterialId: 'material-dsa-searching-sorting',
    relatedMaterialTitle: 'DSA Searching and Sorting (40-Page Handwritten Notes)',
    tags: ['DSA', 'Searching & Sorting', 'Focus Sprint', 'Admin Curated'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'room-dbms-norm-2',
    name: 'DBMS Normalization & Relational Algebra Sprint',
    subject: 'Database Management Systems',
    topic: '1NF, 2NF, 3NF, BCNF Decomposition & Lossless Joins',
    description:
      'Structured study room covering functional dependency closures, candidate key identification, and canonical cover algorithms.',
    hostName: 'Om Tajane',
    hostId: 'user-admin-om',
    scheduledDate: new Date().toISOString().split('T')[0],
    startTime: '07:30 PM',
    duration: '60 mins',
    capacity: 100,
    roomType: 'PUBLIC',
    status: 'UPCOMING',
    isPublished: true,
    activeParticipants: 19,
    liveSessionUrl: 'https://meet.google.com/vds-dbms-room',
    relatedMaterialId: 'content-dbms-normalization',
    relatedMaterialTitle: 'DBMS Normalization Guide & Cheatsheet',
    tags: ['DBMS', 'Normalization', 'SQL', 'GATE CS'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'room-os-sync-3',
    name: 'Operating Systems: Process Synchronization & Mutex Labs',
    subject: 'Operating Systems',
    topic: 'Semaphores, Dining Philosophers & Deadlock Prevention',
    description:
      'Explore Peterson’s algorithm, test-and-set hardware primitives, condition variables, and Banker’s safe state evaluation.',
    hostName: 'Om Tajane',
    hostId: 'user-admin-om',
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    startTime: '05:00 PM',
    duration: '75 mins',
    capacity: 80,
    roomType: 'PUBLIC',
    status: 'UPCOMING',
    isPublished: true,
    activeParticipants: 14,
    liveSessionUrl: 'https://meet.google.com/vds-os-sync',
    relatedMaterialId: 'content-os-concurrency',
    relatedMaterialTitle: 'OS Concurrency & Synchronization Notes',
    tags: ['OS', 'Concurrency', 'Semaphores', 'Deadlocks'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'room-cn-tcp-4',
    name: 'Computer Networks: TCP Congestion & Window Protocols',
    subject: 'Computer Networks',
    topic: 'AIMD, Slow Start, Reno/Tahoe & 3-Way Handshake',
    description:
      'Analysis of sliding window flow control, sequence numbers, checksum calculations, and TCP teardown states.',
    hostName: 'Om Tajane',
    hostId: 'user-admin-om',
    scheduledDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    startTime: '06:00 PM',
    duration: '60 mins',
    capacity: 100,
    roomType: 'PUBLIC',
    status: 'ENDED',
    isPublished: true,
    activeParticipants: 68,
    liveSessionUrl: '',
    tags: ['Computer Networks', 'TCP/IP', 'Transport Layer'],
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_LIVE_SESSIONS: LiveSessionItem[] = [
  {
    id: 'session-dsa-hashing-live',
    title: 'DSA Live Doubt Session: Hashing Collisions & LRU Cache Design',
    description:
      'Interactive walkthrough of Open Addressing quadratic probing vs Separate Chaining, load factor rehashing thresholds, and rolling hash polynomial modulo.',
    subject: 'Computer Science (DSA)',
    topic: 'Hashing & Hash Tables',
    hostName: 'Om Tajane',
    hostId: 'user-admin-om',
    roomId: 'room-dsa-sprint-1',
    date: 'Today',
    startTime: '06:30 PM',
    duration: '60 mins',
    sessionUrl: 'https://meet.google.com/vds-dsa-live',
    relatedMaterialId: 'material-dsa-hashing',
    relatedMaterialTitle: 'DSA Hashing & Hash Tables (25-Page Handwritten Notes)',
    status: 'LIVE',
    isPublished: true,
    attendeeCount: 58,
    tags: ['DSA', 'Hashing', 'Live Q&A', 'Interview Prep'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'session-dbms-doubt-upcoming',
    title: 'DBMS Normalization Problem Solving & PYQ Walkthrough',
    description:
      'Step-by-step resolution of complex multi-table schemas into BCNF with dependency preservation checks.',
    subject: 'Database Management Systems',
    topic: 'BCNF & Minimal Covers',
    hostName: 'Om Tajane',
    hostId: 'user-admin-om',
    roomId: 'room-dbms-norm-2',
    date: 'Today',
    startTime: '07:30 PM',
    duration: '75 mins',
    sessionUrl: 'https://meet.google.com/vds-dbms-live',
    relatedMaterialId: 'content-dbms-normalization',
    relatedMaterialTitle: 'DBMS Normalization Complete Notes',
    status: 'SCHEDULED',
    isPublished: true,
    attendeeCount: 31,
    tags: ['DBMS', 'Relational Model', 'Live Solving'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'session-os-vm-tomorrow',
    title: 'Virtual Memory & Page Replacement Algorithm Deep Dive',
    description:
      'Calculating effective memory access times with TLB hit ratios, Belady’s anomaly in FIFO, and optimal replacement proofs.',
    subject: 'Operating Systems',
    topic: 'Memory Management & Paging',
    hostName: 'Om Tajane',
    hostId: 'user-admin-om',
    roomId: 'room-os-sync-3',
    date: 'Tomorrow',
    startTime: '05:30 PM',
    duration: '60 mins',
    sessionUrl: 'https://meet.google.com/vds-os-live',
    relatedMaterialId: 'content-os-concurrency',
    relatedMaterialTitle: 'Virtual Memory & Paging Notes',
    status: 'SCHEDULED',
    isPublished: true,
    attendeeCount: 22,
    tags: ['Operating Systems', 'Paging', 'TLB'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'session-dsa-sort-past',
    title: 'Asymptotic Analysis & Sorting Lower Bounds (O(N log N) Proof)',
    description:
      'Decision tree model for comparison-based sorting lower bounds and non-comparison O(N) Radix sort pipelines.',
    subject: 'Computer Science (DSA)',
    topic: 'Searching & Sorting',
    hostName: 'Om Tajane',
    hostId: 'user-admin-om',
    date: 'Yesterday',
    startTime: '07:00 PM',
    duration: '90 mins',
    sessionUrl: '',
    relatedMaterialId: 'material-dsa-searching-sorting',
    relatedMaterialTitle: 'DSA Searching and Sorting Notes (40 Pages)',
    status: 'ENDED',
    isPublished: true,
    attendeeCount: 84,
    tags: ['DSA', 'Sorting', 'Theory'],
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_PARTICIPANTS: SessionParticipant[] = [
  {
    id: 'part-1',
    studentId: 'user-student-aryan',
    studentName: 'Aryan Sharma',
    studentEmail: 'aryan@yuvasetu.com',
    college: 'IIT Bombay',
    roomId: 'room-dsa-sprint-1',
    sessionId: 'session-dsa-hashing-live',
    joinedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    status: 'ACTIVE',
  },
  {
    id: 'part-2',
    studentId: 'user-student-aditi',
    studentName: 'Aditi Sen',
    studentEmail: 'aditi@yuvasetu.com',
    college: 'BITS Pilani',
    roomId: 'room-dsa-sprint-1',
    sessionId: 'session-dsa-hashing-live',
    joinedAt: new Date(Date.now() - 12 * 60000).toISOString(),
    status: 'ACTIVE',
  },
  {
    id: 'part-3',
    studentId: 'user-student-rohit',
    studentName: 'Rohit Kulkarni',
    studentEmail: 'rohit@yuvasetu.com',
    college: 'COEP Pune',
    roomId: 'room-dsa-sprint-1',
    sessionId: 'session-dsa-hashing-live',
    joinedAt: new Date(Date.now() - 8 * 60000).toISOString(),
    status: 'ACTIVE',
  },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Live Now: DSA Hashing & LRU Cache',
    message: 'Om Tajane is hosting a live doubt resolution session right now. Click to join!',
    time: '5 mins ago',
    read: false,
    type: 'session',
    linkView: 'live_sessions',
  },
  {
    id: 'notif-2',
    title: 'Upcoming: DBMS Normalization Sprint',
    message: 'Your enrolled session starts at 07:30 PM today.',
    time: '25 mins ago',
    read: false,
    type: 'session',
    linkView: 'study_rooms',
  },
  {
    id: 'notif-3',
    title: 'Curriculum Update',
    message: 'Verified notes for DSA Searching & Sorting (40 pages) and Hashing (25 pages) are published.',
    time: '2 hours ago',
    read: true,
    type: 'system',
    linkView: 'explore',
  },
];

class SessionRoomService {
  // ===================== STUDY ROOMS =====================
  public getStudyRooms(includeUnpublished = false): StudyRoomItem[] {
    try {
      const data = localStorage.getItem(STUDY_ROOMS_KEY);
      let rooms: StudyRoomItem[] = data ? JSON.parse(data) : [...INITIAL_STUDY_ROOMS];
      if (!data) {
        localStorage.setItem(STUDY_ROOMS_KEY, JSON.stringify(INITIAL_STUDY_ROOMS));
      }
      if (!includeUnpublished) {
        return rooms.filter((r) => r.isPublished);
      }
      return rooms;
    } catch {
      return INITIAL_STUDY_ROOMS;
    }
  }

  public getStudyRoomById(id: string): StudyRoomItem | undefined {
    const rooms = this.getStudyRooms(true);
    return rooms.find((r) => r.id === id);
  }

  public saveStudyRooms(rooms: StudyRoomItem[]): void {
    localStorage.setItem(STUDY_ROOMS_KEY, JSON.stringify(rooms));
  }

  public createStudyRoom(room: Omit<StudyRoomItem, 'id' | 'createdAt' | 'activeParticipants'>): StudyRoomItem {
    const rooms = this.getStudyRooms(true);
    const newRoom: StudyRoomItem = {
      ...room,
      id: `room-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      activeParticipants: 1,
      createdAt: new Date().toISOString(),
    };
    rooms.unshift(newRoom);
    this.saveStudyRooms(rooms);

    // SQLite Backend Sync
    apiPost('/api/rooms', {
      name: newRoom.name,
      subject: newRoom.subject,
      description: newRoom.description,
      roomUrl: newRoom.liveSessionUrl,
      capacity: newRoom.capacity,
      createdBy: newRoom.hostId,
    }).catch((err) => console.warn('SQLite create study room sync:', err?.message));

    return newRoom;
  }

  public updateStudyRoom(id: string, updates: Partial<StudyRoomItem>): StudyRoomItem | null {
    const rooms = this.getStudyRooms(true);
    const idx = rooms.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    rooms[idx] = { ...rooms[idx], ...updates };
    this.saveStudyRooms(rooms);
    return rooms[idx];
  }

  public deleteStudyRoom(id: string): boolean {
    const rooms = this.getStudyRooms(true);
    const filtered = rooms.filter((r) => r.id !== id);
    if (filtered.length !== rooms.length) {
      this.saveStudyRooms(filtered);
      return true;
    }
    return false;
  }

  public setRoomStatus(id: string, status: RoomStatus): StudyRoomItem | null {
    return this.updateStudyRoom(id, { status });
  }

  // Synchronize study rooms from SQLite backend
  public async syncRoomsFromBackend(): Promise<StudyRoomItem[]> {
    try {
      const resp = await apiGet<{ rooms: any[] }>('/api/rooms');
      if (resp && Array.isArray(resp.rooms) && resp.rooms.length > 0) {
        const stored = this.getStudyRooms(true);
        const updated = [...stored];

        for (const r of resp.rooms) {
          const existingIdx = updated.findIndex((x) => x.id === r.id || x.name.toLowerCase() === r.name.toLowerCase());
          const mapped: StudyRoomItem = {
            id: r.id,
            name: r.name,
            subject: r.subject,
            topic: r.subject,
            description: r.description || '',
            hostName: 'YuvaSetu Host',
            hostId: r.createdBy || 'admin',
            scheduledDate: new Date(r.createdAt || Date.now()).toISOString().split('T')[0],
            startTime: '06:00 PM',
            duration: '60 mins',
            capacity: r.capacity || 50,
            roomType: 'PUBLIC',
            status: r.status === 'ACTIVE' ? 'LIVE' : 'UPCOMING',
            isPublished: true,
            activeParticipants: r.currentUsers || 1,
            liveSessionUrl: r.roomUrl || 'https://meet.google.com/new',
            tags: [r.subject, 'Study Room'],
            createdAt: r.createdAt || new Date().toISOString(),
          };

          if (existingIdx !== -1) {
            updated[existingIdx] = { ...updated[existingIdx], ...mapped };
          } else {
            updated.push(mapped);
          }
        }

        this.saveStudyRooms(updated);
        return updated;
      }
    } catch {
      // Return local cache on failure
    }
    return this.getStudyRooms(true);
  }

  // ===================== LIVE SESSIONS =====================
  public getLiveSessions(includeUnpublished = false): LiveSessionItem[] {
    try {
      const data = localStorage.getItem(LIVE_SESSIONS_KEY);
      let sessions: LiveSessionItem[] = data ? JSON.parse(data) : [...INITIAL_LIVE_SESSIONS];
      if (!data) {
        localStorage.setItem(LIVE_SESSIONS_KEY, JSON.stringify(INITIAL_LIVE_SESSIONS));
      }
      if (!includeUnpublished) {
        return sessions.filter((s) => s.isPublished);
      }
      return sessions;
    } catch {
      return INITIAL_LIVE_SESSIONS;
    }
  }

  public getLiveSessionById(id: string): LiveSessionItem | undefined {
    const sessions = this.getLiveSessions(true);
    return sessions.find((s) => s.id === id);
  }

  public saveLiveSessions(sessions: LiveSessionItem[]): void {
    localStorage.setItem(LIVE_SESSIONS_KEY, JSON.stringify(sessions));
  }

  public createLiveSession(
    session: Omit<LiveSessionItem, 'id' | 'createdAt' | 'attendeeCount'>
  ): LiveSessionItem {
    const sessions = this.getLiveSessions(true);
    const newSession: LiveSessionItem = {
      ...session,
      id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      attendeeCount: 1,
      createdAt: new Date().toISOString(),
    };
    sessions.unshift(newSession);
    this.saveLiveSessions(sessions);

    if (newSession.isPublished) {
      notificationService.notifySessionScheduled(
        newSession.id,
        newSession.title,
        newSession.subject
      );
    }

    // SQLite Backend Sync
    const startIso = new Date(`${newSession.date} ${newSession.startTime}`).toISOString();
    const endIso = new Date(new Date(startIso).getTime() + 60 * 60 * 1000).toISOString();

    apiPost('/api/sessions', {
      title: newSession.title,
      subject: newSession.subject,
      description: newSession.description,
      scheduledStart: isNaN(new Date(startIso).getTime()) ? new Date().toISOString() : startIso,
      scheduledEnd: isNaN(new Date(endIso).getTime()) ? new Date(Date.now() + 3600000).toISOString() : endIso,
      platform: 'Google Meet',
      meetingUrl: newSession.sessionUrl,
      createdBy: newSession.hostId,
      instructorName: newSession.hostName,
    }).catch((err) => console.warn('SQLite create live session sync:', err?.message));

    return newSession;
  }

  public updateLiveSession(id: string, updates: Partial<LiveSessionItem>): LiveSessionItem | null {
    const sessions = this.getLiveSessions(true);
    const idx = sessions.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    sessions[idx] = { ...sessions[idx], ...updates };
    this.saveLiveSessions(sessions);

    if (updates.status || updates.title || updates.sessionUrl) {
      apiPut(`/api/sessions/${id}`, {
        status: updates.status === 'LIVE' ? 'LIVE' : updates.status === 'ENDED' ? 'ENDED' : 'SCHEDULED',
        title: updates.title,
        meetingUrl: updates.sessionUrl,
      }).catch((err) => console.warn('SQLite update live session sync:', err?.message));
    }

    return sessions[idx];
  }

  public deleteLiveSession(id: string): boolean {
    const sessions = this.getLiveSessions(true);
    const filtered = sessions.filter((s) => s.id !== id);
    if (filtered.length !== sessions.length) {
      this.saveLiveSessions(filtered);
      return true;
    }
    return false;
  }

  public setSessionStatus(id: string, status: SessionStatus): LiveSessionItem | null {
    const updated = this.updateLiveSession(id, { status });
    if (updated && status === 'LIVE') {
      notificationService.notifySessionStarting(updated.id, updated.title, updated.hostName);
    }
    return updated;
  }

  // Synchronize live sessions from SQLite backend
  public async syncSessionsFromBackend(): Promise<LiveSessionItem[]> {
    try {
      const resp = await apiGet<{ sessions: any[] }>('/api/sessions');
      if (resp && Array.isArray(resp.sessions) && resp.sessions.length > 0) {
        const stored = this.getLiveSessions(true);
        const updated = [...stored];

        for (const s of resp.sessions) {
          const existingIdx = updated.findIndex((x) => x.id === s.id || x.title.toLowerCase() === s.title.toLowerCase());
          const dateObj = new Date(s.scheduledStart || Date.now());
          const mapped: LiveSessionItem = {
            id: s.id,
            title: s.title,
            subject: s.subject,
            topic: s.subject,
            description: s.description || '',
            hostName: s.instructorName || 'Platform Instructor',
            hostId: s.createdBy || 'admin',
            date: isNaN(dateObj.getTime()) ? new Date().toISOString().split('T')[0] : dateObj.toISOString().split('T')[0],
            startTime: isNaN(dateObj.getTime()) ? '07:00 PM' : dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            duration: '60 mins',
            attendeeCount: s.participantCount || 0,
            status: s.status === 'LIVE' ? 'LIVE' : s.status === 'ENDED' ? 'ENDED' : 'SCHEDULED',
            isPublished: true,
            sessionUrl: s.meetingUrl || 'https://meet.google.com/new',
            tags: [s.subject, 'Live Class'],
            createdAt: s.createdAt || new Date().toISOString(),
          };

          if (existingIdx !== -1) {
            updated[existingIdx] = { ...updated[existingIdx], ...mapped };
          } else {
            updated.push(mapped);
          }
        }

        this.saveLiveSessions(updated);
        return updated;
      }
    } catch {
      // Return local cache on failure
    }
    return this.getLiveSessions(true);
  }

  // ===================== PARTICIPATION TRACKING =====================
  public getParticipants(): SessionParticipant[] {
    try {
      const data = localStorage.getItem(PARTICIPANTS_KEY);
      if (!data) {
        localStorage.setItem(PARTICIPANTS_KEY, JSON.stringify(INITIAL_PARTICIPANTS));
        return INITIAL_PARTICIPANTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PARTICIPANTS;
    }
  }

  public getParticipantsForTarget(targetId: string): SessionParticipant[] {
    const all = this.getParticipants();
    return all.filter((p) => (p.roomId === targetId || p.sessionId === targetId) && p.status === 'ACTIVE');
  }

  public isStudentParticipating(studentId: string, targetId: string): boolean {
    const all = this.getParticipants();
    return all.some(
      (p) =>
        p.studentId === studentId &&
        (p.roomId === targetId || p.sessionId === targetId) &&
        p.status === 'ACTIVE'
    );
  }

  public joinTarget(
    student: { id: string; name: string; email: string; college?: string },
    options: { roomId?: string; sessionId?: string }
  ): SessionParticipant {
    const all = this.getParticipants();
    const targetKey = options.roomId ? 'roomId' : 'sessionId';
    const targetVal = options.roomId || options.sessionId;

    // Check if already active
    const existing = all.find(
      (p) =>
        p.studentId === student.id &&
        ((options.roomId && p.roomId === options.roomId) ||
          (options.sessionId && p.sessionId === options.sessionId))
    );

    if (existing) {
      existing.status = 'ACTIVE';
      existing.joinedAt = new Date().toISOString();
      localStorage.setItem(PARTICIPANTS_KEY, JSON.stringify(all));
      return existing;
    }

    const newParticipant: SessionParticipant = {
      id: `part-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      college: student.college,
      roomId: options.roomId,
      sessionId: options.sessionId,
      joinedAt: new Date().toISOString(),
      status: 'ACTIVE',
    };

    all.unshift(newParticipant);
    localStorage.setItem(PARTICIPANTS_KEY, JSON.stringify(all));

    // Increment count on room / session and log activity
    if (options.roomId) {
      const room = this.getStudyRoomById(options.roomId);
      if (room) {
        this.updateStudyRoom(options.roomId, {
          activeParticipants: (room.activeParticipants || 0) + 1,
        });
        activityService.logStudyRoomJoined(
          student.id,
          student.name,
          student.email,
          room.id,
          room.name,
          room.subject
        );
      }
      apiPost(`/api/rooms/${options.roomId}/join`, {
        studentId: student.id,
        studentName: student.name,
        studentEmail: student.email,
        college: student.college,
      }).catch((err) => console.warn('SQLite study room join sync:', err?.message));
    }
    if (options.sessionId) {
      const sess = this.getLiveSessionById(options.sessionId);
      if (sess) {
        this.updateLiveSession(options.sessionId, {
          attendeeCount: (sess.attendeeCount || 0) + 1,
        });
        activityService.logLiveSessionJoined(
          student.id,
          student.name,
          student.email,
          sess.id,
          sess.title,
          sess.subject,
          sess.sessionUrl
        );
      }
      apiPost(`/api/sessions/${options.sessionId}/join`, {
        studentId: student.id,
        studentName: student.name,
        studentEmail: student.email,
        college: student.college,
      }).catch((err) => console.warn('SQLite live session join sync:', err?.message));
    }

    return newParticipant;
  }

  public leaveTarget(studentId: string, options: { roomId?: string; sessionId?: string }): void {
    const all = this.getParticipants();
    let updated = false;

    for (const p of all) {
      if (
        p.studentId === studentId &&
        ((options.roomId && p.roomId === options.roomId) ||
          (options.sessionId && p.sessionId === options.sessionId)) &&
        p.status === 'ACTIVE'
      ) {
        p.status = 'LEFT';
        updated = true;
      }
    }

    if (updated) {
      localStorage.setItem(PARTICIPANTS_KEY, JSON.stringify(all));
      if (options.roomId) {
        const room = this.getStudyRoomById(options.roomId);
        if (room && room.activeParticipants > 0) {
          this.updateStudyRoom(options.roomId, {
            activeParticipants: room.activeParticipants - 1,
          });
        }
      }
      if (options.sessionId) {
        const sess = this.getLiveSessionById(options.sessionId);
        if (sess && sess.attendeeCount > 0) {
          this.updateLiveSession(options.sessionId, {
            attendeeCount: sess.attendeeCount - 1,
          });
        }
      }
    }
  }

  // ===================== NOTIFICATIONS =====================
  public getNotifications(): AppNotification[] {
    try {
      const data = localStorage.getItem(NOTIFICATIONS_KEY);
      if (!data) {
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
        return INITIAL_NOTIFICATIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  }

  public markNotificationAsRead(id: string): void {
    const notifs = this.getNotifications();
    const item = notifs.find((n) => n.id === id);
    if (item) {
      item.read = true;
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
    }
  }

  public markAllNotificationsAsRead(): void {
    const notifs = this.getNotifications();
    notifs.forEach((n) => (n.read = true));
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
  }
}

export const sessionRoomService = new SessionRoomService();
