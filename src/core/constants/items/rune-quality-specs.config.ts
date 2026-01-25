import { RuneQualitySpec } from '../../models';

export const RUNE_CRIT_QUALITY: RuneQualitySpec[] = [
  { Quality: 'Magic', Value: { Min: 4, Max: 6 } },
  { Quality: 'Rare', Value: { Min: 6, Max: 9 } },
  { Quality: 'Epic', Value: { Min: 9, Max: 12 } },
  { Quality: 'Legendary', Value: { Min: 12, Max: 16 } }
];
