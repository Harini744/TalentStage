import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS } from './collections';

const userRef = (uid) => doc(db, COLLECTIONS.USERS, uid);

export const updateUserProfile = (uid, data) => updateDoc(userRef(uid), data);

export const addPortfolioItem = (uid, item) =>
  updateDoc(userRef(uid), { portfolio: arrayUnion({ id: crypto.randomUUID(), createdAt: Date.now(), ...item }) });

export const addVerifiedSkill = (uid, skill) => updateDoc(userRef(uid), { verifiedSkills: arrayUnion(skill) });

export const setFreelancerSaved = (uid, freelancerId, saved) =>
  updateDoc(userRef(uid), { savedFreelancers: saved ? arrayUnion(freelancerId) : arrayRemove(freelancerId) });

export const saveFreelancerNote = (uid, freelancerId, note) =>
  updateDoc(userRef(uid), { [`savedNotes.${freelancerId}`]: note });
