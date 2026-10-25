import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAiSettings } from '@/context/AiSettingsContext';
import { useToast } from '@/context/ToastContext';
import { useFreelancers, useMyProjects, useReceivedProposals } from '@/hooks/useCollections';
import { hireFreelancer } from '@/firebase/projectService';
import { setFreelancerSaved } from '@/firebase/userService';
import { evaluateProposals, matchFreelancers } from '@/services/ai';
import { ROUTES } from '@/config/navigation';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';
import PageContainer from '@/components/ui/PageContainer';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { PageLoader } from '@/components/ui/Spinner';
import ProposalCard from '@/components/projects/ProposalCard';
import HireModal from '@/components/projects/HireModal';

export default function ManageProjectsPage() {
  const { user, profile } = useAuth();
  const { apiKey } = useAiSettings();
  const addToast = useToast();
  const navigate = useNavigate();

  const { data: projects, loading } = useMyProjects();
  const { data: proposals } = useReceivedProposals();
  const { data: freelancers } = useFreelancers();

  const [selectedId, setSelectedId] = useState(null);
  const [matches, setMatches] = useState(null);
  const [evaluations, setEvaluations] = useState({});
  const [aiBusy, setAiBusy] = useState(null); // 'match' | 'evaluate' | null
  const [hiring, setHiring] = useState(null);

  const project = projects.find((p) => p.id === selectedId) ?? null;
  const projectProposals = useMemo(() => proposals.filter((p) => p.projectId === selectedId), [proposals, selectedId]);

  const selectProject = (p) => {
    setSelectedId(p.id);
    setMatches(null);
    setEvaluations({});
  };

  const runAi = async (kind, task, done) => {
    setAiBusy(kind);
    try {
      done(await task());
    } catch (error) {
      console.error(error);
      addToast(`AI request failed: ${error.message}`);
    } finally {
      setAiBusy(null);
    }
  };

  const runMatch = () => {
    addToast('Running AI smart match...');
    // Don't suggest yourself on a hybrid account.
    const candidates = freelancers.filter((f) => f.id !== user.uid);
    return runAi('match', () => matchFreelancers({ project, freelancers: candidates, apiKey }), (r) => setMatches(r.matches));
  };

  const runEvaluate = () => {
    if (projectProposals.length === 0) return addToast('No proposals on this project yet.');
    addToast('Claude is evaluating each proposal...');
    return runAi(
      'evaluate',
      () => evaluateProposals({ project, proposals: projectProposals, apiKey }),
      (r) => setEvaluations(Object.fromEntries(r.evaluations.map((e) => [e.proposalId, e])))
    );
  };

  const saveTalent = async (freelancer) => {
    try {
      await setFreelancerSaved(user.uid, freelancer.id, true);
      addToast(`Saved ${freelancer.name} to your bookmarks.`);
    } catch (error) {
      addToast(`Couldn't save: ${error.message}`);
    }
  };

  const confirmHire = async (proposal) => {
    try {
      await hireFreelancer({ clientId: user.uid, clientName: profile.name, project, proposal });
      addToast(`Hired ${proposal.freelancerName}! Escrow contract activated.`);
      navigate(ROUTES.CONTRACTS);
    } catch (error) {
      console.error(error);
      addToast(`Failed to create contract: ${error.message}`);
      setHiring(null);
    }
  };

  return (
    <PageContainer width="2xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h3 className="section-title">Your Posted Briefs</h3>
          {loading ? (
            <PageLoader />
          ) : projects.length === 0 ? (
            <EmptyState description="No projects posted yet." action={<Button size="sm" onClick={() => navigate(ROUTES.POST_PROJECT)}>Post Now</Button>} />
          ) : (
            projects.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => selectProject(p)}
                className={cn('w-full p-4 rounded-xl border text-left transition-all', selectedId === p.id ? 'border-gold-500 bg-card' : 'border-line bg-panel hover:border-gold-500/20')}
              >
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-xs font-bold font-serif leading-snug">{p.title}</h4>
                  <span className="badge badge-muted text-gold-500">{formatCurrency(p.budget)}</span>
                </div>
                <div className="flex items-center justify-between mt-3 text-[10px] text-muted font-mono">
                  <span>{p.proposalsCount ?? 0} bids • {p.status === 'in-progress' ? 'Hired' : 'Open'}</span>
                  <span className="badge badge-gold">{p.category}</span>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {!project ? (
            <EmptyState icon={Sparkles} title="No brief selected" description="Select a brief to review proposals and AI rankings." className="h-64 flex flex-col justify-center max-w-none" />
          ) : (
            <>
              <div className="card p-5">
                <span className="eyebrow">Managing Project</span>
                <h2 className="text-xl font-serif font-bold text-gold-500 mt-1">{project.title}</h2>
                <p className="text-xs text-muted mt-2 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button variant="secondary" loading={aiBusy === 'evaluate'} onClick={runEvaluate} className="text-gold-500">
                    <Sparkles className="w-4 h-4" />AI Evaluate Bids
                  </Button>
                  <Button variant="secondary" loading={aiBusy === 'match'} onClick={runMatch} className="text-gold-500">
                    <Sparkles className="w-4 h-4" />AI Smart Match
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="eyebrow text-sm">Proposals ({projectProposals.length})</h3>
                {projectProposals.length === 0 ? (
                  <EmptyState description="No proposals yet." className="max-w-none" />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projectProposals.map((p) => (
                      <ProposalCard key={p.id} proposal={p} evaluation={evaluations[p.id]} onHire={setHiring} />
                    ))}
                  </div>
                )}
              </div>

              {matches && (
                <div className="space-y-3 animate-slide-up">
                  <h3 className="eyebrow text-sm">Claude Matching Engine Rank</h3>
                  {matches.map((m) => {
                    const fl = freelancers.find((f) => f.id === m.freelancerId);
                    if (!fl) return null;
                    return (
                      <div key={fl.id} className="card card-hover p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar src={fl.avatar} name={fl.name} />
                          <div className="min-w-0">
                            <span className="text-sm font-semibold">{fl.name}</span>
                            <p className="text-xs text-muted">{fl.specialty}</p>
                            <p className="text-[10px] text-faint leading-tight mt-1">{m.reasoning}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="badge badge-gold font-bold">Match {m.matchScore}%</span>
                          <div className="flex gap-2 mt-2 justify-end">
                            <Button variant="outline" size="sm" aria-label="Save talent" onClick={() => saveTalent(fl)}><Bookmark className="w-3.5 h-3.5" /></Button>
                            <Button size="sm" onClick={() => addToast(`Invite sent to ${fl.name}!`)}>Invite</Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <HireModal proposal={hiring} onClose={() => setHiring(null)} onConfirm={confirmHire} />
    </PageContainer>
  );
}
