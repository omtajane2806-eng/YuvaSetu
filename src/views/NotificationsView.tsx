import React, { useState, useEffect } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Filter,
  Search,
  Trash2,
  ExternalLink,
  HelpCircle,
  Radio,
  Users,
  BookOpen,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  Settings,
  Activity,
  ArrowLeft,
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { User } from '../types/user';
import { AppNotification, NotificationType } from '../types/notification';
import { notificationService } from '../services/notificationService';

interface NotificationsViewProps {
  currentUser: User | null;
  onNavigate: (view: string, payload?: any) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  currentUser,
  onNavigate,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD' | 'DOUBTS' | 'SESSIONS' | 'MATERIALS' | 'SYSTEM'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null);

  const loadNotifications = () => {
    if (!currentUser) return;
    const list = notificationService.getUserNotifications(currentUser);
    setNotifications(list);
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleMarkAllRead = () => {
    if (!currentUser) return;
    notificationService.markAllAsRead(currentUser);
    loadNotifications();
  };

  const handleMarkSingleRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    notificationService.markAsRead(id);
    loadNotifications();
  };

  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    notificationService.deleteNotification(id);
    loadNotifications();
    if (selectedNotification?.id === id) {
      setSelectedNotification(null);
    }
  };

  const handleNotificationClick = (item: AppNotification) => {
    notificationService.markAsRead(item.id);
    loadNotifications();
    setSelectedNotification(item);

    const isAdmin = currentUser?.role === 'admin';

    if (item.related_type === 'doubt' && item.related_id) {
      if (isAdmin && (item.type === 'NEW_DOUBT' || item.type === 'DOUBT_REPORTED')) {
        onNavigate('admin_doubts', { doubtId: item.related_id });
      } else {
        onNavigate('doubts', { doubtId: item.related_id });
      }
      return;
    }

    if (item.related_type === 'live_session' && item.related_id) {
      if (isAdmin) {
        onNavigate('admin_live_sessions', { sessionId: item.related_id });
      } else {
        onNavigate('live_sessions', { sessionId: item.related_id });
      }
      return;
    }

    if (item.related_type === 'study_room' && item.related_id) {
      if (isAdmin) {
        onNavigate('admin_study_rooms', { roomId: item.related_id });
      } else {
        onNavigate('study_rooms', { roomId: item.related_id });
      }
      return;
    }

    if (item.related_type === 'material' && item.related_id) {
      if (isAdmin) {
        onNavigate('admin_materials', { materialId: item.related_id });
      } else {
        onNavigate('explore', { materialId: item.related_id });
      }
      return;
    }

    if (item.related_type === 'student' && item.related_id && isAdmin) {
      onNavigate('admin_students', { studentId: item.related_id });
      return;
    }

    if (item.action_url) {
      onNavigate(item.action_url);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'NEW_DOUBT':
      case 'DOUBT_ANSWERED':
      case 'ANSWER_ACCEPTED':
      case 'DOUBT_RESOLVED':
      case 'DOUBT_CLOSED':
        return <HelpCircle className="w-5 h-5 text-emerald-400" />;
      case 'SESSION_SCHEDULED':
      case 'SESSION_STARTING':
      case 'SESSION_LIVE':
      case 'SESSION_CANCELLED':
        return <Radio className="w-5 h-5 text-cyan-400" />;
      case 'ROOM_LIVE':
      case 'ROOM_CANCELLED':
        return <Users className="w-5 h-5 text-purple-400" />;
      case 'NEW_STUDY_MATERIAL':
      case 'MATERIAL_PUBLISHED':
      case 'MATERIAL_ENGAGEMENT':
        return <BookOpen className="w-5 h-5 text-amber-400" />;
      case 'STUDENT_REGISTERED':
      case 'STUDENT_DEACTIVATED':
      case 'ACCOUNT_UPDATED':
        return <GraduationCap className="w-5 h-5 text-blue-400" />;
      case 'DOUBT_REPORTED':
        return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      default:
        return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return `${d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })} at ${d.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    } catch {
      return 'Recent';
    }
  };

  // Filter list
  const filteredNotifications = notifications.filter((item) => {
    // Tab filter
    if (activeTab === 'UNREAD' && item.is_read) return false;
    if (
      activeTab === 'DOUBTS' &&
      !['NEW_DOUBT', 'DOUBT_ANSWERED', 'ANSWER_RECEIVED', 'ANSWER_ACCEPTED', 'DOUBT_RESOLVED', 'DOUBT_CLOSED', 'DOUBT_REPORTED'].includes(
        item.type
      )
    ) {
      return false;
    }
    if (
      activeTab === 'SESSIONS' &&
      !['LIVE_SESSION_SCHEDULED', 'LIVE_SESSION_STARTING', 'STUDENT_JOINED_ROOM'].includes(item.type)
    ) {
      return false;
    }
    if (activeTab === 'MATERIALS' && item.type !== 'NEW_MATERIAL_PUBLISHED') {
      return false;
    }
    if (
      activeTab === 'SYSTEM' &&
      !['STUDENT_REGISTERED', 'STUDENT_STATUS_CHANGED', 'CONTENT_FLAGGED', 'SECURITY_ALERT', 'GENERAL'].includes(
        item.type
      )
    ) {
      return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* TOP BAR & BREADCRUMB */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
              <button
                onClick={() => onNavigate(currentUser?.role === 'admin' ? 'admin' : 'dashboard')}
                className="hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{currentUser?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}</span>
              </button>
              <span>/</span>
              <span className="text-slate-400">Notifications & Alerts</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Bell className="w-7 h-7 text-cyan-400" />
              <span>Notification Center</span>
              {unreadCount > 0 && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold border border-cyan-500/30">
                  {unreadCount} Unread
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Stay up to date with doubt resolutions, live sessions, verified study notes, and system updates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                id="notifications-mark-all-read-btn"
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer shadow-sm"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Mark All Read</span>
              </button>
            )}

            <button
              id="notifications-view-settings-btn"
              onClick={() => onNavigate('settings_notifications')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
              title="Notification Settings"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Preferences</span>
            </button>

            <button
              id="notifications-view-activity-btn"
              onClick={() => onNavigate('activity')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
              title="Activity Center"
            >
              <Activity className="w-4 h-4 text-purple-400" />
              <span>Activity Log</span>
            </button>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="bg-[#0b101e] border border-slate-800/80 rounded-2xl p-4 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* SEARCH INPUT */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="notifications-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search alerts by title or content..."
                className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* QUICK STATS */}
            <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
              <span>Total: <strong className="text-white">{notifications.length}</strong></span>
              <span>•</span>
              <span>Unread: <strong className="text-cyan-400">{unreadCount}</strong></span>
              <span>•</span>
              <span>Read: <strong className="text-slate-300">{notifications.length - unreadCount}</strong></span>
            </div>
          </div>

          {/* CATEGORY TABS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/60 pt-3">
            {[
              { id: 'ALL', label: 'All Alerts' },
              { id: 'UNREAD', label: `Unread (${unreadCount})` },
              { id: 'DOUBTS', label: 'Doubts & Q&A' },
              { id: 'SESSIONS', label: 'Live & Rooms' },
              { id: 'MATERIALS', label: 'Study Notes' },
              { id: 'SYSTEM', label: currentUser?.role === 'admin' ? 'Admin / Platform' : 'System' },
            ].map((tab) => (
              <button
                key={tab.id}
                id={`notification-tab-${tab.id.toLowerCase()}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="space-y-3" id="notifications-stream-container">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center bg-[#0b101e] border border-slate-800/80 rounded-2xl shadow-xl">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                <Check className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-base font-bold text-white">No notifications found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                {searchQuery
                  ? 'No notifications match your current search criteria.'
                  : 'You have no pending notifications in this category. Everything is up to date!'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all cursor-pointer"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <div
                key={item.id}
                id={`notification-card-${item.id}`}
                onClick={() => handleNotificationClick(item)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                  !item.is_read
                    ? 'bg-[#0e1426] border-cyan-500/40 hover:border-cyan-400/70 shadow-lg shadow-cyan-950/20'
                    : 'bg-[#0b101e]/80 border-slate-800/80 hover:border-slate-700 opacity-85 hover:opacity-100'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                    {getNotificationIcon(item.type)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4
                        className={`text-sm font-bold ${
                          !item.is_read ? 'text-white' : 'text-slate-300'
                        }`}
                      >
                        {item.title}
                      </h4>
                      {!item.is_read && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          NEW
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500">
                        {formatTimestamp(item.created_at)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                      {item.message}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[11px]">
                      <span className="text-cyan-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Open & view item</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* ITEM ACTIONS */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  {!item.is_read ? (
                    <button
                      id={`mark-read-btn-${item.id}`}
                      onClick={(e) => handleMarkSingleRead(item.id, e)}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30 transition-all"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  ) : null}

                  <button
                    id={`delete-notif-btn-${item.id}`}
                    onClick={(e) => handleDeleteNotification(item.id, e)}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
