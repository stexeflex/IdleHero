import { Affix } from '../affixes/affix';
import { ItemLevel } from './item-level.type';
import { ItemRarity } from './item-rarity.enum';
import { ItemSlot } from './item-slot.enum';
import { Rune } from '../runes/rune';
import { StatSource } from '../../combat/stats/stat-source.type';

/**
 * Innate stat specification for an item variant.
 * Provides per-level values rather than formulas to keep data model simple and tunable.
 */
export interface InnateSpec {
  /** Human-readable label, e.g., "Base Damage" */
  Label: string;

  /** Values for each item level (1..5). */
  ValuesByLevel: Record<ItemLevel, number>;

  /**
   * Maps a single innate numeric value into StatSource contribution for this variant.
   * Implementations will set the appropriate StatSource fields (e.g., Damage.Flat).
   */
  MapToStatSource: (value: number) => StatSource;
}

/** Item variant (e.g., Sword vs Wand) with its innate spec and slot constraints. */
export interface ItemVariantDefinition {
  Id: string;
  Name: string;
  Slot: ItemSlot;
  Innate: InnateSpec;
}

/** Concrete item instance players own/craft/enchant. */
export interface Item {
  Id: string;

  /** References the ItemVariantDefinition this item is based on. */
  DefinitionId: string;

  Name: string;
  Description?: string;

  /** Required player level to equip the item */
  LevelRequirement: number;

  Slot: ItemSlot;
  Rarity: ItemRarity;
  Level: ItemLevel;

  /** Rolled/enchanted affixes currently on the item */
  Affixes: Affix[];

  /** Optional rune socketed */
  Rune?: Rune | null;
}
