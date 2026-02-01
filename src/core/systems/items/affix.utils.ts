import { AFFIX_TIER_ORDER, MAX_AFFIX_TIER_FOR_LEVEL } from '../../constants';
import { AffixTier, ItemLevel } from '../../models';

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
  const maxTierAllowed: AffixTier = MAX_AFFIX_TIER_FOR_LEVEL[itemLevel];
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

/**
 * Checks if the affix tier exceeds the maximum allowed for the item level.
 * @param affixTier the affix tier to check.
 * @param itemLevel the item level to check against.
 * @returns True if the affix tier is above the max allowed for the item level; false otherwise.
 */
export function ExceedsMaxTierForItemLevel(affixTier: AffixTier, itemLevel: ItemLevel): boolean {
  const maxTierAllowed: AffixTier = MAX_AFFIX_TIER_FOR_LEVEL[itemLevel];
  const affixIndex = AFFIX_TIER_ORDER.indexOf(affixTier);
  const maxIndex = AFFIX_TIER_ORDER.indexOf(maxTierAllowed);
  const overMax = affixIndex > maxIndex;
  return overMax;
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
  const val = lo + Math.random() * (hi - lo);
  return Math.round(val);
}
