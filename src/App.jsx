import { Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from '@/config/navigation';
import { PublicOnly, RequireAuth, RequireOnboarded, RequireRole } from '@/components/common/RouteGuards';
import AppLayout from '@/components/layout/AppLayout';

import AuthPage from '@/pages/AuthPage';
import OnboardingPage from '@/pages/OnboardingPage';
import DashboardPage from '@/pages/DashboardPage';
import ContractsPage from '@/pages/ContractsPage';

import ProfilePage from '@/pages/freelancer/ProfilePage';
import PortfolioPage from '@/pages/freelancer/PortfolioPage';
import BrowseProjectsPage from '@/pages/freelancer/BrowseProjectsPage';
import MyProposalsPage from '@/pages/freelancer/MyProposalsPage';
import EarningsPage from '@/pages/freelancer/EarningsPage';

import PostProjectPage from '@/pages/client/PostProjectPage';
import ManageProjectsPage from '@/pages/client/ManageProjectsPage';
import SavedTalentsPage from '@/pages/client/SavedTalentsPage';

import CommunityPage from '@/pages/community/CommunityPage';
import ChallengesPage from '@/pages/community/ChallengesPage';
import MentorshipPage from '@/pages/community/MentorshipPage';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicOnly />}>
        <Route path={ROUTES.AUTH} element={<AuthPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route path={ROUTES.ONBOARDING} element={<OnboardingPage />} />

        <Route element={<RequireOnboarded />}>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.CONTRACTS} element={<ContractsPage />} />
            <Route path={ROUTES.COMMUNITY} element={<CommunityPage />} />
            <Route path={ROUTES.CHALLENGES} element={<ChallengesPage />} />
            <Route path={ROUTES.MENTORSHIP} element={<MentorshipPage />} />

            <Route element={<RequireRole role="freelancer" />}>
              <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
              <Route path={ROUTES.PORTFOLIO} element={<PortfolioPage />} />
              <Route path={ROUTES.BROWSE_PROJECTS} element={<BrowseProjectsPage />} />
              <Route path={ROUTES.MY_PROPOSALS} element={<MyProposalsPage />} />
              <Route path={ROUTES.EARNINGS} element={<EarningsPage />} />
            </Route>

            <Route element={<RequireRole role="client" />}>
              <Route path={ROUTES.POST_PROJECT} element={<PostProjectPage />} />
              <Route path={ROUTES.MY_PROJECTS} element={<ManageProjectsPage />} />
              <Route path={ROUTES.SAVED_TALENTS} element={<SavedTalentsPage />} />
            </Route>
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
}
