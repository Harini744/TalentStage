import {
  User, BookOpen, Search, FileText, CreditCard, Plus, Briefcase, Bookmark,
  ShieldCheck, Users, Award, HelpCircle, LayoutDashboard,
} from 'lucide-react';
import { ROLES } from '@/constants';

export const ROUTES = {
  AUTH: '/auth',
  ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  PROFILE: '/freelancer/profile',
  PORTFOLIO: '/freelancer/portfolio',
  BROWSE_PROJECTS: '/freelancer/projects',
  MY_PROPOSALS: '/freelancer/proposals',
  EARNINGS: '/freelancer/earnings',
  POST_PROJECT: '/client/post-project',
  MY_PROJECTS: '/client/projects',
  SAVED_TALENTS: '/client/saved',
  CONTRACTS: '/contracts',
  COMMUNITY: '/community',
  CHALLENGES: '/challenges',
  MENTORSHIP: '/mentorship',
};

export const DASHBOARD_ITEM = { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard };

/** Sidebar structure. `roles: null` means every signed-in user. */
export const NAV_SECTIONS = [
  {
    title: 'Freelancer Vault',
    roles: [ROLES.FREELANCER, ROLES.BOTH],
    items: [
      { path: ROUTES.PROFILE, label: 'My Profile', icon: User },
      { path: ROUTES.PORTFOLIO, label: 'Portfolio Gallery', icon: BookOpen },
      { path: ROUTES.BROWSE_PROJECTS, label: 'Browse Projects', icon: Search },
      { path: ROUTES.MY_PROPOSALS, label: 'Bids & Proposals', icon: FileText },
      { path: ROUTES.EARNINGS, label: 'Earnings Vault', icon: CreditCard },
    ],
  },
  {
    title: 'Client Terminal',
    roles: [ROLES.CLIENT, ROLES.BOTH],
    items: [
      { path: ROUTES.POST_PROJECT, label: 'Post a Project', icon: Plus },
      { path: ROUTES.MY_PROJECTS, label: 'Manage Projects', icon: Briefcase },
      { path: ROUTES.SAVED_TALENTS, label: 'Saved Talents', icon: Bookmark },
    ],
  },
  {
    title: 'Collaborations',
    roles: null,
    items: [
      { path: ROUTES.CONTRACTS, label: 'Contracts Tracker', icon: ShieldCheck },
      { path: ROUTES.COMMUNITY, label: 'Public Feed', icon: Users },
      { path: ROUTES.CHALLENGES, label: 'Skill Challenges', icon: Award },
      { path: ROUTES.MENTORSHIP, label: 'Mentorship Match', icon: HelpCircle },
    ],
  },
];

const ALL_ITEMS = [DASHBOARD_ITEM, ...NAV_SECTIONS.flatMap((s) => s.items)];

export const getPageTitle = (pathname) =>
  ALL_ITEMS.find((item) => item.path === pathname)?.label ?? 'TalentStage';
