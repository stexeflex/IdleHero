import { ITEM_CONFIG, ITEM_RARITY_RULES } from '../../constants';
import { Item, ItemLevel, ItemRarity, RarityRules } from '../../models';

export function GetItemRarityRule(rarity: ItemRarity): RarityRules {
  return ITEM_RARITY_RULES[rarity];
}

export function NextLevel(item: Item): ItemLevel {
  const nextLevel: ItemLevel = Math.min(ITEM_CONFIG.LEVEL.MAX, item.Level + 1) as ItemLevel;
  return nextLevel;
}

export function IsMaxLevel(item: Item): boolean {
  return item.Level >= ITEM_CONFIG.LEVEL.MAX;
}
