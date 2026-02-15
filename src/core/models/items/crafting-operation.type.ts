import { Item } from './items/item';

export type CraftingOperation =
  | 'LevelUp'
  | 'RerollAffix'
  | 'EnchantAffix'
  | 'AddAffix'
  | 'RemoveAffix'
  | 'SocketRune'
  | 'UnsocketRune';

export interface OperationResult {
  Success: boolean;
  Item: Item;
  Cost?: number;
}
