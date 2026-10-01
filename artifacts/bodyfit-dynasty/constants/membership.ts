import {
  MEMBERSHIP_CONFIG,
  getMembershipConfig,
  hasTierAccess,
  type MembershipTierId,
} from './membershipConfig';

export type MembershipId = MembershipTierId;

export type MembershipPlan = {
  id: MembershipId;
  name: 'STANDARD' | 'BRONZE' | 'PLATINUM' | 'GOLDEN';
  price: string;
  description: string;
  catalogPercent: number;
  features: string[];
  icon: 'circle' | 'award' | 'star';
  color: string;
};

export const membershipPlans: MembershipPlan[] = [
  {
    id: 'standard',
    name: 'STANDARD',
    price: MEMBERSHIP_CONFIG.standard.priceFormatted,
    description: MEMBERSHIP_CONFIG.standard.description,
    catalogPercent: MEMBERSHIP_CONFIG.standard.catalogPercentTarget,
    icon: 'circle',
    color: '#3A2B1E',
    features: MEMBERSHIP_CONFIG.standard.features,
  },
  {
    id: 'bronze',
    name: 'BRONZE',
    price: MEMBERSHIP_CONFIG.bronze.priceFormatted,
    description: MEMBERSHIP_CONFIG.bronze.description,
    catalogPercent: MEMBERSHIP_CONFIG.bronze.catalogPercentTarget,
    icon: 'award',
    color: '#4A2A14',
    features: MEMBERSHIP_CONFIG.bronze.features,
  },
  {
    id: 'platinum',
    name: 'PLATINUM',
    price: MEMBERSHIP_CONFIG.platinum.priceFormatted,
    description: MEMBERSHIP_CONFIG.platinum.description,
    catalogPercent: MEMBERSHIP_CONFIG.platinum.catalogPercentTarget,
    icon: 'star',
    color: '#1A2942',
    features: MEMBERSHIP_CONFIG.platinum.features,
  },
  {
    id: 'golden',
    name: 'GOLDEN',
    price: MEMBERSHIP_CONFIG.golden.priceFormatted,
    description: MEMBERSHIP_CONFIG.golden.description,
    catalogPercent: MEMBERSHIP_CONFIG.golden.catalogPercentTarget,
    icon: 'award',
    color: '#3A2C10',
    features: MEMBERSHIP_CONFIG.golden.features,
  },
];

export const getMembershipPlan = (id: MembershipId | string | undefined) => {
  const normalized = (id?.toLowerCase() as MembershipId) || 'standard';
  return membershipPlans.find((plan) => plan.id === normalized) ?? membershipPlans[0];
};

export { MEMBERSHIP_CONFIG, getMembershipConfig, hasTierAccess };