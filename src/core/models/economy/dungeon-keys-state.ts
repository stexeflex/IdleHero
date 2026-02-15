import { DungeonRoomKey } from '../combat/dungeon-room';

export interface DungeonKeysState {
  Keys: DungeonRoomKey[];
}

export function InitialDungeonKeysState(): DungeonKeysState {
  return {
    Keys: []
  };
}
