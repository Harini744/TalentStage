import { useMemo } from 'react';
import { collection, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { COLLECTIONS, SUBCOLLECTIONS } from '@/firebase/collections';
import { useAuth } from '@/context/AuthContext';
import { useFirestoreQuery } from './useFirestoreQuery';
import { FALLBACK_CHALLENGES } from '@/constants/fallbackData';
import { PROJECT_STATUS, ROLES } from '@/constants';
import { sortByNewest } from '@/utils/format';

/**
 * Domain hooks. Every query uses a single filter (+ client-side sort) so no
 * composite Firestore indexes are required.
 */

export function useFreelancers() {
  const q = useMemo(
    () => query(collection(db, COLLECTIONS.USERS), where('role', 'in', [ROLES.FREELANCER, ROLES.BOTH])),
    []
  );
  return useFirestoreQuery(q);
}

/** Open projects on the marketplace (newest first). */
export function useOpenProjects() {
  const q = useMemo(() => query(collection(db, COLLECTIONS.PROJECTS), orderBy('createdAt', 'desc')), []);
  const { data, loading, error } = useFirestoreQuery(q);
  const open = useMemo(() => data.filter((p) => (p.status ?? PROJECT_STATUS.OPEN) === PROJECT_STATUS.OPEN), [data]);
  return { data: open, loading, error };
}

export function useMyProjects() {
  const { user } = useAuth();
  const q = useMemo(
    () => (user ? query(collection(db, COLLECTIONS.PROJECTS), where('clientId', '==', user.uid)) : null),
    [user]
  );
  const { data, loading, error } = useFirestoreQuery(q);
  return { data: useMemo(() => sortByNewest(data), [data]), loading, error };
}

/** Proposals the signed-in freelancer has submitted. */
export function useMyProposals() {
  const { user } = useAuth();
  const q = useMemo(
    () => (user ? query(collection(db, COLLECTIONS.PROPOSALS), where('freelancerId', '==', user.uid)) : null),
    [user]
  );
  const { data, loading, error } = useFirestoreQuery(q);
  return { data: useMemo(() => sortByNewest(data), [data]), loading, error };
}

/** Proposals received on the signed-in client's projects. */
export function useReceivedProposals() {
  const { user } = useAuth();
  const q = useMemo(
    () => (user ? query(collection(db, COLLECTIONS.PROPOSALS), where('clientId', '==', user.uid)) : null),
    [user]
  );
  const { data, loading, error } = useFirestoreQuery(q);
  return { data: useMemo(() => sortByNewest(data), [data]), loading, error };
}

export function useMyContracts() {
  const { user } = useAuth();
  const q = useMemo(
    () => (user ? query(collection(db, COLLECTIONS.CONTRACTS), where('participants', 'array-contains', user.uid)) : null),
    [user]
  );
  const { data, loading, error } = useFirestoreQuery(q);
  return { data: useMemo(() => sortByNewest(data), [data]), loading, error };
}

export function useContractMessages(contractId) {
  const q = useMemo(
    () =>
      contractId
        ? query(collection(db, COLLECTIONS.CONTRACTS, contractId, SUBCOLLECTIONS.MESSAGES), orderBy('createdAt', 'asc'))
        : null,
    [contractId]
  );
  return useFirestoreQuery(q);
}

export function useMyTransactions() {
  const { user } = useAuth();
  const q = useMemo(
    () => (user ? query(collection(db, COLLECTIONS.TRANSACTIONS), where('userId', '==', user.uid)) : null),
    [user]
  );
  const { data, loading, error } = useFirestoreQuery(q);
  return { data: useMemo(() => sortByNewest(data), [data]), loading, error };
}

export function useFeed() {
  const q = useMemo(
    () => query(collection(db, COLLECTIONS.POSTS), orderBy('createdAt', 'desc'), limit(50)),
    []
  );
  return useFirestoreQuery(q);
}

/** Challenges from Firestore, falling back to built-in samples when the collection is empty. */
export function useChallenges() {
  const q = useMemo(() => query(collection(db, COLLECTIONS.CHALLENGES)), []);
  const { data, loading, error } = useFirestoreQuery(q);
  return { data: data.length > 0 ? data : FALLBACK_CHALLENGES, loading, error };
}
