import {
  addDoc, arrayRemove, arrayUnion, collection, doc, increment, serverTimestamp, setDoc, updateDoc,
} from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS, SUBCOLLECTIONS } from './collections';

export const createPost = (uid, profile, { content, category }) =>
  addDoc(collection(db, COLLECTIONS.POSTS), {
    authorId: uid,
    author: profile.name,
    avatar: profile.avatar || '',
    category,
    content,
    likes: 0,
    likedBy: [],
    comments: 0,
    createdAt: serverTimestamp(),
  });

export const togglePostLike = (postId, uid, currentlyLiked) =>
  updateDoc(doc(db, COLLECTIONS.POSTS, postId), {
    likedBy: currentlyLiked ? arrayRemove(uid) : arrayUnion(uid),
    likes: increment(currentlyLiked ? -1 : 1),
  });

/** One submission per user per challenge (doc id = uid), so resubmitting just replaces it. */
export const submitChallengeEntry = (challengeId, uid, profile, url) =>
  setDoc(doc(db, COLLECTIONS.CHALLENGES, challengeId, SUBCOLLECTIONS.SUBMISSIONS, uid), {
    userId: uid,
    userName: profile.name,
    url,
    createdAt: serverTimestamp(),
  });
