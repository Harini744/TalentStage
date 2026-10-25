import { formatCurrency } from '@/utils/format';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

export default function ProjectDetailModal({ project, hasBid, onClose, onBid }) {
  if (!project) return null;

  return (
    <Modal open onClose={onClose} title={project.title}>
      <p className="text-xs text-muted leading-relaxed">{project.description}</p>

      <div className="flex gap-4 text-[10px] font-mono text-muted">
        <span>Budget: <span className="text-gold-500">{formatCurrency(project.budget)}</span></span>
        <span>Deadline: {project.deadline}</span>
        <span className="capitalize">{project.type}</span>
      </div>

      {project.skills?.length > 0 && (
        <div>
          <span className="eyebrow">Skills Map</span>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {project.skills.map((s) => <span key={s} className="chip text-gold-500">{s}</span>)}
          </div>
        </div>
      )}

      <div>
        <span className="eyebrow">Expected Deliverables</span>
        <ul className="list-disc pl-4 text-xs text-muted mt-1 space-y-1">
          {project.deliverables?.map((d, i) => <li key={i}>{d}</li>)}
        </ul>
      </div>

      <Button block disabled={hasBid} onClick={() => onBid(project)} className="!py-2.5">
        {hasBid ? 'Bid Already Submitted' : 'Submit Bid Proposal'}
      </Button>
    </Modal>
  );
}
