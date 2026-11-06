import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  getAdditionalUserInfo,
  signOut as firebaseSignOut,
  UserCredential,
} from 'firebase/auth';

import firebaseAppletConfig from '../../firebase-applet-config.json';

// Public client-side Firebase configuration (non-sensitive client credentials)
const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || (firebaseAppletConfig as any)?.apiKey || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || (firebaseAppletConfig as any)?.authDomain || 'gen-lang-client-0911605900.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || (firebaseAppletConfig as any)?.projectId || 'gen-lang-client-0911605900',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || (firebaseAppletConfig as any)?.storageBucket || 'gen-lang-client-0911605900.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || (firebaseAppletConfig as any)?.messagingSenderId || '545487495045',
  appId: env.VITE_FIREBASE_APP_ID || (firebaseAppletConfig as any)?.appId || '',
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(env.VITE_FIREBASE_API_KEY || (firebaseAppletConfig as any)?.apiKey);
};

export const getFirebaseAuth = () => {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return getAuth(app);
};

// In-memory cache for Google Calendar / Meet OAuth access token
let cachedGoogleCalendarToken: { token: string; expiresAt: number; email: string } | null = null;

export const getStoredGoogleCalendarAccessToken = (): string | null => {
  if (cachedGoogleCalendarToken && cachedGoogleCalendarToken.expiresAt > Date.now()) {
    return cachedGoogleCalendarToken.token;
  }
  return null;
};

export const getStoredGoogleCalendarEmail = (): string | null => {
  if (cachedGoogleCalendarToken && cachedGoogleCalendarToken.expiresAt > Date.now()) {
    return cachedGoogleCalendarToken.email;
  }
  return null;
};

export const clearGoogleCalendarAccessToken = (): void => {
  cachedGoogleCalendarToken = null;
};

/**
 * Acquires a genuine Google Calendar OAuth 2.0 access token with
 * https://www.googleapis.com/auth/calendar.events scope via client-side Firebase Auth popup.
 */
export const acquireGoogleCalendarAccessToken = async (
  forceConsentPrompt = false
): Promise<{ accessToken: string; email: string; displayName?: string | null }> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase configuration not available. Please verify Firebase setup.');
  }

  // Return valid cached token if available and not forcing re-prompt
  if (!forceConsentPrompt) {
    const existing = getStoredGoogleCalendarAccessToken();
    if (existing && cachedGoogleCalendarToken) {
      return {
        accessToken: existing,
        email: cachedGoogleCalendarToken.email,
      };
    }
  }

  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/calendar.events');
  provider.setCustomParameters({
    prompt: forceConsentPrompt ? 'consent' : 'select_account',
    access_type: 'offline',
  });

  try {
    const credentialResult: UserCredential = await signInWithPopup(auth, provider);
    const oauthCred = GoogleAuthProvider.credentialFromResult(credentialResult);
    const accessToken = oauthCred?.accessToken;

    if (!accessToken) {
      throw new Error(
        'Google did not return an access token for Calendar. Please grant calendar permissions when prompted.'
      );
    }

    const email = credentialResult.user.email || 'omtajane2806@gmail.com';
    // Cache for 50 minutes (tokens are valid for 60 minutes)
    cachedGoogleCalendarToken = {
      token: accessToken,
      expiresAt: Date.now() + 50 * 60 * 1000,
      email,
    };

    return {
      accessToken,
      email,
      displayName: credentialResult.user.displayName,
    };
  } catch (err: unknown) {
    throw formatFirebaseAuthError(err);
  }
};

export interface OAuthAuthResult {
  uid: string;
  email: string;
  displayName: string | null;
  idToken: string;
  providerId: 'google.com' | 'apple.com' | string;
}

export type GoogleAuthResult = OAuthAuthResult;
export type AppleAuthResult = OAuthAuthResult;

export type SignInOAuthOutcome =
  | { type: 'success'; result: OAuthAuthResult }
  | { type: 'redirecting' };

export type SignInGoogleOutcome = SignInOAuthOutcome;
export type SignInAppleOutcome = SignInOAuthOutcome;

export interface SignInGoogleOptions {
  forceRedirect?: boolean;
}

export interface SignInAppleOptions {
  forceRedirect?: boolean;
}

/**
 * Detects whether the user is browsing on a mobile device or browser
 * (Android Chrome, Android WebViews, iPhone Safari, iPhone Chrome/CriOS, iPhone Firefox/FxiOS, etc.)
 */
