import {
  Affix,
  AffixDefinition,
  AffixTier,
  Item,
  ItemRarity,
  ItemVariantDefinition,
  OperationResult,
  RarityRules,
  Rune,
  RuneDefinition,
  RuneQuality
} from '../models';
import {
  AffixEnchantService,
  AffixRerollService,
  ClampAffixTier,
  GetItemRarityRule,
  ItemLevelService,
  RandomInRange
} from '../systems/items';
import { Injectable, inject } from '@angular/core';

export interface CraftingCostProvider {
  GetCraftItemCost(variant: ItemVariantDefinition, rarity: ItemRarity): number;
  GetLevelUpCost(item: Item): number;
  GetRerollAffixCost(item: Item, affixIndex: number): number;
  GetEnchantAffixCost(item: Item, affixIndex: number): number;
  GetAddAffixCost(item: Item, definition: AffixDefinition): number;
  GetRemoveAffixCost(item: Item, affixIndex: number): number;
  GetSocketRuneCost(item: Item, definition: RuneDefinition, quality: RuneQuality): number;
  GetUnsocketRuneCost(item: Item): number;
  CanAfford(cost: number): boolean;
  Charge(cost: number): boolean;
}

@Injectable({ providedIn: 'root' })
export class CraftingService {
  private readonly Level = inject(ItemLevelService);
  private readonly Reroll = inject(AffixRerollService);
  private readonly Enchant = inject(AffixEnchantService);

