import { useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useMyContracts, useMyTransactions } from '@/hooks/useCollections';
import { summarizeEarnings } from '@/utils/earnings';
import PageContainer from '@/components/ui/PageContainer';
import { PageLoader } from '@/components/ui/Spinner';
import EarningsStats from '@/components/earnings/EarningsStats';
import EarningsCharts from '@/components/earnings/EarningsCharts';
import TransactionsTable from '@/components/earnings/TransactionsTable';
import WithdrawModal from '@/components/earnings/WithdrawModal';

export default function EarningsPage() {
  const { user } = useAuth();
  const { data: transactions, loading } = useMyTransactions();
  const { data: contracts } = useMyContracts();
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const summary = useMemo(
    () => summarizeEarnings(transactions, contracts.filter((c) => c.freelancerId === user.uid)),
    [transactions, contracts, user.uid]
  );

  if (loading) return <PageLoader />;

  return (
    <PageContainer width="2xl">
      <EarningsStats summary={summary} onWithdraw={() => setWithdrawOpen(true)} />
      <EarningsCharts monthly={summary.monthly} categoryShare={summary.categoryShare} />
      <TransactionsTable transactions={transactions} />
      <WithdrawModal open={withdrawOpen} onClose={() => setWithdrawOpen(false)} balance={summary.walletBalance} />
    </PageContainer>
  );
}
