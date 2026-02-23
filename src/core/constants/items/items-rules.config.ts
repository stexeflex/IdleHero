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
    MAX: 30 as ItemLevel,
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
      MAX: 30 as LegendaryItemLevel
    }
  }
};

export interface ItemTierRule {
  PlayerLevelRequirement?: number;
  MinItemLevel: ItemLevel;
  MaxItemLevel: ItemLevel;
  MinRarity: ItemRarity;
  MaxRarity: ItemRarity;
}

export const ITEM_TIER_RULES: Record<ItemTier, ItemTierRule> = {
  I: {
    PlayerLevelRequirement: 1,
    MinItemLevel: ITEM_LEVEL_CONFIG.LEVEL.COMMON.MIN,
    MaxItemLevel: ITEM_LEVEL_CONFIG.LEVEL.MAGIC.MAX,
    MinRarity: 'Common',
    MaxRarity: 'Magic'
  },
  II: {
    PlayerLevelRequirement: 15,
    MinItemLevel: ITEM_LEVEL_CONFIG.LEVEL.RARE.MIN,
    MaxItemLevel: ITEM_LEVEL_CONFIG.LEVEL.EPIC.MAX,
    MinRarity: 'Rare',
    MaxRarity: 'Epic'
  },
  III: {
    PlayerLevelRequirement: 35,
    MinItemLevel: ITEM_LEVEL_CONFIG.LEVEL.LEGENDARY.MIN,
    MaxItemLevel: ITEM_LEVEL_CONFIG.LEVEL.LEGENDARY.MAX,
    MinRarity: 'Legendary',
    MaxRarity: 'Legendary'
  }
};

export const ITEM_RARITY_RULES: RarityRulesMap = {
  Common: {
    MinItemLevel: ITEM_LEVEL_CONFIG.LEVEL.COMMON.MIN,
    MaxItemLevel: ITEM_LEVEL_CONFIG.LEVEL.COMMON.MAX,
    MaxAffixes: 1,
    MaxEnchantableAffixes: 1,
    MaxAffixTier: 'Common',
    AllowAffixReroll: true
  },
  Magic: {
    MinItemLevel: ITEM_LEVEL_CONFIG.LEVEL.MAGIC.MIN,
    MaxItemLevel: ITEM_LEVEL_CONFIG.LEVEL.MAGIC.MAX,
    MaxAffixes: 2,
    MaxEnchantableAffixes: 2,
    MaxAffixTier: 'Magic',
    AllowAffixReroll: true
  },
  Rare: {
    MinItemLevel: ITEM_LEVEL_CONFIG.LEVEL.RARE.MIN,
    MaxItemLevel: ITEM_LEVEL_CONFIG.LEVEL.RARE.MAX,
    MaxAffixes: 2,
    MaxEnchantableAffixes: 2,
    MaxAffixTier: 'Rare',
    AllowAffixReroll: true
  },
  Epic: {
    MinItemLevel: ITEM_LEVEL_CONFIG.LEVEL.EPIC.MIN,
    MaxItemLevel: ITEM_LEVEL_CONFIG.LEVEL.EPIC.MAX,
    MaxAffixes: 3,
    MaxEnchantableAffixes: 3,
    MaxAffixTier: 'Epic',
    AllowAffixReroll: true
  },
  Legendary: {
    MinItemLevel: ITEM_LEVEL_CONFIG.LEVEL.LEGENDARY.MIN,
    MaxItemLevel: ITEM_LEVEL_CONFIG.LEVEL.LEGENDARY.MAX,
    MaxAffixes: 4,
    MaxEnchantableAffixes: 4,
    MaxAffixTier: 'Legendary',
    AllowAffixReroll: true
  }
};

/** Helper order for tiers and qualities */
export const AFFIX_TIER_ORDER: AffixTier[] = ['Common', 'Magic', 'Rare', 'Epic', 'Legendary'];
