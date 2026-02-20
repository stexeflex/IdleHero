import { RuneQualitySpec } from '../../models';

export const RUNE_ACCURACY: RuneQualitySpec[] = [
  { Quality: 'Common', Value: { Min: 0.01, Max: 0.05, Type: 'Percent' } },
  { Quality: 'Magic', Value: { Min: 0.06, Max: 0.1, Type: 'Percent' } },
  { Quality: 'Rare', Value: { Min: 0.11, Max: 0.15, Type: 'Percent' } },
  { Quality: 'Epic', Value: { Min: 0.16, Max: 0.2, Type: 'Percent' } },
  { Quality: 'Legendary', Value: { Min: 0.21, Max: 0.3, Type: 'Percent' } }
];

export const RUNE_ATTACK_SPEED: RuneQualitySpec[] = [
  { Quality: 'Common', Value: { Min: 0.01, Max: 0.1, Type: 'Percent' } },
  { Quality: 'Magic', Value: { Min: 0.1, Max: 0.2, Type: 'Percent' } },
  { Quality: 'Rare', Value: { Min: 0.2, Max: 0.3, Type: 'Percent' } },
  { Quality: 'Epic', Value: { Min: 0.3, Max: 0.4, Type: 'Percent' } },
  { Quality: 'Legendary', Value: { Min: 0.4, Max: 0.5, Type: 'Percent' } }
];

export const RUNE_CHANCE: RuneQualitySpec[] = [
  { Quality: 'Common', Value: { Min: 0.01, Max: 0.1, Type: 'Percent' } },
  { Quality: 'Magic', Value: { Min: 0.1, Max: 0.2, Type: 'Percent' } },
  { Quality: 'Rare', Value: { Min: 0.2, Max: 0.3, Type: 'Percent' } },
  { Quality: 'Epic', Value: { Min: 0.3, Max: 0.4, Type: 'Percent' } },
  { Quality: 'Legendary', Value: { Min: 0.4, Max: 0.5, Type: 'Percent' } }
];

export const RUNE_BLEEDING_DAMAGE: RuneQualitySpec[] = [
  { Quality: 'Common', Value: { Min: 0.01, Max: 0.1, Type: 'Percent' } },
  { Quality: 'Magic', Value: { Min: 0.1, Max: 0.2, Type: 'Percent' } },
  { Quality: 'Rare', Value: { Min: 0.2, Max: 0.35, Type: 'Percent' } },
  { Quality: 'Epic', Value: { Min: 0.35, Max: 0.5, Type: 'Percent' } },
  { Quality: 'Legendary', Value: { Min: 0.5, Max: 0.75, Type: 'Percent' } }
];

export const RUNE_CRIT_DAMAGE: RuneQualitySpec[] = [
  { Quality: 'Common', Value: { Min: 0.01, Max: 0.25, Type: 'Percent' } },
  { Quality: 'Magic', Value: { Min: 0.25, Max: 0.5, Type: 'Percent' } },
  { Quality: 'Rare', Value: { Min: 0.5, Max: 0.75, Type: 'Percent' } },
  { Quality: 'Epic', Value: { Min: 0.75, Max: 1.0, Type: 'Percent' } },
  { Quality: 'Legendary', Value: { Min: 1.0, Max: 1.5, Type: 'Percent' } }
];

export const RUNE_MULTI_HIT_DAMAGE: RuneQualitySpec[] = [
  { Quality: 'Common', Value: { Min: 0.01, Max: 0.12, Type: 'Percent' } },
  { Quality: 'Magic', Value: { Min: 0.12, Max: 0.25, Type: 'Percent' } },
  { Quality: 'Rare', Value: { Min: 0.25, Max: 0.5, Type: 'Percent' } },
  { Quality: 'Epic', Value: { Min: 0.5, Max: 0.75, Type: 'Percent' } },
  { Quality: 'Legendary', Value: { Min: 0.75, Max: 1.0, Type: 'Percent' } }
];

export const RUNE_MULTI_HIT_CHAIN: RuneQualitySpec[] = [
  { Quality: 'Common', Value: { Min: 0.01, Max: 0.1, Type: 'Percent' } },
  { Quality: 'Magic', Value: { Min: 0.1, Max: 0.2, Type: 'Percent' } },
  { Quality: 'Rare', Value: { Min: 0.2, Max: 0.3, Type: 'Percent' } },
  { Quality: 'Epic', Value: { Min: 0.3, Max: 0.4, Type: 'Percent' } },
  { Quality: 'Legendary', Value: { Min: 0.4, Max: 0.5, Type: 'Percent' } }
];

export const RUNE_CHARGE_GAIN: RuneQualitySpec[] = [
  { Quality: 'Common', Value: { Min: 0.01, Max: 0.1, Type: 'Flat' } },
  { Quality: 'Magic', Value: { Min: 0.1, Max: 0.2, Type: 'Flat' } },
  { Quality: 'Rare', Value: { Min: 0.2, Max: 0.3, Type: 'Flat' } },
  { Quality: 'Epic', Value: { Min: 0.3, Max: 0.4, Type: 'Flat' } },
  { Quality: 'Legendary', Value: { Min: 0.4, Max: 0.5, Type: 'Flat' } }
];

export const RUNE_CHARGE_DAMAGE: RuneQualitySpec[] = [
  { Quality: 'Common', Value: { Min: 0.01, Max: 0.12, Type: 'Percent' } },
  { Quality: 'Magic', Value: { Min: 0.12, Max: 0.25, Type: 'Percent' } },
  { Quality: 'Rare', Value: { Min: 0.25, Max: 0.5, Type: 'Percent' } },
  { Quality: 'Epic', Value: { Min: 0.5, Max: 0.75, Type: 'Percent' } },
  { Quality: 'Legendary', Value: { Min: 0.75, Max: 1.0, Type: 'Percent' } }
];
