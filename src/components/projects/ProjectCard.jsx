import { formatCurrency } from '@/utils/format';
import Button from '@/components/ui/Button';

export default function ProjectCard({ project, hasBid, onView, onBid }) {
  return (
    <div className="card card-hover p-5 flex flex-col justify-between gap-4">
      <div>
        <div className="flex justify-between items-start gap-4">
          <div>
            <h4 className="text-sm font-bold font-serif text-gold-500">{project.title}</h4>
            <p className="text-[10px] text-muted font-mono mt-1">Client: {project.client?.name}</p>
          </div>
          <span className="text-xs bg-panel border border-line text-gold-500 px-3 py-1 rounded font-mono font-bold">
            {formatCurrency(project.budget)}
          </span>
        </div>
        <p className="text-xs text-muted mt-3 line-clamp-2 leading-relaxed">{project.description}</p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-line text-[10px] font-mono text-faint gap-2 flex-wrap">
        <div className="flex gap-2 items-center">
          <span className="badge badge-gold">{project.category}</span>
          <span>Level: {project.experienceLevel}</span>
          <span>• {project.proposalsCount ?? 0} bids</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onView(project)}>View Details</Button>
          <Button size="sm" disabled={hasBid} onClick={() => onBid(project)}>
            {hasBid ? 'Bid Submitted' : 'Apply & Bid'}
          </Button>
        </div>
      </div>
    </div>
  );
}
