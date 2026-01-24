import { INVENTORY_CONFIG } from '../../constants';
import { Item } from './item';

export interface InventoryState {
  Capacity: number;
  Items: Item[];
}

export function InitialInventoryState(
  capacity: number = INVENTORY_CONFIG.ITEM_CAPACITY
): InventoryState {
  return {
    Capacity: Math.max(0, Math.floor(capacity)),
    Items: []
  };
}
