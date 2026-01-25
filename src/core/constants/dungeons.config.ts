import {
  CapstoneDungeonRoom,
  DungeonRoom,
  DungeonRoomKey,
  DungeonType,
  NormalDungeonRoom
} from '../models';

export const NORMAL_DUNGEONS: NormalDungeonRoom[] = [
  {
    Id: 'D1',
    Title: 'Slime Cave',
    Description: 'A damp cave filled with oozing slimes.',
    Icon: 'slime',
    Type: DungeonType.Normal,
    StagesBase: 1,
    MidStages: [20],
    StagesMax: 40,
    BossBaseHealth: 80,
    XpBase: 8,
    GoldBase: 12
  },
  {
    Id: 'D2',
    Title: 'Goblin Caves',
    Description: 'A dank cave infested with mischievous goblins.',
    Icon: 'brute',
    Type: DungeonType.Normal,
    StagesBase: 1,
    MidStages: [20, 40],
    StagesMax: 60,
    BossBaseHealth: 100,
    XpBase: 10,
    GoldBase: 15
  },
  {
    Id: 'D3',
    Title: 'Wolf Den',
    Description: 'A frozen den where hungry wolves lurk.',
    Icon: 'werewolf',
    Type: DungeonType.Normal,
    StagesBase: 1,
    MidStages: [20, 40, 60],
    StagesMax: 80,
    BossBaseHealth: 150,
    XpBase: 14,
    GoldBase: 20
  },
  {
    Id: 'D4',
    Title: 'Ghostly Crypt',
    Description: 'A dark crypt teeming with the spectral.',
    Icon: 'spectre',
    Type: DungeonType.Normal,
    StagesBase: 1,
    MidStages: [20, 40, 60, 80],
    StagesMax: 100,
    BossBaseHealth: 200,
    XpBase: 18,
    GoldBase: 25
  }
];

export const CAPSTONE_DUNGEONS: CapstoneDungeonRoom[] = [
  {
    Id: 'C1',
    Title: 'Trial of Silver',
    Description: 'Prove your worth in the trial of Silver.',
    Icon: 'wyvern',
    Type: DungeonType.Capstone,
    StagesBase: 1,
    MidStages: [20, 40],
    StagesMax: 60,
    BossBaseHealth: 300,
    XpBase: 25,
    GoldBase: 40,
    Prerequisites: { Gold: 500, Key: null },
    Rewards: { Gold: 2500, Key: 'Silver Key' as DungeonRoomKey }
  },
  {
    Id: 'C2',
    Title: 'Trial of Arcana',
    Description: 'Arcane guardians test your mastery.',
    Icon: 'evilbat',
    Type: DungeonType.Capstone,
    StagesBase: 1,
    MidStages: [20, 40],
    StagesMax: 60,
    BossBaseHealth: 450,
    XpBase: 30,
    GoldBase: 60,
    Prerequisites: { Gold: 2500, Key: 'Silver Key' as DungeonRoomKey },
    Rewards: { Gold: 10000, Key: 'Magic Key' as DungeonRoomKey }
  },
  {
    Id: 'C3',
    Title: 'Trial of Gold',
    Description: 'The final trial, guarded by golden sentinels.',
    Icon: 'gargoyle',
    Type: DungeonType.Capstone,
    StagesBase: 1,
    MidStages: [20, 40],
    StagesMax: 60,
    BossBaseHealth: 600,
    XpBase: 35,
    GoldBase: 80,
    Prerequisites: { Gold: 10000, Key: 'Magic Key' as DungeonRoomKey },
    Rewards: { Gold: 50000, Key: 'Golden Key' as DungeonRoomKey }
  }
];

export function GetAllDungeons(): DungeonRoom[] {
  return [...NORMAL_DUNGEONS, ...CAPSTONE_DUNGEONS];
}

export function GetDungeonById(id: string): DungeonRoom | null {
  return [...NORMAL_DUNGEONS, ...CAPSTONE_DUNGEONS].find((d) => d.Id === id) ?? null;
}
