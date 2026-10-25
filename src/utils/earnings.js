import { PLATFORM_FEE_RATE } from '@/constants';
import { toDate } from './format';

export const CHART_COLORS = ['#F5C842', '#C9A227', '#4ADE80', '#FB923C', '#60A5FA', '#F87171'];

const MONTH_LABEL = new Intl.DateTimeFormat('en-US', { month: 'short' });

/** Derives every number on the Earnings page from real transactions and contracts. */
export function summarizeEarnings(transactions, contracts, months = 6) {
  const income = transactions.filter((t) => t.type === 'Income');

  const walletBalance = transactions.reduce((sum, t) => sum + (t.net || 0), 0);
  const lifetimeEarnings = income.reduce((sum, t) => sum + (t.net || 0), 0);

  const pendingEscrow = contracts.reduce((sum, c) => {
    const total = c.deliverables?.length || 0;
    if (!total) return sum;
    const remainingGross = c.totalValue * ((total - (c.milestoneReleasedCount || 0)) / total);
    return sum + Math.round(remainingGross * (1 - PLATFORM_FEE_RATE));
  }, 0);

  // Last N calendar months, oldest first.
  const now = new Date();
  const buckets = Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, name: MONTH_LABEL.format(d), amount: 0 };
  });
  income.forEach((t) => {
    const d = toDate(t.createdAt) ?? now;
    const bucket = buckets.find((b) => b.key === `${d.getFullYear()}-${d.getMonth()}`);
    if (bucket) bucket.amount += t.net || 0;
  });

  const byCategory = {};
  income.forEach((t) => {
    const key = t.category || 'Other';
    byCategory[key] = (byCategory[key] || 0) + (t.net || 0);
  });
  const categoryShare = Object.entries(byCategory).map(([name, value], i) => ({
    name,
    value,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  return { walletBalance, lifetimeEarnings, pendingEscrow, monthly: buckets, categoryShare };
}
