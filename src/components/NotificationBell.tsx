import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
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
  ChevronRight,
  Info,
} from 'lucide-react';
import { User } from '../types/user';
import { AppNotification, NotificationType } from '../types/notification';
import { notificationService } from '../services/notificationService';

interface NotificationBellProps {
  currentUser: User | null;
  onNavigate: (view: string, payload?: any) => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  currentUser,
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = () => {
    if (!currentUser) return;
    const list = notificationService.getUserNotifications(currentUser);
    setNotifications(list);
    setUnreadCount(notificationService.getUnreadCount(currentUser));
  };

  useEffect(() => {
    loadNotifications();

    // Listen for custom notification/storage change events
    const handleStorage = (e: StorageEvent) => {
      if (
        e.key === 'yuvasetu_notifications_v6' ||
        e.key === 'yuvasetu_activity_events_v5'
      ) {
        loadNotifications();
      }
    };

    window.addEventListener('storage', handleStorage);
    // Periodic refresh
    const interval = setInterval(loadNotifications, 5000);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, [currentUser]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    notificationService.markAllAsRead(currentUser);
    loadNotifications();
  };

  const handleNotificationClick = (item: AppNotification) => {
    notificationService.markAsRead(item.id);
    loadNotifications();
    setIsOpen(false);

    // Deep routing based on payload & user role
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
      return;
    }

    // Default fallback
    onNavigate('notifications');
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'NEW_DOUBT':
      case 'DOUBT_ANSWERED':
      case 'ANSWER_ACCEPTED':
      case 'DOUBT_RESOLVED':
      case 'DOUBT_CLOSED':
        return <HelpCircle className="w-4 h-4 text-emerald-400" />;
      case 'SESSION_SCHEDULED':
      case 'SESSION_STARTING':
      case 'SESSION_LIVE':
      case 'SESSION_CANCELLED':
        return <Radio className="w-4 h-4 text-cyan-400" />;
      case 'ROOM_LIVE':
      case 'ROOM_CANCELLED':
        return <Users className="w-4 h-4 text-purple-400" />;
      case 'NEW_STUDY_MATERIAL':
      case 'MATERIAL_PUBLISHED':
      case 'MATERIAL_ENGAGEMENT':
        return <BookOpen className="w-4 h-4 text-amber-400" />;
      case 'STUDENT_REGISTERED':
      case 'STUDENT_DEACTIVATED':
      case 'ACCOUNT_UPDATED':
        return <GraduationCap className="w-4 h-4 text-blue-400" />;
      case 'DOUBT_REPORTED':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      default:
        return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHr = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHr / 24);

      if (diffSec < 60) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      if (diffHr < 24) return `${diffHr}h ago`;
      if (diffDay === 1) return 'Yesterday';
      return `${diffDay}d ago`;
    } catch {
      return 'Recently';
    }
  };

  const recentList = notifications.slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef} id="yuvasetu-notification-bell-container">
      <button
        id="navbar-notification-bell"
        onClick={() => {
          setIsOpen(!isOpen);
          loadNotifications();
        }}
        className="relative p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800/80 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
        aria-label={`Notifications (${unreadCount} unread)`}
        title="Notifications & Activity Alerts"
      >
        <Bell className="w-4 h-4 text-slate-300 transition-transform active:scale-90" />
        {unreadCount > 0 && (
          <span
            id="notification-unread-badge"
            className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-[10px] font-black text-white shadow-lg shadow-cyan-500/40 animate-pulse border border-[#080b14]"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN POPOVER */}
      {isOpen && (
        <div
          id="notification-popover-menu"
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0c101d] border border-slate-800/90 shadow-2xl shadow-black/80 z-50 overflow-hidden animate-fadeIn backdrop-blur-xl"
        >
          {/* Header */}
          <div className="p-3.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">Notifications</h4>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {unreadCount > 0 ? `${unreadCount} unread alerts` : 'All caught up'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  id="mark-all-notifications-read-btn"
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3 h-3" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                id="notification-settings-btn"
                onClick={() => {
                  setIsOpen(false);
                  onNavigate('settings_notifications');
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Notification Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* List Content */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/50">
            {recentList.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400">
                  <Check className="w-5 h-5 text-cyan-400" />
                </div>
                <p className="text-xs font-semibold text-slate-200">No new notifications</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  You are all caught up with your study rooms, doubts, and curriculum.
                </p>
              </div>
            ) : (
              recentList.map((item) => (
                <div
                  key={item.id}
                  id={`notification-item-${item.id}`}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3 transition-colors cursor-pointer flex items-start gap-3 hover:bg-slate-850/60 ${
                    !item.is_read
                      ? 'bg-slate-900/90 border-l-2 border-l-cyan-400'
                      : 'bg-transparent opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="mt-0.5 p-2 rounded-xl bg-slate-800/90 border border-slate-700/60 shrink-0">
                    {getNotificationIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p
                        className={`text-xs font-bold truncate ${
                          !item.is_read ? 'text-white' : 'text-slate-300'
                        }`}
                      >
                        {item.title}
                      </p>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap shrink-0">
                        {formatRelativeTime(item.created_at)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>

                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[9px] font-bold text-cyan-400/90 flex items-center gap-1 group-hover:underline">
                        <span>View details</span>
                        <ChevronRight className="w-2.5 h-2.5" />
                      </span>
                      {!item.is_read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer CTAs */}
          <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 grid grid-cols-2 gap-2 text-center text-xs">
            <button
              id="view-all-notifications-btn"
              onClick={() => {
                setIsOpen(false);
                onNavigate('notifications');
              }}
              className="px-3 py-1.5 rounded-xl font-bold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-colors flex items-center justify-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5 text-cyan-400" />
              <span>All Alerts</span>
            </button>

            <button
              id="view-activity-center-btn"
              onClick={() => {
                setIsOpen(false);
                onNavigate('activity');
              }}
              className="px-3 py-1.5 rounded-xl font-bold text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/40 transition-colors flex items-center justify-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Activity Log</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
