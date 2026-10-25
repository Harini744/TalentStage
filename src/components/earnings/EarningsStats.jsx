import { formatCurrency } from '@/utils/format';
import Button from '@/components/ui/Button';

function StatCard({ label, children, valueClass = 'text-fg' }) {
  return (
    <div className="card p-4 flex flex-col justify-between">
      <span className="eyebrow">{label}</span>
      {typeof children === 'number' ? (
        <span className={`block text-2xl font-bold font-serif mt-1 ${valueClass}`}>{formatCurrency(children)}</span>
      ) : (
        children
      )}
    </div>
  );
}

export default function EarningsStats({ summary, onWithdraw }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
      <StatCard label="Wallet Balance" valueClass="text-gold-500">{summary.walletBalance}</StatCard>
      <StatCard label="Lifetime Earnings">{summary.lifetimeEarnings}</StatCard>
      <StatCard label="Pending Escrow Funds" valueClass="text-amber-500">{summary.pendingEscrow}</StatCard>
      <StatCard label="Funds Withdrawal">
        <Button size="sm" block className="mt-2" disabled={summary.walletBalance <= 0} onClick={onWithdraw}>
          Withdraw Now
        </Button>
      </StatCard>
    </div>
  );
}
