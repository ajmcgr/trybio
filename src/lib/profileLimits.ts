/**
 * Profile limits based on subscription plan
 */
export const PROFILE_LIMITS = {
  free: 1,
  pro: 5,
  business: 20,
} as const;

export type Plan = 'free' | 'pro' | 'business';

export function getProfileLimit(plan: string | null): number {
  if (plan === 'pro') return PROFILE_LIMITS.pro;
  if (plan === 'business') return PROFILE_LIMITS.business;
  return PROFILE_LIMITS.free;
}

export function canCreateProfile(currentCount: number, plan: string | null): boolean {
  const limit = getProfileLimit(plan);
  return currentCount < limit;
}
