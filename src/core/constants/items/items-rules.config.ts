import {
  AffixTier,
  CommonItemLevel,
  EpicItemLevel,
  ItemLevel,
  ItemRarity,
  ItemTier,
  LegendaryItemLevel,
  MagicItemLevel,
  RareItemLevel,
  RarityRulesMap
} from '../../models';

export const ITEM_LEVEL_CONFIG = {
  LEVEL: {
    MIN: 1 as ItemLevel,
    MAX: 25 as ItemLevel,
    COMMON: {
      MIN: 1 as CommonItemLevel,
      MAX: 4 as CommonItemLevel
    },
    MAGIC: {
      MIN: 5 as MagicItemLevel,
      MAX: 9 as MagicItemLevel
    },
    RARE: {
      MIN: 10 as RareItemLevel,
      MAX: 14 as RareItemLevel
    },
    EPIC: {
      MIN: 15 as EpicItemLevel,
      MAX: 19 as EpicItemLevel
    },
    LEGENDARY: {
      MIN: 20 as LegendaryItemLevel,
      MAX: 25 as LegendaryItemLevel
    }
  }
};

export interface ItemTierRule {
  MinItemLevel: ItemLevel;
  MaxItemLevel: ItemLevel;
  MinRarity: ItemRarity;
  MaxRarity: ItemRarity;
}

export const ITEM_TIER_RULES: Record<ItemTier, ItemTierRule> = {
  I: {
    MinItemLevel: ITEM_LEVEL_CONFIG.LEVEL.COMMON.MIN,
    MaxItemLevel: ITEM_LEVEL_CONFIG.LEVEL.RARE.MAX,
    MinRarity: 'Common',
    MaxRarity: 'Rare'
  },
  II: {
    MinItemLevel: ITEM_LEVEL_CONFIG.LEVEL.MAGIC.MIN,
    MaxItemLevel: ITEM_LEVEL_CONFIG.LEVEL.LEGENDARY.MAX,
    MinRarity: 'Magic',
    MaxRarity: 'Epic'
  },
  III: {
    MinItemLevel: ITEM_LEVEL_CONFIG.LEVEL.RARE.MIN,
    MaxItemLevel: ITEM_LEVEL_CONFIG.LEVEL.LEGENDARY.MAX,
    MinRarity: 'Rare',
    MaxRarity: 'Legendary'
  }
};

export const ITEM_RARITY_RULES: RarityRulesMap = {
  Common: {
    MaxAffixes: 0,
    MaxEnchantableAffixes: 0,
    AllowAffixReroll: false,
    AllowedRuneQualities: []
  },
  Magic: {
    MaxAffixes: 1,
    MaxEnchantableAffixes: 1,
    AllowAffixReroll: true,
    AllowedRuneQualities: ['Magic']
  },
  Rare: {
    MaxAffixes: 2,
    MaxEnchantableAffixes: 1,
    AllowAffixReroll: true,
    AllowedRuneQualities: ['Magic', 'Rare']
  },
  Epic: {
    MaxAffixes: 3,
    MaxEnchantableAffixes: 2,
    AllowAffixReroll: true,
    AllowedRuneQualities: ['Magic', 'Rare', 'Epic']
  },
  Legendary: {
    MaxAffixes: 3,
    MaxEnchantableAffixes: 3,
    AllowAffixReroll: true,
    AllowedRuneQualities: ['Magic', 'Rare', 'Epic', 'Legendary']
  }
};

/** Helper order for tiers and qualities */
export const AFFIX_TIER_ORDER: AffixTier[] = ['Common', 'Magic', 'Rare', 'Epic', 'Legendary'];

/** Returns the max affix tier allowed for an item level per your gating rules. */
export const MAX_AFFIX_TIER_FOR_LEVEL: Record<ItemLevel, AffixTier> = {
  1: 'Magic',
  2: 'Magic',
  3: 'Magic',
  4: 'Magic',
  5: 'Rare',
  6: 'Rare',
  7: 'Rare',
  8: 'Rare',
  9: 'Rare',
  10: 'Epic',
  11: 'Epic',
  12: 'Epic',
  13: 'Epic',
  14: 'Epic',
  15: 'Epic',
  16: 'Epic',
  17: 'Epic',
  18: 'Epic',
  19: 'Epic',
  20: 'Legendary',
  21: 'Legendary',
  22: 'Legendary',
  23: 'Legendary',
  24: 'Legendary',
  25: 'Legendary'
};
