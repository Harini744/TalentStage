import { useEffect, useState } from 'react';
import { onSnapshot } from 'firebase/firestore';

const EMPTY = [];

/**
 * Subscribe to a Firestore query in realtime.
 * Pass a memoised query (or `null` to skip). Returns { data, loading, error }.
 */
export function useFirestoreQuery(query) {
  const [result, setResult] = useState({ source: null, data: EMPTY, error: null });

  useEffect(() => {
    if (!query) return undefined;
    return onSnapshot(
      query,
      (snapshot) =>
        setResult({
          source: query,
          data: snapshot.docs.map((d) => ({ id: d.id, ...d.data() })),
          error: null,
        }),
      (error) => {
        console.error('[firestore]', error);
        setResult({ source: query, data: EMPTY, error });
      }
    );
  }, [query]);

  // `loading` is derived, so switching queries never needs a synchronous setState in the effect.
  const ready = Boolean(query) && result.source === query;
  return {
    data: ready ? result.data : EMPTY,
    loading: Boolean(query) && !ready,
    error: ready ? result.error : null,
  };
}
