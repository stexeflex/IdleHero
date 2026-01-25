import { EmptyStatSource, RuneDefinition, RuneQuality, StatSource } from '../../models';

import { RUNE_CRIT_QUALITY } from './rune-quality-specs.config';

export const RUNE_QUALITY_ORDER: RuneQuality[] = ['Magic', 'Rare', 'Epic', 'Legendary'];

export const RUNE_DEFINITIONS: RuneDefinition[] = [
  {
    Id: 'rune_berserker',
    Name: 'Berserker Rune',
    AllowedSlots: ['Weapon'],
    Qualities: RUNE_CRIT_QUALITY,
    Effect: {
      Description: '+X% Critical Hit Damage',
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('rune_berserker');
        s.CriticalHit.MultiplierDamage = Math.max(0, value / 100);
        return s;
      }
    }
  }
];
