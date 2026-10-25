import { ROLES } from '@/constants';

export const isFreelancer = (profile) => profile?.role === ROLES.FREELANCER || profile?.role === ROLES.BOTH;
export const isClient = (profile) => profile?.role === ROLES.CLIENT || profile?.role === ROLES.BOTH;

/** Profile completeness out of 100, based only on fields users can actually edit. */
export function getProfileCompleteness(profile = {}) {
  let score = 0;
  if (profile.bio) score += 15;
  if (profile.skills?.length > 0) score += 20;
  if (profile.portfolio?.length > 0) score += 25;
  if (profile.hourlyRate > 0) score += 10;
  if (profile.availability) score += 5;
  if (profile.specialty) score += 10;
  if (profile.location) score += 5;
  if (profile.verifiedSkills?.length > 0) score += 10;
  return score;
}
