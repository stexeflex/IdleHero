import { Item } from './items/item';
import { ItemSlot } from './items/item-slot.enum';

export type GearLoadout = Record<ItemSlot, Item | null>;

export function CreateEmptyLoadout(): GearLoadout {
  return {
    Weapon: null,
    OffHand: null,
    Head: null,
    Chest: null,
    Legs: null,
    Boots: null
  };
}
