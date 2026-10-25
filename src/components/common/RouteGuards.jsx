import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { FullScreenLoader } from '@/components/ui/Spinner';
import { ROUTES } from '@/config/navigation';
import { isClient, isFreelancer } from '@/utils/profile';

/** Waits for Firebase, then requires a signed-in user with a loaded profile. */
export function RequireAuth() {
  const { user, profile, loading } = useAuth();
  if (loading) return <FullScreenLoader />;
  if (!user) return <Navigate to={ROUTES.AUTH} replace />;
  // Account exists but its profile doc hasn't arrived yet (right after sign-up).
  if (!profile) return <FullScreenLoader />;
  return <Outlet />;
}

/** Sends users who haven't finished onboarding to the onboarding flow. */
export function RequireOnboarded() {
  const { profile } = useAuth();
  if (!profile.onboardingComplete) return <Navigate to={ROUTES.ONBOARDING} replace />;
  return <Outlet />;
}

/** Login/register pages: signed-in users get redirected into the app. */
export function PublicOnly() {
  const { user, profile, loading } = useAuth();
  if (loading) return <FullScreenLoader />;
  if (user && profile) {
    return <Navigate to={profile.onboardingComplete ? ROUTES.DASHBOARD : ROUTES.ONBOARDING} replace />;
  }
  if (user) return <FullScreenLoader />;
  return <Outlet />;
}

/** role: 'freelancer' | 'client' */
export function RequireRole({ role }) {
  const { profile } = useAuth();
  const allowed = role === 'freelancer' ? isFreelancer(profile) : isClient(profile);
  return allowed ? <Outlet /> : <Navigate to={ROUTES.DASHBOARD} replace />;
}
