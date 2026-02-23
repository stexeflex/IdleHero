import { Item, ItemVariantDefinition } from './items/item';

import { ItemRarity } from './items/item-rarity.enum';

export interface CraftingCostProvider {
  GetCraftItemCost(variant: ItemVariantDefinition, rarity: ItemRarity): number;
  GetLevelUpCost(item: Item): number;
  GetRerollAffixCost(item: Item, affixIndex: number): number;
  GetEnchantAffixCost(item: Item, affixIndex: number): number;
  GetAddAffixCost(item: Item): number;
  CanAfford(cost: number): boolean;
  Charge(cost: number): boolean;
}
