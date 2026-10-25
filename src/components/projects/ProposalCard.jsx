import { PROPOSAL_STATUS } from '@/constants';
import { formatCurrency } from '@/utils/format';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';

function ScoreBar({ label, value, color }) {
  return (
    <>
      <div className="flex justify-between text-[10px] font-mono mt-1.5">
        <span>{label}</span>
        <span className="text-gold-500">{value}/10</span>
      </div>
      <div className="w-full bg-card h-1.5 rounded-full overflow-hidden">
        <div className={`${color} h-full rounded-full`} style={{ width: `${value * 10}%` }} />
      </div>
    </>
  );
}

/** A received bid, optionally decorated with the AI evaluation scores. */
export default function ProposalCard({ proposal, evaluation, onHire }) {
  const hired = proposal.status === PROPOSAL_STATUS.HIRED;

  return (
    <div className={`card p-4 flex flex-col justify-between ${evaluation?.shortlist ? 'border-gold-500 card-glow' : ''}`}>
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar src={proposal.freelancerAvatar} name={proposal.freelancerName} className="w-7 h-7" />
            <span className="text-xs font-bold truncate">{proposal.freelancerName}</span>
          </div>
          <span className="text-[10px] text-gold-500 font-mono font-semibold">{formatCurrency(proposal.bidAmount)}</span>
        </div>
        <p className="text-[10px] text-muted mt-2 line-clamp-3 italic">&ldquo;{proposal.cover}&rdquo;</p>
        <p className="text-[10px] text-faint font-mono mt-1">Timeline: {proposal.timeline}</p>

        {evaluation && (
          <div className="mt-3 bg-panel p-2 rounded border border-line">
            <ScoreBar label="Relevance" value={evaluation.relevance} color="bg-emerald-400" />
            <ScoreBar label="Clarity" value={evaluation.clarity} color="bg-amber-400" />
            <ScoreBar label="Value" value={evaluation.valueForMoney} color="bg-purple-400" />
            <p className="text-[10px] text-muted mt-2 italic">&ldquo;{evaluation.recommendation}&rdquo;</p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-2 border-t border-line">
        {hired ? (
          <span className="badge badge-success w-full justify-center py-1">Contract Active</span>
        ) : (
          <Button block size="sm" onClick={() => onHire(proposal)}>Accept & Hire</Button>
        )}
      </div>
    </div>
  );
}
