import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useMyContracts } from '@/hooks/useCollections';
import { approveMilestone, updateDeliverableStatus } from '@/firebase/contractService';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';
import PageContainer from '@/components/ui/PageContainer';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { PageLoader } from '@/components/ui/Spinner';
import MilestoneTracker from '@/components/contracts/MilestoneTracker';
import DeliveryLinks from '@/components/contracts/DeliveryLinks';
import ChatPanel from '@/components/contracts/ChatPanel';

export default function ContractsPage() {
  const { user } = useAuth();
  const addToast = useToast();
  const { data: contracts, loading } = useMyContracts();
  const [selectedId, setSelectedId] = useState(null);
  const [busyIndex, setBusyIndex] = useState(null);

  // Always read the live copy so milestone changes show up instantly.
  const active = contracts.find((c) => c.id === selectedId) ?? null;
  const isClient = active?.clientId === user.uid;

  const runMilestoneAction = async (index, action, successMessage) => {
    setBusyIndex(index);
    try {
      const result = await action();
      addToast(typeof successMessage === 'function' ? successMessage(result) : successMessage);
    } catch (error) {
      console.error(error);
      addToast(`Update failed: ${error.message}`);
    } finally {
      setBusyIndex(null);
    }
  };

  const handleStatusChange = (index, status) =>
    runMilestoneAction(index, () => updateDeliverableStatus(active.id, index, status), `Milestone status: ${status}`);

  const handleApprove = (index) =>
    runMilestoneAction(
      index,
      () => approveMilestone(active.id, index),
      (net) => (net ? `Escrow released! ${formatCurrency(net)} credited to ${active.freelancerName}.` : 'Milestone already approved.')
    );

  return (
    <PageContainer width="2xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h3 className="section-title">Escrow Contracts</h3>
          {loading ? (
            <PageLoader />
          ) : contracts.length === 0 ? (
            <EmptyState description="No contracts yet. A contract is created when a client hires a freelancer from their proposals." />
          ) : (
            contracts.map((c) => {
              const done = c.deliverables.length > 0 && c.milestoneReleasedCount >= c.deliverables.length;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  className={cn(
                    'w-full p-4 rounded-xl border text-left transition-all',
                    active?.id === c.id ? 'border-gold-500 bg-card' : 'border-line bg-panel hover:border-gold-500/20'
                  )}
                >
                  <h4 className="text-xs font-bold font-serif">{c.projectName}</h4>
                  <p className="text-[10px] text-faint font-mono mt-1">
                    {c.clientId === user.uid ? `Hired ${c.freelancerName}` : `For ${c.clientName}`}
                  </p>
                  <div className="flex justify-between items-center text-[10px] text-muted font-mono mt-3">
                    <span>Value: {formatCurrency(c.totalValue)}</span>
                    <Badge tone={done ? 'success' : 'gold'}>{done ? 'Completed' : 'Active'}</Badge>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {active ? (
            <>
              <MilestoneTracker
                contract={active}
                isClient={isClient}
                busyIndex={busyIndex}
                onStatusChange={handleStatusChange}
                onApprove={handleApprove}
              />
              <DeliveryLinks contract={active} canAdd={!isClient} />
              <ChatPanel contractId={active.id} />
            </>
          ) : (
            <EmptyState
              icon={ShieldCheck}
              title="No contract selected"
              description="Select a contract from the list to track milestones and chat."
              className="h-64 flex flex-col justify-center max-w-none"
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
}
