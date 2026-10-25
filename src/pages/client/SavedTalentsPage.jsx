import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useFreelancers } from '@/hooks/useCollections';
import { saveFreelancerNote, setFreelancerSaved } from '@/firebase/userService';
import { ROUTES } from '@/config/navigation';
import PageContainer from '@/components/ui/PageContainer';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import { TextArea } from '@/components/ui/Field';

export default function SavedTalentsPage() {
  const { user, profile } = useAuth();
  const addToast = useToast();
  const navigate = useNavigate();
  const { data: freelancers } = useFreelancers();
  const [editing, setEditing] = useState(null);
  const [noteText, setNoteText] = useState('');

  const saved = useMemo(() => freelancers.filter((f) => profile.savedFreelancers?.includes(f.id)), [freelancers, profile.savedFreelancers]);

  const startNote = (fl) => {
    setEditing(fl);
    setNoteText(profile.savedNotes?.[fl.id] ?? '');
  };

  const saveNote = async () => {
    try {
      await saveFreelancerNote(user.uid, editing.id, noteText.trim());
      addToast('Private note saved.');
      setEditing(null);
    } catch (error) {
      addToast(`Couldn't save note: ${error.message}`);
    }
  };

  const remove = (fl) => setFreelancerSaved(user.uid, fl.id, false).catch((e) => addToast(`Couldn't remove: ${e.message}`));

  return (
    <PageContainer>
      <h3 className="section-title">Saved Talent Directory</h3>
      {saved.length === 0 ? (
        <EmptyState icon={Bookmark} description="No bookmarked freelancers." action={<Button variant="secondary" size="sm" onClick={() => navigate(ROUTES.MY_PROJECTS)}>Explore Matching</Button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {saved.map((fl) => {
            const note = profile.savedNotes?.[fl.id];
            return (
              <div key={fl.id} className="card card-hover p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={fl.avatar} name={fl.name} />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold">{fl.name}</h4>
                          {fl.verified && <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />}
                        </div>
                        <p className="text-[11px] text-muted">{fl.specialty}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gold-500 font-mono">${fl.hourlyRate}/hr</span>
                  </div>
                  {note && <div className="mt-3 bg-panel p-2.5 rounded border border-gold-500/10 text-[10px] text-gold-500 font-mono italic">Note: {note}</div>}
                </div>
                <div className="flex gap-2 mt-4 pt-3 border-t border-line">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => startNote(fl)}>Edit Note</Button>
                  <Button variant="danger" size="sm" className="flex-1" onClick={() => remove(fl)}>Remove</Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={`Private Note${editing ? ` (${editing.name})` : ''}`} size="sm">
        <TextArea rows={4} value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Write client remarks..." />
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
          <Button onClick={saveNote}>Save</Button>
        </div>
      </Modal>
    </PageContainer>
  );
}
