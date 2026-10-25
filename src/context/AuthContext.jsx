import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { COLLECTIONS } from '@/firebase/collections';
import { loginUser, logoutUser, registerUser } from '@/firebase/authService';
import { updateUserProfile } from '@/firebase/userService';

const AuthContext = createContext(null);

/**
 * Exposes the Firebase Auth user plus their live Firestore profile
 * (`users/{uid}`), so every page reacts instantly to profile changes.
 */
export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({ user: null, ready: false });
  const [profileState, setProfileState] = useState({ uid: null, profile: null });

  useEffect(() => onAuthStateChanged(auth, (user) => setAuthState({ user, ready: true })), []);

  const uid = authState.user?.uid ?? null;

  useEffect(() => {
    if (!uid) return undefined;
    return onSnapshot(
      doc(db, COLLECTIONS.USERS, uid),
      (snap) => setProfileState({ uid, profile: snap.exists() ? { id: snap.id, ...snap.data() } : null }),
      (error) => {
        console.error('[auth] profile listener failed', error);
        setProfileState({ uid, profile: null });
      }
    );
  }, [uid]);

  const value = useMemo(() => {
    const { user, ready } = authState;
    const profileLoaded = !user || profileState.uid === user.uid;
    return {
      user,
      profile: user && profileLoaded ? profileState.profile : null,
      // True until Firebase has told us who is signed in *and* (if someone is) loaded their profile.
      loading: !ready || (Boolean(user) && !profileLoaded),
      signUp: registerUser,
      signIn: loginUser,
      signOut: logoutUser,
      updateProfile: (data) => updateUserProfile(user.uid, data),
    };
  }, [authState, profileState]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
