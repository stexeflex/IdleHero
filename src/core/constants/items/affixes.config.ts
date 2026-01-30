import { AffixDefinition, AffixTier, EmptyStatSource, ItemLevel, StatSource } from '../../models';
import { DAMAGE_PCT_TIERS, STRENGTH_TIERS } from './affix-tier-specs.config';

/** Helper order for tiers and qualities */
export const AFFIX_TIER_ORDER: AffixTier[] = ['Common', 'Magic', 'Rare', 'Epic', 'Legendary'];

/** Returns the max affix tier allowed for an item level per your gating rules. */
export function MaxAffixTierForLevel(level: ItemLevel): AffixTier {
  switch (level) {
    case 1:
    case 2:
      return 'Magic'; // tiers up to 2
    case 3:
    case 4:
      return 'Epic'; // tiers up to 3–4
    case 5:
    default:
      return 'Legendary'; // tiers up to 5
  }
}

export const AFFIX_DEFINITIONS: AffixDefinition[] = [
  //   {
  //     Id: 'affix_strength_flat',
  //     Name: '+Strength',
  //     Groups: ['Offense'],
  //     AllowedSlots: ['Weapon', 'Head', 'Chest', 'Legs', 'Boots', 'OffHand'],
  //     Tiers: STRENGTH_TIERS,
  //     Effect: {
  //       Description: '+X Strength',
  //       MapToStatSource: (value: number): StatSource => {
  //         const s = EmptyStatSource('affix_str_flat');
  //         s.Strength.Flat = Math.floor(value);
  //         return s;
  //       }
  //     }
  //   },
  //   {
  //     Id: 'affix_damage_percent',
  //     Name: '% Damage',
  //     Groups: ['Offense'],
  //     AllowedSlots: ['Weapon'],
  //     Tiers: DAMAGE_PCT_TIERS,
  //     Effect: {
  //       Description: '+X% Damage',
  //       MapToStatSource: (value: number): StatSource => {
  //         const s = EmptyStatSource('affix_dmg_pct');
  //         s.Damage.Multiplier = Math.max(0, value / 100);
  //         return s;
  //       }
  //     }
  //   }
];
