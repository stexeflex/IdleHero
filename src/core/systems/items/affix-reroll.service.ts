import { Affix, AffixDefinition, Item } from '../../models';

import { Injectable } from '@angular/core';
import { RandomInRange } from '.';

@Injectable({ providedIn: 'root' })
export class AffixRerollService {
  /**
   * Rerolls the value of a single affix within its current tier.
   * @param item The item instance containing the affix.
   * @param affixIndex The index of the affix to reroll.
   * @param definition The affix definition used to obtain tier ranges.
   * @returns A new item instance with the rerolled affix value.
   */
  public RerollAffix(item: Item, affixIndex: number, definition: AffixDefinition): Item {
    if (affixIndex < 0 || affixIndex >= item.Affixes.length) return item;

    const affix = item.Affixes[affixIndex];
    const tierSpec = definition.Tiers.find((t) => t.Tier === affix.Tier);
    if (!tierSpec) return item;

    const newValue = RandomInRange(tierSpec.Value.Min, tierSpec.Value.Max);
    const newAffix: Affix = { ...affix, RolledValue: newValue };

    const nextAffixes = item.Affixes.slice();
    nextAffixes[affixIndex] = newAffix;

    return { ...item, Affixes: nextAffixes };
  }
}
