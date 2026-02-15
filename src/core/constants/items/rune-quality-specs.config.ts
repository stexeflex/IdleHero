import { RuneQualitySpec } from '../../models';

export const RUNE_CRIT_QUALITY: RuneQualitySpec[] = [
  { Quality: 'Magic', Value: { Min: 0.04, Max: 0.06, Type: 'Percent' } },
  { Quality: 'Rare', Value: { Min: 0.06, Max: 0.09, Type: 'Percent' } },
  { Quality: 'Epic', Value: { Min: 0.09, Max: 0.12, Type: 'Percent' } },
  { Quality: 'Legendary', Value: { Min: 0.12, Max: 0.16, Type: 'Percent' } }
];
