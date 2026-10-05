import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  UserCredential,
} from 'firebase/auth';

// Public client-side Firebase configuration (non-sensitive client credentials)
const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'yuvasetu.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'yuvasetu',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'yuvasetu.appspot.com',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: env.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(env.VITE_FIREBASE_API_KEY);
};

export const getFirebaseAuth = () => {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return getAuth(app);
};

export interface GoogleAuthResult {
  uid: string;
  email: string;
  displayName: string | null;
  idToken: string;
}

export const signInWithGoogle = async (): Promise<GoogleAuthResult> => {
  if (!isFirebaseConfigured()) {
    throw new Error(
      'Firebase Google Authentication is not configured with VITE_FIREBASE_API_KEY. Please provide Firebase credentials in Settings or continue with email/password.'
    );
  }

  try {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({
      prompt: 'select_account',
    });

    const credential: UserCredential = await signInWithPopup(auth, provider);
    const user = credential.user;

    if (!user.email) {
      throw new Error('Google account did not return an email address. Please sign in with an email that has verified address.');
    }

    const idToken = await user.getIdToken();

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      idToken,
    };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    console.error('Firebase Google Auth error:', error);

    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('The Google sign-in window was closed before completing authentication.');
    }
    if (error.code === 'auth/popup-blocked') {
      throw new Error('Google sign-in popup was blocked by your browser. Please allow popups for this site or use email and password.');
    }
    if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('Sign-in was cancelled by another action.');
    }
    if (error.code === 'auth/unauthorized-domain') {
      throw new Error('Current preview domain is not listed in Firebase Console Authorized Domains. Please add this preview domain to Firebase Authentication > Settings > Authorized domains.');
    }
    if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error during Google authentication. Please verify your internet connection.');
    }

    throw new Error(error.message || 'Failed to complete Google authentication. Please try again.');
  }
};

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
