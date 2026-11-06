import React, { useState, useEffect } from 'react';
import { YuvaSetuLogo } from '../components/YuvaSetuLogo';
import { UserInitialsBadge } from '../components/UserInitialsBadge';
import { LiveSessionItem, StudyRoomItem, SessionStatus, RoomStatus } from '../types/sessionRoom';
import { sessionRoomService } from '../services/sessionRoomService';
import { User } from '../types/user';
import {
  Video,
  Radio,
  Calendar,
  Clock,
  Users,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Search,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  X,
  Share2,
  AlertCircle,
  Plus,
  Copy,
  Check,
  MessageSquare,
  Volume2,
  VolumeX,
  Flame,
  Send,
  LogOut,
  ChevronLeft,
  Lock,
  Mail,
  User as UserIcon,
  Filter,
} from 'lucide-react';
import { authService, DEFAULT_ADMIN_USERS } from '../services/authService';
import {
  acquireGoogleCalendarAccessToken,
  getStoredGoogleCalendarAccessToken,
  getStoredGoogleCalendarEmail,
} from '../services/firebaseAuth';

export interface LiveSessionsViewProps {
  currentUser: User | null;
  onNavigate: (view: string, payload?: any) => void;
  activeSessionId?: string;
  activeRoomId?: string;
  initialSubTab?: 'live_sessions' | 'study_rooms';
}

