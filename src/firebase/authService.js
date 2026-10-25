import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateAuthProfile,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { COLLECTIONS } from './collections';

const AUTH_ERRORS = {
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/user-not-found': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
};

/** Turn a Firebase error into a message safe to show to users. */
export const getAuthErrorMessage = (error) => AUTH_ERRORS[error?.code] ?? error?.message ?? 'Something went wrong.';

export async function registerUser({ name, email, password, role }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const { user } = credential;

  try {
    await updateAuthProfile(user, { displayName: name });
    await setDoc(doc(db, COLLECTIONS.USERS, user.uid), {
      name,
      email,
      role,
      avatar: '',
      specialty: '',
      bio: '',
      location: '',
      hourlyRate: 0,
      skills: [],
      verifiedSkills: [],
      portfolio: [],
      savedFreelancers: [],
      savedNotes: {},
      availability: 'available',
      verified: false,
      proMember: false,
      rating: 0,
      onboardingComplete: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    // Don't leave an auth account behind without a profile document.
    await deleteUser(user).catch(() => {});
    throw error;
  }
  return user;
}

export const loginUser = (email, password) => signInWithEmailAndPassword(auth, email, password);

export const logoutUser = () => signOut(auth);
