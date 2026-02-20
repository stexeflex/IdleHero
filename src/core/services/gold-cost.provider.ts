import {
  CRAFTING_COST_CONFIG,
  ITEM_RARITY_COST_MULTIPLIER,
  ITEM_TIER_COST_MULTIPLIER
} from '../constants';
import {
  CraftingCostProvider,
  Item,
  ItemRarity,
  ItemVariantDefinition,
  RuneDefinition,
  RuneQuality
} from '../models';
import { GetItemRarity, MinLevelForTier, TierIndex } from '../systems/items';
import { Injectable, inject } from '@angular/core';

import { GoldService } from './gold.service';
import { QualityIndex } from '../systems/runes';

@Injectable({ providedIn: 'root' })
export class GoldCostProvider implements CraftingCostProvider {
  private readonly Gold = inject(GoldService);

  public GetLevelUpCost(item: Item): number {
    const base = CRAFTING_COST_CONFIG.ITEM_UPGRADE_BASE_COST;
    const rarity = GetItemRarity(item.Level);
    const mult = ITEM_RARITY_COST_MULTIPLIER[rarity];
    // Scale by rarity and current level; modest bump per existing affix
    const affixFactor = 1 + Math.max(0, item.Affixes.length) * 0.15;
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
    return Math.floor(base * mult * (tIdx + 1) * (1 + item.Level * 0.1));
  }

  public GetAddAffixCost(item: Item): number {
    const base = CRAFTING_COST_CONFIG.AFFIX_ADD_BASE_COST;
    const rarity = GetItemRarity(item.Level);
    const mult = ITEM_RARITY_COST_MULTIPLIER[rarity];
    // Adding an affix is mid-tier cost; scales with item level
    return Math.floor(base * mult * (1 + item.Level * 0.2));
  }

  public GetSocketRuneCost(item: Item, definition: RuneDefinition, quality: RuneQuality): number {
    const rarity = GetItemRarity(item.Level);
    const mult = ITEM_RARITY_COST_MULTIPLIER[rarity];
    const qIdx = QualityIndex(quality);
    // Rune socketing scales with rune quality and item rarity
    return Math.floor(80 * mult * (qIdx + 1));
  }

  public GetUnsocketRuneCost(item: Item): number {
    const rarity = GetItemRarity(item.Level);
    const mult = ITEM_RARITY_COST_MULTIPLIER[rarity];
    // Small cost to safely extract
    return Math.floor(40 * mult);
  }

  public CanAfford(cost: number): boolean {
    return this.Gold.CanAfford(cost);
  }

  public Charge(cost: number): boolean {
    return this.Gold.Spend(cost);
  }
}
