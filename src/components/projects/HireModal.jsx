import { useState } from 'react';
import { PLATFORM_FEE_RATE } from '@/constants';
import { formatCurrency } from '@/utils/format';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

export default function HireModal({ proposal, onClose, onConfirm }) {
  const [busy, setBusy] = useState(false);
  if (!proposal) return null;

  const fee = proposal.bidAmount * PLATFORM_FEE_RATE;

  const confirm = async () => {
    setBusy(true);
    await onConfirm(proposal);
    setBusy(false);
  };

  return (
    <Modal open onClose={onClose} title="Milestone Contract Setup">
      <p className="text-xs text-muted leading-normal">
        You are hiring {proposal.freelancerName}. The bid amount is held in escrow and released milestone by milestone as you approve deliverables.
      </p>
      <div className="bg-panel p-3 rounded border border-line space-y-2 text-xs font-mono">
        <div className="flex justify-between"><span>Contract Total:</span><span className="text-gold-500 font-bold">{formatCurrency(proposal.bidAmount)}</span></div>
        <div className="flex justify-between"><span>Platform Commission ({PLATFORM_FEE_RATE * 100}%):</span><span className="text-faint">{formatCurrency(fee)}</span></div>
        <div className="flex justify-between border-t border-line pt-2"><span>Freelancer Receives:</span><span className="text-emerald-400 font-bold">{formatCurrency(proposal.bidAmount - fee)}</span></div>
      </div>
      <div className="flex gap-4">
        <Button variant="outline" onClick={onClose} className="w-1/2">Cancel</Button>
        <Button loading={busy} onClick={confirm} className="w-1/2">Lock Escrow & Hire</Button>
      </div>
    </Modal>
  );
}
