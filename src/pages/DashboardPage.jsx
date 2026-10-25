import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMyContracts, useMyProjects, useMyProposals } from '@/hooks/useCollections';
import { ROUTES } from '@/config/navigation';
import { isClient, isFreelancer } from '@/utils/profile';
import PageContainer from '@/components/ui/PageContainer';
import SkillTags from '@/components/ui/SkillTags';

function Stat({ label, value }) {
  return (
    <div className="card p-4 text-center">
      <span className="eyebrow">{label}</span>
      <span className="block text-2xl font-serif font-bold text-gold-500 mt-1">{value}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { profile } = useAuth();
  const { data: contracts } = useMyContracts();
  const { data: proposals } = useMyProposals();
  const { data: projects } = useMyProjects();

  return (
    <PageContainer width="lg">
      <div className="card p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl" />
        <span className="badge badge-gold">Welcome dashboard</span>
        <h2 className="text-3xl font-serif font-bold mt-3">Welcome back, {profile.name}!</h2>
        <p className="text-xs text-muted max-w-lg mt-2 leading-relaxed">
          Check your matches, verify more skill badges, or publish a new project brief.
        </p>
        <div className="flex gap-3 mt-6 relative z-10">
          {isFreelancer(profile) && <Link to={ROUTES.PROFILE} className="btn btn-primary">My Profile</Link>}
          {isClient(profile) && <Link to={ROUTES.POST_PROJECT} className="btn btn-secondary">Post a Brief</Link>}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Stat label="Contracts" value={contracts.length} />
        {isFreelancer(profile) && <Stat label="Bids Submitted" value={proposals.length} />}
        {isClient(profile) && <Stat label="Projects Posted" value={projects.length} />}
      </div>

      {isFreelancer(profile) && (
        <div className="card p-5">
          <h3 className="text-sm font-serif font-bold text-gold-500 mb-2">My verified badges</h3>
          {profile.verifiedSkills?.length ? (
            <SkillTags skills={profile.verifiedSkills} verified={profile.verifiedSkills} />
          ) : (
            <p className="text-xs text-muted">None yet — take a skill quiz from your profile.</p>
          )}
        </div>
      )}
    </PageContainer>
  );
}
