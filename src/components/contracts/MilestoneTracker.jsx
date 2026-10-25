import { DELIVERABLE_STATUS as STATUS } from '@/constants';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const FREELANCER_STATUSES = [STATUS.NOT_STARTED, STATUS.IN_PROGRESS, STATUS.SUBMITTED];

export default function MilestoneTracker({ contract, isClient, busyIndex, onStatusChange, onApprove }) {
  return (
    <div className="card p-5">
      <span className="eyebrow">Escrow Tracker</span>
      <h3 className="text-base font-serif font-bold text-gold-500 mt-1">{contract.projectName}</h3>
      <p className="text-[10px] font-mono text-muted mt-1">
        {isClient ? `Freelancer: ${contract.freelancerName}` : `Client: ${contract.clientName}`}
      </p>

      <div className="mt-4 space-y-3">
        {contract.deliverables.map((item, idx) => {
          const approved = item.status === STATUS.APPROVED;
          return (
            <div key={idx} className="flex items-center justify-between gap-3 bg-panel border border-line p-3 rounded-lg text-xs">
              <div className="min-w-0">
                <span className="font-mono text-faint block">MILESTONE {String(idx + 1).padStart(2, '0')}</span>
                <span className="font-medium">{item.name}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {approved ? (
                  <Badge tone="success" className="font-bold">Approved</Badge>
                ) : isClient ? (
                  <>
                    <Badge tone="muted">{item.status}</Badge>
                    <Button
                      variant="success"
                      size="sm"
                      loading={busyIndex === idx}
                      disabled={item.status !== STATUS.SUBMITTED}
                      title={item.status !== STATUS.SUBMITTED ? 'Available once the freelancer submits this milestone' : undefined}
                      onClick={() => onApprove(idx)}
                    >
                      Approve & Pay
                    </Button>
                  </>
                ) : (
                  <select
                    value={item.status}
                    disabled={busyIndex === idx}
                    onChange={(e) => onStatusChange(idx, e.target.value)}
                    className="bg-card border border-line rounded text-[10px] px-2 py-1"
                  >
                    {FREELANCER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
