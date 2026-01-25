import { AffixTierSpec } from '../../models';

export const STRENGTH_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 1, Max: 2 } },
  { Tier: 'Magic', Value: { Min: 2, Max: 4 } },
  { Tier: 'Rare', Value: { Min: 4, Max: 7 } },
  { Tier: 'Epic', Value: { Min: 7, Max: 10 } },
  { Tier: 'Legendary', Value: { Min: 10, Max: 15 } }
];

export const DAMAGE_PCT_TIERS: AffixTierSpec[] = [
  { Tier: 'Common', Value: { Min: 2, Max: 4 } },
  { Tier: 'Magic', Value: { Min: 4, Max: 7 } },
  { Tier: 'Rare', Value: { Min: 7, Max: 10 } },
  { Tier: 'Epic', Value: { Min: 10, Max: 14 } },
  { Tier: 'Legendary', Value: { Min: 14, Max: 20 } }
];
