import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMyProposals } from '@/hooks/useCollections';
import { ROUTES } from '@/config/navigation';
import { PROPOSAL_STATUS } from '@/constants';
import { formatCurrency, formatDate } from '@/utils/format';
import PageContainer from '@/components/ui/PageContainer';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { PageLoader } from '@/components/ui/Spinner';

const STATUS_TONE = {
  [PROPOSAL_STATUS.HIRED]: 'success',
  [PROPOSAL_STATUS.SHORTLISTED]: 'gold',
};

export default function MyProposalsPage() {
  const { data: proposals, loading } = useMyProposals();

  return (
    <PageContainer>
      <h3 className="section-title">My Submitted Bid Packages</h3>

      {loading ? (
        <PageLoader />
      ) : proposals.length === 0 ? (
        <EmptyState
          icon={FileText}
          description="No proposals filed yet."
          action={<Link to={ROUTES.BROWSE_PROJECTS} className="btn btn-secondary btn-sm text-gold-500">Browse Projects</Link>}
        />
      ) : (
        <div className="space-y-4">
          {proposals.map((bid) => (
            <div key={bid.id} className="card p-5 flex flex-col md:flex-row justify-between gap-4 md:items-center">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold font-serif">{bid.projectTitle}</h4>
                  <Badge tone="gold">{formatCurrency(bid.bidAmount)}</Badge>
                </div>
                <p className="text-xs text-muted mt-2 line-clamp-2 italic">&ldquo;{bid.cover}&rdquo;</p>
                <div className="flex gap-2 text-[10px] text-faint font-mono mt-3">
                  <span>Bid date: {formatDate(bid.createdAt)}</span>
                  <span>•</span>
                  <span>Timeline: {bid.timeline}</span>
                </div>
              </div>
              <Badge tone={STATUS_TONE[bid.status] ?? 'muted'} className="!text-xs !px-3 !py-1 font-bold shrink-0">
                {bid.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
