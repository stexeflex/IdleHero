import { Affix, AffixDefinition, AffixTier, AffixTierSpec, Item, RarityRules } from '../../models';
import {
  ExceedsMaxTierForItemLevel,
  ExceedsMaximumEnchantableAffixes,
  GetAffixTierSpec,
  NextTier,
  RandomInRange
} from './affix.utils';
import { GetAffixPool, GetItemRarity, GetItemRarityRule } from './item.utils';

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ItemAffixService {
  /**
   * Checks if the item can enchant an affix according to its rarity rules.
   * @param item The item instance.
   * @param affixIndex The index of the affix to check for enchant eligibility.
   * @returns True if current count of Improved affixes is below rarity limit.
   */
  public CanEnchant(item: Item, affixIndex: number): boolean {
    if (affixIndex < 0) return false;
    if (affixIndex >= item.Affixes.length) return false;

    const affix = item.Affixes[affixIndex];
    const next = NextTier(affix.Tier);
    if (!next) return false;
    if (ExceedsMaxTierForItemLevel(next, item.Level)) return false;

    if (!affix.Improved) {
      if (ExceedsMaximumEnchantableAffixes(item)) return false;
    }

    return true;
  }

  /**
   * Checks if the item can receive a new affix according to its rarity rules.
   * @param item The item instance to check.
   * @returns True if current count of affixes is below rarity limit.
   */
  public CanAddAffix(item: Item): boolean {
    const rarity = GetItemRarity(item.Level);
    const rules: RarityRules = GetItemRarityRule(rarity);
    return item.Affixes.length < rules.MaxAffixes;
  }

  /**
   * Checks if the affix at the given index can be rerolled according to rarity rules and index validity.
   * @param item The item instance containing the affix.
   * @param affixIndex The index of the affix to check for reroll eligibility.
   * @returns True if the affix can be rerolled; false if index is invalid or rarity does not allow rerolls.
   */
  public CanReroll(item: Item, affixIndex: number): boolean {
    const rarity = GetItemRarity(item.Level);
    const rules: RarityRules = GetItemRarityRule(rarity);
    if (!rules.AllowAffixReroll) return false;
    if (affixIndex < 0) return false;
    if (affixIndex >= item.Affixes.length) return false;
    return true;
  }

  /**
   * Adds a new affix to the item if allowed by rarity and slot, respecting level tier gating.
   * @param item The item instance.
   * @returns A new item instance with the added affix; original if not allowed.
   */
  public AddAffix(item: Item): Item {
    if (!this.CanAddAffix(item)) return item;

    const pool = GetAffixPool(item.Slot);
    const definition = this.PickRandomDefinition(pool);
    if (!definition) return item;

    const baseTier: AffixTier = 'Common';
    const tierSpec: AffixTierSpec = GetAffixTierSpec(definition, baseTier);
    const rolled = RandomInRange(tierSpec.Value.Min, tierSpec.Value.Max);

    const newAffix: Affix = {
      DefinitionId: definition.Id,
      Tier: baseTier,
      RolledValue: rolled,
      Improved: false
    };

    const nextAffixes = [...item.Affixes, newAffix];
    return { ...item, Affixes: nextAffixes };
  }

  /**
   * Enchants (upgrades tier) of a specific affix if allowed by item level and rarity rules.
   * @param item The item instance to modify.
   * @param affixIndex Index of the affix to enchant.
   * @param definition The affix definition to resolve tier ranges.
   * @returns A new item with the affix tier increased and marked as Improved; original if not allowed.
   */
  public EnchantAffix(item: Item, affixIndex: number, definition: AffixDefinition): Item {
    if (!this.CanEnchant(item, affixIndex)) return item;

    const affix: Affix = item.Affixes[affixIndex];

    // Get next tier (null if at max)
    const next: AffixTier | null = NextTier(affix.Tier);
    if (!next) return item;

    // Respect level gating: do not exceed max tier for item level
    const overMax: boolean = ExceedsMaxTierForItemLevel(next, item.Level);
    if (overMax) return item;

    // Determine new rolled value in next tier's range
    const tierSpec: AffixTierSpec = GetAffixTierSpec(definition, next);
    const rolled = RandomInRange(tierSpec.Value.Min, tierSpec.Value.Max);

    const newAffix: Affix = {
      ...affix,
      Tier: next,
      RolledValue: rolled,
      Improved: true
    };

    const nextAffixes = item.Affixes.slice();
    nextAffixes[affixIndex] = newAffix;

    return { ...item, Affixes: nextAffixes };
  }

  /**
   * Rerolls the value of a single affix within its current tier.
   * @param item The item instance containing the affix.
   * @param affixIndex The index of the affix to reroll.
   * @returns A new item instance with the rerolled affix value.
   */
  public RerollAffix(item: Item, affixIndex: number): Item {
    if (affixIndex < 0) return item;
    if (affixIndex >= item.Affixes.length) return item;

    const affix = item.Affixes[affixIndex];
    const pool = this.AllowedAffixPool(item);
    const definition = this.PickRandomDefinition(pool);

    if (!definition) return item;

    const rolledValue = this.RollValue(definition, affix.Tier);
    if (rolledValue === null) return item;

    const newAffix: Affix = {
      ...affix,
      DefinitionId: definition.Id,
      RolledValue: rolledValue
    };

    const nextAffixes = item.Affixes.slice();
    nextAffixes[affixIndex] = newAffix;

    return { ...item, Affixes: nextAffixes };
  }

  private AllowedAffixPool(item: Item): AffixDefinition[] {
    return GetAffixPool(item.Slot);
  }

  private PickRandomDefinition(pool: AffixDefinition[]): AffixDefinition | null {
    if (pool.length === 0) return null;
    const index = Math.floor(Math.random() * pool.length);
    return pool[index] ?? null;
  }

  private RollValue(definition: AffixDefinition, tier: AffixTier): number | null {
    const tierSpec = GetAffixTierSpec(definition, tier);
    return RandomInRange(tierSpec.Value.Min, tierSpec.Value.Max);
  }
}
