import { AffixTier } from '../affixes/affix-tier.enum';
import { ItemLevel } from './item-level.type';
import { ItemRarity } from './item-rarity.enum';

export interface RarityRules {
  MinItemLevel: ItemLevel;
  MaxItemLevel: ItemLevel;

  /** Max number of affixes allowed for items of this rarity */
  MaxAffixes: number;

  /** Number of affixes that can be improved via enchanting */
  MaxEnchantableAffixes: number;

  /** The max affix tier allowed for items of this rarity */
  MaxAffixTier: AffixTier;

  /** Whether affix rerolling is available */
  AllowAffixReroll: boolean;
}

export type RarityRulesMap = Record<ItemRarity, RarityRules>;
