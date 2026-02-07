import { Affix, AffixDefinition, AffixTier, Item } from '../../models';
import { GetAffixPool, RandomInRange } from '.';

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AffixRerollService {
  /**
   * Rerolls the value of a single affix within its current tier.
   * @param item The item instance containing the affix.
   * @param affixIndex The index of the affix to reroll.
   * @returns A new item instance with the rerolled affix value.
   */
  public RerollAffix(item: Item, affixIndex: number): Item {
    if (affixIndex < 0 || affixIndex >= item.Affixes.length) return item;

    const affix = item.Affixes[affixIndex];
    const pool = this.PickPool(item);
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

  private PickPool(item: Item): AffixDefinition[] {
    const basePool = this.AllowedAffixPool(item);
    if (basePool.length === 0) return [];

    const existingIds = new Set(item.Affixes.map((a) => a.DefinitionId));

    const poolWithoutDuplicates = basePool.filter((definition) => !existingIds.has(definition.Id));
    if (poolWithoutDuplicates.length > 0) {
      return poolWithoutDuplicates;
    }

    return basePool;
  }

  private PickRandomDefinition(pool: AffixDefinition[]): AffixDefinition | null {
    if (pool.length === 0) return null;
    const index = Math.floor(Math.random() * pool.length);
    return pool[index] ?? null;
  }

  private RollValue(definition: AffixDefinition, tier: AffixTier): number | null {
    const tierSpec = definition.Tiers.find((t) => t.Tier === tier);
    if (!tierSpec) return null;
    return RandomInRange(tierSpec.Value.Min, tierSpec.Value.Max);
  }
}
