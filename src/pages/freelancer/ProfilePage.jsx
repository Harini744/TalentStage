import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAiSettings } from '@/context/AiSettingsContext';
import { useToast } from '@/context/ToastContext';
import { reviewPortfolio } from '@/services/ai';
import PageContainer from '@/components/ui/PageContainer';
import ConfettiEffect from '@/components/common/ConfettiEffect';
import ProfileHeader from '@/components/profile/ProfileHeader';
import AuditReport from '@/components/profile/AuditReport';
import EditProfileModal from '@/components/profile/EditProfileModal';
import SkillQuizModal from '@/components/profile/SkillQuizModal';

const CONFETTI_DURATION_MS = 5000;

export default function ProfilePage() {
  const { profile } = useAuth();
  const { apiKey } = useAiSettings();
  const addToast = useToast();

  const [editing, setEditing] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [audit, setAudit] = useState(null);
  const [auditing, setAuditing] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const runAudit = async () => {
    setAuditing(true);
    setAudit(null);
    addToast('Claude is auditing your portfolio...');
    try {
      setAudit(await reviewPortfolio({ portfolio: profile.portfolio ?? [], apiKey }));
      addToast('Portfolio review ready!');
    } catch (error) {
      console.error(error);
      addToast(`Audit failed: ${error.message}`);
    } finally {
      setAuditing(false);
    }
  };

  const handlePassed = (skill) => {
    addToast(`Congratulations! Verified [${skill}] badge unlocked!`);
    setConfetti(true);
    setTimeout(() => setConfetti(false), CONFETTI_DURATION_MS);
  };

  return (
    <PageContainer>
      {confetti && <ConfettiEffect />}

      <ProfileHeader
        profile={profile}
        auditing={auditing}
        onEdit={() => setEditing(true)}
        onVerify={() => setQuizOpen(true)}
        onAudit={runAudit}
      />
      {audit && <AuditReport audit={audit} />}

      <EditProfileModal open={editing} onClose={() => setEditing(false)} />
      <SkillQuizModal open={quizOpen} onClose={() => setQuizOpen(false)} onPassed={handlePassed} />
    </PageContainer>
  );
}
