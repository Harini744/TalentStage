/** Convert a Firestore Timestamp / Date / number into a Date (or null). */
export function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export const formatCurrency = (amount = 0) =>
  `$${Number(amount).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

export function formatDate(value) {
  const d = toDate(value);
  return d ? d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Just now';
}

export function timeAgo(value) {
  const d = toDate(value);
  if (!d) return 'Just now';
  const seconds = Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000));
  const units = [
    ['day', 86400],
    ['hr', 3600],
    ['min', 60],
  ];
  for (const [label, size] of units) {
    const n = Math.floor(seconds / size);
    if (n >= 1) return `${n} ${label}${label === 'day' && n > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
}

export const getInitials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('') || '?';

/** yyyy-mm-dd, `days` from today (used for form defaults). */
export function dateInputValue(days = 0) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Sort newest-first by a Firestore timestamp field (pending writes sort to the top). */
export const sortByNewest = (items, field = 'createdAt') =>
  [...items].sort((a, b) => (toDate(b[field])?.getTime() ?? Infinity) - (toDate(a[field])?.getTime() ?? Infinity));
