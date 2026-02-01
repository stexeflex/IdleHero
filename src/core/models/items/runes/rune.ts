import { ItemSlot } from '../items/item-slot.enum';
import { RuneQuality } from './rune-quality.enum';
import { StatSource } from '../../combat/stats/stat-source.type';

/** Specifies the value range for a rune. */
export interface RuneValueRange {
  Min: number;
  Max: number;
}

/** Specifies a rune quality along with its value range. */
export interface RuneQualitySpec {
  Quality: RuneQuality;
  Value: RuneValueRange;
}

/**
 * Describes how a rune applies stats when a concrete value is chosen.
 * For example, a "+X% Critical Strike Chance" rune maps its rolled value X into StatSource.CriticalHit.FlatChance.
 */
export interface RuneEffectMapping {
  /** Human-readable description of the effect */
  Description: string;

  /**
   * Maps a rolled numeric value to a StatSource contribution.
   * Implementations will apply the numeric value to the appropriate StatSource fields.
   */
  MapToStatSource: (source: string, value: number) => StatSource;
}

/** Template for runes. */
export interface RuneDefinition {
  Id: string;
  Name: string;

  /** Allowed item slots for this rune */
  AllowedSlots: ItemSlot[];

  /** Quality tiers available for this rune */
  Qualities: RuneQualitySpec[];

  /** How to translate a rolled value into stat contributions */
  Effect: RuneEffectMapping;
}

/** Concrete rune instance socketed on an item. */
export interface Rune {
  Id: string;

  /** References the RuneDefinition.Id this rune is based on. */
  DefinitionId: string;

  /** The quality this rune rolled into */
  Quality: RuneQuality;

  /** The numeric value rolled within the quality range */
  RolledValue: number;
}
