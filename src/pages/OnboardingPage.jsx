import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ROUTES } from '@/config/navigation';
import AuthShell from '@/components/auth/AuthShell';
import VerifyIdentityStep from '@/components/auth/VerifyIdentityStep';
import ProfileSetupStep from '@/components/auth/ProfileSetupStep';

/** Steps 2 and 3 of sign-up (step 1, creating the account, lives on the auth page). */
export default function OnboardingPage() {
  const { profile, updateProfile } = useAuth();
  const addToast = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(2);
  const [verification, setVerification] = useState(null);
  const [saving, setSaving] = useState(false);

  if (profile.onboardingComplete) return <Navigate to={ROUTES.DASHBOARD} replace />;

  const handleVerification = (data) => {
    setVerification(data);
    setStep(3);
    addToast('Verification request submitted! Complete your profile.');
  };

  const handleFinish = async (setup) => {
    setSaving(true);
    try {
      await updateProfile({
        ...setup,
        verification: { ...verification, status: 'pending' },
        onboardingComplete: true,
      });
      addToast('Onboarding complete! Welcome to TalentStage.');
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (error) {
      console.error(error);
      addToast(`Couldn't save your profile: ${error.message}`);
      setSaving(false);
    }
  };

  return (
    <AuthShell step={step}>
      {step === 2 && <VerifyIdentityStep onSubmit={handleVerification} />}
      {step === 3 && <ProfileSetupStep onBack={() => setStep(2)} onFinish={handleFinish} saving={saving} />}
    </AuthShell>
  );
}
