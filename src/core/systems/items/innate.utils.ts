import { ItemLevel, ItemVariantDefinition } from '../../models';

/** Returns the innate value for a variant at a given level. */
export function InnateValue(variant: ItemVariantDefinition, level: ItemLevel): number {
  return variant.Innate.ValuesByLevel[level];
}
