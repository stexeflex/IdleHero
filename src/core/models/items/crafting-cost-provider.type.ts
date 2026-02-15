import { Item, ItemVariantDefinition } from './items/item';

import { ItemRarity } from './items/item-rarity.enum';
import { RuneDefinition } from './runes/rune';
import { RuneQuality } from './runes/rune-quality.enum';

export interface CraftingCostProvider {
  GetCraftItemCost(variant: ItemVariantDefinition, rarity: ItemRarity): number;
  GetLevelUpCost(item: Item): number;
  GetRerollAffixCost(item: Item, affixIndex: number): number;
  GetEnchantAffixCost(item: Item, affixIndex: number): number;
  GetAddAffixCost(item: Item): number;
  GetSocketRuneCost(item: Item, definition: RuneDefinition, quality: RuneQuality): number;
  GetUnsocketRuneCost(item: Item): number;
  CanAfford(cost: number): boolean;
  Charge(cost: number): boolean;
}
