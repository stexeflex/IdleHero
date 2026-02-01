import { ItemRarity, ItemTier } from '../../models';

export const ITEM_RARITY_COST_MULTIPLIER: Record<ItemRarity, number> = {
  Common: 1,
  Magic: 2,
  Rare: 4,
  Epic: 8,
  Legendary: 16
};

export const ITEM_TIER_COST_MULTIPLIER: Record<ItemTier, number> = {
  I: 1,
  II: 5,
  III: 20
};
