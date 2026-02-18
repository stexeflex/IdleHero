import { AffixTier } from '../affixes/affix-tier.enum';
import { ItemRarity } from './item-rarity.enum';
import { RuneQuality } from '../runes/rune-quality.enum';

export interface RarityRules {
  /** Max number of affixes allowed for items of this rarity */
  MaxAffixes: number;

  /** Number of affixes that can be improved via enchanting */
  MaxEnchantableAffixes: number;

  /** The max affix tier allowed for items of this rarity */
  MaxAffixTier: AffixTier;

  /** Whether affix rerolling is available */
  AllowAffixReroll: boolean;

  /** Allowed rune qualities for the rune slot */
  AllowedRuneQualities: RuneQuality[];
}

export type RarityRulesMap = Record<ItemRarity, RarityRules>;
