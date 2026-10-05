import React, { useState, useEffect } from 'react';
import {
  Settings,
  Bell,
  Check,
  ArrowLeft,
  Shield,
  HelpCircle,
  Radio,
  Users,
  BookOpen,
  Sparkles,
  Save,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { User } from '../types/user';
import { NotificationPreference, NotificationCategory } from '../types/notification';
import { notificationService } from '../services/notificationService';

interface NotificationSettingsViewProps {
  currentUser: User | null;
  onNavigate: (view: string, payload?: any) => void;
}

export const NotificationSettingsView: React.FC<NotificationSettingsViewProps> = ({
  currentUser,
  onNavigate,
}) => {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const prefs = notificationService.getUserPreferences(
      currentUser.id,
      currentUser.role === 'admin' ? 'admin' : 'student'
    );
    setPreferences(prefs);
  }, [currentUser]);

  const handleToggle = (category: NotificationCategory, currentVal: boolean) => {
    if (!currentUser) return;
    const updated = notificationService.updatePreference(
      currentUser.id,
      currentUser.role === 'admin' ? 'admin' : 'student',
      category,
      !currentVal
    );
    setPreferences(updated);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'doubts':
        return <HelpCircle className="w-5 h-5 text-emerald-400" />;
      case 'live_sessions':
        return <Radio className="w-5 h-5 text-cyan-400" />;
      case 'study_rooms':
        return <Users className="w-5 h-5 text-purple-400" />;
      case 'study_materials':
        return <BookOpen className="w-5 h-5 text-amber-400" />;
      case 'student_activity':
        return <Sparkles className="w-5 h-5 text-blue-400" />;
      case 'reports':
        return <Shield className="w-5 h-5 text-rose-400" />;
      default:
        return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
              <button
                onClick={() => onNavigate('notifications')}
                className="hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Notifications Center</span>
              </button>
              <span>/</span>
              <span className="text-slate-400">Settings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Settings className="w-7 h-7 text-cyan-400" />
              <span>Notification Preferences</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Configure which real-time alerts and curriculum notifications you wish to receive in your YuvaSetu portal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="back-to-notifications-btn"
              onClick={() => onNavigate('notifications')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4 text-cyan-400" />
              <span>Back to Alerts</span>
            </button>
          </div>
        </div>

        {/* TOAST FEEDBACK */}
        {showSavedToast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-2xl animate-fadeIn backdrop-blur-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Preferences saved successfully!</span>
          </div>
        )}

        {/* ROLE NOTICE */}
        <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 flex items-start gap-3">
          <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-white">
              {currentUser?.role === 'admin' ? 'Sole Administrator Notification Channels' : 'Student Notification Channels'}
            </span>
            <p className="text-slate-400 mt-0.5">
              {currentUser?.role === 'admin'
                ? 'Control system alerts for new student doubts, moderation flags, student registrations, and scheduled live broadcast triggers.'
                : 'Choose notifications for doubt answers from peers & teachers, scheduled live sessions, active focus rooms, and new study materials.'}
            </p>
          </div>
        </div>

        {/* PREFERENCES LIST */}
        <div className="bg-[#0b101e] border border-slate-800/80 rounded-2xl divide-y divide-slate-800/60 shadow-xl overflow-hidden">
          {preferences.map((pref) => (
            <div
              key={pref.id}
              id={`preference-row-${pref.category}`}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                  {getCategoryIcon(pref.category)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{pref.label}</span>
                    {pref.enabled ? (
                      <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-slate-800 text-slate-400 border border-slate-700">
                        Muted
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 max-w-xl leading-relaxed">
                    {pref.description}
                  </p>
                </div>
              </div>

              {/* TOGGLE SWITCH */}
              <button
                id={`toggle-btn-${pref.category}`}
                type="button"
                onClick={() => handleToggle(pref.category, pref.enabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-[#0b101e] ${
                  pref.enabled ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
                role="switch"
                aria-checked={pref.enabled}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    pref.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
