import {
  AFFIX_DEFINITIONS,
  CRAFTING_COST_CONFIG,
  ITEM_LEVEL_CONFIG,
  ITEM_RARITY_COST_MULTIPLIER,
  ITEM_RARITY_RULES,
  ITEM_TIER_COST_MULTIPLIER,
  ITEM_TIER_RULES,
  ITEM_VARIANTS
} from '../../constants';
import {
  AffixDefinition,
  AffixTier,
  Item,
  ItemLevel,
  ItemRarity,
  ItemSlot,
  ItemTier,
  ItemVariantDefinition,
  RarityRules
} from '../../models';

import { TierIndex } from './affix.utils';
import { TimestampUtils } from '../../../shared/utils';

export function GetItemVariant(definitionId: string): ItemVariantDefinition {
  return ITEM_VARIANTS.find((v) => v.Id === definitionId)!;
}

export function GetItemRarityRule(rarity: ItemRarity): RarityRules {
  return ITEM_RARITY_RULES[rarity];
}

export function GetMaxAffixTier(rarity: ItemRarity): AffixTier {
  const rules = ITEM_RARITY_RULES[rarity];
  return rules.MaxAffixTier;
}

export function GetItemRarity(itemLevel: ItemLevel): ItemRarity {
  if (itemLevel >= ITEM_LEVEL_CONFIG.LEVEL.LEGENDARY.MIN) {
    return 'Legendary';
  } else if (itemLevel >= ITEM_LEVEL_CONFIG.LEVEL.EPIC.MIN) {
    return 'Epic';
  } else if (itemLevel >= ITEM_LEVEL_CONFIG.LEVEL.RARE.MIN) {
    return 'Rare';
  } else if (itemLevel >= ITEM_LEVEL_CONFIG.LEVEL.MAGIC.MIN) {
    return 'Magic';
  }
  return 'Common';
}

export function MinRarityForTier(tier: ItemTier): ItemRarity {
  const rules = ITEM_TIER_RULES[tier];
  return rules.MinRarity;
}

export function GetAffixPool(itemSlot: ItemSlot): AffixDefinition[] {
  return AFFIX_DEFINITIONS.filter((definition) => definition.AllowedSlots.includes(itemSlot));
}

export function MinLevelForTier(tier: ItemTier): ItemLevel {
  const rules = ITEM_TIER_RULES[tier];
  return rules.MinItemLevel;
}

export function MaxLevelForTier(tier: ItemTier): ItemLevel {
  const rules = ITEM_TIER_RULES[tier];
  return rules.MaxItemLevel;
}

export function MaxLevelForRarity(rarity: ItemRarity): ItemLevel {
  const rules = ITEM_RARITY_RULES[rarity];
  return rules.MaxItemLevel;
}

export function NextLevel(item: Item): ItemLevel {
  // TODO: Respect max level per rarity
  const nextLevel: ItemLevel = Math.min(ITEM_LEVEL_CONFIG.LEVEL.MAX, item.Level + 1) as ItemLevel;
  return nextLevel;
}

export function IsMaxLevel(item: Item): boolean {
  const definition = GetItemVariant(item.DefinitionId);
  const tierRules = ITEM_TIER_RULES[definition.Tier];
  return item.Level >= tierRules.MaxItemLevel;
}

export function CreateItem(variant: ItemVariantDefinition): Item {
  const item: Item = {
    Id: `item_${variant.Id}_${TimestampUtils.GetTimestampNow()}`,
    DefinitionId: variant.Id,
    Level: MinLevelForTier(variant.Tier),
    Affixes: []
  };
  return item;
}

export function GetDismantleRefund(item: Item): number {
  const definition = GetItemVariant(item.DefinitionId);
  const itemRarity = GetItemRarity(item.Level);
  const minLevel = MinLevelForTier(definition.Tier);

  const baseCost =
    definition.Slot === 'Weapon'
      ? CRAFTING_COST_CONFIG.ITEM_WEAPON_CRAFT_BASE_COST
      : CRAFTING_COST_CONFIG.ITEM_CRAFT_BASE_COST;

  const levelMultiplier = 1 + (item.Level - minLevel);
  const rarityMultiplier = ITEM_RARITY_COST_MULTIPLIER[itemRarity];
  const tierMultiplier = ITEM_TIER_COST_MULTIPLIER[definition.Tier];

  const itemRefund = baseCost * levelMultiplier * rarityMultiplier * tierMultiplier;

  const affixRefund = item.Affixes.length * CRAFTING_COST_CONFIG.AFFIX_ADD_BASE_COST;
  const affixTierRefund = item.Affixes.reduce((sum, affix) => {
    const tierMultiplier = affix ? TierIndex(affix.Tier) + 1 : 0;
    return sum + CRAFTING_COST_CONFIG.AFFIX_ENCHANT_BASE_COST * tierMultiplier;
  }, 0);

  const affixesRefund = affixRefund + affixTierRefund;

  const totalRefund = Math.round(itemRefund + affixesRefund);

  return Math.round(totalRefund * CRAFTING_COST_CONFIG.REFUND_MULTIPLIER);
}
