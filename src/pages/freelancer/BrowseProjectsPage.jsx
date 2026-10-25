import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useChallenges, useMyProposals, useOpenProjects } from '@/hooks/useCollections';
import PageContainer from '@/components/ui/PageContainer';
import { PageLoader } from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectDetailModal from '@/components/projects/ProjectDetailModal';
import BidModal from '@/components/projects/BidModal';

export default function BrowseProjectsPage() {
  const { user } = useAuth();
  const { data: projects, loading } = useOpenProjects();
  const { data: proposals } = useMyProposals();
  const { data: challenges } = useChallenges();

  const [search, setSearch] = useState('');
  const [detailProject, setDetailProject] = useState(null);
  const [bidProject, setBidProject] = useState(null);

  const biddedIds = useMemo(() => new Set(proposals.map((p) => p.projectId)), [proposals]);

  const visibleProjects = useMemo(() => {
    const term = search.trim().toLowerCase();
    return projects
      .filter((p) => p.clientId !== user.uid) // you can't bid on your own brief
      .filter(
        (p) =>
          !term ||
          p.title.toLowerCase().includes(term) ||
          p.skills?.some((s) => s.toLowerCase().includes(term))
      );
  }, [projects, search, user.uid]);

  const openBid = (project) => {
    setDetailProject(null);
    setBidProject(project);
  };

  const activeChallenges = challenges.filter((c) => c.active);

  return (
    <PageContainer width="2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
        <h3 className="text-lg font-serif font-semibold">Active Developer Briefs Marketplace</h3>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-3 w-4 h-4 text-faint" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or skill..."
            className="input pl-9 !py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <PageLoader />
          ) : visibleProjects.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No open projects found"
              description={search ? 'Try a different search term.' : 'New briefs from clients will appear here.'}
            />
          ) : (
            visibleProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                hasBid={biddedIds.has(project.id)}
                onView={setDetailProject}
                onBid={openBid}
              />
            ))
          )}
        </div>

        <aside className="space-y-4">
          <div className="card p-5">
            <h4 className="text-sm font-serif font-bold text-gold-500 mb-3 border-b border-line pb-1.5">
              Weekly Active Challenges
            </h4>
            {activeChallenges.length === 0 && <p className="text-xs text-muted">No active challenges right now.</p>}
            {activeChallenges.map((c) => (
              <div key={c.id} className="space-y-2 text-xs">
                <span className="badge badge-success">Active Contest</span>
                <h5 className="font-serif font-bold">{c.title}</h5>
                <p className="text-muted leading-normal">{c.description}</p>
                <div className="flex justify-between items-center text-[10px] font-mono pt-2 border-t border-line">
                  <span className="text-gold-500">{c.prize}</span>
                  <span>Ends: {c.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <ProjectDetailModal
        project={detailProject}
        hasBid={detailProject ? biddedIds.has(detailProject.id) : false}
        onClose={() => setDetailProject(null)}
        onBid={openBid}
      />
      {bidProject && <BidModal key={bidProject.id} project={bidProject} onClose={() => setBidProject(null)} />}
    </PageContainer>
  );
}
