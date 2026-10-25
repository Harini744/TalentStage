import { useState } from 'react';
import { Award } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useChallenges } from '@/hooks/useCollections';
import { submitChallengeEntry } from '@/firebase/communityService';
import PageContainer from '@/components/ui/PageContainer';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { TextInput } from '@/components/ui/Field';

export default function ChallengesPage() {
  const { user, profile } = useAuth();
  const addToast = useToast();
  const { data: challenges } = useChallenges();
  const [target, setTarget] = useState(null);
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!/^https?:\/\//i.test(url.trim())) return addToast('Enter a full link starting with http:// or https://');
    setSaving(true);
    try {
      await submitChallengeEntry(target.id, user.uid, profile, url.trim());
      addToast('Entry submitted! The jury will review it.');
      setTarget(null);
      setUrl('');
    } catch (error) {
      addToast(`Submission failed: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer>
      {challenges.filter((c) => c.active).map((c) => (
        <div key={c.id} className="card border-gold-500/20 p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl" />
          <div className="space-y-3 relative">
            <span className="badge badge-gold animate-pulse">Weekly Core Hack</span>
            <h3 className="text-2xl font-serif font-bold">{c.title}</h3>
            <p className="text-xs text-muted max-w-lg leading-relaxed">{c.description}</p>
            <div className="flex gap-4 text-xs font-mono text-faint pt-2">
              <span>Prize: <span className="text-gold-500 font-bold">{c.prize}</span></span>
              <span>•</span>
              <span>Deadline: <span className="text-red-400">{c.deadline}</span></span>
            </div>
          </div>
          <Button onClick={() => setTarget(c)} className="shrink-0 relative !py-2.5 !px-6">Submit Entry</Button>
        </div>
      ))}

      <h3 className="eyebrow text-sm border-b border-line pb-1">Past Challenge Legends</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {challenges.filter((c) => !c.active).map((c) => (
          <div key={c.id} className="card p-4 flex flex-col justify-between gap-4">
            <div>
              <span className="badge badge-muted text-gold-500">Archived</span>
              <h4 className="text-xs font-bold font-serif mt-2">{c.title}</h4>
              <p className="text-[11px] text-muted leading-normal mt-1">{c.description}</p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-line text-[10px] font-mono">
              <Award className="w-4 h-4 text-gold-500" />
              <span>Winner: <span className="text-gold-500 font-bold">{c.winner}</span></span>
            </div>
          </div>
        ))}
      </div>

      <Modal open={Boolean(target)} onClose={() => setTarget(null)} title="Submit Your Entry" size="sm">
        <p className="text-xs text-muted">Provide a repository URL or deployed preview.</p>
        <TextInput label="Sandbox / Git link" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://github.com/my-submission" />
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={() => setTarget(null)}>Cancel</Button>
          <Button loading={saving} onClick={submit}>File Entry</Button>
        </div>
      </Modal>
    </PageContainer>
  );
}
