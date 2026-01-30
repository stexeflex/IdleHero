import { INVENTORY_CONFIG } from '../../constants';
import { Item } from './items/item';
import { Rune } from './runes/rune';

export interface InventoryState {
  Capacity: number;
  Items: Item[];
  Runes: Rune[];
}

export function InitialInventoryState(
  capacity: number = INVENTORY_CONFIG.ITEM_CAPACITY
): InventoryState {
  return {
    Capacity: Math.max(0, Math.floor(capacity)),
    Items: [],
    Runes: []
  };
}
