import React, { useState } from 'react';
import { YuvaSetuLogo } from './YuvaSetuLogo';
import { UserInitialsBadge } from './UserInitialsBadge';
import { NotificationBell } from './NotificationBell';
import { User, UserRole } from '../types/user';
import {
  BookOpen,
  Users,
  HelpCircle,
  LayoutDashboard,
  Sparkles,
  Search,
  Bell,
  Menu,
  X,
  GraduationCap,
  Video,
  ShieldCheck,
  ChevronDown,
  LogIn,
  UserPlus,
  CheckCircle2,
  LogOut,
  User as UserIcon,
  Settings,
  Flame,
  FileText,
  Radio,
  Activity,
  BarChart3,
  FileSpreadsheet,
  MessageSquare,
  Coins,
  Wallet,
} from 'lucide-react';
import { tokenService } from '../services/tokenService';

export type { UserRole };

export interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, payload?: any) => void;
  currentUser: User | null;
  isAuthenticated: boolean;
  onLogout: () => void;
  onOpenAuth: (mode?: 'student_login' | 'admin_login' | 'register' | 'login') => void;
  onOpenSearch: () => void;
  onOpenProfileSetup?: () => void;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isScrollSection?: boolean;
  badge?: string;
  highlight?: boolean;
  requiresAuth?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  isAuthenticated,
  onLogout,
  onOpenAuth,
  onOpenSearch,
  onOpenProfileSetup,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Authenticated nav items vs Logged-out nav items
  const studentNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explore', label: 'Explore', icon: BookOpen },
    { id: 'doubts', label: 'Doubts', icon: HelpCircle },
    { id: 'community', label: 'Community', icon: MessageSquare },
    { id: 'study_rooms', label: 'Study Rooms', icon: Users },
    { id: 'live_sessions', label: 'Live Sessions', icon: Radio },
    { id: 'ai_assistant', label: 'AI', icon: Sparkles, highlight: true },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'wallet', label: 'Wallet', icon: Coins, badge: 'VT' },
  ];

  const adminNavItems: NavItem[] = [
    { id: 'admin', label: 'Dashboard', icon: ShieldCheck, highlight: true },
    { id: 'admin_students', label: 'Students', icon: GraduationCap },
    { id: 'admin_admins', label: 'Admins', icon: ShieldCheck },
    { id: 'admin_materials', label: 'Study Materials', icon: FileText },
    { id: 'admin_doubts', label: 'Doubts', icon: HelpCircle },
    { id: 'admin_study_rooms', label: 'Study Rooms', icon: Users },
    { id: 'admin_live_sessions', label: 'Live Sessions', icon: Radio },
    { id: 'admin_community', label: 'Community', icon: MessageSquare },
    { id: 'admin_analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'admin_reports', label: 'Reports', icon: FileSpreadsheet },
    { id: 'admin_ai_settings', label: 'AI', icon: Sparkles },
    { id: 'admin_tokens', label: 'Tokens', icon: Coins },
    { id: 'admin_system_health', label: 'System Health', icon: Activity },
  ];

  const loggedOutNavItems: NavItem[] = [
    { id: 'landing', label: 'Home', icon: GraduationCap },
    { id: 'explore', label: 'Explore', icon: BookOpen },
    { id: 'how_it_works', label: 'How It Works', icon: HelpCircle, isScrollSection: true },
    { id: 'community', label: 'Community', icon: MessageSquare },
  ];

  const activeNavItems = !isAuthenticated
    ? loggedOutNavItems
    : currentUser?.role === 'admin'
    ? adminNavItems
    : studentNavItems;

  const handleNavClick = (viewId: string) => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);

    if (viewId === 'how_it_works') {
      if (currentView !== 'landing') {
        onNavigate('landing');
      }
      setTimeout(() => {
        const el = document.getElementById('how-it-works-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    onNavigate(viewId);
  };

  return (
    <header
      id="yuvasetu-global-navbar"
      className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#080b14]/90 backdrop-blur-xl transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* LEFT: Official YuvaSetu Brand Logo */}
          <div className="flex items-center gap-6">
            {/* Desktop Brand Logo */}
            <div className="hidden sm:block">
              <YuvaSetuLogo
                id="navbar-desktop-logo"
                variant="horizontal"
                size="md"
                showTagline={true}
                onClick={() => handleNavClick(isAuthenticated ? 'dashboard' : 'landing')}
                className="cursor-pointer"
              />
            </div>

            {/* Mobile Brand Logo */}
            <div className="block sm:hidden">
              <YuvaSetuLogo
                id="navbar-mobile-logo"
                variant="horizontal"
                size="sm"
                showTagline={false}
                onClick={() => handleNavClick(isAuthenticated ? 'dashboard' : 'landing')}
                className="cursor-pointer"
              />
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1 ml-4" aria-label="Main Navigation">
              {activeNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* RIGHT CONTROLS: Search, Notifications, User Menu / Auth CTAs */}
          <div className="flex items-center gap-3">
            {/* Quick Search Trigger */}
            <button
              id="global-search-trigger"
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 text-xs sm:text-sm font-medium transition-all cursor-pointer"
              title="Search courses, concepts, study materials (Cmd+K)"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span className="hidden md:inline">Search YuvaSetu...</span>
              <kbd className="hidden md:inline px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* Student VidyaTokens Wallet Quick Pill */}
            {isAuthenticated && currentUser?.role === 'student' && (
              <button
                id="navbar-student-token-pill"
                onClick={() => handleNavClick('wallet')}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 hover:border-amber-400/60 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all shadow-sm shadow-amber-950/20 cursor-pointer"
                title="Your VidyaTokens Balance - Click to open wallet"
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>{tokenService.getUserBalance(currentUser.id)} VT</span>
              </button>
            )}

            {/* Notifications Bell with real-time status */}
            {isAuthenticated && (
              <NotificationBell currentUser={currentUser} onNavigate={handleNavClick} />
            )}

            {/* User Profile Menu or Log In / Get Started */}
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    id="user-profile-menu-btn"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-full bg-slate-900/90 border border-slate-800 hover:border-orange-500/50 transition-all cursor-pointer"
                  >
                    <UserInitialsBadge
                      name={currentUser.name}
                      role={currentUser.role}
                      size="xs"
                    />
                    <div className="hidden md:flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-200 leading-none">
                        {currentUser.name}
                      </span>
                      <span className="text-[10px] text-orange-400 font-semibold leading-tight">
                        {currentUser.role === 'admin' ? 'Sole Admin' : 'Student'}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 opacity-80" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div
                      id="user-profile-dropdown"
                      className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0c1228] border border-slate-700/80 shadow-2xl p-2.5 z-50 backdrop-blur-2xl animate-fadeIn space-y-1"
                    >
                      {/* User Mini Card */}
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
                        <UserInitialsBadge
                          name={currentUser.name}
                          role={currentUser.role}
                          size="md"
                        />
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-black bg-orange-500/20 text-orange-300 border border-orange-500/30">
                            {currentUser.role === 'admin' ? 'Sole Administrator' : 'Student Account'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-1 space-y-1">
                        {currentUser.role === 'admin' ? (
                          <>
                            <button
                              id="user-menu-admin-portal-btn"
                              onClick={() => handleNavClick('admin')}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/40 border border-rose-500/30 hover:bg-rose-900/50 transition-colors text-left"
                            >
                              <ShieldCheck className="w-4 h-4 text-rose-400" />
                              <span>Admin Dashboard</span>
                            </button>

                            <button
                              id="user-menu-admin-tokens-btn"
                              onClick={() => handleNavClick('admin_tokens')}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-orange-300 hover:bg-slate-800/70 transition-colors text-left"
                            >
                              <Coins className="w-4 h-4 text-orange-400" />
                              <span>VidyaTokens Economy</span>
                            </button>

                            <button
                              id="user-menu-analytics-btn"
                              onClick={() => handleNavClick('admin_analytics')}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-cyan-300 hover:bg-slate-800/70 transition-colors text-left"
                            >
                              <BarChart3 className="w-4 h-4 text-cyan-400" />
                              <span>Analytics & Insights</span>
                            </button>

                            <button
                              id="user-menu-reports-btn"
                              onClick={() => handleNavClick('admin_reports')}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800/70 transition-colors text-left"
                            >
                              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                              <span>Reports & CSV Export</span>
                            </button>

                            <button
                              id="user-menu-profile-btn"
                              onClick={() => handleNavClick('profile')}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800/70 transition-colors text-left"
                            >
                              <UserIcon className="w-4 h-4 text-cyan-400" />
                              <span>Admin Profile</span>
                            </button>

                            <button
                              id="user-menu-notifications-btn"
                              onClick={() => handleNavClick('notifications')}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800/70 transition-colors text-left"
                            >
                              <Bell className="w-4 h-4 text-amber-400" />
                              <span>Notifications & Alerts</span>
                            </button>

                            <button
                              id="user-menu-activity-btn"
                              onClick={() => handleNavClick('activity')}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800/70 transition-colors text-left"
                            >
                              <Activity className="w-4 h-4 text-purple-400" />
                              <span>Platform Activity Stream</span>
                            </button>

                            <button
                              id="user-menu-dashboard-btn"
                              onClick={() => handleNavClick('dashboard')}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800/70 transition-colors text-left"
                            >
                              <LayoutDashboard className="w-4 h-4 text-blue-400" />
                              <span>Student Dashboard View</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              id="user-menu-dashboard-btn"
                              onClick={() => handleNavClick('dashboard')}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800/70 transition-colors text-left"
                            >
                              <LayoutDashboard className="w-4 h-4 text-blue-400" />
                              <span>Student Dashboard</span>
                            </button>

                            <button
                              id="user-menu-wallet-btn"
                              onClick={() => handleNavClick('wallet')}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-orange-300 bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition-colors text-left"
                            >
                              <Coins className="w-4 h-4 text-orange-400" />
                              <span>My Token Wallet ({tokenService.getUserBalance(currentUser.id)} VT)</span>
                            </button>

                            <button
                              id="user-menu-wallet-buy-btn"
                              onClick={() => handleNavClick('wallet_buy')}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800/70 transition-colors text-left"
                            >
                              <Wallet className="w-4 h-4 text-emerald-400" />
                              <span>Buy VidyaTokens</span>
                            </button>

                            <button
                              id="user-menu-wallet-earn-btn"
                              onClick={() => handleNavClick('wallet_earn')}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800/70 transition-colors text-left"
                            >
                              <Sparkles className="w-4 h-4 text-cyan-400" />
                              <span>Learn & Earn Rewards</span>
                            </button>

                            <button
                              id="user-menu-notifications-btn"
                              onClick={() => handleNavClick('notifications')}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800/70 transition-colors text-left"
                            >
                              <Bell className="w-4 h-4 text-amber-400" />
                              <span>My Notifications</span>
                            </button>

                            <button
                              id="user-menu-activity-btn"
                              onClick={() => handleNavClick('activity')}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800/70 transition-colors text-left"
                            >
                              <Activity className="w-4 h-4 text-purple-400" />
                              <span>My Learning Activity</span>
                            </button>

                            <button
                              id="user-menu-profile-btn"
                              onClick={() => handleNavClick('profile')}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800/70 transition-colors text-left"
                            >
                              <UserIcon className="w-4 h-4 text-cyan-400" />
                              <span>My Profile & Preferences</span>
                            </button>

                            <button
                              id="user-menu-saved-btn"
                              onClick={() => handleNavClick('saved_content')}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800/70 transition-colors text-left"
                            >
                              <BookOpen className="w-4 h-4 text-amber-400" />
                              <span>Saved Learning Resources</span>
                            </button>
                          </>
                        )}

                        <button
                          id="user-menu-settings-btn"
                          onClick={() => handleNavClick('settings_notifications')}
                          className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800/70 transition-colors text-left"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span>Notification Settings</span>
                        </button>

                        <div className="border-t border-slate-800/80 my-1" />

                        <button
                          id="user-menu-logout-btn"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onLogout();
                          }}
                          className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/30 transition-all text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-rose-400" />
                          <span>Log Out of YuvaSetu</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct Visible 1-Click Logout Button for all Logged-in Users */}
                <button
                  id="navbar-desktop-logout-btn"
                  onClick={onLogout}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/30 hover:border-rose-400/60 text-rose-300 hover:text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                  title="Log out of YuvaSetu"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  id="nav-login-btn"
                  onClick={() => onOpenAuth('student_login')}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-slate-700 transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-orange-400" />
                  <span>Login</span>
                </button>

                <button
                  id="nav-get-started-btn"
                  onClick={() => onOpenAuth('register')}
                  className="btn-yuva-primary text-xs sm:text-sm py-2 px-3.5 sm:px-4 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                </button>
              </div>
            )}

            {/* Mobile Quick Logout for Authenticated Users */}
            {isAuthenticated && (
              <button
                id="mobile-header-quick-logout-btn"
                onClick={onLogout}
                className="md:hidden flex items-center justify-center p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-100 transition-all cursor-pointer"
                title="Log out of YuvaSetu"
                aria-label="Log out of YuvaSetu"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-nav-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Open mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE EXPANDED DRAWER */}
      {isMobileMenuOpen && (
        <div id="mobile-nav-drawer" className="lg:hidden border-t border-slate-800 bg-[#080b14]/98 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
            <YuvaSetuLogo variant="horizontal" size="sm" showTagline={true} />
            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded-full border border-cyan-800/40">
              {isAuthenticated ? (currentUser?.role === 'admin' ? 'Sole Admin' : 'Student') : 'Official Platform'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {activeNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'bg-slate-900/70 text-slate-300 border border-slate-800/80 hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-800 space-y-2.5">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <UserInitialsBadge
                    name={currentUser?.name || 'User'}
                    role={currentUser?.role}
                    size="sm"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">{currentUser?.name}</p>
                    <p className="text-[10px] text-slate-400">{currentUser?.email}</p>
                    <span className="text-[9px] font-bold text-cyan-400">
                      {currentUser?.role === 'admin' ? 'Sole Administrator' : 'Student Account'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Full-width prominent mobile logout button */}
              <button
                id="mobile-drawer-logout-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 hover:text-white font-bold text-xs transition-all shadow-sm cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Log Out of YuvaSetu</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <button
                id="mobile-nav-login-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuth('student_login');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-100 text-xs font-bold text-center cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-orange-400" />
                <span>Login</span>
              </button>
              <button
                id="mobile-nav-get-started-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuth('register');
                }}
                className="btn-yuva-primary w-full py-2.5 text-xs text-center cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Get Started Free</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
