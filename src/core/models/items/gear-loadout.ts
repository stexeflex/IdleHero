import { Item } from './item';
import { ItemSlot } from './item-slot.enum';

export type GearLoadout = Record<ItemSlot, Item | null>;

export function createEmptyLoadout(): GearLoadout {
  return {
    Weapon: null,
    OffHand: null,
    Head: null,
    Chest: null,
    Legs: null,
    Boots: null
  };
}
