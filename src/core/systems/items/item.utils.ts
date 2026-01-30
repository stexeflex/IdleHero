import { ITEM_CONFIG, ITEM_RARITY_RULES, ITEM_TIER_RULES } from '../../constants';
import { Item, ItemLevel, ItemRarity, ItemTier, RarityRules } from '../../models';

export function GetItemRarityRule(rarity: ItemRarity): RarityRules {
  return ITEM_RARITY_RULES[rarity];
}

export function GetItemRarity(itemLevel: ItemLevel): ItemRarity {
  if (itemLevel >= ITEM_CONFIG.LEVEL.LEGENDARY.MIN) {
    return 'Legendary';
  } else if (itemLevel >= ITEM_CONFIG.LEVEL.EPIC.MIN) {
    return 'Epic';
  } else if (itemLevel >= ITEM_CONFIG.LEVEL.RARE.MIN) {
    return 'Rare';
  } else if (itemLevel >= ITEM_CONFIG.LEVEL.MAGIC.MIN) {
    return 'Magic';
  }
  return 'Common';
}

export function MinRarityForTier(tier: ItemTier): ItemRarity {
  const rules = ITEM_TIER_RULES[tier];
  return rules.MinRarity;
}

export function MinLevelForTier(tier: ItemTier): ItemLevel {
  const rules = ITEM_TIER_RULES[tier];
  return rules.MinItemLevel;
}

export function NextLevel(item: Item): ItemLevel {
  // TODO: Respect max level per rarity
  const nextLevel: ItemLevel = Math.min(ITEM_CONFIG.LEVEL.MAX, item.Level + 1) as ItemLevel;
  return nextLevel;
}

export function IsMaxLevel(item: Item): boolean {
  return item.Level >= ITEM_CONFIG.LEVEL.MAX;
}
