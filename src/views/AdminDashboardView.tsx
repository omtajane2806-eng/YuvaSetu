import React, { useState, useMemo, useEffect } from 'react';
import { ContentItem, ContentType } from '../types/content';
import { User, AddStudentFormData, EditStudentFormData, EditAdminFormData, CreateAdminFormData } from '../types/user';
import { contentService } from '../services/contentService';
import { authService } from '../services/authService';
import { sessionRoomService } from '../services/sessionRoomService';
import { activityService } from '../services/activityService';
import { notificationService } from '../services/notificationService';
import { StudyRoomItem, LiveSessionItem, RoomStatus, SessionStatus } from '../types/sessionRoom';
import { AdminAddMaterialView } from './AdminAddMaterialView';
import { AdminDoubtManagementView } from './AdminDoubtManagementView';
import { doubtService } from '../services/doubtService';
import { communityService } from '../services/communityService';
import { UserInitialsBadge } from '../components/UserInitialsBadge';
import { AdminMetricsGrid } from '../components/admin/AdminMetricsGrid';
import { StudentListTable } from '../components/admin/StudentListTable';
import { StudentDetailView } from '../components/admin/StudentDetailView';
import { AddStudentModal } from '../components/admin/AddStudentModal';
import { EditStudentModal } from '../components/admin/EditStudentModal';
import { EditAdminModal } from '../components/admin/EditAdminModal';
import { AdminActivityFeed } from '../components/admin/AdminActivityFeed';
import {
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  EyeOff,
  FileCode,
  FileText,
  Video,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Users,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Heart,
  Calendar,
  Clock,
  X,
  ShieldAlert,
  Radio,
  ExternalLink,
  Play,
  Square,
  Filter,
  UserPlus,
  UserCheck,
  Lock,
  Mail,
  Shield,
  Power,
  Layers,
  ArrowRight,
  Download,
  Bookmark,
  HelpCircle,
  Bell,
  Activity,
  CheckCheck,
  BarChart3,
  FileSpreadsheet,
  MessageSquare,
  LogOut,
} from 'lucide-react';

export interface AdminDashboardViewProps {
  onNavigate: (view: string, payload?: any) => void;
  currentUser?: User | null;
  initialTab?:
    | 'overview'
    | 'materials'
    | 'study_rooms'
    | 'live_sessions'
    | 'students'
    | 'admins'
    | 'doubts'
    | 'doubt_reports'
    | 'add_material';
  initialStudentId?: string;
  onLogout?: () => void;
}

