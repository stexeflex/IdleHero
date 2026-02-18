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
    MaxItemLevel: ITEM_LEVEL_CONFIG.LEVEL.EPIC.MAX,
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
    MaxAffixes: 1,
    MaxEnchantableAffixes: 1,
    MaxAffixTier: 'Common',
    AllowAffixReroll: true,
    AllowedRuneQualities: []
  },
  Magic: {
    MaxAffixes: 2,
    MaxEnchantableAffixes: 2,
    MaxAffixTier: 'Magic',
    AllowAffixReroll: true,
    AllowedRuneQualities: ['Magic']
  },
  Rare: {
    MaxAffixes: 2,
    MaxEnchantableAffixes: 2,
    MaxAffixTier: 'Rare',
    AllowAffixReroll: true,
    AllowedRuneQualities: ['Magic', 'Rare']
  },
  Epic: {
    MaxAffixes: 3,
    MaxEnchantableAffixes: 3,
    MaxAffixTier: 'Epic',
    AllowAffixReroll: true,
    AllowedRuneQualities: ['Magic', 'Rare', 'Epic']
  },
  Legendary: {
    MaxAffixes: 3,
    MaxEnchantableAffixes: 3,
    MaxAffixTier: 'Legendary',
    AllowAffixReroll: true,
    AllowedRuneQualities: ['Magic', 'Rare', 'Epic', 'Legendary']
  }
};

/** Helper order for tiers and qualities */
export const AFFIX_TIER_ORDER: AffixTier[] = ['Common', 'Magic', 'Rare', 'Epic', 'Legendary'];
