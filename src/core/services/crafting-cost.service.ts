import {
  AffixDefinition,
  Item,
  ItemRarity,
  ItemVariantDefinition,
  RuneDefinition,
  RuneQuality
} from '../models';
import { ITEM_RARITY_COST_MULTIPLIER, ITEM_TIER_COST_MULTIPLIER } from '../constants';
import { Injectable, inject } from '@angular/core';
import { QualityIndex, TierIndex } from '../systems/items';

import { CraftingCostProvider } from './crafting.service';
import { GoldService } from './gold.service';

@Injectable({ providedIn: 'root' })
export class GoldCostProvider implements CraftingCostProvider {
  private readonly Gold = inject(GoldService);

  public GetLevelUpCost(item: Item): number {
    const mult = ITEM_RARITY_COST_MULTIPLIER[item.Rarity];
    // Scale by rarity and current level; modest bump per existing affix
    const affixFactor = 1 + Math.max(0, item.Affixes.length) * 0.15;
    return Math.floor(100 * mult * item.Level * affixFactor);
  }

  public GetCraftItemCost(variant: ItemVariantDefinition, rarity: ItemRarity): number {
    const rarityMult = ITEM_RARITY_COST_MULTIPLIER[rarity];
    const tierMult = ITEM_TIER_COST_MULTIPLIER[variant.Tier];
    // Base by slot type; weapons a bit pricier than armor
    const slotBase = variant.Slot === 'Weapon' ? 200 : 120;
    return Math.floor(slotBase * rarityMult * tierMult);
  }

  public GetRerollAffixCost(item: Item, affixIndex: number): number {
    const mult = ITEM_RARITY_COST_MULTIPLIER[item.Rarity];
    const affix = item.Affixes[affixIndex];
    const tIdx = affix ? TierIndex(affix.Tier) : 0;
    // Cheaper than enchanting; scales with tier
    return Math.floor(30 * mult * (tIdx + 1));
  }

  public GetEnchantAffixCost(item: Item, affixIndex: number): number {
    const mult = ITEM_RARITY_COST_MULTIPLIER[item.Rarity];
    const affix = item.Affixes[affixIndex];
    const tIdx = affix ? TierIndex(affix.Tier) : 0;
    // More expensive; scales stronger with current tier
    return Math.floor(120 * mult * (tIdx + 1) * (1 + item.Level * 0.1));
  }

  public GetAddAffixCost(item: Item, definition: AffixDefinition): number {
    const mult = ITEM_RARITY_COST_MULTIPLIER[item.Rarity];
    // Adding an affix is mid-tier cost; scales with item level
    return Math.floor(90 * mult * (1 + item.Level * 0.2));
  }

  public GetRemoveAffixCost(item: Item, affixIndex: number): number {
    const mult = ITEM_RARITY_COST_MULTIPLIER[item.Rarity];
    // Flat service fee scaled by rarity
    return Math.floor(25 * mult);
  }

  public GetSocketRuneCost(item: Item, definition: RuneDefinition, quality: RuneQuality): number {
    const mult = ITEM_RARITY_COST_MULTIPLIER[item.Rarity];
    const qIdx = QualityIndex(quality);
    // Rune socketing scales with rune quality and item rarity
    return Math.floor(80 * mult * (qIdx + 1));
  }

  public GetUnsocketRuneCost(item: Item): number {
    const mult = ITEM_RARITY_COST_MULTIPLIER[item.Rarity];
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
