import { AffixTierSpec } from '../../models';

export const ATTRIBUTE_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 1, Max: 3, Type: 'Flat' } },
  { Tier: 'Magic', Value: { Min: 3, Max: 5, Type: 'Flat' } },
  { Tier: 'Rare', Value: { Min: 5, Max: 7, Type: 'Flat' } },
  { Tier: 'Epic', Value: { Min: 7, Max: 10, Type: 'Flat' } },
  { Tier: 'Legendary', Value: { Min: 10, Max: 15, Type: 'Flat' } }
];

export const DAMAGE_FLAT_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 1, Max: 3, Type: 'Flat' } },
  { Tier: 'Magic', Value: { Min: 3, Max: 5, Type: 'Flat' } },
  { Tier: 'Rare', Value: { Min: 5, Max: 8, Type: 'Flat' } },
  { Tier: 'Epic', Value: { Min: 8, Max: 11, Type: 'Flat' } },
  { Tier: 'Legendary', Value: { Min: 11, Max: 15, Type: 'Flat' } }
];

export const DAMAGE_PCT_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 0.02, Max: 0.04, Type: 'Percent' } },
  { Tier: 'Magic', Value: { Min: 0.04, Max: 0.07, Type: 'Percent' } },
  { Tier: 'Rare', Value: { Min: 0.07, Max: 0.1, Type: 'Percent' } },
  { Tier: 'Epic', Value: { Min: 0.1, Max: 0.14, Type: 'Percent' } },
  { Tier: 'Legendary', Value: { Min: 0.14, Max: 0.2, Type: 'Percent' } }
];

export const CHANCE_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 0.01, Max: 0.02, Type: 'Percent' } },
  { Tier: 'Magic', Value: { Min: 0.02, Max: 0.04, Type: 'Percent' } },
  { Tier: 'Rare', Value: { Min: 0.04, Max: 0.06, Type: 'Percent' } },
  { Tier: 'Epic', Value: { Min: 0.06, Max: 0.08, Type: 'Percent' } },
  { Tier: 'Legendary', Value: { Min: 0.08, Max: 0.1, Type: 'Percent' } }
];

export const BLEEDING_DAMAGE_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 0.03, Max: 0.05, Type: 'Percent' } },
  { Tier: 'Magic', Value: { Min: 0.05, Max: 0.08, Type: 'Percent' } },
  { Tier: 'Rare', Value: { Min: 0.08, Max: 0.12, Type: 'Percent' } },
  { Tier: 'Epic', Value: { Min: 0.12, Max: 0.16, Type: 'Percent' } },
  { Tier: 'Legendary', Value: { Min: 0.16, Max: 0.2, Type: 'Percent' } }
];

export const CRIT_DAMAGE_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 0.05, Max: 0.15, Type: 'Percent' } },
  { Tier: 'Magic', Value: { Min: 0.15, Max: 0.25, Type: 'Percent' } },
  { Tier: 'Rare', Value: { Min: 0.25, Max: 0.35, Type: 'Percent' } },
  { Tier: 'Epic', Value: { Min: 0.35, Max: 0.45, Type: 'Percent' } },
  { Tier: 'Legendary', Value: { Min: 0.45, Max: 0.6, Type: 'Percent' } }
];

export const MULTIHIT_DAMAGE_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 0.1, Max: 0.2, Type: 'Percent' } },
  { Tier: 'Magic', Value: { Min: 0.2, Max: 0.35, Type: 'Percent' } },
  { Tier: 'Rare', Value: { Min: 0.35, Max: 0.5, Type: 'Percent' } },
  { Tier: 'Epic', Value: { Min: 0.5, Max: 0.7, Type: 'Percent' } },
  { Tier: 'Legendary', Value: { Min: 0.7, Max: 1.0, Type: 'Percent' } }
];

export const MULTIHIT_CHAIN_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 0.02, Max: 0.05, Type: 'Percent' } },
  { Tier: 'Magic', Value: { Min: 0.05, Max: 0.1, Type: 'Percent' } },
  { Tier: 'Rare', Value: { Min: 0.1, Max: 0.15, Type: 'Percent' } },
  { Tier: 'Epic', Value: { Min: 0.15, Max: 0.2, Type: 'Percent' } },
  { Tier: 'Legendary', Value: { Min: 0.2, Max: 0.3, Type: 'Percent' } }
];

export const ATTACK_SPEED_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 0.01, Max: 0.03, Type: 'Percent' } },
  { Tier: 'Magic', Value: { Min: 0.03, Max: 0.06, Type: 'Percent' } },
  { Tier: 'Rare', Value: { Min: 0.06, Max: 0.1, Type: 'Percent' } },
  { Tier: 'Epic', Value: { Min: 0.1, Max: 0.15, Type: 'Percent' } },
  { Tier: 'Legendary', Value: { Min: 0.15, Max: 0.2, Type: 'Percent' } }
];

export const ACCURACY_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 0.02, Max: 0.05, Type: 'Percent' } },
  { Tier: 'Magic', Value: { Min: 0.05, Max: 0.08, Type: 'Percent' } },
  { Tier: 'Rare', Value: { Min: 0.08, Max: 0.11, Type: 'Percent' } },
  { Tier: 'Epic', Value: { Min: 0.11, Max: 0.15, Type: 'Percent' } },
  { Tier: 'Legendary', Value: { Min: 0.15, Max: 0.2, Type: 'Percent' } }
];

export const PENETRATION_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 0.01, Max: 0.03, Type: 'Percent' } },
  { Tier: 'Magic', Value: { Min: 0.03, Max: 0.05, Type: 'Percent' } },
  { Tier: 'Rare', Value: { Min: 0.05, Max: 0.08, Type: 'Percent' } },
  { Tier: 'Epic', Value: { Min: 0.08, Max: 0.12, Type: 'Percent' } },
  { Tier: 'Legendary', Value: { Min: 0.12, Max: 0.15, Type: 'Percent' } }
];

export const CHARGING_STRIKE_GAIN_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 1, Max: 2, Type: 'Flat' } },
  { Tier: 'Magic', Value: { Min: 3, Max: 4, Type: 'Flat' } },
  { Tier: 'Rare', Value: { Min: 5, Max: 6, Type: 'Flat' } },
  { Tier: 'Epic', Value: { Min: 7, Max: 8, Type: 'Flat' } },
  { Tier: 'Legendary', Value: { Min: 9, Max: 10, Type: 'Flat' } }
];

export const CHARGING_STRIKE_DAMAGE_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 0.05, Max: 0.25, Type: 'Percent' } },
  { Tier: 'Magic', Value: { Min: 0.25, Max: 0.5, Type: 'Percent' } },
  { Tier: 'Rare', Value: { Min: 0.5, Max: 1.0, Type: 'Percent' } },
  { Tier: 'Epic', Value: { Min: 1.0, Max: 2.0, Type: 'Percent' } },
  { Tier: 'Legendary', Value: { Min: 2.0, Max: 4.0, Type: 'Percent' } }
];

export const CHARGED_DURATION_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 0.5, Max: 1.0, Type: 'Percent' } },
  { Tier: 'Magic', Value: { Min: 1.0, Max: 1.5, Type: 'Percent' } },
  { Tier: 'Rare', Value: { Min: 1.5, Max: 2.5, Type: 'Percent' } },
  { Tier: 'Epic', Value: { Min: 2.5, Max: 3.5, Type: 'Percent' } },
  { Tier: 'Legendary', Value: { Min: 3.5, Max: 5.0, Type: 'Percent' } }
];
