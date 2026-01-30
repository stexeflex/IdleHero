import { Affix } from '../affixes/affix';
import { GearSlotIconName } from '../../../../shared/components';
import { ItemLevel } from './item-level.type';
import { ItemRarity } from './item-rarity.enum';
import { ItemSlot } from './item-slot.enum';
import { ItemTier } from './item-tier.type';
import { ItemType } from './item-type.type';
import { Label } from '../labels/label';
import { Rune } from '../runes/rune';
import { StatSource } from '../../combat/stats/stat-source.type';

/**
 * Innate stat specification for an item variant.
 * Provides per-level values rather than formulas to keep data model simple and tunable.
 */
export interface InnateSpec {
  /** Human-readable label */
  ToLabel: (value: number) => Label;

  /** Values for each item level (1..5). */
  ValuesByLevel: Record<ItemLevel, number>;

  /**
   * Maps a single innate numeric value into StatSource contribution for this variant.
   * Implementations will set the appropriate StatSource fields (e.g., Damage.Flat).
   */
  MapToStatSource: (value: number) => StatSource;
}

/** Item variant with its innate spec and slot constraints. */
export interface ItemVariantDefinition {
  Id: string;
  Name: string;
  Icon: GearSlotIconName;
  Slot: ItemSlot;
  Type: ItemType;
  Tier: ItemTier;
  Innate: InnateSpec;

  /**
   * Weapon-only base damage value used in damage calculations.
   * Example: 15 for broadsword, 25 for battleaxe.
   * Increased by weapon level.
   */
  WeaponBaseDamage?: number;

  /**
   * Weapon-only multiplier that defines the base attack speed identity of the weapon.
   * Example: 0.8 for heavy axe, 1.0 for sword, 1.2 for dagger.
   */
  WeaponBaseAttackSpeed?: number;
}

/** Concrete item instance players own/craft/enchant. */
export interface Item {
  Id: string;

  /** References the ItemVariantDefinition this item is based on. */
  DefinitionId: string;

  Name: string;
  Icon: GearSlotIconName;

  Slot: ItemSlot;
  Rarity: ItemRarity;
  Level: ItemLevel;

  /** Weapon-only base damage after level scaling. */
  WeaponDamage?: number;

  /** Rolled/enchanted affixes currently on the item */
  Affixes: Affix[];

  /** Socketed Rune */
  Rune?: Rune | null;
}