export const LiveSessionsView: React.FC<LiveSessionsViewProps> = ({
  currentUser,
  onNavigate,
  activeSessionId,
  activeRoomId,
  initialSubTab = 'live_sessions',
}) => {
  // Top primary navigation tab: Live Sessions OR Virtual Study Rooms
  const [primaryTab, setPrimaryTab] = useState<'live_sessions' | 'study_rooms'>(
    initialSubTab === 'study_rooms' || activeRoomId ? 'study_rooms' : 'live_sessions'
  );

  // =========================================================================
  // LIVE SESSIONS STATE
  // =========================================================================
  const [sessions, setSessions] = useState<LiveSessionItem[]>(() =>
    sessionRoomService.getLiveSessions()
  );
  const [sessionFilter, setSessionFilter] = useState<'LIVE' | 'UPCOMING' | 'PAST'>('LIVE');
  const [selectedSession, setSelectedSession] = useState<LiveSessionItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [meetingError, setMeetingError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Helper to get next hour formatted for time input (future time guarantee)
  const getDefaultTime = () => {
    const d = new Date(Date.now() + 60 * 60 * 1000);
    const hh = String(d.getHours()).padStart(2, '0');
    return `${hh}:00`;
  };

  // Helper to generate genuine Google Meet code format
  const getValidMeetLink = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const randPart = (len: number) =>
      Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `https://meet.google.com/${randPart(3)}-${randPart(4)}-${randPart(3)}`;
  };

  // Create Session Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [newlyCreatedSession, setNewlyCreatedSession] = useState<LiveSessionItem | null>(null);

  // Create Form Inputs
  const [formTitle, setFormTitle] = useState('');
  const [formSubject, setFormSubject] = useState('Computer Science (DSA)');
  const [formTopic, setFormTopic] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formStartTime, setFormStartTime] = useState(getDefaultTime);
  const [formDuration, setFormDuration] = useState('60 mins');
  const [formAudience, setFormAudience] = useState('All YuvaSetu Students');
  const [formMeetingPassword, setFormMeetingPassword] = useState('');
  const [formMeetingUrl, setFormMeetingUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [creationMode, setCreationMode] = useState<'google_auto' | 'manual'>('google_auto');
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const [submittingStatusText, setSubmittingStatusText] = useState('Scheduling Live Session...');
  const [googleConnectedEmail, setGoogleConnectedEmail] = useState<string | null>(() => getStoredGoogleCalendarEmail());
  const [goingLiveSessionId, setGoingLiveSessionId] = useState<string | null>(null);
  const [endingSessionId, setEndingSessionId] = useState<string | null>(null);
  const [cancellingSessionId, setCancellingSessionId] = useState<string | null>(null);

  // =========================================================================
  // STUDY ROOMS STATE (Unified Feature)
  // =========================================================================
  const [rooms, setRooms] = useState<StudyRoomItem[]>(() => sessionRoomService.getStudyRooms());
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(activeRoomId || null);
  const [selectedRoomSubject, setSelectedRoomSubject] = useState<string>('ALL');
  const [roomStatusFilter, setRoomStatusFilter] = useState<'ALL' | RoomStatus>('ALL');
  const [roomSearchQuery, setRoomSearchQuery] = useState('');
  const [isInsideRoom, setIsInsideRoom] = useState<boolean>(!!activeRoomId);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [activeSound, setActiveSound] = useState<'rain' | 'lofi' | 'library' | 'off'>('lofi');
  const [roomNotes, setRoomNotes] = useState(
    '• Focus Sprint Goal: Master QuickSort partition & Binary Search Invariants\n• Key Takeaway: Maintain stable pivots and partition indices\n• Check BST in-order traversal yields strictly sorted sequences.'
  );
  const [chatMessages, setChatMessages] = useState([
    { user: 'Om Tajane', role: 'Admin Host', text: 'Welcome to YuvaSetu Focus Sprint! Let’s crush core concepts together. 🚀', time: '06:00 PM' },
    { user: 'Aryan Sharma', role: 'Student', text: 'Working on Problem #3 from the verified DSA Searching & Sorting notes!', time: '06:05 PM' },
    { user: 'Aditi Sen', role: 'Student', text: 'Binary search lower bound condition makes complete sense now. 💡', time: '06:12 PM' },
  ]);
  const [newChatMsg, setNewChatMsg] = useState('');
  const [isRoomJoined, setIsRoomJoined] = useState(false);

  // Sync data on mount
  useEffect(() => {
    sessionRoomService.syncSessionsFromBackend().then((data) => {
      if (data && data.length > 0) setSessions(data);
    });
    sessionRoomService.syncRoomsFromBackend().then((data) => {
      if (data && data.length > 0) setRooms(data);
    });
  }, []);

  // Handle activeSessionId prop
  useEffect(() => {
    if (activeSessionId) {
      const match = sessionRoomService.getLiveSessionById(activeSessionId);
      if (match) {
        setSelectedSession(match);
        setPrimaryTab('live_sessions');
      }
    }
  }, [activeSessionId]);

  // Handle activeRoomId prop
  useEffect(() => {
    if (activeRoomId) {
      setSelectedRoomId(activeRoomId);
      setIsInsideRoom(true);
      setPrimaryTab('study_rooms');
    }
  }, [activeRoomId]);

  // Pomodoro countdown timer tick
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && secondsRemaining > 0 && isInsideRoom && primaryTab === 'study_rooms') {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining, isInsideRoom, primaryTab]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Live sessions filtering
  const liveSessionsList = sessions.filter((s) => s.status === 'LIVE');
  const upcomingSessionsList = sessions.filter((s) => s.status === 'SCHEDULED');
  const pastSessionsList = sessions.filter((s) => s.status === 'ENDED' || s.status === 'CANCELLED');

  const getDisplayedSessions = () => {
    let currentList =
      sessionFilter === 'LIVE'
        ? liveSessionsList
        : sessionFilter === 'UPCOMING'
        ? upcomingSessionsList
        : pastSessionsList;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      currentList = currentList.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.subject.toLowerCase().includes(q) ||
          (s.topic && s.topic.toLowerCase().includes(q)) ||
          s.hostName.toLowerCase().includes(q)
      );
    }
    return currentList;
  };

  // Study rooms filtering
  const activeRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  useEffect(() => {
    if (currentUser && activeRoom) {
      const participating = sessionRoomService.isStudentParticipating(currentUser.id, activeRoom.id);
      setIsRoomJoined(participating);
    }
  }, [currentUser, activeRoom, selectedRoomId]);

  const studyRoomSubjects = ['ALL', ...Array.from(new Set(rooms.map((r) => r.subject)))];

  const filteredStudyRooms = rooms.filter((r) => {
    const matchSubject = selectedRoomSubject === 'ALL' || r.subject === selectedRoomSubject;
    const matchStatus = roomStatusFilter === 'ALL' || r.status === roomStatusFilter;
    const matchSearch =
      !roomSearchQuery.trim() ||
      r.name.toLowerCase().includes(roomSearchQuery.toLowerCase()) ||
      r.topic.toLowerCase().includes(roomSearchQuery.toLowerCase()) ||
      r.subject.toLowerCase().includes(roomSearchQuery.toLowerCase());
    return matchSubject && matchStatus && matchSearch;
  });

  // =========================================================================
  // HOST & AUDIENCE HELPERS
  // =========================================================================
  const isHostOrAdmin = (session: LiveSessionItem): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    if (session.hostId && session.hostId === currentUser.id) return true;
    if (
      session.hostEmail &&
      currentUser.email &&
      session.hostEmail.trim().toLowerCase() === currentUser.email.trim().toLowerCase()
    ) {
      return true;
    }
    if (currentUser.email === 'omtajane2806@gmail.com') return true;
    return false;
  };

  const isAudienceAllowed = (session: LiveSessionItem): boolean => {
    if (!currentUser) return true;
    if (currentUser.role === 'admin' || isHostOrAdmin(session)) return true;
    const aud = (session.audience || '').toLowerCase();
    if (!aud || aud.includes('all') || aud.includes('students')) return true;
    if (currentUser.year && aud.includes(currentUser.year.toLowerCase())) return true;
    if (currentUser.branch && aud.includes(currentUser.branch.toLowerCase())) return true;
    return true;
  };

  // =========================================================================
  // ACTIONS: JOIN, GO LIVE, END & CANCEL
  // =========================================================================
  const handleHostGoLive = async (session: LiveSessionItem) => {
    if (goingLiveSessionId) return;

    const hostUser = currentUser || authService.getCurrentUser() || DEFAULT_ADMIN_USERS[0];
    if (!isHostOrAdmin(session)) {
      setMeetingError('Only the assigned host or platform admin has authorization to start this live session.');
      return;
    }

    setGoingLiveSessionId(session.id);
    setMeetingError(null);

    try {
      let targetMeetUrl = session.sessionUrl?.trim();
      let targetEventId = session.googleEventId;

      // Check if real Google Meet link is already generated (reuse existing - no duplicate meetings)
      const hasRealMeetUrl =
        targetMeetUrl &&
        targetMeetUrl.startsWith('https://meet.google.com/') &&
        !targetMeetUrl.endsWith('/new');

      if (!hasRealMeetUrl) {
        // Needs Google Calendar authorization to create official conference
        let tokenData;
        try {
          tokenData = await acquireGoogleCalendarAccessToken(false);
          setGoogleConnectedEmail(tokenData.email);
        } catch (authErr: any) {
          console.error('Google Calendar authorization failed on Go Live:', authErr);
          setMeetingError(
            authErr?.message ||
              'Google Calendar access is required to generate the Google Meet room. Please approve permissions when prompted.'
          );
          setGoingLiveSessionId(null);
          return;
        }

        // Call backend to create official Google Meet via Google Calendar API
        const created = await sessionRoomService.createGoogleMeetSessionAsync({
          title: session.title,
          subject: session.subject,
          topic: session.topic || session.subject,
          description: session.description || '',
          hostName: hostUser.name || session.hostName,
          hostEmail: tokenData.email || hostUser.email || session.hostEmail,
          hostId: hostUser.id || session.hostId,
          date: session.date,
          startTime: session.startTime,
          duration: session.duration,
          audience: session.audience,
          googleAccessToken: tokenData.accessToken,
        });

        targetMeetUrl = created.sessionUrl;
        targetEventId = created.googleEventId;
      }

      if (!targetMeetUrl || !targetMeetUrl.startsWith('http')) {
        throw new Error('Valid Google Meet video URL was not found. Cannot launch live session.');
      }

      // Persist LIVE status to SQLite backend
      await sessionRoomService.updateLiveSessionAsync(
        session.id,
        {
          status: 'LIVE',
          sessionUrl: targetMeetUrl,
          googleEventId: targetEventId,
        },
        {
          userId: hostUser.id,
          userRole: hostUser.role,
          userEmail: hostUser.email,
        }
      );

      // Refresh session list from SQLite
      const freshList = await sessionRoomService.syncSessionsFromBackend();
      setSessions(freshList && freshList.length > 0 ? freshList : sessionRoomService.getLiveSessions(true));

      // Update selectedSession if opened
      if (selectedSession && selectedSession.id === session.id) {
        setSelectedSession({
          ...selectedSession,
          status: 'LIVE',
          sessionUrl: targetMeetUrl,
          googleEventId: targetEventId,
        });
      }

      // Launch the genuine Google Meet conference in a new tab for host
      window.open(targetMeetUrl, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      console.error('Failed to go live:', err);
      setMeetingError(err?.message || 'Failed to start live session. Please verify Google Calendar permissions.');
    } finally {
      setGoingLiveSessionId(null);
    }
  };

  const handleHostEndSession = async (session: LiveSessionItem) => {
    if (endingSessionId) return;

    const hostUser = currentUser || authService.getCurrentUser() || DEFAULT_ADMIN_USERS[0];
    if (!isHostOrAdmin(session)) {
      setMeetingError('Only the assigned host or platform admin can end this session.');
      return;
    }

    if (!window.confirm(`Are you sure you want to end "${session.title}"? This marks the session COMPLETED.`)) {
      return;
    }

    setEndingSessionId(session.id);
    try {
      await sessionRoomService.updateLiveSessionAsync(
        session.id,
        { status: 'COMPLETED' },
        {
          userId: hostUser.id,
          userRole: hostUser.role,
          userEmail: hostUser.email,
        }
      );
      const freshList = await sessionRoomService.syncSessionsFromBackend();
      setSessions(freshList && freshList.length > 0 ? freshList : sessionRoomService.getLiveSessions(true));

      if (selectedSession?.id === session.id) {
        setSelectedSession(null);
      }
    } catch (err: any) {
      setMeetingError(err?.message || 'Failed to end live session.');
    } finally {
      setEndingSessionId(null);
    }
  };

  const handleHostCancelSession = async (session: LiveSessionItem) => {
    if (cancellingSessionId) return;

    const hostUser = currentUser || authService.getCurrentUser() || DEFAULT_ADMIN_USERS[0];
    if (!isHostOrAdmin(session)) {
      setMeetingError('Only the assigned host or platform admin can cancel this session.');
      return;
    }

    if (!window.confirm(`Are you sure you want to cancel the scheduled session "${session.title}"?`)) {
      return;
    }

    setCancellingSessionId(session.id);
    try {
      await sessionRoomService.updateLiveSessionAsync(
        session.id,
        { status: 'CANCELLED' },
        {
          userId: hostUser.id,
          userRole: hostUser.role,
          userEmail: hostUser.email,
        }
      );
      const freshList = await sessionRoomService.syncSessionsFromBackend();
      setSessions(freshList && freshList.length > 0 ? freshList : sessionRoomService.getLiveSessions(true));

      if (selectedSession?.id === session.id) {
        setSelectedSession(null);
      }
    } catch (err: any) {
      setMeetingError(err?.message || 'Failed to cancel session.');
    } finally {
      setCancellingSessionId(null);
    }
  };

  const handleJoinLive = (session: LiveSessionItem) => {
    if (!currentUser) {
      onNavigate('login');
      return;
    }

    const url = session.sessionUrl?.trim();
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      setMeetingError('Meeting link is not available yet.');
      setTimeout(() => setMeetingError(null), 4000);
      return;
    }

    // Record student participation
    sessionRoomService.joinTarget(
      {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        college: currentUser.college,
      },
      { sessionId: session.id }
    );

    // Open genuine Google Meet link
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // WhatsApp formatted invitation generator
  const getWhatsAppMessage = (session: LiveSessionItem) => {
    const host = session.hostName || (currentUser?.name || 'YuvaSetu Academic Lead');
    const email = session.hostEmail || (currentUser?.email || 'omtajane2806@gmail.com');
    const topicDisplay = session.topic ? `${session.subject} — ${session.topic}` : session.subject;

    return `🎓 *YuvaSetu Live Session Invitation*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📌 *Title:* ${session.title}\n` +
      `📚 *Subject / Topic:* ${topicDisplay}\n` +
      `👤 *Host:* ${host} (${email})\n` +
      `📅 *Date & Time:* ${session.date} at ${session.startTime}\n` +
      `⏱️ *Duration:* ${session.duration}\n` +
      `👥 *Audience:* ${session.audience || 'All YuvaSetu Students'}\n` +
      `🔗 *Join Google Meet:* ${session.sessionUrl}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `_Shared via YuvaSetu — Samajh Se Safalta Tak_`;
  };

  const handleShareWhatsApp = (session: LiveSessionItem) => {
    const text = getWhatsAppMessage(session);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyInvitation = (session: LiveSessionItem) => {
    const text = getWhatsAppMessage(session);
    navigator.clipboard.writeText(text);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  const handleCopyMeetingLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  // Generate a valid Google Meet link code
  const handleGenerateMeetLink = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const randPart = (len: number) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const code = `${randPart(3)}-${randPart(4)}-${randPart(3)}`;
    setFormMeetingUrl(`https://meet.google.com/${code}`);
    setFormError(null);
  };

  // Open Google Meet instant meeting in new tab
  const handleLaunchGoogleMeetNew = () => {
    window.open('https://meet.google.com/new', '_blank', 'noopener,noreferrer');
  };

  // Connect Google account upfront for seamless meeting creation
  const handleConnectGoogleCalendar = async () => {
    setIsConnectingGoogle(true);
    setFormError(null);
    try {
      const res = await acquireGoogleCalendarAccessToken(true);
      setGoogleConnectedEmail(res.email);
    } catch (err: any) {
      console.error('Google Calendar connection error:', err);
      setFormError(err?.message || 'Google Calendar connection was cancelled or rejected.');
    } finally {
      setIsConnectingGoogle(false);
    }
  };

  // Open Create Session Modal with clean upcoming defaults
  const handleOpenCreateModal = () => {
    setFormError(null);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormStartTime(getDefaultTime());
    setFormMeetingUrl('');
    setGoogleConnectedEmail(getStoredGoogleCalendarEmail());
    setShowCreateModal(true);
  };

  // Submit Live Session Creation Form
  const handleCreateMeetingSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    setFormError(null);

    // Prevent duplicate concurrent requests
    if (isSubmitting) {
      return;
    }

    const hostUser = currentUser || authService.getCurrentUser() || DEFAULT_ADMIN_USERS[0];

    // 1. Required Field Validations
    const trimmedTitle = formTitle.trim();
    if (!trimmedTitle) {
      setFormError('Meeting title is required. Please enter a title for the live session.');
      return;
    }

    const trimmedSubject = formSubject.trim();
    if (!trimmedSubject) {
      setFormError('Subject or topic is required. Please choose a subject.');
      return;
    }

    if (!formDate.trim()) {
      setFormError('Meeting date is required.');
      return;
    }

    if (!formStartTime.trim()) {
      setFormError('Start time is required.');
      return;
    }

    // 2. Validate scheduled date and time is not in past (allow 15-minute buffer)
    const selectedDate = new Date(`${formDate.trim()}T${formStartTime.trim()}:00`);
    const now = new Date();
    if (!isNaN(selectedDate.getTime()) && selectedDate.getTime() < now.getTime() - 15 * 60 * 1000) {
      setFormError('Selected date and time cannot be in the past. Please select an upcoming date and time.');
      return;
    }

    setIsSubmitting(true);

    try {
      const hostName = hostUser.name || 'Om Tajane';
      const hostEmail = hostUser.email || 'omtajane2806@gmail.com';
      const hostId = hostUser.id || 'user-admin-om';

      let newSession: LiveSessionItem;

      if (creationMode === 'google_auto') {
        setSubmittingStatusText('Connecting to Google Calendar & Authorizing...');

        let tokenData;
        try {
          tokenData = await acquireGoogleCalendarAccessToken(false);
          setGoogleConnectedEmail(tokenData.email);
        } catch (authErr: any) {
          console.error('Google Calendar authorization failed:', authErr);
          setFormError(
            authErr?.message ||
              'Google Calendar permission is required to create a Google Meet conference. Please grant access when prompted.'
          );
          setIsSubmitting(false);
          return;
        }

        setSubmittingStatusText('Creating Real Google Meet via Calendar API...');

        newSession = await sessionRoomService.createGoogleMeetSessionAsync({
          title: trimmedTitle,
          subject: trimmedSubject,
          topic: formTopic.trim() || trimmedSubject,
          description: formDescription.trim() || `Live academic session on ${trimmedSubject} hosted by ${hostName}.`,
          hostName,
          hostEmail: tokenData.email || hostEmail,
          hostId,
          date: formDate.trim(),
          startTime: formStartTime.trim(),
          duration: formDuration,
          audience: formAudience,
          meetingPassword: formMeetingPassword.trim() || undefined,
          googleAccessToken: tokenData.accessToken,
        });
      } else {
        // Manual Google Meet URL
        const trimmedUrl = formMeetingUrl.trim();
        if (!trimmedUrl) {
          setFormError(
            'Meeting URL is required in manual mode. Please enter an active Google Meet URL or switch to Automatic Google Meet Creation.'
          );
          setIsSubmitting(false);
          return;
        }

        if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
          setFormError('Meeting URL must begin with https:// or http://.');
          setIsSubmitting(false);
          return;
        }

        if (!trimmedUrl.toLowerCase().includes('meet.google.com') && !trimmedUrl.toLowerCase().includes('google.com')) {
          setFormError('Please enter a valid Google Meet URL (e.g. https://meet.google.com/xxx-yyyy-zzz).');
          setIsSubmitting(false);
          return;
        }

        setSubmittingStatusText('Saving Live Session to Database...');

        newSession = await sessionRoomService.createLiveSessionAsync({
          title: trimmedTitle,
          subject: trimmedSubject,
          topic: formTopic.trim() || trimmedSubject,
          description: formDescription.trim() || `Live academic session on ${trimmedSubject} hosted by ${hostName}.`,
          hostName,
          hostEmail,
          hostId,
          date: formDate.trim(),
          startTime: formStartTime.trim(),
          duration: formDuration,
          audience: formAudience,
          meetingPassword: formMeetingPassword.trim() || undefined,
          sessionUrl: trimmedUrl,
          status: 'SCHEDULED',
          isPublished: true,
          tags: [trimmedSubject, 'Live Class', 'Google Meet'],
        });
      }

      // Update state and sync freshly from SQLite backend
      const freshList = await sessionRoomService.syncSessionsFromBackend();
      if (freshList && freshList.length > 0) {
        setSessions(freshList);
      } else {
        setSessions(sessionRoomService.getLiveSessions(true));
      }

      setNewlyCreatedSession(newSession);
      setShowCreateModal(false);
      setShowSuccessCard(true);

      // Reset form fields
      setFormTitle('');
      setFormTopic('');
      setFormDescription('');
      setFormMeetingPassword('');
      setFormMeetingUrl('');
    } catch (err: any) {
      console.error('Failed to schedule session:', err);
      setFormError(
        err?.message || 'Failed to schedule live session on backend. Please check inputs and Google Calendar authorization.'
      );
    } finally {
      setIsSubmitting(false);
      setSubmittingStatusText('Scheduling Live Session...');
    }
  };

  // Study room inside handlers
  const handleEnterRoom = (room: StudyRoomItem) => {
    setSelectedRoomId(room.id);
    setIsInsideRoom(true);
    if (currentUser && !sessionRoomService.isStudentParticipating(currentUser.id, room.id)) {
      sessionRoomService.joinTarget(
        {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          college: currentUser.college,
        },
        { roomId: room.id }
      );
      setIsRoomJoined(true);
      setRooms(sessionRoomService.getStudyRooms());
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMsg.trim()) return;
    const senderName = currentUser ? currentUser.name : 'Guest Student';
    const senderRole = currentUser?.role === 'admin' ? 'Admin Host' : 'Student';
    setChatMessages((prev) => [
      ...prev,
      {
        user: senderName,
        role: senderRole,
        text: newChatMsg.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setNewChatMsg('');
  };

  return (
    <div id="yuvasetu-live-session-unified-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* 1. TOP HEADER WITH BRAND & CREATE LIVE SESSION BUTTON */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d1428] via-[#090d1c] to-[#1a0f2e] border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <YuvaSetuLogo variant="icon" size="sm" />
            <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
              Live Session
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Radio className="w-3 h-3 text-rose-400 animate-pulse" />
              <span>Real-Time Hub</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Unified live academic center: join real Google Meet classes, interact in collaborative virtual study rooms, and focus with Pomodoro sprints.
          </p>
        </div>

        {/* Action Header Button: Create Live Session */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            id="btn-create-live-session"
            onClick={handleOpenCreateModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-rose-950/50 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Live Session</span>
          </button>
        </div>
      </div>

      {/* 2. UNIFIED TOP SUB-NAV TOGGLE: LIVE SESSIONS vs VIRTUAL STUDY ROOMS */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0c1020] border border-slate-800">
          <button
            id="tab-toggle-live-sessions"
            onClick={() => {
              setPrimaryTab('live_sessions');
              setIsInsideRoom(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              primaryTab === 'live_sessions'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Live & Scheduled Sessions ({sessions.length})</span>
          </button>

          <button
            id="tab-toggle-study-rooms"
            onClick={() => {
              setPrimaryTab('study_rooms');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              primaryTab === 'study_rooms'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Virtual Study Rooms ({rooms.length})</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Samajh Se Safalta Tak</span>
        </div>
      </div>

      {/* Error Banner */}
      {meetingError && (
        <div className="p-4 rounded-2xl bg-amber-950/70 border border-amber-500/60 text-amber-200 text-xs font-bold flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{meetingError}</span>
          </div>
          <button
            onClick={() => setMeetingError(null)}
            className="text-amber-400 hover:text-white text-xs underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* =====================================================================
          TAB 1: LIVE & SCHEDULED SESSIONS VIEW
      ===================================================================== */}
      {primaryTab === 'live_sessions' && (
        <div className="space-y-6">
          {/* Top Live Alert Banner (if any session is LIVE NOW) */}
          {liveSessionsList.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/90 via-[#160b24] to-indigo-950/90 border border-rose-500/50 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-200 text-[10px] font-black uppercase tracking-wider animate-pulse flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                      LIVE NOW ON YUVASETU
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {liveSessionsList[0].subject}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
                    {liveSessionsList[0].title}
                  </h4>
                  <span className="text-xs text-slate-300">
                    Host: <strong className="text-white">{liveSessionsList[0].hostName}</strong> • Audience: {liveSessionsList[0].audience || 'All YuvaSetu Students'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {isHostOrAdmin(liveSessionsList[0]) ? (
                  <>
                    <button
                      onClick={() => handleJoinLive(liveSessionsList[0])}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-rose-950/50 transition-all cursor-pointer"
                    >
                      <Video className="w-4 h-4" />
                      <span>Enter Meet (Host)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={endingSessionId === liveSessionsList[0].id}
                      onClick={() => handleHostEndSession(liveSessionsList[0])}
                      className="px-3 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 border border-rose-500/50 text-rose-200 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                    >
                      End
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleJoinLive(liveSessionsList[0])}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-rose-950/50 transition-all cursor-pointer"
                  >
                    <Radio className="w-4 h-4 animate-pulse" />
                    <span>Join Live Session</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Filter Pills & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0c1020] border border-slate-800 w-full sm:w-auto">
              <button
                onClick={() => setSessionFilter('LIVE')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  sessionFilter === 'LIVE'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-950/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>LIVE NOW ({liveSessionsList.length})</span>
              </button>

              <button
                onClick={() => setSessionFilter('UPCOMING')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  sessionFilter === 'UPCOMING'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>UPCOMING ({upcomingSessionsList.length})</span>
              </button>

              <button
                onClick={() => setSessionFilter('PAST')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  sessionFilter === 'PAST'
                    ? 'bg-slate-800 text-slate-200 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>RECENT / PAST ({pastSessionsList.length})</span>
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search sessions by topic or host..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0c1020] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Sessions Grid */}
          {getDisplayedSessions().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getDisplayedSessions().map((session) => {
                const isLive = session.status === 'LIVE';
                const isUpcoming = session.status === 'SCHEDULED';

                return (
                  <div
                    key={session.id}
                    id={`session-card-${session.id}`}
                    className="p-6 rounded-3xl bg-[#0c1020] hover:bg-[#0f1528] border border-slate-800 hover:border-cyan-500/40 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-5"
                  >
                    <div className="space-y-3">
                      {/* Subject and Status */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold">
                          {session.subject}
                        </span>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                            isLive
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                              : isUpcoming
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {isLive && <Radio className="w-3 h-3" />}
                          <span>{session.status === 'SCHEDULED' ? 'UPCOMING' : session.status}</span>
                        </span>
                      </div>

                      {/* Title & Topic */}
                      <div>
                        <h3 className="text-base font-bold font-['Outfit'] text-white line-clamp-2">
                          {session.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">{session.topic}</p>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {session.description}
                      </p>
                    </div>

                    <div className="space-y-4 pt-3 border-t border-slate-800/80">
                      {/* Host Info & Attendance */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <UserInitialsBadge name={session.hostName} role="admin" size="xs" />
                          <div>
                            <span className="text-[10px] text-slate-500 block leading-none">Host / Mentor</span>
                            <span className="text-xs font-bold text-slate-200">{session.hostName}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block leading-none">Attendance</span>
                          <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> {session.attendeeCount} Students
                          </span>
                        </div>
                      </div>

                      {/* Date, Time & Duration */}
                      <div className="flex items-center justify-between text-[11px] text-slate-300 bg-slate-950/80 p-2.5 rounded-xl border border-slate-900">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{session.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>{session.startTime} ({session.duration})</span>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          {isLive ? (
                            isHostOrAdmin(session) ? (
                              <>
                                <button
                                  onClick={() => handleJoinLive(session)}
                                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
                                >
                                  <Video className="w-4 h-4" />
                                  <span>Enter Meet (Host)</span>
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                                <button
                                  disabled={endingSessionId === session.id}
                                  onClick={() => handleHostEndSession(session)}
                                  className="px-3 py-3 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 border border-rose-500/50 text-rose-300 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                                  title="End this live session"
                                >
                                  End
                                </button>
                              </>
                            ) : isAudienceAllowed(session) ? (
                              <button
                                onClick={() => handleJoinLive(session)}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
                              >
                                <Radio className="w-4 h-4 animate-pulse" />
                                <span>Join Live (Google Meet)</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            ) : (
                              <button
                                disabled
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-xs font-bold cursor-not-allowed opacity-75"
                              >
                                <Lock className="w-3.5 h-3.5 text-slate-500" />
                                <span>Audience Restricted</span>
                              </button>
                            )
                          ) : isUpcoming ? (
                            isHostOrAdmin(session) ? (
                              <>
                                <button
                                  disabled={goingLiveSessionId === session.id}
                                  onClick={() => handleHostGoLive(session)}
                                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-rose-950/40 transition-all cursor-pointer disabled:opacity-50"
                                >
                                  {goingLiveSessionId === session.id ? (
                                    <>
                                      <Clock className="w-3.5 h-3.5 animate-spin" />
                                      <span>Launching Meet...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Radio className="w-3.5 h-3.5 text-white" />
                                      <span>Go Live</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => setSelectedSession(session)}
                                  className="px-3 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                                  title="View Details"
                                >
                                  Details
                                </button>
                                <button
                                  disabled={cancellingSessionId === session.id}
                                  onClick={() => handleHostCancelSession(session)}
                                  className="p-3 rounded-xl bg-slate-900/60 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition-all cursor-pointer disabled:opacity-50"
                                  title="Cancel session"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setSelectedSession(session)}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-950/40 transition-all cursor-pointer"
                              >
                                <Clock className="w-4 h-4" />
                                <span>View Details & Meet</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )
                          ) : (
                            <button
                              onClick={() => setSelectedSession(session)}
                              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                            >
                              <span>View Summary</span>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                          )}

                          {/* WhatsApp Quick Share Button */}
                          <button
                            onClick={() => handleShareWhatsApp(session)}
                            title="Share on WhatsApp"
                            className="p-3 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 transition-colors cursor-pointer shrink-0"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-[#0c1020] border border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500">
                <Video className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">No {sessionFilter.toLowerCase()} sessions found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Check back shortly or click &ldquo;Create Live Session&rdquo; above to schedule a new Google Meet lecture.
              </p>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 2: VIRTUAL STUDY ROOMS VIEW (POMODORO FOCUS & PEER ROOMS)
      ===================================================================== */}
      {primaryTab === 'study_rooms' && !isInsideRoom && (
        <div className="space-y-6">
          {/* Study Rooms Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {studyRoomSubjects.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedRoomSubject(sub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedRoomSubject === sub
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/40'
                      : 'bg-[#0c1020] text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search study rooms..."
                value={roomSearchQuery}
                onChange={(e) => setRoomSearchQuery(e.target.value)}
                className="w-full bg-[#0c1020] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Study Rooms Grid */}
          {filteredStudyRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudyRooms.map((room) => {
                const isRoomLive = room.status === 'LIVE';

                return (
                  <div
                    key={room.id}
                    id={`room-card-${room.id}`}
                    className="p-6 rounded-3xl bg-[#0c1020] hover:bg-[#0f1528] border border-slate-800 hover:border-purple-500/40 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-bold">
                          {room.subject}
                        </span>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                            isRoomLive
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          }`}
                        >
                          {isRoomLive && <Radio className="w-3 h-3" />}
                          <span>{room.status}</span>
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold font-['Outfit'] text-white line-clamp-2">
                          {room.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">{room.topic}</p>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {room.description}
                      </p>
                    </div>

                    <div className="space-y-4 pt-3 border-t border-slate-800/80">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                          <UserInitialsBadge name={room.hostName} role="admin" size="xs" />
                          <div>
                            <span className="text-[10px] text-slate-500 block leading-none">Host / Lead</span>
                            <span className="text-xs font-bold text-slate-200">{room.hostName}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block leading-none">Active</span>
                          <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> {room.activeParticipants} Peers
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-300 bg-slate-950/80 p-2.5 rounded-xl border border-slate-900">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{room.startTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-purple-400" />
                          <span>{room.duration}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleEnterRoom(room)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-black shadow-lg shadow-purple-950/40 transition-all cursor-pointer"
                      >
                        <Users className="w-4 h-4" />
                        <span>Enter Study Room</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-[#0c1020] border border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">No study rooms found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try selecting &ldquo;ALL&rdquo; subjects or clearing your search filter.
              </p>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 2 (INSIDE ROOM): FULL POMODORO & COLLABORATIVE WORKSPACE
      ===================================================================== */}
      {primaryTab === 'study_rooms' && isInsideRoom && activeRoom && (
        <div className="space-y-6 animate-fadeIn">
          {/* Room Top Bar */}
          <div className="p-4 rounded-2xl bg-[#0c1020] border border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setIsInsideRoom(false)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Room List</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-rose-500/30 animate-pulse">
                <Radio className="w-3 h-3" /> Live Sprint Room
              </span>
              {activeRoom.liveSessionUrl && (
                <a
                  href={activeRoom.liveSessionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-all"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Open Room Meet</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Pomodoro Timer & Notes */}
            <div className="lg:col-span-8 space-y-6">
              {/* Pomodoro Timer Box */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c1020] to-[#12182e] border border-slate-800 text-center space-y-4 shadow-xl">
                <span className="text-[11px] font-black uppercase text-cyan-400 tracking-wider">
                  Deep Focus Pomodoro Sprint
                </span>
                <div className="text-5xl sm:text-6xl font-black font-mono text-white tracking-widest">
                  {formatTimer(secondsRemaining)}
                </div>

                {/* Timer Controls */}
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black shadow-lg shadow-cyan-950/40 transition-all cursor-pointer"
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isTimerRunning ? 'Pause Sprint' : 'Resume Sprint'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setSecondsRemaining(25 * 60);
                    }}
                    className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Reset to 25 mins"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Ambient Audio Selector */}
                <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[11px]">Ambient Audio:</span>
                  {(['lofi', 'rain', 'library', 'off'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setActiveSound(mode)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        activeSound === mode
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-900 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Collaborative Focus Notes */}
              <div className="p-6 rounded-3xl bg-[#0c1020] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>Personal Sprint Notes & Key Formulas</span>
                  </h3>
                  <span className="text-[10px] text-slate-500">Auto-saved locally</span>
                </div>
                <textarea
                  value={roomNotes}
                  onChange={(e) => setRoomNotes(e.target.value)}
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-cyan-500 font-mono"
                  placeholder="Record algorithms, proofs, or key questions here..."
                />
              </div>
            </div>

            {/* Right: Study Room Chat */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-5 rounded-3xl bg-[#0c1020] border border-slate-800 flex flex-col h-[520px] justify-between space-y-3 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Study Room Chat</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{activeRoom.activeParticipants} Online</span>
                  </span>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white">{msg.user}</span>
                          {msg.role === 'Admin Host' ? (
                            <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[9px] font-black border border-rose-500/30">
                              Host
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 text-[9px]">
                              Student
                            </span>
                          )}
                        </div>
                        <span className="text-slate-500">{msg.time}</span>
                      </div>
                      <p className="text-slate-200 text-xs">{msg.text}</p>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    placeholder="Ask doubt or share progress..."
                    value={newChatMsg}
                    onChange={(e) => setNewChatMsg(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 1: CREATE LIVE SESSION FORM (REQUIREMENT 2 & 3)
      ===================================================================== */}
      {showCreateModal && (
        <div
          id="modal-create-live-session"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="relative w-full max-w-2xl my-8 rounded-3xl bg-[#0c1020] border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-fadeIn">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  <Video className="w-4 h-4" />
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider text-rose-400">
                  Google Meet Integration
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
                Create Live Session
              </h2>
              <p className="text-xs text-slate-400">
                Schedule a real Google Meet lecture, doubt clearing session, or peer revision class.
              </p>
            </div>

            {/* Form Error Notice */}
            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/60 text-rose-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Authenticated Host Auto-Populate Chip */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <UserInitialsBadge name={currentUser?.name || 'Om Tajane'} role={currentUser?.role || 'admin'} size="sm" />
                <div>
                  <span className="text-[10px] text-slate-500 block leading-tight font-bold uppercase">
                    Host (Auto-Populated Profile)
                  </span>
                  <span className="font-bold text-white text-xs">
                    {currentUser?.name || 'Om Tajane'}
                  </span>
                  <span className="text-slate-400 text-[11px] block">
                    {currentUser?.email || 'omtajane2806@gmail.com'}
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Host
              </span>
            </div>

            <form id="form-create-live-session" noValidate onSubmit={handleCreateMeetingSubmit} className="space-y-4 text-xs">
              {/* Meeting Title */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">
                  Meeting Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. DSA QuickSort Partition & Master Theorem Proofs"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Subject & Topic Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">
                    Subject <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Computer Science (DSA)">Computer Science (DSA)</option>
                    <option value="Database Management Systems">Database Management Systems</option>
                    <option value="Operating Systems">Operating Systems</option>
                    <option value="Computer Networks">Computer Networks</option>
                    <option value="System Design & Architecture">System Design & Architecture</option>
                    <option value="Full Stack Web Development">Full Stack Web Development</option>
                    <option value="GATE CS Theory">GATE CS Theory</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Topic Sub-Heading</label>
                  <input
                    type="text"
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value)}
                    placeholder="e.g. Asymptotic Bounds & Recurrence Trees"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Short Description (Optional)</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={2}
                  placeholder="Summary of concepts covered, prerequisite reading, and target outcomes..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Date, Time, Duration Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">
                    Meeting Date <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">
                    Start Time <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Duration</label>
                  <select
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="30 mins">30 mins</option>
                    <option value="45 mins">45 mins</option>
                    <option value="60 mins">60 mins</option>
                    <option value="90 mins">90 mins</option>
                    <option value="120 mins">120 mins</option>
                  </select>
                </div>
              </div>

              {/* Audience & Optional Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Audience / Target Cohort</label>
                  <select
                    value={formAudience}
                    onChange={(e) => setFormAudience(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="All YuvaSetu Students">All YuvaSetu Students</option>
                    <option value="1st Year Engineering Cohort">1st Year Engineering Cohort</option>
                    <option value="2nd Year Engineering Cohort">2nd Year Engineering Cohort</option>
                    <option value="3rd Year Engineering Cohort">3rd Year Engineering Cohort</option>
                    <option value="Final Year / Placement Sprints">Final Year / Placement Sprints</option>
                    <option value="GATE CS Aspirants">GATE CS Aspirants</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Optional Meeting Password</label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formMeetingPassword}
                      onChange={(e) => setFormMeetingPassword(e.target.value)}
                      placeholder="Only if supported by provider"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Meeting Creation Method Selection */}
              <div className="space-y-2 pt-1">
                <label className="font-bold text-slate-300 block">Meeting Provider & Creation Method</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCreationMode('google_auto');
                      setFormError(null);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1 ${
                      creationMode === 'google_auto'
                        ? 'bg-rose-950/40 border-rose-500/70 shadow-md shadow-rose-950/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-rose-400" />
                        <span>Google Meet (Official API)</span>
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[9px] font-black uppercase border border-emerald-500/30">
                        Recommended
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Creates a verified Google Meet conference directly via Google Calendar API.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCreationMode('manual');
                      setFormError(null);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1 ${
                      creationMode === 'manual'
                        ? 'bg-cyan-950/40 border-cyan-500/70 shadow-md shadow-cyan-950/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white flex items-center gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Custom Meeting URL</span>
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px] font-bold">
                        Manual Link
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Paste an existing Google Meet link you have already generated.
                    </span>
                  </button>
                </div>
              </div>

              {/* Dynamic Provider Details based on mode */}
              {creationMode === 'google_auto' ? (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0d1428] border border-rose-500/30 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-rose-400" />
                      <span className="font-bold text-white text-xs">Official Google Meet Integration</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> OAuth 2.0 Configured
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    YuvaSetu will create a calendar event with a genuine <strong className="text-white">meet.google.com</strong> video conference link on Google Calendar. The actual meeting URL and Google Event ID will be permanently saved to the backend database.
                  </p>

                  <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Google Host Account</span>
                      <span className="font-bold text-slate-200">
                        {googleConnectedEmail || currentUser?.email || 'omtajane2806@gmail.com'}
                      </span>
                      <span className="text-[10px] text-emerald-400 block">
                        Scope: https://www.googleapis.com/auth/calendar.events
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={isConnectingGoogle}
                      onClick={handleConnectGoogleCalendar}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-bold transition-all cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      {isConnectingGoogle ? (
                        <>
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          <span>Authorizing...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{googleConnectedEmail ? 'Re-authorize Account' : 'Connect Google Account'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0d1428] border border-cyan-500/30 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-white text-xs">Manual Google Meet Link</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold">
                      Direct URL Entry
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleLaunchGoogleMeetNew}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Launch Google Meet (New Meeting)</span>
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="font-bold text-slate-300">
                      Google Meet URL <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={formMeetingUrl}
                      onChange={(e) => setFormMeetingUrl(e.target.value)}
                      placeholder="https://meet.google.com/xxx-yyyy-zzz"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    <span className="text-[10px] text-slate-400 block">
                      Must be a valid Google Meet link (e.g. https://meet.google.com/abc-defg-hij).
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Buttons & Error Notification */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                {formError && (
                  <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/70 text-rose-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    id="btn-schedule-live-session"
                    disabled={isSubmitting}
                    onClick={handleCreateMeetingSubmit}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-rose-950/40 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Clock className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>{isSubmitting ? submittingStatusText : 'Schedule Live Session'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: MEETING DETAILS & SUCCESS CARD (REQUIREMENT 4 & 5)
      ===================================================================== */}
      {(showSuccessCard || selectedSession) && (
        <div
          id="modal-meeting-details-card"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          {(() => {
            const currentItem = newlyCreatedSession || selectedSession;
            if (!currentItem) return null;

            return (
              <div className="relative w-full max-w-xl my-8 rounded-3xl bg-[#0c1020] border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-fadeIn">
                <button
                  onClick={() => {
                    setShowSuccessCard(false);
                    setSelectedSession(null);
                    setNewlyCreatedSession(null);
                  }}
                  className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Header Badge */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold">
                      {currentItem.subject}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        currentItem.status === 'LIVE'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                          : currentItem.status === 'SCHEDULED'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {currentItem.status}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
                    {currentItem.title}
                  </h2>
                  <p className="text-xs text-slate-400">{currentItem.topic}</p>
                </div>

                {/* Description */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  {currentItem.description}
                </div>

                {/* Comprehensive Meeting Metadata Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Host info */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">
                      Host Details
                    </span>
                    <div className="flex items-center gap-2 pt-1">
                      <UserInitialsBadge name={currentItem.hostName} role="admin" size="xs" />
                      <div>
                        <span className="font-bold text-white block text-xs">{currentItem.hostName}</span>
                        <span className="text-slate-400 text-[11px] flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span>{currentItem.hostEmail || 'omtajane2806@gmail.com'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">
                      Schedule & Duration
                    </span>
                    <div className="pt-1 space-y-1 text-slate-300 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-semibold text-white">{currentItem.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{currentItem.startTime} ({currentItem.duration})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actual Google Meet Link Container */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-cyan-400" /> Genuine Google Meet Video Link
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> Official Meeting
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300 break-all select-all flex items-center justify-between gap-2">
                    <span className="font-bold">{currentItem.sessionUrl}</span>
                    <button
                      onClick={() => handleCopyMeetingLink(currentItem.sessionUrl)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0 cursor-pointer"
                      title="Copy Link"
                    >
                      {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {currentItem.googleEventId && (
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Calendar className="w-3 h-3 text-cyan-400" /> Google Calendar Event ID:
                      </span>
                      <span className="font-mono text-[10px] text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {currentItem.googleEventId}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons: Go Live, Open Google Meet, End, Cancel, Share on WhatsApp, Copy Invite */}
                <div className="space-y-3 pt-2">
                  {currentItem.status === 'LIVE' ? (
                    isHostOrAdmin(currentItem) ? (
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <button
                          onClick={() => handleJoinLive(currentItem)}
                          className="flex-1 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-rose-950/50 transition-all cursor-pointer"
                        >
                          <Video className="w-4 h-4" />
                          <span>Enter Meet (Host)</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={endingSessionId === currentItem.id}
                          onClick={() => handleHostEndSession(currentItem)}
                          className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-rose-950/70 hover:bg-rose-900 border border-rose-500/60 text-rose-200 text-xs font-bold transition-all cursor-pointer disabled:opacity-50 shrink-0"
                        >
                          End Live Session
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleJoinLive(currentItem)}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-rose-950/50 transition-all cursor-pointer"
                      >
                        <Radio className="w-4 h-4 animate-pulse" />
                        <span>Join Live (Google Meet)</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )
                  ) : currentItem.status === 'SCHEDULED' ? (
                    isHostOrAdmin(currentItem) ? (
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <button
                          disabled={goingLiveSessionId === currentItem.id}
                          onClick={() => handleHostGoLive(currentItem)}
                          className="flex-1 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-rose-950/50 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {goingLiveSessionId === currentItem.id ? (
                            <>
                              <Clock className="w-4 h-4 animate-spin" />
                              <span>Launching Google Meet...</span>
                            </>
                          ) : (
                            <>
                              <Radio className="w-4 h-4" />
                              <span>Go Live Now (Launch Google Meet)</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                        <button
                          disabled={cancellingSessionId === currentItem.id}
                          onClick={() => handleHostCancelSession(currentItem)}
                          className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-300 text-xs font-bold transition-all cursor-pointer disabled:opacity-50 shrink-0"
                        >
                          Cancel Session
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleJoinLive(currentItem)}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-black shadow-lg shadow-cyan-950/50 transition-all cursor-pointer"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Join Meeting Room</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )
                  ) : null}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Share on WhatsApp (Requirement 5) */}
                    <button
                      onClick={() => handleShareWhatsApp(currentItem)}
                      className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share on WhatsApp</span>
                    </button>

                    {/* Copy Invitation Button (Requirement 5) */}
                    <button
                      onClick={() => handleCopyInvitation(currentItem)}
                      className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold transition-all cursor-pointer"
                    >
                      {copiedInvite ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">Invitation Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-cyan-400" />
                          <span>Copy Invitation</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
