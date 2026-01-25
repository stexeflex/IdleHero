import { Affix, AffixDefinition, AffixTier, AffixTierSpec, Item, RarityRules } from '../../models';
import { ExceedsMaxTierForItemLevel, GetItemRarityRule, NextTier, RandomInRange } from '.';

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AffixEnchantService {
  /**
   * Checks if the item can enchant one more affix according to its rarity rules.
   * @param item The item instance.
   * @returns True if current count of Improved affixes is below rarity limit.
   */
  public CanEnchant(item: Item): boolean {
    const rules: RarityRules = GetItemRarityRule(item.Rarity);
    const improvedCount: number = item.Affixes.filter((a) => a.Improved).length;
    return improvedCount < rules.MaxEnchantableAffixes;
  }

  /**
   * Enchants (upgrades tier) of a specific affix if allowed by item level and rarity rules.
   * @param item The item instance to modify.
   * @param affixIndex Index of the affix to enchant.
   * @param definition The affix definition to resolve tier ranges.
   * @returns A new item with the affix tier increased and marked as Improved; original if not allowed.
   */
  public EnchantAffix(item: Item, affixIndex: number, definition: AffixDefinition): Item {
    if (!this.CanEnchant(item)) return item;
    if (affixIndex < 0 || affixIndex >= item.Affixes.length) return item;

    const affix: Affix = item.Affixes[affixIndex];

    // Get next tier (null if at max)
    const next: AffixTier | null = NextTier(affix.Tier);
    if (!next) return item;

    // Respect level gating: do not exceed max tier for item level
    const overMax: boolean = ExceedsMaxTierForItemLevel(next, item.Level);
    if (overMax) return item;

    // Determine new rolled value in next tier's range
    const tierSpec: AffixTierSpec | undefined = definition.Tiers.find((t) => t.Tier === next);
    if (!tierSpec) return item;

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
}
