/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { ProfileSetupModal } from './components/ProfileSetupModal';
import { OpeningAnimation } from './components/OpeningAnimation';
import { LandingPage } from './views/LandingPage';
import { ExploreView } from './views/ExploreView';
import { ContentDetailsView } from './views/ContentDetailsView';
import { UploadContentView } from './views/UploadContentView';
import { MyContentView } from './views/MyContentView';
import { SavedContentView } from './views/SavedContentView';
import { ContentPlayerView } from './views/ContentPlayerView';
import { DoubtsView } from './views/DoubtsView';
import { AskDoubtView } from './views/AskDoubtView';
import { DoubtDetailView } from './views/DoubtDetailView';
import { AdminDoubtManagementView } from './views/AdminDoubtManagementView';
import { StudyRoomsView } from './views/StudyRoomsView';
import { LiveSessionsView } from './views/LiveSessionsView';
import { DashboardView } from './views/DashboardView';
import { ProfileView } from './views/ProfileView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AdminAnalyticsView } from './views/AdminAnalyticsView';
import { AdminReportsView } from './views/AdminReportsView';
import { AdminAISettingsView } from './views/AdminAISettingsView';
import { AIAssistantView } from './views/AIAssistantView';
import { CommunityView } from './views/CommunityView';
import { CommunityCreateView } from './views/CommunityCreateView';
import { CommunityDetailView } from './views/CommunityDetailView';
import { AdminCommunityManagementView } from './views/AdminCommunityManagementView';
import { AuthView } from './views/AuthView';
import { NotificationsView } from './views/NotificationsView';
import { ActivityView } from './views/ActivityView';
import { NotificationSettingsView } from './views/NotificationSettingsView';
import { WalletView } from './views/WalletView';
import { AdminTokensView } from './views/AdminTokensView';
import { AdminSystemHealthView } from './views/AdminSystemHealthView';
import { DocumentationView } from './views/DocumentationView';
import { ErrorStateCard } from './components/ErrorStateCard';
import { User, ProfileSetupData } from './types/user';
import { authService } from './services/authService';
import { contentService } from './services/contentService';
import { sessionRoomService } from './services/sessionRoomService';
import { checkAuthRedirectResult, checkGoogleRedirectResult, isPendingAuthRedirect, isPendingGoogleRedirect } from './services/firebaseAuth';
import {
  INITIAL_COURSES,
  INITIAL_STUDY_ROOMS,
  INITIAL_DOUBTS,
  Course,
  StudyRoom,
  DoubtItem,
} from './data/platformData';

