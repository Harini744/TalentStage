import { useState } from 'react';
import { BID_TIMELINES } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { submitProposal } from '@/firebase/projectService';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Select, TextArea, TextInput } from '@/components/ui/Field';

const MIN_COVER_LENGTH = 20;

export default function BidModal({ project, onClose }) {
  const { user, profile } = useAuth();
  const addToast = useToast();
  const [amount, setAmount] = useState(project?.budget ?? '');
  const [timeline, setTimeline] = useState(BID_TIMELINES[0].value);
  const [cover, setCover] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!project) return null;

  const handleSubmit = async () => {
    if (!(Number(amount) > 0) || cover.trim().length < MIN_COVER_LENGTH) {
      return addToast(`Enter a bid amount and a cover letter of at least ${MIN_COVER_LENGTH} characters.`);
    }
    setSubmitting(true);
    try {
      await submitProposal(user.uid, profile, project, { bidAmount: Number(amount), timeline, cover: cover.trim() });
      addToast(`Proposal for "${project.title}" submitted!`);
      onClose();
    } catch (error) {
      console.error(error);
      addToast(`Failed to submit proposal: ${error.message}`);
      setSubmitting(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={`Bidding: ${project.title}`}>
      <div className="grid grid-cols-2 gap-4">
        <TextInput label="Bid Amount ($ USD)" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Select label="Timeline" options={BID_TIMELINES} value={timeline} onChange={(e) => setTimeline(e.target.value)} />
      </div>
      <TextArea
        label="Cover Message & Outline"
        rows={5}
        value={cover}
        onChange={(e) => setCover(e.target.value)}
        placeholder="Introduce your credentials and outline your approach..."
        hint={`Character count: ${cover.length} (min ${MIN_COVER_LENGTH})`}
      />
      <Button block loading={submitting} onClick={handleSubmit}>Submit Bid Package</Button>
    </Modal>
  );
}
