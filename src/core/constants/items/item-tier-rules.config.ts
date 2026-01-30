import { ItemLevel, ItemRarity, ItemTier } from '../../models';

export interface ItemTierRule {
  MinItemLevel: ItemLevel;
  MaxItemLevel: ItemLevel;
  MinRarity: ItemRarity;
  MaxRarity: ItemRarity;
}

export const ITEM_TIER_RULES: Record<ItemTier, ItemTierRule> = {
  I: {
    MinItemLevel: 1,
    MaxItemLevel: 14,
    MinRarity: 'Common',
    MaxRarity: 'Rare'
  },
  II: {
    MinItemLevel: 5,
    MaxItemLevel: 25,
    MinRarity: 'Magic',
    MaxRarity: 'Epic'
  },
  III: {
    MinItemLevel: 10,
    MaxItemLevel: 25,
    MinRarity: 'Rare',
    MaxRarity: 'Legendary'
  }
};