const KNOWN_VIEWS = new Set([
  'landing', 'login', 'register', 'auth', 'dashboard', 'explore', 'materials',
  'content_details', 'content_player', 'upload', 'my_content', 'saved',
  'doubts', 'doubt_detail', 'ask_doubt', 'study_rooms', 'live_sessions',
  'community', 'community_detail', 'community_create', 'notifications',
  'notification_settings', 'activity', 'profile', 'admin', 'admin_analytics',
  'admin_materials', 'admin_sessions', 'admin_rooms', 'admin_doubts',
  'admin_community', 'admin_reports', 'admin_health', 'admin_system_health',
  'admin_tokens', 'wallet', 'wallet_buy', 'wallet_earn', 'wallet_unlocked',
  'ai_assistant', 'ai_tutor', 'documentation',
]);

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());
  const [currentView, setCurrentView] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('contentId')) {
      return 'content_details';
    }
    return authService.getCurrentUser() ? 'dashboard' : 'landing';
  });
  const [activeContentId, setActiveContentId] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('contentId') || 'content-dbms-normalization';
  });
  const [activeCourseId, setActiveCourseId] = useState<string>('course-rotational-dynamics');
  const [activeRoomId, setActiveRoomId] = useState<string | undefined>(undefined);
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(undefined);
  const [activeDoubtId, setActiveDoubtId] = useState<string>('doubt-dsa-1');
  const [activeDiscussionId, setActiveDiscussionId] = useState<string>('disc-graph-djikstra');
  const [communityInitialTab, setCommunityInitialTab] = useState<
    'all' | 'popular' | 'unanswered' | 'following' | 'my'
  >('all');
  const [adminStudentId, setAdminStudentId] = useState<string | undefined>(undefined);
  const [aiMaterialId, setAiMaterialId] = useState<string | undefined>(undefined);
  const [aiTopic, setAiTopic] = useState<string | undefined>(undefined);
  const [doubtsInitialTab, setDoubtsInitialTab] = useState<'recent' | 'popular' | 'my_doubts' | 'unanswered'>('recent');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'student_login' | 'admin_login' | 'register' | 'login'>('student_login');
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [redirectAuthError, setRedirectAuthError] = useState<string | null>(null);
  const [isCompletingRedirect, setIsCompletingRedirect] = useState<boolean>(() => {
    return isPendingGoogleRedirect();
  });
  const [showProfileSetup, setShowProfileSetup] = useState<boolean>(false);
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    return !sessionStorage.getItem('yuvasetu_intro_played');
  });

  // Dynamic state arrays
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [studyRooms, setStudyRooms] = useState<StudyRoom[]>(INITIAL_STUDY_ROOMS);
  const [doubts, setDoubts] = useState<DoubtItem[]>(INITIAL_DOUBTS);

  const isAuthenticated = !!currentUser;

  // Handle URL share params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedId = params.get('contentId');
    if (sharedId) {
      setActiveContentId(sharedId);
      setCurrentView('content_details');
    }

    // Background sync with SQLite backend
    authService.refreshUsersFromBackend().catch(() => {});
    contentService.syncMaterialsFromBackend().catch(() => {});
    sessionRoomService.syncRoomsFromBackend().catch(() => {});
    sessionRoomService.syncSessionsFromBackend().catch(() => {});
  }, []);

  // Check for returning Google or Apple redirect authentication (Android, iOS Safari/Chrome, etc.)
  useEffect(() => {
    let isMounted = true;

    const handleCheckRedirect = async () => {
      try {
        const oauthResult = await checkAuthRedirectResult();
        if (!isMounted) return;

        if (oauthResult) {
          let authOutcome;
          if (oauthResult.providerId === 'apple.com') {
            authOutcome = await authService.handleAppleAuthUser({
              uid: oauthResult.uid,
              email: oauthResult.email,
              displayName: oauthResult.displayName,
            });
          } else {
            authOutcome = await authService.handleGoogleAuthUser({
              uid: oauthResult.uid,
              email: oauthResult.email,
              displayName: oauthResult.displayName,
            });
          }

          if (!isMounted) return;
          setIsCompletingRedirect(false);
          setRedirectAuthError(null);
          handleAuthSuccess(authOutcome.user, Boolean(authOutcome.requiresProfileSetup));
        } else {
          if (isMounted) setIsCompletingRedirect(false);
        }
      } catch (err: any) {
        if (!isMounted) return;
        setIsCompletingRedirect(false);
        const errorText = err?.message || 'Authentication could not be completed.';
        setRedirectAuthError(errorText);
        setAuthMode('student_login');
        setIsAuthOpen(true);
      }
    };

    handleCheckRedirect();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleNavigate = (view: string, payload?: any) => {
    // If trying to access protected views without being logged in, open auth modal
    const protectedViews = [
      'dashboard',
      'profile',
      'upload_content',
      'my_content',
      'saved_content',
      'notifications',
      'activity',
      'settings_notifications',
      'community_create',
      'wallet',
      'wallet_buy',
      'wallet_earn',
      'wallet_unlocked',
      'admin_tokens',
      'admin',
      'admin_students',
      'admin_admins',
      'admin_materials',
      'admin_community',
      'admin_community_reports',
      'admin_study_rooms',
      'admin_live_sessions',
      'admin_doubts',
      'admin_doubt_reports',
      'admin_analytics',
      'admin_reports',
      'admin_ai_settings',
      'admin_health',
      'admin_system_health',
    ];

    if (protectedViews.includes(view) && !currentUser) {
      setAuthMode('login');
      setIsAuthOpen(true);
      return;
    }

    // Gated admin routes: only admin can access
    const adminOnlyViews = [
      'admin',
      'admin_tokens',
      'admin_students',
      'admin_admins',
      'admin_materials',
      'admin_community',
      'admin_community_reports',
      'admin_study_rooms',
      'admin_live_sessions',
      'admin_doubts',
      'admin_doubt_reports',
      'admin_analytics',
      'admin_reports',
      'admin_ai_settings',
      'admin_health',
      'admin_system_health',
    ];

    if (adminOnlyViews.includes(view) && currentUser?.role !== 'admin') {
      setCurrentView(currentUser ? 'dashboard' : 'landing');
      return;
    }

    if (view === 'my_doubts') {
      setDoubtsInitialTab('my_doubts');
      setCurrentView('doubts');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'community_following') {
      setCommunityInitialTab('following');
      setCurrentView('community');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'community_my') {
      setCommunityInitialTab('my');
      setCurrentView('community');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (payload?.discussionId) {
      setActiveDiscussionId(payload.discussionId);
    }
    if (payload?.materialId) {
      setAiMaterialId(payload.materialId);
    }
    if (payload?.topic) {
      setAiTopic(payload.topic);
    }
    if (payload?.studentId) {
      setAdminStudentId(payload.studentId);
    }
    if (payload?.doubtId) {
      setActiveDoubtId(payload.doubtId);
    }
    if (payload?.contentId) {
      setActiveContentId(payload.contentId);
    }
    if (payload?.courseId) {
      setActiveCourseId(payload.courseId);
    }
    if (payload?.roomId) {
      setActiveRoomId(payload.roomId);
    }
    if (payload?.sessionId) {
      setActiveSessionId(payload.sessionId);
    }
    setIsAuthOpen(false);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'student_login' | 'admin_login' | 'register' | 'login' = 'student_login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (user: User, requiresProfileSetup: boolean) => {
    setCurrentUser(user);
    setIsAuthOpen(false);

    if (requiresProfileSetup) {
      setShowProfileSetup(true);
    } else {
      if (user.role === 'admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('dashboard');
      }
    }
  };

  const handleCompleteProfileSetup = (setupData: ProfileSetupData) => {
    if (!currentUser) return;
    const updated = authService.saveProfileSetup(currentUser.id, setupData);
    setCurrentUser(updated);
    setShowProfileSetup(false);
    setCurrentView('dashboard');
  };

  const handleUpdateUserProfile = (updatedUser: User) => {
    const saved = authService.updateProfile(updatedUser.id, updatedUser);
    setCurrentUser(saved);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const handleAddDoubt = (newDoubt: DoubtItem) => {
    setDoubts((prev) => [newDoubt, ...prev]);
  };

  const currentCourse = courses.find((c) => c.id === activeCourseId) || courses[0];

  return (
    <div
      id="yuvasetu-root-app"
      className="min-h-screen bg-[#070913] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-white"
    >
      {/* BRANDED OPENING ANIMATION SEQUENCE */}
      {showIntro && (
        <OpeningAnimation onComplete={() => setShowIntro(false)} />
      )}

      {/* GLOBAL TOP NAVIGATION */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenProfileSetup={() => setShowProfileSetup(true)}
      />

      {/* POST-REGISTRATION PROFILE SETUP ONBOARDING MODAL */}
      {showProfileSetup && currentUser && (
        <ProfileSetupModal
          user={currentUser}
          onComplete={handleCompleteProfileSetup}
          onSkip={() => {
            setShowProfileSetup(false);
            setCurrentView('dashboard');
          }}
        />
      )}

      {/* OAUTH (GOOGLE / APPLE) REDIRECT COMPLETION LOADER */}
      {isCompletingRedirect && (
        <div
          id="yuvasetu-redirect-auth-loader"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070913]/95 backdrop-blur-md text-white p-6 animate-fadeIn"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-emerald-500 p-0.5 shadow-xl shadow-cyan-500/20 mb-6 animate-pulse">
            <div className="w-full h-full bg-[#070913] rounded-2xl flex items-center justify-center">
              <span className="font-['Outfit'] font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                YS
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h2 className="text-lg font-black font-['Outfit'] text-white">
              {typeof window !== 'undefined' &&
              sessionStorage.getItem('yuvasetu_pending_auth_redirect') === 'apple.com'
                ? 'Connecting with Apple...'
                : 'Connecting with Google...'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-xs text-center">
            Completing authentication for YuvaSetu ("Samajh Se Safalta Tak"). Returning to your student dashboard...
          </p>
        </div>
      )}

      {/* MAIN VIEW ROUTING */}
      <main className="flex-1 w-full">
        {isAuthOpen ? (
          <AuthView
            initialMode={authMode}
            initialError={redirectAuthError}
            onSuccess={handleAuthSuccess}
            onCancel={() => {
              setRedirectAuthError(null);
              setIsAuthOpen(false);
            }}
          />
        ) : (
          <>
            {currentView === 'landing' && (
              <LandingPage
                courses={courses}
                studyRooms={studyRooms}
                doubts={doubts}
                onNavigate={handleNavigate}
                onOpenAuth={handleOpenAuth}
              />
            )}

            {currentView === 'explore' && (
              <ExploreView
                currentUser={currentUser}
                onNavigate={handleNavigate}
                onOpenAuth={handleOpenAuth}
              />
            )}

            {currentView === 'content_details' && (
              <ContentDetailsView
                contentId={activeContentId}
                currentUser={currentUser}
                onNavigate={handleNavigate}
                onOpenAuth={handleOpenAuth}
              />
            )}

            {currentView === 'upload_content' && currentUser && (
              <UploadContentView
                currentUser={currentUser}
                onNavigate={handleNavigate}
                onUploadSuccess={() => {}}
              />
            )}

            {currentView === 'my_content' && currentUser && (
              <MyContentView
                currentUser={currentUser}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'saved_content' && currentUser && (
              <SavedContentView
                currentUser={currentUser}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'course_player' && (
              <ContentPlayerView
                course={currentCourse}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'community' && (
              <CommunityView
                currentUser={currentUser}
                onNavigate={handleNavigate}
                onOpenAuth={handleOpenAuth}
                initialTab={communityInitialTab}
              />
            )}

            {currentView === 'community_create' && (
              <CommunityCreateView
                currentUser={currentUser}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'community_detail' && (
              <CommunityDetailView
                discussionId={activeDiscussionId}
                currentUser={currentUser}
                onNavigate={handleNavigate}
                onOpenAuth={handleOpenAuth}
              />
            )}

            {currentView === 'admin_community' && currentUser?.role === 'admin' && (
              <AdminCommunityManagementView
                currentUser={currentUser}
                onNavigate={handleNavigate}
                initialTab="discussions"
              />
            )}

            {currentView === 'admin_community_reports' && currentUser?.role === 'admin' && (
              <AdminCommunityManagementView
                currentUser={currentUser}
                onNavigate={handleNavigate}
                initialTab="reports"
              />
            )}

            {currentView === 'doubts' && (
              <DoubtsView
                currentUser={currentUser}
                onNavigate={handleNavigate}
                onOpenAuth={handleOpenAuth}
                initialTab={doubtsInitialTab}
              />
            )}

            {currentView === 'ask_doubt' && (
              <AskDoubtView
                currentUser={currentUser}
                onNavigate={handleNavigate}
                onOpenAuth={handleOpenAuth}
              />
            )}

            {currentView === 'doubt_detail' && (
              <DoubtDetailView
                doubtId={activeDoubtId}
                currentUser={currentUser}
                onNavigate={handleNavigate}
                onOpenAuth={handleOpenAuth}
              />
            )}

            {currentView === 'admin_doubts' && currentUser?.role === 'admin' && (
              <AdminDoubtManagementView
                currentUser={currentUser}
                onNavigate={handleNavigate}
                defaultTab="doubts"
              />
            )}

            {currentView === 'admin_doubt_reports' && currentUser?.role === 'admin' && (
              <AdminDoubtManagementView
                currentUser={currentUser}
                onNavigate={handleNavigate}
                defaultTab="reports"
              />
            )}

            {currentView === 'study_rooms' && (
              <StudyRoomsView
                currentUser={currentUser}
                activeRoomId={activeRoomId}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'live_sessions' && (
              <LiveSessionsView
                currentUser={currentUser}
                activeSessionId={activeSessionId}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'dashboard' && currentUser && (
              <DashboardView
                user={currentUser}
                courses={courses}
                studyRooms={studyRooms}
                doubts={doubts}
                onNavigate={handleNavigate}
                onOpenProfileSetup={() => setShowProfileSetup(true)}
                onLogout={handleLogout}
              />
            )}

            {currentView === 'profile' && currentUser && (
              <ProfileView
                user={currentUser}
                onUpdateUser={handleUpdateUserProfile}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
              />
            )}

            {currentView === 'notifications' && currentUser && (
              <NotificationsView
                currentUser={currentUser}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'activity' && currentUser && (
              <ActivityView
                currentUser={currentUser}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'settings_notifications' && currentUser && (
              <NotificationSettingsView
                currentUser={currentUser}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'admin' && currentUser?.role === 'admin' && (
              <AdminDashboardView
                onNavigate={handleNavigate}
                currentUser={currentUser}
                initialTab="overview"
                onLogout={handleLogout}
              />
            )}

            {currentView === 'admin_students' && currentUser?.role === 'admin' && (
              <AdminDashboardView
                onNavigate={handleNavigate}
                currentUser={currentUser}
                initialTab="students"
                initialStudentId={adminStudentId}
                onLogout={handleLogout}
              />
            )}

            {currentView === 'admin_admins' && currentUser?.role === 'admin' && (
              <AdminDashboardView
                onNavigate={handleNavigate}
                currentUser={currentUser}
                initialTab="admins"
                onLogout={handleLogout}
              />
            )}

            {currentView === 'admin_materials' && currentUser?.role === 'admin' && (
              <AdminDashboardView
                onNavigate={handleNavigate}
                currentUser={currentUser}
                initialTab="materials"
                onLogout={handleLogout}
              />
            )}

            {currentView === 'admin_study_rooms' && currentUser?.role === 'admin' && (
              <AdminDashboardView
                onNavigate={handleNavigate}
                currentUser={currentUser}
                initialTab="study_rooms"
                onLogout={handleLogout}
              />
            )}

            {currentView === 'admin_live_sessions' && currentUser?.role === 'admin' && (
              <AdminDashboardView
                onNavigate={handleNavigate}
                currentUser={currentUser}
                initialTab="live_sessions"
                onLogout={handleLogout}
              />
            )}

            {currentView === 'admin_analytics' && currentUser?.role === 'admin' && (
              <AdminAnalyticsView
                currentUser={currentUser}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'admin_reports' && currentUser?.role === 'admin' && (
              <AdminReportsView
                currentUser={currentUser}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'admin_ai_settings' && currentUser?.role === 'admin' && (
              <AdminAISettingsView
                currentUser={currentUser}
                onNavigate={handleNavigate}
              />
            )}

            {(currentView === 'admin_health' || currentView === 'admin_system_health') && currentUser?.role === 'admin' && (
              <AdminSystemHealthView
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'wallet' && currentUser && (
              <WalletView
                currentUser={currentUser}
                onNavigate={handleNavigate}
                initialTab="wallet"
              />
            )}

            {currentView === 'wallet_buy' && currentUser && (
              <WalletView
                currentUser={currentUser}
                onNavigate={handleNavigate}
                initialTab="buy"
              />
            )}

            {currentView === 'wallet_earn' && currentUser && (
              <WalletView
                currentUser={currentUser}
                onNavigate={handleNavigate}
                initialTab="earn"
              />
            )}

            {currentView === 'wallet_unlocked' && currentUser && (
              <WalletView
                currentUser={currentUser}
                onNavigate={handleNavigate}
                initialTab="unlocked"
              />
            )}

            {currentView === 'admin_tokens' && currentUser?.role === 'admin' && (
              <AdminTokensView
                currentUser={currentUser}
                onNavigate={handleNavigate}
              />
            )}

            {(currentView === 'ai_assistant' || currentView === 'ai_tutor') && (
              <AIAssistantView
                currentUser={currentUser}
                onNavigate={handleNavigate}
                initialMaterialId={aiMaterialId}
                initialTopic={aiTopic}
              />
            )}

            {currentView === 'documentation' && (
              <DocumentationView
                onNavigate={handleNavigate}
              />
            )}

            {/* Authorization Guard: Restricted Admin Endpoints */}
            {currentView.startsWith('admin') && currentUser?.role !== 'admin' && (
              <ErrorStateCard
                type="forbidden"
                title="Administrator Access Required"
                message="This administrative dashboard is restricted to authorized YuvaSetu platform administrators. Please log in with administrator credentials."
                onNavigate={handleNavigate}
              />
            )}

            {/* 404 Guard: Unknown View Route */}
            {!KNOWN_VIEWS.has(currentView) && !currentView.startsWith('admin') && (
              <ErrorStateCard
                type="404"
                title="Page Not Found"
                message={`The requested view ("${currentView}") does not exist in YuvaSetu. Discover verified study materials or return to home.`}
                onNavigate={handleNavigate}
              />
            )}
          </>
        )}
      </main>

      {/* GLOBAL FOOTER */}
      <Footer onNavigate={handleNavigate} />

      {/* SEARCH MODAL */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        courses={courses}
        studyRooms={studyRooms}
        doubts={doubts}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