const PLATFORM_SUBJECTS = [
  { id: 'cs-dsa', name: 'Computer Science (DSA)' },
  { id: 'dbms', name: 'Database Management Systems' },
  { id: 'os', name: 'Operating Systems' },
  { id: 'cn', name: 'Computer Networks' },
  { id: 'se', name: 'Software Engineering' },
  { id: 'physics', name: 'Physics' },
  { id: 'maths', name: 'Mathematics' },
];

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onNavigate,
  currentUser,
  initialTab = 'overview',
  initialStudentId,
  onLogout,
}) => {
  // Authorization Gate: Verify Admin role and ACTIVE status
  const isAuthorizedAdmin = authService.isAdmin(currentUser);

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'materials'
    | 'study_rooms'
    | 'live_sessions'
    | 'students'
    | 'admins'
    | 'doubts'
    | 'doubt_reports'
    | 'add_material'
  >(initialTab);

  // Selected Student for detailed inspection view
  const [selectedStudent, setSelectedStudent] = useState<User | null>(() => {
    if (initialStudentId) {
      return authService.getUserById(initialStudentId) || null;
    }
    return null;
  });

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (initialStudentId) {
      const student = authService.getUserById(initialStudentId);
      if (student) {
        setSelectedStudent(student);
        setActiveTab('students');
      }
    }
  }, [initialStudentId]);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ===================== DATA STATES =====================
  // Students
  const [students, setStudents] = useState<User[]>(() => authService.getStudents());
  const refreshStudents = () => {
    setStudents(authService.getStudents());
    if (selectedStudent) {
      const updated = authService.getUserById(selectedStudent.id);
      if (updated) setSelectedStudent(updated);
    }
  };

  // Admins
  const [admins, setAdmins] = useState<User[]>(() => authService.getAdmins());
  const refreshAdmins = () => {
    setAdmins(authService.getAdmins());
  };

  // Materials
  const [materials, setMaterials] = useState<ContentItem[]>(() =>
    contentService.getAllContent(true)
  );
  const [editingMaterial, setEditingMaterial] = useState<ContentItem | null>(null);
  const refreshMaterials = () => {
    setMaterials([...contentService.getAllContent(true)]);
  };

  // Study Rooms
  const [studyRooms, setStudyRooms] = useState<StudyRoomItem[]>(() =>
    sessionRoomService.getStudyRooms(true)
  );
  const refreshRooms = () => {
    setStudyRooms([...sessionRoomService.getStudyRooms(true)]);
  };

  // Live Sessions
  const [liveSessions, setLiveSessions] = useState<LiveSessionItem[]>(() =>
    sessionRoomService.getLiveSessions(true)
  );
  const refreshSessions = () => {
    setLiveSessions([...sessionRoomService.getLiveSessions(true)]);
  };

  // Activity stream
  const [activityEvents, setActivityEvents] = useState(() => activityService.getAllEvents());
  const refreshActivity = () => {
    setActivityEvents(activityService.getAllEvents());
  };

  // Filter & Search states for Materials tab
  const [materialSearch, setMaterialSearch] = useState('');
  const [materialSubjectFilter, setMaterialSubjectFilter] = useState('all');
  const [materialTypeFilter, setMaterialTypeFilter] = useState<ContentType | 'all'>('all');
  const [materialStatusFilter, setMaterialStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // ===================== MODAL STATES =====================
  // Student Modals
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<User | null>(null);
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);

  // Admin Modals
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [adminFormData, setAdminFormData] = useState<CreateAdminFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [adminFormError, setAdminFormError] = useState<string | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null);
  const [isEditAdminModalOpen, setIsEditAdminModalOpen] = useState(false);

  // Room Modal
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<StudyRoomItem | null>(null);
  const [roomFormData, setRoomFormData] = useState({
    name: '',
    subject: 'Computer Science (DSA)',
    topic: '',
    description: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    startTime: '06:00 PM',
    duration: '60 mins',
    capacity: 100,
    roomType: 'PUBLIC' as const,
    status: 'UPCOMING' as RoomStatus,
    isPublished: true,
    liveSessionUrl: '',
    tags: 'DSA, Sprint, Study Room',
  });

  // Live Session Modal
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<LiveSessionItem | null>(null);
  const [sessionFormData, setSessionFormData] = useState({
    title: '',
    description: '',
    subject: 'Computer Science (DSA)',
    topic: '',
    date: 'Today',
    startTime: '06:30 PM',
    duration: '60 mins',
    sessionUrl: 'https://meet.google.com/vds-live-room',
    status: 'SCHEDULED' as SessionStatus,
    isPublished: true,
    tags: 'Live Session, Q&A, Doubt Clearing',
  });

  // ===================== REAL-TIME PLATFORM METRICS =====================
  const platformMetrics = useMemo(() => {
    const rawMetrics = activityService.getPlatformActivityMetrics();
    const activeStudents = students.filter((s) => s.status !== 'INACTIVE').length;
    const inactiveStudents = students.filter((s) => s.status === 'INACTIVE').length;
    const activeAdmins = admins.filter((a) => a.status !== 'INACTIVE').length;
    const publishedMaterials = materials.filter((m) => m.status === 'published').length;
    const draftMaterials = materials.filter((m) => m.status === 'draft').length;
    const liveRooms = studyRooms.filter((r) => r.status === 'LIVE').length;
    const upcomingRooms = studyRooms.filter((r) => r.status === 'UPCOMING').length;
    const liveSess = liveSessions.filter((s) => s.status === 'LIVE').length;
    const schedSess = liveSessions.filter((s) => s.status === 'SCHEDULED').length;
    const endedSess = liveSessions.filter((s) => s.status === 'ENDED').length;
    const totalParts = sessionRoomService.getParticipants().length;

    // Calculate total material views across content items
    const totalViews = materials.reduce((acc, curr) => acc + (curr.views || 0), 0) + rawMetrics.totalMaterialViews;

    return {
      totalStudents: students.length,
      activeStudents,
      inactiveStudents,
      totalAdmins: admins.length,
      activeAdmins,
      totalMaterials: materials.length,
      publishedMaterials,
      draftMaterials,
      totalViews,
      totalPdfDownloads: rawMetrics.totalPdfDownloads,
      totalVideosWatched: rawMetrics.totalVideosWatched,
      totalMaterialsSaved: rawMetrics.totalMaterialSaves,
      totalMaterialsLiked: rawMetrics.totalMaterialsLiked,
      totalStudyRooms: studyRooms.length,
      liveStudyRooms: liveRooms,
      upcomingStudyRooms: upcomingRooms,
      totalLiveSessions: liveSessions.length,
      liveSessions: liveSess,
      scheduledLiveSessions: schedSess,
      endedLiveSessions: endedSess,
      totalParticipants: totalParts,
    };
  }, [students, admins, materials, studyRooms, liveSessions, activityEvents]);

  // ===================== STUDENT HANDLERS =====================
  const handleAddStudentSubmit = (data: AddStudentFormData) => {
    const newStudent = authService.addStudent(data);
    refreshStudents();
    refreshActivity();
    showToast(`Student "${newStudent.name}" added successfully.`);
  };

  const handleEditStudentSubmit = (studentId: string, updates: Partial<EditStudentFormData>) => {
    const updated = authService.updateStudent(studentId, updates);
    if (updated) {
      refreshStudents();
      refreshActivity();
      showToast(`Student "${updated.name}" updated successfully.`);
    }
  };

  const handleToggleStudentStatus = (student: User) => {
    const isInactive = student.status === 'INACTIVE';
    const actionText = isInactive ? 'activate' : 'deactivate';

    if (
      window.confirm(
        `Are you sure you want to ${actionText} student account for "${student.name}" (${student.email})?`
      )
    ) {
      if (isInactive) {
        authService.activateStudent(student.id);
        showToast(`Student "${student.name}" is now ACTIVE.`);
      } else {
        authService.deactivateStudent(student.id);
        showToast(`Student "${student.name}" has been DEACTIVATED.`);
      }
      refreshStudents();
      refreshActivity();
    }
  };

  const handleViewStudentDetail = (student: User) => {
    setSelectedStudent(student);
    setActiveTab('students');
  };

  // ===================== ADMIN HANDLERS =====================
  const handleOpenAddAdminModal = () => {
    setAdminFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setAdminFormError(null);
    setIsAddAdminModalOpen(true);
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminFormError(null);

    if (!adminFormData.name.trim()) {
      setAdminFormError('Full Name is required.');
      return;
    }
    if (!adminFormData.email.trim()) {
      setAdminFormError('Email Address is required.');
      return;
    }
    if (!adminFormData.password || adminFormData.password.length < 6) {
      setAdminFormError('Password must be at least 6 characters.');
      return;
    }
    if (adminFormData.password !== adminFormData.confirmPassword) {
      setAdminFormError('Passwords do not match.');
      return;
    }

    try {
      const newAdmin = authService.addAdmin(adminFormData);
      refreshAdmins();
      refreshActivity();
      setIsAddAdminModalOpen(false);
      showToast(`Administrator "${newAdmin.name}" added successfully.`);
    } catch (err: any) {
      setAdminFormError(err.message || 'Failed to add administrator.');
    }
  };

  const handleEditAdminSubmit = (adminId: string, updates: EditAdminFormData) => {
    const updated = authService.editAdmin(adminId, updates);
    if (updated) {
      refreshAdmins();
      refreshActivity();
      showToast(`Administrator "${updated.name}" updated successfully.`);
    }
  };

  const handleToggleAdminStatus = (admin: User) => {
    const nextStatus = admin.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
    const actionText = nextStatus === 'ACTIVE' ? 'activate' : 'deactivate';

    if (
      window.confirm(
        `Are you sure you want to ${actionText} administrator "${admin.name}" (${admin.email})?`
      )
    ) {
      try {
        authService.updateAdminStatus(admin.id, nextStatus);
        refreshAdmins();
        refreshActivity();
        showToast(`Administrator "${admin.name}" status updated to ${nextStatus}.`);
      } catch (err: any) {
        alert(err.message || 'Action failed.');
      }
    }
  };

  // ===================== MATERIAL HANDLERS =====================
  const handleTogglePublishMaterial = (item: ContentItem) => {
    try {
      const res = contentService.adminTogglePublish(item.id);
      refreshMaterials();
      showToast(
        `Material "${res.item.title}" is now ${
          res.status === 'published' ? 'PUBLISHED' : 'DRAFT / UNPUBLISHED'
        }`
      );
    } catch (err: any) {
      alert(err.message || 'Action failed.');
    }
  };

  const handleDeleteMaterial = (item: ContentItem) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete study material "${item.title}"?`
      )
    ) {
      contentService.adminDeleteMaterial(item.id);
      refreshMaterials();
      showToast(`Deleted "${item.title}" from library.`);
    }
  };

  const filteredMaterials = useMemo(() => {
    return materials.filter((item) => {
      if (materialSearch.trim()) {
        const q = materialSearch.toLowerCase();
        const matches =
          item.title.toLowerCase().includes(q) ||
          item.subject_name.toLowerCase().includes(q) ||
          (item.topic && item.topic.toLowerCase().includes(q)) ||
          item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (materialSubjectFilter !== 'all' && item.subject_id !== materialSubjectFilter) {
        return false;
      }
      if (materialTypeFilter !== 'all' && item.content_type !== materialTypeFilter) {
        return false;
      }
      if (materialStatusFilter !== 'all' && item.status !== materialStatusFilter) {
        return false;
      }
      return true;
    });
  }, [materials, materialSearch, materialSubjectFilter, materialTypeFilter, materialStatusFilter]);

  // ===================== ROOM HANDLERS =====================
  const handleOpenRoomModal = (room?: StudyRoomItem) => {
    if (room) {
      setEditingRoom(room);
      setRoomFormData({
        name: room.name,
        subject: room.subject,
        topic: room.topic || '',
        description: room.description || '',
        scheduledDate: room.scheduledDate || new Date().toISOString().split('T')[0],
        startTime: room.startTime || '06:00 PM',
        duration: room.duration || '60 mins',
        capacity: room.capacity || 100,
        roomType: room.roomType || 'PUBLIC',
        status: room.status,
        isPublished: room.isPublished ?? true,
        liveSessionUrl: room.liveSessionUrl || '',
        tags: room.tags ? room.tags.join(', ') : 'DSA, Sprint',
      });
    } else {
      setEditingRoom(null);
      setRoomFormData({
        name: '',
        subject: 'Computer Science (DSA)',
        topic: '',
        description: '',
        scheduledDate: new Date().toISOString().split('T')[0],
        startTime: '06:00 PM',
        duration: '60 mins',
        capacity: 100,
        roomType: 'PUBLIC',
        status: 'UPCOMING',
        isPublished: true,
        liveSessionUrl: '',
        tags: 'DSA, Sprint, Focus Room',
      });
    }
    setIsRoomModalOpen(true);
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomFormData.name.trim()) {
      alert('Room name is required.');
      return;
    }

    const tagsArray = roomFormData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingRoom) {
      sessionRoomService.updateStudyRoom(editingRoom.id, {
        name: roomFormData.name,
        subject: roomFormData.subject,
        topic: roomFormData.topic,
        description: roomFormData.description,
        scheduledDate: roomFormData.scheduledDate,
        startTime: roomFormData.startTime,
        duration: roomFormData.duration,
        capacity: roomFormData.capacity,
        roomType: roomFormData.roomType,
        status: roomFormData.status,
        isPublished: roomFormData.isPublished,
        liveSessionUrl: roomFormData.liveSessionUrl,
        tags: tagsArray,
      });
      showToast(`Updated study room "${roomFormData.name}"`);
    } else {
      sessionRoomService.createStudyRoom({
        name: roomFormData.name,
        subject: roomFormData.subject,
        topic: roomFormData.topic,
        description: roomFormData.description,
        hostName: currentUser?.name || 'Om Tajane',
        hostId: currentUser?.id || 'user-admin-om',
        scheduledDate: roomFormData.scheduledDate,
        startTime: roomFormData.startTime,
        duration: roomFormData.duration,
        capacity: roomFormData.capacity,
        roomType: roomFormData.roomType,
        status: roomFormData.status,
        isPublished: roomFormData.isPublished,
        liveSessionUrl: roomFormData.liveSessionUrl,
        tags: tagsArray,
      });
      showToast(`Created study room "${roomFormData.name}"`);
    }

    refreshRooms();
    setIsRoomModalOpen(false);
  };

  const handleToggleRoomStatus = (room: StudyRoomItem) => {
    const nextStatus: RoomStatus =
      room.status === 'UPCOMING' ? 'LIVE' : room.status === 'LIVE' ? 'ENDED' : 'UPCOMING';
    sessionRoomService.setRoomStatus(room.id, nextStatus);
    refreshRooms();
    showToast(`Study room status changed to ${nextStatus}`);
  };

  const handleDeleteRoom = (room: StudyRoomItem) => {
    if (window.confirm(`Are you sure you want to delete room "${room.name}"?`)) {
      sessionRoomService.deleteStudyRoom(room.id);
      refreshRooms();
      showToast(`Deleted room "${room.name}"`);
    }
  };

  // ===================== LIVE SESSION HANDLERS =====================
  const handleOpenSessionModal = (session?: LiveSessionItem) => {
    if (session) {
      setEditingSession(session);
      setSessionFormData({
        title: session.title,
        description: session.description || '',
        subject: session.subject,
        topic: session.topic || '',
        date: session.date,
        startTime: session.startTime,
        duration: session.duration,
        sessionUrl: session.sessionUrl,
        status: session.status,
        isPublished: session.isPublished ?? true,
        tags: session.tags ? session.tags.join(', ') : 'Live Session, Q&A',
      });
    } else {
      setEditingSession(null);
      setSessionFormData({
        title: '',
        description: '',
        subject: 'Computer Science (DSA)',
        topic: '',
        date: 'Today',
        startTime: '06:30 PM',
        duration: '60 mins',
        sessionUrl: 'https://meet.google.com/vds-live-room',
        status: 'SCHEDULED',
        isPublished: true,
        tags: 'Live Session, Doubt Clearing',
      });
    }
    setIsSessionModalOpen(true);
  };

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionFormData.title.trim()) {
      alert('Session title is required.');
      return;
    }

    const tagsArray = sessionFormData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingSession) {
      sessionRoomService.updateLiveSession(editingSession.id, {
        title: sessionFormData.title,
        description: sessionFormData.description,
        subject: sessionFormData.subject,
        topic: sessionFormData.topic,
        date: sessionFormData.date,
        startTime: sessionFormData.startTime,
        duration: sessionFormData.duration,
        sessionUrl: sessionFormData.sessionUrl,
        status: sessionFormData.status,
        isPublished: sessionFormData.isPublished,
        tags: tagsArray,
      });
      showToast(`Updated live session "${sessionFormData.title}"`);
    } else {
      sessionRoomService.createLiveSession({
        title: sessionFormData.title,
        description: sessionFormData.description,
        subject: sessionFormData.subject,
        topic: sessionFormData.topic,
        hostName: currentUser?.name || 'Om Tajane',
        hostId: currentUser?.id || 'user-admin-om',
        date: sessionFormData.date,
        startTime: sessionFormData.startTime,
        duration: sessionFormData.duration,
        sessionUrl: sessionFormData.sessionUrl,
        status: sessionFormData.status,
        isPublished: sessionFormData.isPublished,
        tags: tagsArray,
      });
      showToast(`Scheduled live session "${sessionFormData.title}"`);
    }

    refreshSessions();
    setIsSessionModalOpen(false);
  };

  const handleToggleSessionStatus = (session: LiveSessionItem) => {
    const nextStatus: SessionStatus =
      session.status === 'SCHEDULED' ? 'LIVE' : session.status === 'LIVE' ? 'ENDED' : 'SCHEDULED';
    sessionRoomService.setSessionStatus(session.id, nextStatus);
    refreshSessions();
    showToast(`Live session status changed to ${nextStatus}`);
  };

  const handleDeleteSession = (session: LiveSessionItem) => {
    if (window.confirm(`Delete live session "${session.title}"?`)) {
      sessionRoomService.deleteLiveSession(session.id);
      refreshSessions();
      showToast(`Deleted session "${session.title}"`);
    }
  };

  // ===================== ACCESS RESTRICTION FOR NON-ADMINS =====================
  if (!isAuthorizedAdmin) {
    return (
      <div
        id="admin-unauthorized-view"
        className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center space-y-6 animate-fadeIn"
      >
        <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-2xl">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider">
            Access Restricted
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
            Administrator Authorization Required
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            The Admin Portal and platform governance operations are restricted to authorized YuvaSetu administrators.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 max-w-md mx-auto">
          Study material uploads and live sessions are curated by authorized YuvaSetu Admins. Students can browse, download, and join live sessions from Explore.
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('explore')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-black shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Go to Explore Learning</span>
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            Student Dashboard
          </button>
          {onLogout && (
            <button
              id="admin-unauthorized-logout-btn"
              onClick={onLogout}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      id="vidyasetu-admin-portal"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn"
    >
      {/* GLOBAL TOAST */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-950 border border-emerald-500/80 text-emerald-200 text-xs font-bold shadow-2xl flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. UNIFIED ADMIN HEADER & IDENTITY BAR (ZERO PROFILE PICTURES - INITIALS ONLY) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1c0c16] via-[#100e1f] to-[#0a1226] border border-rose-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <UserInitialsBadge name={currentUser?.name || 'Om Tajane'} size="lg" />
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
                YuvaSetu Admin Portal
              </h1>
              <span className="px-3 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold">
                Admin: {currentUser?.name || 'Om Tajane'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold">
                {platformMetrics.activeAdmins} Active Admin{platformMetrics.activeAdmins > 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-2">
              <span>Central Platform Governance & Learning Analytics</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-mono">{currentUser?.email || 'omtajane2806@gmail.com'}</span>
            </p>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="admin-quick-add-student-btn"
            onClick={() => setIsAddStudentModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Student</span>
          </button>

          <button
            id="admin-quick-add-admin-btn"
            onClick={handleOpenAddAdminModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            <span>+ Add Admin</span>
          </button>

          <button
            id="admin-quick-add-material-btn"
            onClick={() => {
              setEditingMaterial(null);
              setActiveTab('add_material');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Add Material</span>
          </button>

          <button
            id="admin-quick-create-room-btn"
            onClick={() => handleOpenRoomModal()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-purple-500 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-purple-400" />
            <span>Create Room</span>
          </button>

          <button
            id="admin-quick-schedule-session-btn"
            onClick={() => handleOpenSessionModal()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-pink-500 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-pink-400" />
            <span>Schedule Session</span>
          </button>

          {onLogout && (
            <button
              id="admin-quick-logout-btn"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Log out of Admin Portal"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          id="admin-tab-overview"
          onClick={() => {
            setSelectedStudent(null);
            setActiveTab('overview');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          id="admin-tab-students"
          onClick={() => {
            setSelectedStudent(null);
            refreshStudents();
            setActiveTab('students');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'students'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Management ({students.length})</span>
        </button>

        <button
          id="admin-tab-materials"
          onClick={() => {
            setActiveTab('materials');
            setEditingMaterial(null);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'materials'
              ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Study Materials ({materials.length})</span>
        </button>

        <button
          id="admin-tab-study-rooms"
          onClick={() => setActiveTab('study_rooms')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'study_rooms'
              ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Study Rooms ({studyRooms.length})</span>
        </button>

        <button
          id="admin-tab-live-sessions"
          onClick={() => setActiveTab('live_sessions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'live_sessions'
              ? 'bg-pink-500/15 text-pink-300 border border-pink-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Live Sessions ({liveSessions.length})</span>
        </button>

        <button
          id="admin-tab-doubts"
          onClick={() => setActiveTab('doubts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'doubts' || activeTab === 'doubt_reports'
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Academic Doubts</span>
        </button>

        <button
          id="admin-tab-community"
          onClick={() => onNavigate('admin_community')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span>Community Moderation ↗</span>
        </button>

        <button
          id="admin-tab-admins"
          onClick={() => {
            refreshAdmins();
            setActiveTab('admins');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'admins'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Admin Management ({admins.length})</span>
        </button>

        <button
          id="admin-tab-analytics"
          onClick={() => onNavigate('admin_analytics')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 hover:bg-cyan-900/50 transition-all cursor-pointer shadow-sm"
        >
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <span>Analytics & Insights ↗</span>
        </button>

        <button
          id="admin-tab-reports"
          onClick={() => onNavigate('admin_reports')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Reports & CSV ↗</span>
        </button>

        <button
          id="admin-tab-system-health"
          onClick={() => onNavigate('admin_system_health')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/40 border border-rose-500/30 hover:bg-rose-900/50 transition-all cursor-pointer shadow-sm"
        >
          <ShieldCheck className="w-4 h-4 text-rose-400" />
          <span>System Health & Security ↗</span>
        </button>
      </div>

      {/* 3. TAB CONTENT: OVERVIEW (CENTRAL DASHBOARD) */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* REAL PLATFORM METRICS */}
          <AdminMetricsGrid
            metrics={platformMetrics}
            onNavigateTab={(tab) => setActiveTab(tab as any)}
          />

          {/* COMPACT ANALYTICS SNAPSHOT (MODULE 7) */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0b1022] via-[#0d142b] to-[#0a1224] border border-cyan-500/30 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black font-['Outfit'] text-white">
                    Platform Analytics Snapshot
                  </h3>
                  <p className="text-xs text-slate-400">
                    Real-time learning telemetry & engagement summary
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('admin_analytics')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 cursor-pointer self-start sm:self-auto"
              >
                <span>View Full Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium block">Total Students</span>
                <span className="text-xl font-black font-['Outfit'] text-white">
                  {students.length}
                </span>
                <span className="text-[10px] text-slate-500 block">Registered</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-emerald-400 font-medium block">Active Students</span>
                <span className="text-xl font-black font-['Outfit'] text-emerald-400">
                  {students.filter((s) => s.status === 'ACTIVE').length}
                </span>
                <span className="text-[10px] text-slate-500 block">Active Status</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-cyan-400 font-medium block">Material Views</span>
                <span className="text-xl font-black font-['Outfit'] text-cyan-400">
                  {platformMetrics.totalViews}
                </span>
                <span className="text-[10px] text-slate-500 block">Content Views</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-blue-400 font-medium block">PDF Downloads</span>
                <span className="text-xl font-black font-['Outfit'] text-blue-400">
                  {platformMetrics.totalPdfDownloads}
                </span>
                <span className="text-[10px] text-slate-500 block">Handouts</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-pink-400 font-medium block">Session Joins</span>
                <span className="text-xl font-black font-['Outfit'] text-pink-400">
                  {platformMetrics.totalParticipants}
                </span>
                <span className="text-[10px] text-slate-500 block">Live Attendees</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-amber-400 font-medium block">Total Doubts</span>
                <span className="text-xl font-black font-['Outfit'] text-amber-400">
                  {doubtService.getAllDoubts().length}
                </span>
                <span className="text-[10px] text-slate-500 block">Questions</span>
              </div>
            </div>
          </div>

          {/* ADMIN ALERTS & NEEDS ATTENTION WIDGET */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Needs Attention / Moderation Quick Actions */}
            <div className="p-6 rounded-3xl bg-[#0c1020] border border-amber-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-black font-['Outfit'] text-white">
                    Needs Attention
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Moderation Queue
                </span>
              </div>

              <div className="space-y-2.5">
                {/* Unanswered / Open Doubts */}
                <div
                  onClick={() => setActiveTab('doubts')}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-200">Open Academic Doubts</div>
                    <div className="text-[11px] text-slate-400">Questions awaiting verified educator answers</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-black">
                    {doubtService.getAllDoubts().filter((d) => d.status === 'OPEN').length}
                  </span>
                </div>

                {/* Reported Doubts */}
                <div
                  onClick={() => setActiveTab('doubts')}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-200">Flagged & Reported Doubts</div>
                    <div className="text-[11px] text-slate-400">Community content reported for review</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono font-black">
                    {doubtService.getReports('OPEN').length}
                  </span>
                </div>

                {/* Unpublished Drafts */}
                <div
                  onClick={() => setActiveTab('materials')}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-200">Draft Study Materials</div>
                    <div className="text-[11px] text-slate-400">Handouts unpublished from library</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-black">
                    {materials.filter((m) => m.status === 'draft').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Admin Notifications Stream */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0c1020] border border-cyan-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-black font-['Outfit'] text-white">
                    Admin Notifications & Alerts
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {notificationService.getUnreadCount(currentUser) > 0 && (
                    <button
                      onClick={() => {
                        notificationService.markAllAsRead(currentUser);
                        showToast('All admin notifications marked as read.');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-bold text-cyan-300 border border-slate-800 cursor-pointer"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => onNavigate('notifications')}
                    className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white text-[11px] font-bold transition-all cursor-pointer"
                  >
                    View All ({notificationService.getAdminNotifications().length})
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {notificationService.getAdminNotifications().slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      notificationService.markAsRead(item.id);
                      if (item.related_type === 'doubt') {
                        setActiveTab('doubts');
                      } else if (item.related_type === 'student' && item.related_id) {
                        const s = authService.getUserById(item.related_id);
                        if (s) handleViewStudentDetail(s);
                        else setActiveTab('students');
                      } else {
                        onNavigate('notifications');
                      }
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                      !item.is_read
                        ? 'bg-slate-900/90 border-cyan-500/40 hover:border-cyan-400'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-bold truncate ${!item.is_read ? 'text-white' : 'text-slate-300'}`}>
                        {item.title}
                      </span>
                      {!item.is_read && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                    <div className="text-[10px] text-slate-500 pt-1 flex items-center justify-between border-t border-slate-800/80">
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      <span className="text-cyan-400 font-bold hover:underline">Manage →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* STUDENTS DIRECTORY ON MAIN DASHBOARD */}
          <div className="p-6 rounded-3xl bg-[#090d1c] border border-slate-800 space-y-4">
            <StudentListTable
              students={students}
              onViewStudent={handleViewStudentDetail}
              onEditStudent={(s) => {
                setEditingStudent(s);
                setIsEditStudentModalOpen(true);
              }}
              onToggleStatus={handleToggleStudentStatus}
              onAddStudent={() => setIsAddStudentModalOpen(true)}
            />
          </div>

          {/* REAL-TIME ACTIVITY STREAM & PLATFORM STATUS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-3xl bg-[#090d1c] border border-slate-800">
              <AdminActivityFeed
                events={activityEvents}
                onSelectStudent={(studentId) => {
                  const s = authService.getUserById(studentId);
                  if (s) handleViewStudentDetail(s);
                }}
                onSelectContent={(contentId) => {
                  onNavigate('content_details', { contentId });
                }}
              />
            </div>

            {/* Quick Management Shortcuts */}
            <div className="p-6 rounded-3xl bg-[#090d1c] border border-slate-800 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Administrative Controls</span>
              </h4>

              <div className="space-y-2.5 text-xs">
                <button
                  onClick={() => setActiveTab('materials')}
                  className="w-full p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-slate-200 transition-all text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <span>Curriculum Handouts ({materials.length})</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => setActiveTab('study_rooms')}
                  className="w-full p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-slate-200 transition-all text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span>Active Study Rooms ({studyRooms.length})</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => setActiveTab('live_sessions')}
                  className="w-full p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-slate-200 transition-all text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-pink-400" />
                    <span>Live Interactive Sessions ({liveSessions.length})</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => setActiveTab('admins')}
                  className="w-full p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-slate-200 transition-all text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Platform Administrators ({admins.length})</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="text-slate-300 font-bold block">Zero Profile Picture Policy:</span>
                YuvaSetu strict student privacy safeguards enforce dynamic initials badges across all student profiles.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT: STUDENTS MANAGEMENT (OR STUDENT DETAIL VIEW) */}
      {activeTab === 'students' && (
        <div className="space-y-6 animate-fadeIn">
          {selectedStudent ? (
            <StudentDetailView
              student={selectedStudent}
              onBack={() => setSelectedStudent(null)}
              onEdit={(s) => {
                setEditingStudent(s);
                setIsEditStudentModalOpen(true);
              }}
              onToggleStatus={handleToggleStudentStatus}
              onNavigateToContent={(contentId) => {
                onNavigate('content_details', { contentId });
              }}
            />
          ) : (
            <div className="p-6 rounded-3xl bg-[#090d1c] border border-slate-800 space-y-4">
              <StudentListTable
                students={students}
                onViewStudent={handleViewStudentDetail}
                onEditStudent={(s) => {
                  setEditingStudent(s);
                  setIsEditStudentModalOpen(true);
                }}
                onToggleStatus={handleToggleStudentStatus}
                onAddStudent={() => setIsAddStudentModalOpen(true)}
              />
            </div>
          )}
        </div>
      )}

      {/* 5. TAB CONTENT: STUDY MATERIALS MANAGEMENT */}
      {activeTab === 'materials' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-[#090d1c] border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black font-['Outfit'] text-white">
                    Curriculum Study Materials Management
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono font-bold">
                    {filteredMaterials.length} Handouts
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Upload, verify, publish, edit, or archive academic notes, cheat-sheets, and masterclasses.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingMaterial(null);
                  setActiveTab('add_material');
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Study Material</span>
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={materialSearch}
                  onChange={(e) => setMaterialSearch(e.target.value)}
                  placeholder="Search materials..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <select
                  value={materialSubjectFilter}
                  onChange={(e) => setMaterialSubjectFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Subjects</option>
                  {PLATFORM_SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={materialTypeFilter}
                  onChange={(e) => setMaterialTypeFilter(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Content Types</option>
                  <option value="note">Handwritten Notes (PDF/MD)</option>
                  <option value="dsa_pattern">DSA Patterns & Code</option>
                  <option value="cheat_sheet">Quick Cheat-Sheets</option>
                  <option value="lecture_video">Video Masterclasses</option>
                </select>
              </div>

              <div>
                <select
                  value={materialStatusFilter}
                  onChange={(e) => setMaterialStatusFilter(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Publication Statuses</option>
                  <option value="published">Published Only</option>
                  <option value="draft">Drafts Only</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5 pl-4">Title & Subject</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Views</th>
                    <th className="p-3.5">Likes</th>
                    <th className="p-3.5">Created</th>
                    <th className="p-3.5 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredMaterials.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/40">
                      <td className="p-3.5 pl-4">
                        <div className="font-bold text-white leading-snug">{item.title}</div>
                        <div className="text-[11px] text-slate-400">{item.subject_name} • {item.topic}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 text-[10px] font-bold uppercase font-mono">
                          {item.content_type}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => handleTogglePublishMaterial(item)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border cursor-pointer ${
                            item.status === 'published'
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                              : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                          }`}
                        >
                          {item.status === 'published' ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="p-3.5 font-mono text-slate-300">{item.views || 0}</td>
                      <td className="p-3.5 font-mono text-slate-300">{item.likes_count || 0}</td>
                      <td className="p-3.5 font-mono text-slate-400">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3.5 pr-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => onNavigate('content_details', { contentId: item.id })}
                            className="p-1.5 rounded-lg bg-slate-900 text-cyan-400 hover:bg-slate-800 border border-slate-800"
                            title="Inspect Material View"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingMaterial(item);
                              setActiveTab('add_material');
                            }}
                            className="p-1.5 rounded-lg bg-slate-900 text-purple-400 hover:bg-slate-800 border border-slate-800"
                            title="Edit Material"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMaterial(item)}
                            className="p-1.5 rounded-lg bg-slate-900 text-rose-400 hover:bg-slate-800 border border-slate-800"
                            title="Delete Material"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: STUDY ROOMS MANAGEMENT */}
      {activeTab === 'study_rooms' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" /> Virtual Study Rooms & Pomodoro Sprints
            </h3>
            <button
              onClick={() => handleOpenRoomModal()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 text-white text-xs font-bold transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Study Room</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studyRooms.map((room) => (
              <div
                key={room.id}
                className="p-5 rounded-3xl bg-[#0c1020] border border-slate-800 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold">
                      {room.subject}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        room.status === 'LIVE'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                          : room.status === 'UPCOMING'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {room.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-sm leading-snug">{room.name}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1">{room.topic}</p>
                  <p className="text-xs text-slate-300 line-clamp-2">{room.description}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>
                      Host: <strong className="text-white">{room.hostName}</strong>
                    </span>
                    <span className="text-cyan-400 font-bold">{room.activeParticipants} Peers</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleRoomStatus(room)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        room.status === 'LIVE'
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950/40'
                      }`}
                    >
                      {room.status === 'LIVE' ? 'End Room' : 'Start Live'}
                    </button>

                    <button
                      onClick={() => handleOpenRoomModal(room)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 cursor-pointer"
                      title="Edit Room"
                    >
                      <Edit className="w-3.5 h-3.5 text-cyan-400" />
                    </button>

                    <button
                      onClick={() => handleDeleteRoom(room)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-rose-400 cursor-pointer"
                      title="Delete Room"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. TAB CONTENT: LIVE SESSIONS MANAGEMENT */}
      {activeTab === 'live_sessions' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-400" /> Live Interactive Doubt Resolution & Masterclasses
            </h3>
            <button
              onClick={() => handleOpenSessionModal()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-400 text-white text-xs font-bold transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Session</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveSessions.map((session) => (
              <div
                key={session.id}
                className="p-5 rounded-3xl bg-[#0c1020] border border-slate-800 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold">
                      {session.subject}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        session.status === 'LIVE'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                          : session.status === 'SCHEDULED'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {session.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-sm leading-snug">{session.title}</h4>
                  <p className="text-xs text-slate-400">{session.topic}</p>
                  <p className="text-xs text-slate-300 line-clamp-2">{session.description}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-900 flex items-center justify-between text-[11px] text-slate-300">
                    <span>
                      {session.date} • {session.startTime}
                    </span>
                    <span className="text-rose-400 font-bold">{session.attendeeCount} RSVPs</span>
                  </div>

                  {session.sessionUrl && (
                    <a
                      href={session.sessionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 text-[11px] text-cyan-400 hover:underline"
                    >
                      <span>Meeting Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleSessionStatus(session)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        session.status === 'LIVE'
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 text-white'
                      }`}
                    >
                      {session.status === 'LIVE' ? 'End Stream' : 'Go Live Now'}
                    </button>

                    <button
                      onClick={() => handleOpenSessionModal(session)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 cursor-pointer"
                      title="Edit Session"
                    >
                      <Edit className="w-3.5 h-3.5 text-cyan-400" />
                    </button>

                    <button
                      onClick={() => handleDeleteSession(session)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-rose-400 cursor-pointer"
                      title="Delete Session"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. TAB CONTENT: ADMIN MANAGEMENT */}
      {activeTab === 'admins' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-[#0c1020] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Shield className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-black font-['Outfit'] text-white">
                  Administrator Governance & Access
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Authorized platform administrators with full privileges over curriculum, live broadcasting, and system settings.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                {platformMetrics.activeAdmins} Active / {admins.length} Total Admins
              </span>
              <button
                id="admin-portal-add-admin-btn"
                onClick={handleOpenAddAdminModal}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Add Admin</span>
              </button>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0c1020] border border-slate-800 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Administrator</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Lead Role / College</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Created Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {admins.map((admin) => {
                    const isActive = admin.status !== 'INACTIVE';
                    const isSelf =
                      currentUser && currentUser.email.toLowerCase() === admin.email.toLowerCase();

                    return (
                      <tr key={admin.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <UserInitialsBadge name={admin.name} size="md" />
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5">
                                <span>{admin.name}</span>
                                {isSelf && (
                                  <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[9px] font-bold">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400">{admin.bio || 'Platform Admin'}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-cyan-300">{admin.email}</td>

                        <td className="py-3.5 px-4 text-slate-300">
                          {admin.college || 'YuvaSetu Academic Lead'}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              isActive
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isActive ? 'bg-emerald-400' : 'bg-rose-400'
                              }`}
                            />
                            <span>{isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-400">
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingAdmin(admin);
                                setIsEditAdminModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                              title="Edit Admin"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleToggleAdminStatus(admin)}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-rose-950/60 border-rose-500/40 text-rose-300 hover:bg-rose-900/60'
                                  : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                              }`}
                              title={isActive ? 'Deactivate Admin' : 'Activate Admin'}
                            >
                              <Power className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 9. TAB CONTENT: ADD / EDIT STUDY MATERIAL */}
      {activeTab === 'add_material' && (
        <AdminAddMaterialView
          currentUser={currentUser || null}
          onNavigate={onNavigate}
          initialData={editingMaterial || undefined}
          onSuccess={() => {
            refreshMaterials();
            setEditingMaterial(null);
            setActiveTab('materials');
            showToast('Study material saved successfully!');
          }}
        />
      )}

      {/* 10. TAB CONTENT: ACADEMIC DOUBTS & MODERATION */}
      {(activeTab === 'doubts' || activeTab === 'doubt_reports') && (
        <AdminDoubtManagementView
          currentUser={currentUser || null}
          onNavigate={onNavigate}
          defaultTab={activeTab === 'doubt_reports' ? 'reports' : 'doubts'}
        />
      )}

      {/* ===================== MODALS ===================== */}
      {/* 1. ADD STUDENT MODAL */}
      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        onSubmit={handleAddStudentSubmit}
      />

      {/* 2. EDIT STUDENT MODAL */}
      <EditStudentModal
        isOpen={isEditStudentModalOpen}
        student={editingStudent}
        onClose={() => {
          setIsEditStudentModalOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={handleEditStudentSubmit}
      />

      {/* 3. ADD ADMIN MODAL */}
      {isAddAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-[#0b0f1e] border border-emerald-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-['Outfit'] text-white">Add Administrator</h3>
                  <p className="text-xs text-slate-400">Grant full administrative permissions</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddAdminModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {adminFormError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{adminFormError}</span>
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={adminFormData.name}
                  onChange={(e) => setAdminFormData({ ...adminFormData, name: e.target.value })}
                  placeholder="e.g. Dr. Rajesh Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Admin Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={adminFormData.email}
                  onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
                  placeholder="e.g. admin.rajesh@yuvasetu.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Password <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={adminFormData.password}
                    onChange={(e) => setAdminFormData({ ...adminFormData, password: e.target.value })}
                    placeholder="Min 6 chars"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Confirm Password <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={adminFormData.confirmPassword}
                    onChange={(e) =>
                      setAdminFormData({ ...adminFormData, confirmPassword: e.target.value })
                    }
                    placeholder="Repeat password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddAdminModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-black shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  Create Admin Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. EDIT ADMIN MODAL */}
      <EditAdminModal
        isOpen={isEditAdminModalOpen}
        admin={editingAdmin}
        onClose={() => {
          setIsEditAdminModalOpen(false);
          setEditingAdmin(null);
        }}
        onSubmit={handleEditAdminSubmit}
      />

      {/* 5. CREATE / EDIT STUDY ROOM MODAL */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-[#0b0f1e] border border-purple-500/30 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-['Outfit'] text-white">
                    {editingRoom ? 'Edit Study Room' : 'Create Virtual Study Room'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Collaborative peer focus space with integrated timer
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRoomModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Room Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={roomFormData.name}
                  onChange={(e) => setRoomFormData({ ...roomFormData, name: e.target.value })}
                  placeholder="e.g. DSA LeetCode Hard Problem Sprint"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subject</label>
                  <select
                    value={roomFormData.subject}
                    onChange={(e) => setRoomFormData({ ...roomFormData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    {PLATFORM_SUBJECTS.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Topic</label>
                  <input
                    type="text"
                    value={roomFormData.topic}
                    onChange={(e) => setRoomFormData({ ...roomFormData, topic: e.target.value })}
                    placeholder="e.g. Dynamic Programming Sprints"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={roomFormData.description}
                  onChange={(e) => setRoomFormData({ ...roomFormData, description: e.target.value })}
                  placeholder="Describe the focus topic or sprint goal..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={roomFormData.scheduledDate}
                    onChange={(e) =>
                      setRoomFormData({ ...roomFormData, scheduledDate: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Start Time</label>
                  <input
                    type="text"
                    value={roomFormData.startTime}
                    onChange={(e) => setRoomFormData({ ...roomFormData, startTime: e.target.value })}
                    placeholder="06:00 PM"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status</label>
                  <select
                    value={roomFormData.status}
                    onChange={(e) =>
                      setRoomFormData({ ...roomFormData, status: e.target.value as RoomStatus })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="LIVE">LIVE NOW</option>
                    <option value="ENDED">ENDED</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRoomModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 text-white font-black shadow-lg shadow-purple-500/20 cursor-pointer"
                >
                  {editingRoom ? 'Save Room Changes' : 'Launch Study Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. SCHEDULE / EDIT LIVE SESSION MODAL */}
      {isSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-[#0b0f1e] border border-pink-500/30 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-['Outfit'] text-white">
                    {editingSession ? 'Edit Live Session' : 'Schedule Live Doubt Session'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Host live interactive video doubt sessions and workshops
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSessionModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSession} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Session Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={sessionFormData.title}
                  onChange={(e) => setSessionFormData({ ...sessionFormData, title: e.target.value })}
                  placeholder="e.g. Graph Algorithms Masterclass & Live Doubt Solving"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subject</label>
                  <select
                    value={sessionFormData.subject}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-pink-500 cursor-pointer"
                  >
                    {PLATFORM_SUBJECTS.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Topic</label>
                  <input
                    type="text"
                    value={sessionFormData.topic}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, topic: e.target.value })}
                    placeholder="e.g. BFS, DFS, Dijkstra"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date</label>
                  <input
                    type="text"
                    value={sessionFormData.date}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, date: e.target.value })}
                    placeholder="Today / Friday"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Start Time</label>
                  <input
                    type="text"
                    value={sessionFormData.startTime}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, startTime: e.target.value })}
                    placeholder="06:30 PM"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status</label>
                  <select
                    value={sessionFormData.status}
                    onChange={(e) =>
                      setSessionFormData({ ...sessionFormData, status: e.target.value as SessionStatus })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-pink-500 cursor-pointer"
                  >
                    <option value="SCHEDULED">SCHEDULED</option>
                    <option value="LIVE">LIVE NOW</option>
                    <option value="ENDED">ENDED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Meeting Link / Stream URL</label>
                <input
                  type="url"
                  value={sessionFormData.sessionUrl}
                  onChange={(e) => setSessionFormData({ ...sessionFormData, sessionUrl: e.target.value })}
                  placeholder="https://meet.google.com/xyz-abc"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSessionModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:from-rose-400 text-white font-black shadow-lg shadow-rose-500/20 cursor-pointer"
                >
                  {editingSession ? 'Save Session Changes' : 'Schedule Live Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
