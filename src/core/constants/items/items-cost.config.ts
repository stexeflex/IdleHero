import { ItemRarity, ItemTier } from '../../models';

export const CRAFTING_COST_CONFIG = {
  ITEM_CRAFT_BASE_COST: 150,
  ITEM_WEAPON_CRAFT_BASE_COST: 300,
  ITEM_UPGRADE_BASE_COST: 100,
  AFFIX_ADD_BASE_COST: 100,
  AFFIX_REROLL_BASE_COST: 30,
  AFFIX_ENCHANT_BASE_COST: 120
};

export const ITEM_RARITY_COST_MULTIPLIER: Record<ItemRarity, number> = {
  Common: 1,
  Magic: 1.2,
  Rare: 1.4,
  Epic: 1.8,
  Legendary: 2
};

export const ITEM_TIER_COST_MULTIPLIER: Record<ItemTier, number> = {
  I: 1,
  II: 5,
  III: 10
};
