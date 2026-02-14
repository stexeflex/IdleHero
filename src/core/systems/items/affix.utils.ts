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
import { GetItemRarity, GetMaxAffixTier } from './item.utils';

import { DecimalPipe } from '@angular/common';

export function GetAffixInfo(affix: Affix, decimalPipe: DecimalPipe): AffixInfo {
  const definition: AffixDefinition = GetAffixDefinition(affix.DefinitionId);
  const minMax: { min: number; max: number } = GetMinMaxRoll(definition, affix.Tier);
  const label: string = LabelToString(definition.Effect.ToLabel(affix.RolledValue), decimalPipe);

  return {
    Tier: affix.Tier,
    Label: label,
    Value: affix.RolledValue,
    MinRoll: minMax.min,
    MaxRoll: minMax.max,
    Improved: affix.Improved
  };
}

export function GetAffixDefinition(definitionId: string): AffixDefinition {
  return AFFIX_DEFINITIONS.find((a) => a.Id === definitionId)!;
}

export function GetAffixTierSpec(definition: AffixDefinition, tier: AffixTier): AffixTierSpec {
  return definition.Tiers.find((t) => t.Tier === tier)!;
}

export function GetMinMaxRoll(
  definition: AffixDefinition,
  tier: AffixTier
): { min: number; max: number } {
  const tierSpec = definition.Tiers.find((t) => t.Tier === tier)!;
  const min = Number.isInteger(tierSpec.Value.Min)
    ? tierSpec.Value.Min
    : Math.round(tierSpec.Value.Min * 100);
  const max = Number.isInteger(tierSpec.Value.Max)
    ? tierSpec.Value.Max
    : Math.round(tierSpec.Value.Max * 100);

  return { min: min, max: max };
}

/** Returns the index of the given affix tier in the order array. */
export function TierIndex(tier: string): number {
  const idx = AFFIX_TIER_ORDER.indexOf(tier as any);
  return idx >= 0 ? idx : 0;
}

/**
 * Clamps the target affix tier to the maximum allowed for the item level.
 * @param itemLevel the item level.
 * @param targetTier the desired affix tier.
 * @returns The clamped affix tier.
 */
export function ClampAffixTier(itemLevel: ItemLevel, targetTier?: AffixTier): AffixTier {
  const maxTierAllowed: AffixTier = GetMaxAffixTier(itemLevel);
  targetTier = targetTier ?? maxTierAllowed;

  const allowedIndex = AFFIX_TIER_ORDER.indexOf(maxTierAllowed);
  const desiredIndex = AFFIX_TIER_ORDER.indexOf(targetTier);
  const finalIndex = Math.min(desiredIndex < 0 ? allowedIndex : desiredIndex, allowedIndex);
  const finalTier = AFFIX_TIER_ORDER[finalIndex];

  return finalTier;
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
  const maxTier: AffixTier = GetMaxAffixTier(item.Level);
  return item.Affixes[affixIndex].Tier === maxTier;
}

/**
 * Checks if the affix tier exceeds the maximum allowed for the item level.
 * @param affixTier the affix tier to check.
 * @param itemLevel the item level to check against.
 * @returns True if the affix tier is above the max allowed for the item level; false otherwise.
 */
export function ExceedsMaxTierForItemLevel(affixTier: AffixTier, itemLevel: ItemLevel): boolean {
  const maxTierAllowed: AffixTier = GetMaxAffixTier(itemLevel);
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
 * @returns A random integer between min and max.
 */
export function RandomInRange(min: number, max: number): number {
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);

  const isIntegerRange = Number.isInteger(lo) && Number.isInteger(hi);

  // Inclusive integer roll
  if (isIntegerRange) {
    return Math.floor(lo + Math.random() * (hi - lo + 1));
  }

  // Keep decimals
  const val = lo + Math.random() * (hi - lo);
  return Math.round(val * 100) / 100;
}