export const isMobileBrowser = (): boolean => {
  if (typeof window === 'undefined' || !window.navigator) return false;
  const ua = (window.navigator.userAgent || '').toLowerCase();
  const isMobileUA = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|crios|fxios/i.test(ua);
  const isTouchDevice =
    ('ontouchstart' in window || (window.navigator.maxTouchPoints && window.navigator.maxTouchPoints > 0)) &&
    window.innerWidth <= 1024;
  return Boolean(isMobileUA || isTouchDevice);
};

/**
 * Formats Firebase Google authentication errors into helpful user messages.
 */
export const formatFirebaseAuthError = (err: unknown): Error => {
  const error = err as { code?: string; message?: string };
  console.error('Firebase Google Auth error:', error);

  if (!error || !error.code) {
    return new Error((err as Error)?.message || 'Failed to complete Google authentication. Please try again.');
  }

  switch (error.code) {
    case 'auth/popup-closed-by-user':
      return new Error('The Google sign-in window was closed before completing authentication. Please try again.');
    case 'auth/popup-blocked':
      return new Error('Google sign-in popup was blocked by your browser. Redirecting you to Google sign-in...');
    case 'auth/cancelled-popup-request':
      return new Error('Sign-in request was cancelled by another user action.');
    case 'auth/unauthorized-domain': {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
      return new Error(
        `Current domain (${currentHost}) is not listed in Firebase Console Authorized Domains. Please add ${currentHost} under Firebase Console > Authentication > Settings > Authorized domains.`
      );
    }
    case 'auth/network-request-failed':
      return new Error('Network error during Google authentication. Please check your internet connection and try again.');
    case 'auth/account-exists-with-different-credential':
      return new Error(
        'An account already exists with this email using different sign-in credentials. Please sign in with your email and password.'
      );
    case 'auth/user-disabled':
      return new Error('This account has been deactivated. Please contact YuvaSetu platform administration.');
    case 'auth/operation-not-allowed':
      return new Error('Google Sign-In is not enabled for this project in Firebase Console. Please verify that the Google provider is active.');
    case 'auth/invalid-credential':
      return new Error('The Google authentication credential is invalid or has expired. Please try signing in again.');
    default:
      return new Error(error.message || 'Failed to complete Google authentication. Please try again.');
  }
};

/**
 * Formats Firebase Apple authentication errors into clean, user-friendly messages.
 * Never exposes raw technical stack traces to users.
 */
export const formatFirebaseAppleAuthError = (err: unknown): Error => {
  const error = err as { code?: string; message?: string };
  console.error('Firebase Apple Auth error:', error);

  if (!error || !error.code) {
    return new Error((err as Error)?.message || 'Unable to sign in with Apple. Please try again.');
  }

  switch (error.code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return new Error('Apple Sign-In was cancelled.');
    case 'auth/popup-blocked':
      return new Error('Sign-in popup was blocked. Redirecting you to Apple Sign-In...');
    case 'auth/operation-not-allowed':
    case 'auth/configuration-not-found':
      return new Error(
        'Apple Sign-In is not enabled yet in Firebase Console. Please enable Apple under Firebase Authentication > Sign-in method.'
      );
    case 'auth/unauthorized-domain': {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
      return new Error(
        `Current domain (${currentHost}) is not authorized for Apple Sign-In. Please add ${currentHost} under Firebase Authentication > Settings > Authorized domains.`
      );
    }
    case 'auth/network-request-failed':
      return new Error('Network error during Apple authentication. Please check your internet connection and try again.');
    case 'auth/account-exists-with-different-credential':
      return new Error(
        'An account already exists with this email using a different sign-in method. Please sign in with your email/password or Google.'
      );
    case 'auth/credential-already-in-use':
      return new Error('This Apple credential is already linked to another YuvaSetu account.');
    case 'auth/user-disabled':
      return new Error('Your account could not be accessed. Please contact YuvaSetu support.');
    case 'auth/invalid-credential':
      return new Error('The Apple sign-in credential has expired or is invalid. Please try again.');
    default:
      return new Error(error.message || 'Unable to sign in with Apple. Please try again.');
  }
};

/**
 * Extracts display name from Firebase user or Apple credential additional info
 */
export const extractOAuthDisplayName = (credential: UserCredential): string | null => {
  const user = credential.user;
  if (user.displayName) return user.displayName;
  try {
    const additionalInfo = getAdditionalUserInfo(credential);
    if (additionalInfo?.profile) {
      const profile = additionalInfo.profile as any;
      if (profile.name?.firstName || profile.name?.lastName) {
        const full = [profile.name?.firstName, profile.name?.lastName].filter(Boolean).join(' ').trim();
        if (full) return full;
      }
    }
  } catch {
    // Ignore extraction errors
  }
  return null;
};

/**
 * Creates Apple OAuth Provider with standard email and name scopes
 */
