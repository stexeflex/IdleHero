import {
  CRAFTING_COST_CONFIG,
  ITEM_RARITY_COST_MULTIPLIER,
  ITEM_TIER_COST_MULTIPLIER
} from '../constants';
import { CraftingCostProvider, Item, ItemRarity, ItemVariantDefinition } from '../models';
import { GetItemRarity, MinLevelForTier, TierIndex } from '../systems/items';
import { Injectable, inject } from '@angular/core';

import { GoldService } from './gold.service';

@Injectable({ providedIn: 'root' })
export class GoldCostProvider implements CraftingCostProvider {
  private readonly Gold = inject(GoldService);

  public GetLevelUpCost(item: Item): number {
    const base = CRAFTING_COST_CONFIG.ITEM_UPGRADE_BASE_COST;
    const rarity = GetItemRarity(item.Level);
    const mult = ITEM_RARITY_COST_MULTIPLIER[rarity];
    // Scale by rarity and current level; modest bump per existing affix
    return Math.floor(base * mult * item.Level);
  }

  public GetCraftItemCost(variant: ItemVariantDefinition, rarity: ItemRarity): number {
    const rarityMult = ITEM_RARITY_COST_MULTIPLIER[rarity];
    const tierMult = ITEM_TIER_COST_MULTIPLIER[variant.Tier];
    // Base by slot type; weapons a bit pricier than armor
    const slotBase =
      variant.Slot === 'Weapon'
        ? CRAFTING_COST_CONFIG.ITEM_WEAPON_CRAFT_BASE_COST
        : CRAFTING_COST_CONFIG.ITEM_CRAFT_BASE_COST;
    const minLevel = MinLevelForTier(variant.Tier);
    return Math.floor(slotBase * rarityMult * tierMult * minLevel);
  }

  public GetRerollAffixCost(item: Item, affixIndex: number): number {
    const base = CRAFTING_COST_CONFIG.AFFIX_REROLL_BASE_COST;
    const rarity = GetItemRarity(item.Level);
    const mult = ITEM_RARITY_COST_MULTIPLIER[rarity];
    const affix = item.Affixes[affixIndex];
    const tIdx = affix ? TierIndex(affix.Tier) : 0;
    // Cheaper than enchanting; scales with tier
    return Math.floor(base * mult * (tIdx + 1));
  }

  public GetEnchantAffixCost(item: Item, affixIndex: number): number {
    const base = CRAFTING_COST_CONFIG.AFFIX_ENCHANT_BASE_COST;
    const rarity = GetItemRarity(item.Level);
    const mult = ITEM_RARITY_COST_MULTIPLIER[rarity];
    const affix = item.Affixes[affixIndex];
    const tIdx = affix ? TierIndex(affix.Tier) : 0;
    // More expensive; scales stronger with current tier
    return Math.floor(base * mult * (tIdx + 1));
  }

  public GetAddAffixCost(item: Item): number {
    const base = CRAFTING_COST_CONFIG.AFFIX_ADD_BASE_COST;
    const rarity = GetItemRarity(item.Level);
    const mult = ITEM_RARITY_COST_MULTIPLIER[rarity];
    const affixCount = item.Affixes.length;
    // More expensive with each additional affix; scales with rarity
    return Math.floor(base * mult * (1 + affixCount));
  }

  public CanAfford(cost: number): boolean {
    return this.Gold.CanAfford(cost);
  }

  public Charge(cost: number): boolean {
    return this.Gold.Spend(cost);
  }
}
