import { AffixGroup } from './affix-group.enum';
import { AffixTier } from './affix-tier.enum';
import { ItemSlot } from '../items/item-slot.enum';
import { Label } from '../labels/label';
import { StatSource } from '../../combat/stats/stat-source.type';

/** Specifies the value range for an affix. */
export interface AffixValueRange {
  Min: number;
  Max: number;
}

/** Specifies an affix tier along with its value range. */
export interface AffixTierSpec {
  Tier: AffixTier;
  Value: AffixValueRange;
}

/**
 * Describes how an affix applies stats when a concrete value is chosen.
 * For example, a "+X Strength" affix maps its rolled value X into StatSource.Strength.Flat.
 */
export interface AffixEffectMapping {
  /** Human-readable label */
  ToLabel: (value: number) => Label;

  /**
   * A function that maps a rolled numeric value to a StatSource contribution.
   * Implementations will apply the numeric value to the appropriate StatSource fields.
   */
  MapToStatSource: (source: string, value: number) => StatSource;
}

/** Affix definition template used to roll actual affixes on items. */
export interface AffixDefinition {
  Id: string;
  Groups: AffixGroup[];
  AllowedSlots: ItemSlot[];

  /** Min/Max ranges per tier for rolling values */
  Tiers: AffixTierSpec[];

  /** How to translate a rolled value into stat contributions */
  Effect: AffixEffectMapping;
}

/** Concrete affix instance rolled on an item. */
export interface Affix {
  /** References the AffixDefinition.Id this affix is based on. */
  DefinitionId: string;

  /** The tier this affix rolled into */
  Tier: AffixTier;

  /** The numeric value rolled within the tier range */
  RolledValue: number;

  /** True if this affix was improved (tier-up or special reroll rules) */
  Improved: boolean;
}
