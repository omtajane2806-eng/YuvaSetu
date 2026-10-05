import React, { useState } from 'react';
import { YuvaSetuLogo } from '../components/YuvaSetuLogo';
import {
  LogIn,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Lock,
  Mail,
  User as UserIcon,
  GraduationCap,
  Building2,
  BookOpen,
  Calendar,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import { User, RegisterFormData, LoginFormData, UserRole } from '../types/user';
import { authService } from '../services/authService';
import { signInWithGoogle, isFirebaseConfigured } from '../services/firebaseAuth';

export type AuthMode = 'student_login' | 'admin_login' | 'register';

export interface AuthViewProps {
  initialMode?: 'student_login' | 'admin_login' | 'register' | 'login';
  onSuccess: (user: User, requiresProfileSetup: boolean) => void;
  onCancel: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'student_login',
  onSuccess,
  onCancel,
}) => {
  // Normalize initialMode: 'login' maps to 'student_login'
  const normalizedInitialMode: AuthMode =
    initialMode === 'admin_login'
      ? 'admin_login'
      : initialMode === 'register'
      ? 'register'
      : 'student_login';

  const [mode, setMode] = useState<AuthMode>(normalizedInitialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Password visibility states
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forgot password modal state
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordNewPass, setForgotPasswordNewPass] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string | null>(null);

  // 1. Student Login State
  const [studentLoginData, setStudentLoginData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: true,
  });

  // 2. Admin Login State
  const [adminLoginData, setAdminLoginData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: true,
  });

  // 3. New Registration Form State
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    course: 'B.Tech / B.E.',
    branch: '',
    year: '1st Year',
  });

  // Field validation errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Validate Student Login
  const validateStudentLogin = (): boolean => {
    const errors: Record<string, string> = {};
    if (!studentLoginData.email.trim()) {
      errors.studentEmail = 'Student email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentLoginData.email)) {
      errors.studentEmail = 'Please enter a valid email address';
    }
    if (!studentLoginData.password) {
      errors.studentPassword = 'Password is required';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate Admin Login
  const validateAdminLogin = (): boolean => {
    const errors: Record<string, string> = {};
    if (!adminLoginData.email.trim()) {
      errors.adminEmail = 'Administrator email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminLoginData.email)) {
      errors.adminEmail = 'Please enter a valid administrator email';
    }
    if (!adminLoginData.password) {
      errors.adminPassword = 'Admin password is required';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate New Registration
  const validateRegister = (): boolean => {
    const errors: Record<string, string> = {};
    if (!registerData.name.trim()) errors.name = 'Full name is required';
    if (!registerData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!registerData.password) {
      errors.password = 'Password is required';
    } else if (registerData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (!registerData.confirmPassword) {
      errors.confirmPassword = 'Confirm your password';
    } else if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!registerData.college.trim()) errors.college = 'College/Institution is required';
    if (!registerData.branch.trim()) errors.branch = 'Course/Branch specialization is required';
    if (!registerData.year.trim()) errors.year = 'Year of study is required';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle 1. Student Login
  const handleStudentLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    if (!validateStudentLogin()) return;

    setIsLoading(true);
    try {
      const user = await authService.login(studentLoginData);
      setIsLoading(false);
      onSuccess(user, !user.isProfileSetupCompleted);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Student login failed. Please check your credentials.');
    }
  };

  // Handle 2. Admin Login
  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    if (!validateAdminLogin()) return;

    setIsLoading(true);
    try {
      // Validate specifically for Admin portal
      const user = await authService.login(adminLoginData, 'admin');
      setIsLoading(false);
      onSuccess(user, false);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Admin authentication failed. Please verify administrative credentials.');
    }
  };

  // Handle 3. New Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    if (!validateRegister()) return;

    setIsLoading(true);
    try {
      const result = await authService.register(registerData, 'student');
      setIsLoading(false);
      onSuccess(result.user, result.requiresProfileSetup);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Registration failed. Please try again.');
    }
  };

  // Handle Forgot / Reset Password
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordMessage(null);
    if (!forgotPasswordEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotPasswordEmail)) {
      setForgotPasswordMessage('Please enter a valid email address.');
      return;
    }
    setForgotPasswordLoading(true);
    try {
      const res = await authService.resetPassword(forgotPasswordEmail, forgotPasswordNewPass || undefined);
      setForgotPasswordMessage(res.message);
      setForgotPasswordSuccess(true);
    } catch (err: any) {
      setForgotPasswordMessage(err?.message || 'Failed to reset password. Please check your email.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Handle Real Google Authentication (Strictly maps to STUDENT role)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setInfoMessage(null);
    setIsGoogleLoading(true);
    try {
      const googleResult = await signInWithGoogle();
      const authOutcome = await authService.handleGoogleAuthUser({
        uid: googleResult.uid,
        email: googleResult.email,
        displayName: googleResult.displayName,
      });
      setIsGoogleLoading(false);
      onSuccess(authOutcome.user, Boolean(authOutcome.requiresProfileSetup));
    } catch (err: any) {
      setIsGoogleLoading(false);
      setErrorMessage(
        err?.message ||
          'Google authentication could not be completed. You can also sign in or register with email and password.'
      );
    }
  };

  return (
    <div
      id="yuvasetu-auth-container"
      className="min-h-[85vh] flex items-center justify-center px-4 py-10"
    >
      <div className="w-full max-w-xl bg-[#090d1c] border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-gradient-to-r from-cyan-500/20 via-amber-500/15 to-emerald-500/20 blur-3xl pointer-events-none" />

        {/* TOP: Official YuvaSetu Logo Integration */}
        <div className="flex flex-col items-center justify-center text-center pb-5 border-b border-slate-800/80">
          <YuvaSetuLogo
            id="auth-page-official-logo"
            variant="full"
            size="md"
            showTagline={true}
            className="border-0 bg-transparent shadow-none p-0"
          />
          <p className="text-xs text-slate-300 mt-2 font-medium">
            {mode === 'student_login' && '1. Student Portal — Access your study notes, rooms & doubts'}
            {mode === 'admin_login' && '2. Administrator Portal — Secure Platform Governance & Materials Control'}
            {mode === 'register' && '3. New Student Registration — 100% Free with 100 Welcome VidyaTokens (VT)'}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* THE 3-MODE PRIMARY NAVIGATION SWITCHER */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-slate-950/90 border border-slate-800 mt-5 shadow-inner">
          {/* 1. Log in for Student */}
          <button
            id="auth-tab-student-login"
            type="button"
            onClick={() => {
              setMode('student_login');
              setErrorMessage(null);
              setInfoMessage(null);
              setFieldErrors({});
            }}
            className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 cursor-pointer ${
              mode === 'student_login'
                ? 'bg-gradient-to-r from-cyan-950 to-blue-950 text-cyan-300 shadow-md border border-cyan-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <GraduationCap className={`w-4 h-4 shrink-0 ${mode === 'student_login' ? 'text-cyan-400' : 'text-slate-500'}`} />
            <span className="truncate text-center">1. Student Login</span>
          </button>

          {/* 2. Log in for Admin */}
          <button
            id="auth-tab-admin-login"
            type="button"
            onClick={() => {
              setMode('admin_login');
              setErrorMessage(null);
              setInfoMessage(null);
              setFieldErrors({});
            }}
            className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 cursor-pointer ${
              mode === 'admin_login'
                ? 'bg-gradient-to-r from-amber-950 to-orange-950 text-amber-300 shadow-md border border-amber-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 shrink-0 ${mode === 'admin_login' ? 'text-amber-400' : 'text-slate-500'}`} />
            <span className="truncate text-center">2. Admin Login</span>
          </button>

          {/* 3. New Registration */}
          <button
            id="auth-tab-register"
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
              setInfoMessage(null);
              setFieldErrors({});
            }}
            className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 cursor-pointer ${
              mode === 'register'
                ? 'bg-gradient-to-r from-emerald-950 to-teal-950 text-emerald-300 shadow-md border border-emerald-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <UserPlus className={`w-4 h-4 shrink-0 ${mode === 'register' ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span className="truncate text-center">3. New Registration</span>
          </button>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Global Info Banner */}
        {infoMessage && (
          <div className="mt-4 p-3 rounded-xl bg-cyan-950/60 border border-cyan-800/80 text-cyan-300 text-xs flex items-start gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* OPTION 1: LOG IN FOR STUDENT */}
        {/* ========================================================================= */}
        {mode === 'student_login' && (
          <div className="mt-5 space-y-4 animate-fadeIn">
            {/* Header pill */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-cyan-300 uppercase tracking-wider">
                    Option 1: Log in for Student
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Sign in to your student learning hub & peer notes
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-900/50 text-cyan-300 border border-cyan-700/50 hidden sm:inline-block">
                Student Portal
              </span>
            </div>

            {/* Real Firebase Google Sign-In */}
            <button
              id="student-google-signin-btn"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white font-bold text-xs shadow-lg transition-all cursor-pointer group"
            >
              {isGoogleLoading ? (
                <span className="inline-block animate-spin text-cyan-400">⟳ Connecting to Google...</span>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                  <span className="text-[10px] text-cyan-400 font-medium px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 ml-auto">
                    Instant Access
                  </span>
                </>
              )}
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-slate-800/80" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                Or continue with email
              </span>
              <div className="flex-1 h-px bg-slate-800/80" />
            </div>

            <form onSubmit={handleStudentLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Student Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="student-email-input"
                    type="email"
                    required
                    placeholder="e.g. aryan@yuvasetu.com or your registered email"
                    value={studentLoginData.email}
                    onChange={(e) =>
                      setStudentLoginData({ ...studentLoginData, email: e.target.value })
                    }
                    className={`w-full bg-slate-950 border ${
                      fieldErrors.studentEmail ? 'border-rose-500' : 'border-slate-800'
                    } rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500`}
                  />
                </div>
                {fieldErrors.studentEmail && (
                  <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.studentEmail}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-300">
                    Password <span className="text-rose-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(true)}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="student-password-input"
                    type={showStudentPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your student password"
                    value={studentLoginData.password}
                    onChange={(e) =>
                      setStudentLoginData({ ...studentLoginData, password: e.target.value })
                    }
                    className={`w-full bg-slate-950 border ${
                      fieldErrors.studentPassword ? 'border-rose-500' : 'border-slate-800'
                    } rounded-xl pl-9 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowStudentPassword(!showStudentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showStudentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.studentPassword && (
                  <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.studentPassword}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="student-remember-checkbox"
                  checked={studentLoginData.rememberMe}
                  onChange={(e) =>
                    setStudentLoginData({ ...studentLoginData, rememberMe: e.target.checked })
                  }
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
                <label htmlFor="student-remember-checkbox" className="text-xs text-slate-300 cursor-pointer">
                  Keep me logged in across browser sessions
                </label>
              </div>

              {/* Login Button */}
              <button
                id="student-login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/25 hover:opacity-95 transition-all mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <span className="inline-block animate-spin text-sm">⟳ Authenticating Student...</span>
                ) : (
                  <>
                    <GraduationCap className="w-4 h-4" />
                    <span>Log In as Student</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Student Helper */}
            <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-900/40 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-slate-400 text-[11px]">Need to test student features?</span>
              <button
                type="button"
                onClick={() => {
                  setStudentLoginData({
                    email: 'aryan@yuvasetu.com',
                    password: 'password123',
                    rememberMe: true,
                  });
                  setFieldErrors({});
                }}
                className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 text-[11px] font-bold transition-colors cursor-pointer shrink-0"
              >
                ⚡ Fill Demo (Aryan Sharma)
              </button>
            </div>

            {/* Quick Switch to New Registration */}
            <div className="pt-3 border-t border-slate-800/80 text-center">
              <p className="text-xs text-slate-400">
                Don't have a student account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage(null);
                  }}
                  className="text-cyan-400 font-bold hover:underline ml-1 cursor-pointer"
                >
                  Create Free Account (3. New Registration) →
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* OPTION 2: LOG IN FOR ADMIN */}
        {/* ========================================================================= */}
        {mode === 'admin_login' && (
          <div className="mt-5 space-y-4 animate-fadeIn">
            {/* Header pill */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider">
                    Option 2: Log in for Admin
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    YuvaSetu Platform Administration & Governance Portal
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-900/50 text-amber-300 border border-amber-700/50 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                Console
              </span>
            </div>

            {/* Admin Governance Notice */}
            <div className="p-3 rounded-xl bg-amber-950/25 border border-amber-500/25 text-xs text-amber-200/90 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <span className="font-bold text-amber-300">Platform Administrators:</span> Access verified curriculum approvals, student management, and platform analytics. Lead Administrator: <span className="font-mono text-amber-200 font-bold">omtajane2806@gmail.com</span>.
              </div>
            </div>

            {/* Quick Admin Autofill Buttons */}
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 flex flex-col gap-2">
              <span className="text-[11px] font-bold text-amber-300">Quick Administrator Fill:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAdminLoginData({
                      email: 'omtajane2806@gmail.com',
                      password: 'Omtajane2831',
                      rememberMe: true,
                    });
                    setFieldErrors({});
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-900/60 hover:bg-amber-900 border border-amber-600/60 text-amber-200 text-[11px] font-bold transition-all cursor-pointer shadow"
                >
                  ⚡ Lead Admin (Om Tajane)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAdminLoginData({
                      email: 'ranjanzambare9119@gmail.com',
                      password: 'admin123',
                      rememberMe: true,
                    });
                    setFieldErrors({});
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold transition-all cursor-pointer shadow"
                >
                  ⚡ Admin (Ranjan Zambare)
                </button>
              </div>
            </div>

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Administrator Email <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="admin-email-input"
                    type="email"
                    required
                    placeholder="omtajane2806@gmail.com or authorized admin email"
                    value={adminLoginData.email}
                    onChange={(e) =>
                      setAdminLoginData({ ...adminLoginData, email: e.target.value })
                    }
                    className={`w-full bg-slate-950 border ${
                      fieldErrors.adminEmail ? 'border-rose-500' : 'border-slate-800'
                    } rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500`}
                  />
                </div>
                {fieldErrors.adminEmail && (
                  <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.adminEmail}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-300">
                    Administrator Password <span className="text-rose-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(true)}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="admin-password-input"
                    type={showAdminPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter administrator password"
                    value={adminLoginData.password}
                    onChange={(e) =>
                      setAdminLoginData({ ...adminLoginData, password: e.target.value })
                    }
                    className={`w-full bg-slate-950 border ${
                      fieldErrors.adminPassword ? 'border-rose-500' : 'border-slate-800'
                    } rounded-xl pl-9 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.adminPassword && (
                  <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.adminPassword}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="admin-remember-checkbox"
                  checked={adminLoginData.rememberMe}
                  onChange={(e) =>
                    setAdminLoginData({ ...adminLoginData, rememberMe: e.target.checked })
                  }
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="admin-remember-checkbox" className="text-xs text-slate-300 cursor-pointer">
                  Keep admin session active across browser windows
                </label>
              </div>

              {/* Admin Login Button */}
              <button
                id="admin-login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white font-extrabold text-sm shadow-xl shadow-amber-600/25 hover:opacity-95 transition-all mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <span className="inline-block animate-spin text-sm">⟳ Verifying Administrator...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Log In to Admin Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Switch to Student Login */}
            <div className="pt-3 border-t border-slate-800/80 text-center">
              <p className="text-xs text-slate-400">
                Are you a student looking for your dashboard?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('student_login');
                    setErrorMessage(null);
                  }}
                  className="text-cyan-400 font-bold hover:underline ml-1 cursor-pointer"
                >
                  Switch to 1. Log in for Student →
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* OPTION 3: NEW REGISTRATION */}
        {/* ========================================================================= */}
        {mode === 'register' && (
          <div className="mt-5 space-y-4 animate-fadeIn">
            {/* Header pill */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-emerald-300 uppercase tracking-wider">
                    Option 3: New Student Registration
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Create your 100% Free student account in 30 seconds
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-900/50 text-emerald-300 border border-emerald-700/50 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                100 Free VT
              </span>
            </div>

            {/* Quick 1-Click Registration with Google */}
            <button
              id="register-google-signin-btn"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/30 hover:border-emerald-500/60 text-white font-bold text-xs shadow-lg transition-all cursor-pointer group"
            >
              {isGoogleLoading ? (
                <span className="inline-block animate-spin text-emerald-400">⟳ Creating Account with Google...</span>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign Up with Google</span>
                  <span className="text-[10px] text-emerald-400 font-medium px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60 ml-auto">
                    Instant 100 VT
                  </span>
                </>
              )}
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-slate-800/80" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                Or fill student details
              </span>
              <div className="flex-1 h-px bg-slate-800/80" />
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Free Guarantee Banner */}
              <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Free student account. No payment or credit card required.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="register-name-input"
                      type="text"
                      required
                      placeholder="e.g. Aryan Sharma"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      className={`w-full bg-slate-950 border ${
                        fieldErrors.name ? 'border-rose-500' : 'border-slate-800'
                      } rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500`}
                    />
                  </div>
                  {fieldErrors.name && (
                    <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.name}</p>
                  )}
                </div>

                {/* Email Address */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="register-email-input"
                      type="email"
                      required
                      placeholder="e.g. aryan@college.ac.in"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className={`w-full bg-slate-950 border ${
                        fieldErrors.email ? 'border-rose-500' : 'border-slate-800'
                      } rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Create Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="register-password-input"
                      type={showRegisterPassword ? 'text' : 'password'}
                      required
                      placeholder="At least 6 characters"
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, password: e.target.value })
                      }
                      className={`w-full bg-slate-950 border ${
                        fieldErrors.password ? 'border-rose-500' : 'border-slate-800'
                      } rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showRegisterPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Confirm Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="register-confirm-password-input"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Repeat password"
                      value={registerData.confirmPassword}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, confirmPassword: e.target.value })
                      }
                      className={`w-full bg-slate-950 border ${
                        fieldErrors.confirmPassword ? 'border-rose-500' : 'border-slate-800'
                      } rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.confirmPassword}</p>
                  )}
                </div>

                {/* College / Institution */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    College / Institution <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="register-college-input"
                      type="text"
                      required
                      placeholder="e.g. IIT Bombay / COEP / Delhi University"
                      value={registerData.college}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, college: e.target.value })
                      }
                      className={`w-full bg-slate-950 border ${
                        fieldErrors.college ? 'border-rose-500' : 'border-slate-800'
                      } rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500`}
                    />
                  </div>
                  {fieldErrors.college && (
                    <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.college}</p>
                  )}
                </div>

                {/* Branch / Stream */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Branch / Stream <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="register-branch-input"
                      type="text"
                      required
                      placeholder="e.g. Computer Science"
                      value={registerData.branch}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, branch: e.target.value })
                      }
                      className={`w-full bg-slate-950 border ${
                        fieldErrors.branch ? 'border-rose-500' : 'border-slate-800'
                      } rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500`}
                    />
                  </div>
                  {fieldErrors.branch && (
                    <p className="text-[11px] text-rose-400 mt-1">{fieldErrors.branch}</p>
                  )}
                </div>

                {/* Year of Study */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Year of Study <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      id="register-year-select"
                      value={registerData.year}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, year: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Registration Button */}
              <button
                id="register-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/25 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all mt-3 cursor-pointer"
              >
                {isLoading ? (
                  <span className="inline-block animate-spin text-sm">⟳ Creating Account...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Complete Free Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Switch to Student Login */}
            <div className="pt-3 border-t border-slate-800/80 text-center">
              <p className="text-xs text-slate-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('student_login');
                    setErrorMessage(null);
                  }}
                  className="text-cyan-400 font-bold hover:underline ml-1 cursor-pointer"
                >
                  Log In as Student (1. Student Login) →
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Cancel / Close back */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
          >
            ← Return to Homepage
          </button>
        </div>
      </div>

      {/* FORGOT / RESET PASSWORD MODAL */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0d1222] border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setShowForgotPasswordModal(false);
                setForgotPasswordSuccess(false);
                setForgotPasswordMessage(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <h3 className="text-base font-extrabold text-white">Reset Account Password</h3>
            </div>

            {forgotPasswordSuccess ? (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 inline-block mr-1 text-emerald-400" />
                  {forgotPasswordMessage || `Password updated successfully for ${forgotPasswordEmail}. You can now log in immediately.`}
                </div>
                <button
                  onClick={() => {
                    setShowForgotPasswordModal(false);
                    setForgotPasswordSuccess(false);
                    setForgotPasswordMessage(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <p className="text-xs text-slate-300">
                  Enter your registered college or administrator email address and your new desired password to instantly update your credentials.
                </p>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. omtajane2806@gmail.com or aryan@yuvasetu.com"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">New Password (or leave blank for default)</label>
                  <input
                    type="text"
                    placeholder="Enter new password or leave blank for default"
                    value={forgotPasswordNewPass}
                    onChange={(e) => setForgotPasswordNewPass(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Default reset passwords: <span className="text-cyan-300 font-bold">Omtajane2831</span> for Om Tajane, <span className="text-cyan-300 font-bold">password123</span> for student accounts.
                  </p>
                </div>
                {forgotPasswordMessage && (
                  <p className="text-xs text-rose-400">{forgotPasswordMessage}</p>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={forgotPasswordLoading}
                    onClick={() => {
                      setForgotPasswordNewPass(forgotPasswordEmail.includes('tajane') ? 'Omtajane2831' : 'password123');
                    }}
                    className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-all cursor-pointer"
                  >
                    Use Default
                  </button>
                  <button
                    type="submit"
                    disabled={forgotPasswordLoading}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all cursor-pointer"
                  >
                    {forgotPasswordLoading ? 'Updating Password...' : 'Save & Reset Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
