import { Award, Edit, ShieldCheck, Sparkles } from 'lucide-react';
import { formatDate } from '@/utils/format';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import SkillTags from '@/components/ui/SkillTags';

function Stat({ label, children }) {
  return (
    <div className="bg-panel p-3 rounded-lg border border-line">
      <span className="eyebrow">{label}</span>
      <span className="block text-sm font-bold mt-1.5">{children}</span>
    </div>
  );
}

export default function ProfileHeader({ profile, auditing, onEdit, onVerify, onAudit }) {
  return (
    <div className="card overflow-hidden shadow-xl">
      <div className="h-32 bg-gradient-to-r from-gold-600/30 to-raised" />

      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 -mt-16">
          <div className="flex items-end gap-4">
            <Avatar src={profile.avatar} name={profile.name} className="w-24 h-24 border-4 border-card shadow-lg !text-2xl" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif">{profile.name}</h2>
                {profile.verified && <ShieldCheck className="w-5 h-5 text-gold-500 shrink-0" />}
              </div>
              <p className="text-xs text-gold-500 font-mono">{profile.specialty || 'Add a headline'}</p>
              <p className="text-[10px] text-faint font-mono mt-1">
                {profile.location || 'Location not set'} • Member since {formatDate(profile.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <Button variant="outline" onClick={onEdit}><Edit className="w-4 h-4" />Edit Profile</Button>
            <Button variant="secondary" onClick={onVerify} className="text-gold-500"><Award className="w-4 h-4" />Verify a Skill</Button>
            <Button loading={auditing} onClick={onAudit}><Sparkles className="w-4 h-4" />{auditing ? 'Auditing...' : 'AI Portfolio Audit'}</Button>
          </div>
        </div>

        <div className="mt-6 border-t border-line pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <Stat label="Hourly Rate"><span className="text-gold-500 font-mono">${profile.hourlyRate || 0}/hr</span></Stat>
          <Stat label="Verified Badges">{profile.verifiedSkills?.length || 0} Badges</Stat>
          <Stat label="Showcase Items">{profile.portfolio?.length || 0} Projects</Stat>
          <Stat label="Availability"><span className="text-emerald-400 font-mono uppercase text-xs">{profile.availability}</span></Stat>
        </div>

        <div className="mt-6">
          <h4 className="eyebrow border-b border-line pb-1">Professional Bio</h4>
          <p className="text-xs text-muted leading-relaxed mt-2">{profile.bio || 'No bio yet — click Edit Profile to add one.'}</p>
        </div>

        <div className="mt-6">
          <h4 className="eyebrow border-b border-line pb-1">Claimed Skill Badges</h4>
          {profile.skills?.length ? (
            <SkillTags skills={profile.skills} verified={profile.verifiedSkills} className="mt-2" />
          ) : (
            <p className="text-xs text-muted mt-2">No skills added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
