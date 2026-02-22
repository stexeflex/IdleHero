import { ItemRarity, ItemTier } from '../../models';

export const CRAFTING_COST_CONFIG = {
  ITEM_CRAFT_BASE_COST: 100,
  ITEM_WEAPON_CRAFT_BASE_COST: 200,
  ITEM_UPGRADE_BASE_COST: 200,

  AFFIX_ADD_BASE_COST: 200,
  AFFIX_REROLL_BASE_COST: 50,
  AFFIX_ENCHANT_BASE_COST: 2000,

  REFUND_MULTIPLIER: 0.25
};

export const ITEM_RARITY_COST_MULTIPLIER: Record<ItemRarity, number> = {
  Common: 1,
  Magic: 1.25,
  Rare: 1.5,
  Epic: 1.75,
  Legendary: 2
};

export const ITEM_TIER_COST_MULTIPLIER: Record<ItemTier, number> = {
  I: 1,
  II: 2,
  III: 5
};