  /**
   * Crafts a brand new item from a variant and rarity at level 1.
   * @param variant The item variant definition.
   * @param rarity The desired item rarity.
   * @param provider Optional cost provider.
   * @returns Operation result with created item when successful.
   */
  public CraftNewItem(
    variant: ItemVariantDefinition,
    rarity: ItemRarity,
    provider?: CraftingCostProvider
  ): OperationResult {
    const cost = provider?.GetCraftItemCost(variant, rarity) ?? 0;
    if (provider && !provider.CanAfford(cost)) return { Success: false, Item: null as any };

    const item: Item = {
      Id: `item_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      DefinitionId: variant.Id,
      Name: variant.Name,
      Icon: variant.Icon,
      Slot: variant.Slot,
      Rarity: rarity,
      Level: 1,
      Affixes: [],
      Rune: null
    };

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
   * @param definition The affix definition.
   * @param provider Optional cost provider.
   * @returns Operation result with success flag and updated item.
   */
  public RerollAffix(
    item: Item,
    affixIndex: number,
    definition: AffixDefinition,
    provider?: CraftingCostProvider
  ): OperationResult {
    const rules: RarityRules = GetItemRarityRule(item.Rarity);
    if (!rules.AllowAffixReroll) return { Success: false, Item: item };

    if (affixIndex < 0 || affixIndex >= item.Affixes.length) {
      return { Success: false, Item: item };
    }

    const cost = provider?.GetRerollAffixCost(item, affixIndex) ?? 0;
    if (provider && !provider.CanAfford(cost)) return { Success: false, Item: item };

    const next = this.Reroll.RerollAffix(item, affixIndex, definition);
    if (provider) provider.Charge(cost);

    return { Success: true, Item: next, Cost: cost };
  }

  /**
   * Enchants (upgrades tier) of a specific affix if allowed by rarity and item level.
   * @param item The item instance.
   * @param affixIndex Index of the affix to enchant.
   * @param definition The affix definition.
   * @param provider Optional cost provider.
   * @returns Operation result with success flag and updated item.
   */
  public EnchantAffix(
    item: Item,
    affixIndex: number,
    definition: AffixDefinition,
    provider?: CraftingCostProvider
  ): OperationResult {
    if (!this.Enchant.CanEnchant(item)) return { Success: false, Item: item };

    const cost = provider?.GetEnchantAffixCost(item, affixIndex) ?? 0;
    if (provider && !provider.CanAfford(cost)) return { Success: false, Item: item };
    const next = this.Enchant.EnchantAffix(item, affixIndex, definition);

    if (provider) {
      provider.Charge(cost);
    }

    return { Success: true, Item: next, Cost: cost };
  }

  /**
   * Adds a new affix to the item if allowed by rarity and slot, respecting level tier gating.
   * @param item The item instance.
   * @param definition The affix template to apply.
   * @param desiredTier Optional desired tier; will be clamped by level gating.
   * @param provider Optional cost provider.
   * @returns Operation result with success flag and updated item.
   */
  public AddAffix(
    item: Item,
    definition: AffixDefinition,
    desiredTier?: AffixTier,
    provider?: CraftingCostProvider
  ): OperationResult {
    const rules: RarityRules = GetItemRarityRule(item.Rarity);
    if (item.Affixes.length >= rules.MaxAffixes) return { Success: false, Item: item };
    if (!definition.AllowedSlots.includes(item.Slot)) return { Success: false, Item: item };

    const cost = provider?.GetAddAffixCost(item, definition) ?? 0;
    if (provider && !provider.CanAfford(cost)) return { Success: false, Item: item };

    // Clamp desired tier to level gating and available tiers
    const finalTier = ClampAffixTier(item.Level, desiredTier);
    const tierSpec = definition.Tiers.find((t) => t.Tier === finalTier);

    if (!tierSpec) return { Success: false, Item: item };

    const rolled = RandomInRange(tierSpec.Value.Min, tierSpec.Value.Max);

    const newAffix: Affix = {
      DefinitionId: definition.Id,
      Tier: finalTier,
      RolledValue: rolled,
      Improved: false
    };

    const nextAffixes = [...item.Affixes, newAffix];
    const next: Item = { ...item, Affixes: nextAffixes };

    if (provider) provider.Charge(cost);

    return { Success: true, Item: next, Cost: cost };
  }

  /**
   * Removes an affix at index.
   * @param item The item instance.
   * @param affixIndex The index to remove.
   * @param provider Optional cost provider.
   * @returns Operation result with success flag and updated item.
   */
  public RemoveAffix(
    item: Item,
    affixIndex: number,
    provider?: CraftingCostProvider
  ): OperationResult {
    if (affixIndex < 0 || affixIndex >= item.Affixes.length) {
      return { Success: false, Item: item };
    }

    const cost = provider?.GetRemoveAffixCost(item, affixIndex) ?? 0;
    if (provider && !provider.CanAfford(cost)) return { Success: false, Item: item };

    const nextAffixes = item.Affixes.slice();
    nextAffixes.splice(affixIndex, 1);
    const next: Item = { ...item, Affixes: nextAffixes };

    if (provider) provider.Charge(cost);

    return { Success: true, Item: next, Cost: cost };
  }

  /**
   * Sockets (or replaces) a rune on the item if allowed by rarity and slot.
   * @param item The item instance.
   * @param definition Rune definition.
   * @param quality Desired rune quality.
   * @param provider Optional cost provider.
   * @returns Operation result with success flag and updated item.
   */
  public SocketRune(
    item: Item,
    definition: RuneDefinition,
    quality: RuneQuality,
    provider?: CraftingCostProvider
  ): OperationResult {
    const rules: RarityRules = GetItemRarityRule(item.Rarity);

    if (!definition.AllowedSlots.includes(item.Slot)) return { Success: false, Item: item };
    if (!rules.AllowedRuneQualities.includes(quality)) return { Success: false, Item: item };

    const cost = provider?.GetSocketRuneCost(item, definition, quality) ?? 0;
    if (provider && !provider.CanAfford(cost)) return { Success: false, Item: item };

    const spec = definition.Qualities.find((q) => q.Quality === quality);
    if (!spec) return { Success: false, Item: item };

    const rolled = RandomInRange(spec.Value.Min, spec.Value.Max);

    const newRune: Rune = {
      Id: `rune_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      DefinitionId: definition.Id,
      Quality: quality,
      RolledValue: rolled
    };

    const next: Item = { ...item, Rune: newRune };

    if (provider) provider.Charge(cost);

    return { Success: true, Item: next, Cost: cost };
  }

  /**
   * Unsockets the rune from the item (clears rune).
   * @param item The item instance.
   * @param provider Optional cost provider.
   * @returns Operation result with success flag and updated item.
   */
  public UnsocketRune(item: Item, provider?: CraftingCostProvider): OperationResult {
    const cost = provider?.GetUnsocketRuneCost(item) ?? 0;

    if (provider && !provider.CanAfford(cost)) return { Success: false, Item: item };

    const next: Item = { ...item, Rune: null };

    if (provider) provider.Charge(cost);

    return { Success: true, Item: next, Cost: cost };
  }
}
