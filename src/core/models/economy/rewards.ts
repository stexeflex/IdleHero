import { DungeonRoomKey } from '../combat/dungeon-room';
import { Rune } from '../items/runes/rune';

export interface Rewards {
  Gold: number;
  Experience: number;
  Key?: DungeonRoomKey | null;
  Rune?: Rune | null;
}

export function ZeroRewards(): Rewards {
  return { Gold: 0, Experience: 0, Key: null, Rune: null };
}
