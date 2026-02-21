import {
  AffixDefinition,
  CraftingCostProvider,
  Item,
  ItemVariantDefinition,
  OperationResult
} from '../models';
import {
  CreateItem,
  GetAffixDefinition,
  ItemAffixService,
  ItemLevelService,
  MinRarityForTier
} from '../systems/items';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CraftingService {
  private readonly Level = inject(ItemLevelService);
  private readonly Affix = inject(ItemAffixService);

  /**
   * Crafts a brand new item from a variant and rarity at level 1.
   * @param variant The item variant definition.
   * @param provider Optional cost provider.
   * @returns Operation result with created item when successful.
   */
  public CraftNewItem(
    variant: ItemVariantDefinition,
    provider?: CraftingCostProvider
  ): OperationResult {
    const rarity = MinRarityForTier(variant.Tier);
    const cost = provider?.GetCraftItemCost(variant, rarity) ?? 0;
    if (provider && !provider.CanAfford(cost)) return { Success: false, Item: null as any };

    const item: Item = CreateItem(variant);

    if (provider) provider.Charge(cost);
    return { Success: true, Item: item, Cost: cost };
  }

  /**
   * Levels up an item by one (max 5). Applies optional cost provider.
   * @param item The item to level up.
   * @param provider Optional cost provider.
   * @returns Operation result with success flag and updated item.
   */
  public LevelUp(item: Item, provider?: CraftingCostProvider): OperationResult {
    if (!this.Level.CanLevelUp(item)) return { Success: false, Item: item };

    const cost = provider?.GetLevelUpCost(item) ?? 0;
    if (provider && !provider.CanAfford(cost)) return { Success: false, Item: item };

    const next = this.Level.LevelUp(item);
    if (provider) provider.Charge(cost);
    return { Success: true, Item: next, Cost: cost };
  }

  /**
   * Rerolls the value of an affix within its current tier.
   * @param item The item containing the affix.
   * @param affixIndex The affix index to reroll.
   * @param provider Optional cost provider.
   * @returns Operation result with success flag and updated item.
   */
  public RerollAffix(
    item: Item,
    affixIndex: number,
    provider?: CraftingCostProvider
  ): OperationResult {
    if (!this.Affix.CanReroll(item, affixIndex)) return { Success: false, Item: item };

    const cost = provider?.GetRerollAffixCost(item, affixIndex) ?? 0;
    if (provider && !provider.CanAfford(cost)) return { Success: false, Item: item };

    const next = this.Affix.RerollAffix(item, affixIndex);
    if (provider) provider.Charge(cost);

    return { Success: true, Item: next, Cost: cost };
  }

  /**
   * Enchants (upgrades tier) of a specific affix if allowed by rarity and item level.
   * @param item The item instance.
   * @param affixIndex Index of the affix to enchant.
   * @param provider Optional cost provider.
   * @returns Operation result with success flag and updated item.
   */
  public EnchantAffix(
    item: Item,
    affixIndex: number,
    provider?: CraftingCostProvider
  ): OperationResult {
    if (!this.Affix.CanEnchant(item, affixIndex)) return { Success: false, Item: item };

    const cost = provider?.GetEnchantAffixCost(item, affixIndex) ?? 0;
    if (provider && !provider.CanAfford(cost)) return { Success: false, Item: item };

    const definition: AffixDefinition = GetAffixDefinition(item.Affixes[affixIndex].DefinitionId);
    const next = this.Affix.EnchantAffix(item, affixIndex, definition);
    if (provider) provider.Charge(cost);

    return { Success: true, Item: next, Cost: cost };
  }

  /**
   * Adds a new affix to the item if allowed by rarity and slot, respecting level tier gating.
   * @param item The item instance.
   * @param provider Optional cost provider.
   * @returns Operation result with success flag and updated item.
   */
  public AddAffix(item: Item, provider?: CraftingCostProvider): OperationResult {
    if (!this.Affix.CanAddAffix(item)) return { Success: false, Item: item };

    const cost = provider?.GetAddAffixCost(item) ?? 0;
    if (provider && !provider.CanAfford(cost)) return { Success: false, Item: item };

    const next = this.Affix.AddAffix(item);
    if (provider) provider.Charge(cost);

    return { Success: true, Item: next, Cost: cost };
  }
}
