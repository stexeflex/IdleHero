export interface DungeonStatistics {
  // Normal Dungeon Room ID : Highest Stage Reached
  Dungeon: { [DungeonRoomId: string]: number };
  // Capstone Dungeon Room ID : Highest Stage Reached
  Capstone: { [DungeonRoomId: string]: number };
}

export function InitialDungeonStatistics(): DungeonStatistics {
  return {
    Dungeon: {},
    Capstone: {}
  };
}
