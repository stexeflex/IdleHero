import { AffixTierSpec } from '../../models';

export const ATTRIBUTE_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 1, Max: 3 } },
  { Tier: 'Magic', Value: { Min: 3, Max: 5 } },
  { Tier: 'Rare', Value: { Min: 5, Max: 7 } },
  { Tier: 'Epic', Value: { Min: 7, Max: 10 } },
  { Tier: 'Legendary', Value: { Min: 10, Max: 15 } }
];

export const DAMAGE_FLAT_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 1, Max: 3 } },
  { Tier: 'Magic', Value: { Min: 3, Max: 5 } },
  { Tier: 'Rare', Value: { Min: 5, Max: 8 } },
  { Tier: 'Epic', Value: { Min: 8, Max: 11 } },
  { Tier: 'Legendary', Value: { Min: 11, Max: 15 } }
];

export const DAMAGE_PCT_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 0.02, Max: 0.04 } },
  { Tier: 'Magic', Value: { Min: 0.04, Max: 0.07 } },
  { Tier: 'Rare', Value: { Min: 0.07, Max: 0.1 } },
  { Tier: 'Epic', Value: { Min: 0.1, Max: 0.14 } },
  { Tier: 'Legendary', Value: { Min: 0.14, Max: 0.2 } }
];

export const CHANCE_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 0.01, Max: 0.02 } },
  { Tier: 'Magic', Value: { Min: 0.02, Max: 0.04 } },
  { Tier: 'Rare', Value: { Min: 0.04, Max: 0.06 } },
  { Tier: 'Epic', Value: { Min: 0.06, Max: 0.08 } },
  { Tier: 'Legendary', Value: { Min: 0.08, Max: 0.1 } }
];

export const BLEEDING_DAMAGE_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 0.03, Max: 0.05 } },
  { Tier: 'Magic', Value: { Min: 0.05, Max: 0.08 } },
  { Tier: 'Rare', Value: { Min: 0.08, Max: 0.12 } },
  { Tier: 'Epic', Value: { Min: 0.12, Max: 0.16 } },
  { Tier: 'Legendary', Value: { Min: 0.16, Max: 0.2 } }
];

export const CRIT_DAMAGE_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 0.05, Max: 0.15 } },
  { Tier: 'Magic', Value: { Min: 0.15, Max: 0.25 } },
  { Tier: 'Rare', Value: { Min: 0.25, Max: 0.35 } },
  { Tier: 'Epic', Value: { Min: 0.35, Max: 0.45 } },
  { Tier: 'Legendary', Value: { Min: 0.45, Max: 0.6 } }
];

export const MULTIHIT_DAMAGE_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 0.1, Max: 0.2 } },
  { Tier: 'Magic', Value: { Min: 0.2, Max: 0.35 } },
  { Tier: 'Rare', Value: { Min: 0.35, Max: 0.5 } },
  { Tier: 'Epic', Value: { Min: 0.5, Max: 0.7 } },
  { Tier: 'Legendary', Value: { Min: 0.7, Max: 1.0 } }
];

export const MULTIHIT_CHAIN_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 0.02, Max: 0.05 } },
  { Tier: 'Magic', Value: { Min: 0.05, Max: 0.1 } },
  { Tier: 'Rare', Value: { Min: 0.1, Max: 0.15 } },
  { Tier: 'Epic', Value: { Min: 0.15, Max: 0.2 } },
  { Tier: 'Legendary', Value: { Min: 0.2, Max: 0.3 } }
];

export const ATTACK_SPEED_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 0.01, Max: 0.03 } },
  { Tier: 'Magic', Value: { Min: 0.03, Max: 0.06 } },
  { Tier: 'Rare', Value: { Min: 0.06, Max: 0.1 } },
  { Tier: 'Epic', Value: { Min: 0.1, Max: 0.15 } },
  { Tier: 'Legendary', Value: { Min: 0.15, Max: 0.2 } }
];

export const ACCURACY_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 0.02, Max: 0.04 } },
  { Tier: 'Magic', Value: { Min: 0.04, Max: 0.07 } },
  { Tier: 'Rare', Value: { Min: 0.07, Max: 0.1 } },
  { Tier: 'Epic', Value: { Min: 0.1, Max: 0.14 } },
  { Tier: 'Legendary', Value: { Min: 0.14, Max: 0.2 } }
];

export const PENETRATION_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 0.01, Max: 0.03 } },
  { Tier: 'Magic', Value: { Min: 0.03, Max: 0.05 } },
  { Tier: 'Rare', Value: { Min: 0.05, Max: 0.08 } },
  { Tier: 'Epic', Value: { Min: 0.08, Max: 0.12 } },
  { Tier: 'Legendary', Value: { Min: 0.12, Max: 0.15 } }
];