export const getAppleProvider = (): OAuthProvider => {
  const provider = new OAuthProvider('apple.com');
  provider.addScope('email');
  provider.addScope('name');
  return provider;
};

/**
 * Initiates Google Authentication:
 * - On Mobile browsers: Uses signInWithRedirect() for reliable, popup-free flow.
 * - On Desktop browsers: Uses signInWithPopup() with fallback to signInWithRedirect().
 */
export const signInWithGoogle = async (options?: SignInGoogleOptions): Promise<SignInOAuthOutcome> => {
  if (!isFirebaseConfigured()) {
    throw new Error(
      'Firebase Google Authentication is not configured with VITE_FIREBASE_API_KEY. Please provide Firebase credentials or continue with email and password.'
    );
  }

  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  provider.addScope('email');
  provider.addScope('profile');
  provider.setCustomParameters({
    prompt: 'select_account',
  });

  const isMobile = isMobileBrowser();
  const shouldUseRedirect = Boolean(options?.forceRedirect || isMobile);

  if (shouldUseRedirect) {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem('yuvasetu_pending_auth_redirect', 'google.com');
        sessionStorage.setItem('yuvasetu_pending_google_redirect', 'true');
        sessionStorage.setItem('yuvasetu_redirect_timestamp', Date.now().toString());
      }
      await signInWithRedirect(auth, provider);
      return { type: 'redirecting' };
    } catch (err: unknown) {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.removeItem('yuvasetu_pending_auth_redirect');
        sessionStorage.removeItem('yuvasetu_pending_google_redirect');
        sessionStorage.removeItem('yuvasetu_redirect_timestamp');
      }
      throw formatFirebaseAuthError(err);
    }
  }

  // Desktop popup flow with redirect fallback
  try {
    const credential: UserCredential = await signInWithPopup(auth, provider);
    const user = credential.user;

    const email = user.email || (user.providerData && user.providerData[0]?.email);
    if (!email) {
      throw new Error('Google account did not return an email address. Please sign in with an email that has a verified address.');
    }

    const idToken = await user.getIdToken();

    return {
      type: 'success',
      result: {
        uid: user.uid,
        email,
        displayName: user.displayName,
        idToken,
        providerId: 'google.com',
      },
    };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
      try {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          sessionStorage.setItem('yuvasetu_pending_auth_redirect', 'google.com');
          sessionStorage.setItem('yuvasetu_pending_google_redirect', 'true');
          sessionStorage.setItem('yuvasetu_redirect_timestamp', Date.now().toString());
        }
        await signInWithRedirect(auth, provider);
        return { type: 'redirecting' };
      } catch (redirectErr: unknown) {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          sessionStorage.removeItem('yuvasetu_pending_auth_redirect');
          sessionStorage.removeItem('yuvasetu_pending_google_redirect');
          sessionStorage.removeItem('yuvasetu_redirect_timestamp');
        }
        throw formatFirebaseAuthError(redirectErr);
      }
    }

    throw formatFirebaseAuthError(err);
  }
};

/**
 * Initiates Apple Authentication:
 * - Uses Firebase OAuthProvider('apple.com')
 * - On Mobile browsers (iPhone/iPad Safari, Chrome, etc.): Uses signInWithRedirect()
 * - On Desktop browsers: Uses signInWithPopup() with fallback to signInWithRedirect()
 * - Never collects or renders profile photos (zero profile picture rule)
 * - Accepts standard emails as well as Apple private relay emails (@privaterelay.appleid.com)
 */
