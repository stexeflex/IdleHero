import { AFFIX_DEFINITIONS, AFFIX_TIER_ORDER, ITEM_RARITY_RULES } from '../../constants';
import {
  Affix,
  AffixDefinition,
  AffixInfo,
  AffixTier,
  AffixTierSpec,
  Item,
  ItemLevel,
  LabelToString
} from '../../models';
import { DecimalPipe, PercentPipe } from '@angular/common';
import { GetItemRarity, GetMaxAffixTier } from './item.utils';

import { ClampUtils } from '../../../shared/utils';

function ComputeRolledValue(
  min: number,
  max: number,
  percentage: number,
  type: 'Flat' | 'Percent'
): number {
  const result = min + (max - min) * ClampUtils.clamp(percentage, 0, 1);
  return type === 'Flat' ? Math.round(result) : result;
}

export function GetAffixInfo(affix: Affix, locale: string): AffixInfo {
  const decimalPipe = new DecimalPipe(locale);
  const percentPipe = new PercentPipe(locale);

  const definition: AffixDefinition = GetAffixDefinition(affix.DefinitionId);
  const affixTierSpec: AffixTierSpec = GetAffixTierSpec(definition, affix.Tier);
  const minMax: { min: number; max: number } = GetMinMaxRoll(affixTierSpec);
  const rolledValue = ComputeRolledValue(
    minMax.min,
    minMax.max,
    affix.ValueRangePercentage,
    affixTierSpec.Value.Type
  );
  const label: string = LabelToString(definition.Effect.ToLabel(rolledValue), decimalPipe);

  let minRollLabel: string = minMax.min.toString();
  let maxRollLabel: string = minMax.max.toString();

  switch (affixTierSpec.Value.Type) {
    case 'Flat':
      minRollLabel = decimalPipe.transform(minMax.min, '1.0-0')!;
      maxRollLabel = decimalPipe.transform(minMax.max, '1.0-0')!;
      break;

    case 'Percent':
      minRollLabel = percentPipe.transform(minMax.min, '1.0-0')!;
      maxRollLabel = percentPipe.transform(minMax.max, '1.0-0')!;
      break;
  }

  return {
    Tier: affix.Tier,
    Label: label,
    Value: rolledValue,
    MinRoll: minRollLabel,
    MaxRoll: maxRollLabel,
    Improved: affix.Improved
  };
}

export function GetAffixValue(affix: Affix): number {
  const definition: AffixDefinition = GetAffixDefinition(affix.DefinitionId);
  const affixTierSpec: AffixTierSpec = GetAffixTierSpec(definition, affix.Tier);
  const minMax: { min: number; max: number } = GetMinMaxRoll(affixTierSpec);
  const rolledValue = ComputeRolledValue(
    minMax.min,
    minMax.max,
    affix.ValueRangePercentage,
    affixTierSpec.Value.Type
  );
  return rolledValue;
}

export function GetAffixDefinition(definitionId: string): AffixDefinition {
  return AFFIX_DEFINITIONS.find((a) => a.Id === definitionId)!;
}

export function GetAffixTierSpec(definition: AffixDefinition, tier: AffixTier): AffixTierSpec {
  return definition.Tiers.find((t) => t.Tier === tier)!;
}

export function GetMinMaxRoll(affixTierSpec: AffixTierSpec): { min: number; max: number } {
  return { min: affixTierSpec.Value.Min, max: affixTierSpec.Value.Max };
}

/** Returns the index of the given affix tier in the order array. */
export function TierIndex(tier: string): number {
  const idx = AFFIX_TIER_ORDER.indexOf(tier as any);
  return idx >= 0 ? idx : 0;
}

/**
 * Gets the next affix tier in order.
 * @param current The current affix tier.
 * @returns The next affix tier, or null if at max tier.
 */
export function NextTier(current: AffixTier): AffixTier | null {
  const idx = AFFIX_TIER_ORDER.indexOf(current);
  if (idx < 0 || idx + 1 >= AFFIX_TIER_ORDER.length) return null;
  return AFFIX_TIER_ORDER[idx + 1];
}

export function IsMaxTier(item: Item, affixIndex: number): boolean {
  const itemRarity = GetItemRarity(item.Level);
  const maxTier: AffixTier = GetMaxAffixTier(itemRarity);
  return item.Affixes[affixIndex].Tier === maxTier;
}

/**
 * Checks if the affix tier exceeds the maximum allowed for the item level.
 * @param affixTier the affix tier to check.
 * @param itemLevel the item level to check against.
 * @returns True if the affix tier is above the max allowed for the item level; false otherwise.
 */
export function ExceedsMaxTierForItemLevel(affixTier: AffixTier, itemLevel: ItemLevel): boolean {
  const itemRarity = GetItemRarity(itemLevel);
  const maxTierAllowed: AffixTier = GetMaxAffixTier(itemRarity);
  const affixIndex = AFFIX_TIER_ORDER.indexOf(affixTier);
  const maxIndex = AFFIX_TIER_ORDER.indexOf(maxTierAllowed);
  const overMax = affixIndex > maxIndex;
  return overMax;
}

export function ExceedsMaximumEnchantableAffixes(item: Item): boolean {
  const rules = ITEM_RARITY_RULES[GetItemRarity(item.Level)];
  const enchantedCount = item.Affixes.filter((a) => a.Improved).length;
  return enchantedCount >= rules.MaxEnchantableAffixes;
}

/**
 * Generates a random integer within the specified range [min, max].
 * @param min the minimum value (inclusive).
 * @param max the maximum value (inclusive).
 * @returns The percentage rolled within the tier range, as a number between 0 and 1.
 */
export function RandomInRange(min: number, max: number, type: 'Flat' | 'Percent'): number {
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);

  let rolled: number;

  switch (type) {
    case 'Flat':
      rolled = Math.floor(lo + Math.random() * (hi - lo + 1));
      break;

    case 'Percent':
      rolled = lo + Math.random() * (hi - lo);
      rolled = Math.round(rolled * 100) / 100;
      break;
  }

  const percentage = (rolled - min) / (max - min);
  return percentage;
}
