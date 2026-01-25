import { ItemRarity, RarityRulesMap } from '../../models';

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

export const ITEM_RARITY_COST_MULTIPLIER: Record<ItemRarity, number> = {
  Common: 1,
  Magic: 2,
  Rare: 4,
  Epic: 8,
  Legendary: 16
};
