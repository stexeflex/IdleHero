export type DungeonRoomKey = 'Silver Key' | 'Magic Key' | 'Golden Key';

export interface DungeonRoomPrerequisites {
  Gold: number;
  Key?: DungeonRoomKey | null;
}

export interface DungeonRoomRewards {
  Gold: number;
  Key?: DungeonRoomKey | null;
}

export interface DungeonRoom {
  Id: number;
  Title: string;

  StagesBase: number;
  StagesMax: number;

  BossBaseHealth: number;
  XpBase: number;
  GoldBase: number;

  Prerequisites: DungeonRoomPrerequisites;
  Rewards: DungeonRoomRewards;
}