export const signInWithApple = async (options?: SignInAppleOptions): Promise<SignInOAuthOutcome> => {
  if (!isFirebaseConfigured()) {
    throw new Error('Apple Sign-In is not configured yet. Firebase credentials required.');
  }

  const auth = getFirebaseAuth();
  const provider = getAppleProvider();

  const isMobile = isMobileBrowser();
  const shouldUseRedirect = Boolean(options?.forceRedirect || isMobile);

  if (shouldUseRedirect) {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem('yuvasetu_pending_auth_redirect', 'apple.com');
        sessionStorage.setItem('yuvasetu_pending_apple_redirect', 'true');
        sessionStorage.setItem('yuvasetu_redirect_timestamp', Date.now().toString());
      }
      await signInWithRedirect(auth, provider);
      return { type: 'redirecting' };
    } catch (err: unknown) {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.removeItem('yuvasetu_pending_auth_redirect');
        sessionStorage.removeItem('yuvasetu_pending_apple_redirect');
        sessionStorage.removeItem('yuvasetu_redirect_timestamp');
      }
      throw formatFirebaseAppleAuthError(err);
    }
  }

  // Desktop popup flow with fallback to redirect
  try {
    const credential: UserCredential = await signInWithPopup(auth, provider);
    const user = credential.user;

    const email =
      user.email ||
      (user.providerData && user.providerData[0]?.email) ||
      (user.uid ? `apple_${user.uid.substring(0, 10)}@privaterelay.appleid.com` : '');
    if (!email) {
      throw new Error('Apple did not share an email address. Please try signing in again and choose "Share My Email" or use email/password.');
    }

    const idToken = await user.getIdToken();
    const displayName = extractOAuthDisplayName(credential);

    return {
      type: 'success',
      result: {
        uid: user.uid,
        email,
        displayName,
        idToken,
        providerId: 'apple.com',
      },
    };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
      try {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          sessionStorage.setItem('yuvasetu_pending_auth_redirect', 'apple.com');
          sessionStorage.setItem('yuvasetu_pending_apple_redirect', 'true');
          sessionStorage.setItem('yuvasetu_redirect_timestamp', Date.now().toString());
        }
        await signInWithRedirect(auth, provider);
        return { type: 'redirecting' };
      } catch (redirectErr: unknown) {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          sessionStorage.removeItem('yuvasetu_pending_auth_redirect');
          sessionStorage.removeItem('yuvasetu_pending_apple_redirect');
          sessionStorage.removeItem('yuvasetu_redirect_timestamp');
        }
        throw formatFirebaseAppleAuthError(redirectErr);
      }
    }

    throw formatFirebaseAppleAuthError(err);
  }
};

let checkRedirectPromise: Promise<OAuthAuthResult | null> | null = null;

/**
 * Checks for a pending or completed OAuth redirect authentication result (Google or Apple).
 * Resolves to OAuthAuthResult if returning from provider OAuth, or null if no redirect occurred.
 */
export const checkAuthRedirectResult = async (): Promise<OAuthAuthResult | null> => {
  if (!isFirebaseConfigured()) {
    return null;
  }

  if (checkRedirectPromise) {
    return checkRedirectPromise;
  }

  checkRedirectPromise = (async () => {
    const pendingProvider =
      typeof window !== 'undefined' && window.sessionStorage
        ? sessionStorage.getItem('yuvasetu_pending_auth_redirect') ||
          (sessionStorage.getItem('yuvasetu_pending_apple_redirect') === 'true' ? 'apple.com' : 'google.com')
        : 'google.com';

    try {
      const auth = getFirebaseAuth();
      const credential = await getRedirectResult(auth);
      if (!credential || !credential.user) {
        return null;
      }

      const user = credential.user;
      const email =
        user.email ||
        (user.providerData && user.providerData[0]?.email) ||
        (pendingProvider === 'apple.com' && user.uid
          ? `apple_${user.uid.substring(0, 10)}@privaterelay.appleid.com`
          : '');
      if (!email) {
        throw new Error('Authentication provider did not return a verified email address.');
      }

      const idToken = await user.getIdToken();
      const resolvedProvider =
        credential.providerId ||
        user.providerData[0]?.providerId ||
        pendingProvider;
      const displayName = extractOAuthDisplayName(credential);

      return {
        uid: user.uid,
        email,
        displayName,
        idToken,
        providerId: resolvedProvider,
      };
    } catch (err: unknown) {
      if (pendingProvider === 'apple.com') {
        throw formatFirebaseAppleAuthError(err);
      }
      throw formatFirebaseAuthError(err);
    } finally {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.removeItem('yuvasetu_pending_auth_redirect');
        sessionStorage.removeItem('yuvasetu_pending_google_redirect');
        sessionStorage.removeItem('yuvasetu_pending_apple_redirect');
        sessionStorage.removeItem('yuvasetu_redirect_timestamp');
      }
      checkRedirectPromise = null;
    }
  })();

  return checkRedirectPromise;
};

// Backward-compatible alias
export const checkGoogleRedirectResult = checkAuthRedirectResult;

/**
 * Returns true if an OAuth redirect authentication (Google or Apple) is currently pending.
 */
export const isPendingAuthRedirect = (): boolean => {
  if (typeof window === 'undefined' || !window.sessionStorage) return false;
  return (
    Boolean(sessionStorage.getItem('yuvasetu_pending_auth_redirect')) ||
    sessionStorage.getItem('yuvasetu_pending_google_redirect') === 'true' ||
    sessionStorage.getItem('yuvasetu_pending_apple_redirect') === 'true'
  );
};

export const isPendingGoogleRedirect = isPendingAuthRedirect;

export const logOutFirebase = async (): Promise<void> => {
  if (isFirebaseConfigured()) {
    try {
      const auth = getFirebaseAuth();
      await firebaseSignOut(auth);
    } catch {
      // Ignore background logout errors
    }
  }
};
