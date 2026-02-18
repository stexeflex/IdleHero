import {
  AFFIX_DEFINITIONS,
  ITEM_LEVEL_CONFIG,
  ITEM_RARITY_RULES,
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

export function NextLevel(item: Item): ItemLevel {
  // TODO: Respect max level per rarity
  const nextLevel: ItemLevel = Math.min(ITEM_LEVEL_CONFIG.LEVEL.MAX, item.Level + 1) as ItemLevel;
  return nextLevel;
}

export function IsMaxLevel(item: Item): boolean {
  const tierRules = ITEM_TIER_RULES[item.Tier];
  return item.Level >= tierRules.MaxItemLevel;
}

export function CreateItem(variant: ItemVariantDefinition): Item {
  const item: Item = {
    Id: `item_${variant.Id}_${TimestampUtils.GetTimestampNow()}`,
    DefinitionId: variant.Id,
    Name: variant.Name,
    Icon: variant.Icon,
    Slot: variant.Slot,
    Type: variant.Type,
    Tier: variant.Tier,
    Level: MinLevelForTier(variant.Tier),
    Affixes: [],
    Rune: null
  };
  return item;
}
