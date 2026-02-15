import {
  CapstoneDungeonRoom,
  DungeonRoom,
  DungeonRoomKey,
  DungeonType,
  NormalDungeonRoom
} from '../models/combat/dungeon-room';

export const NORMAL_DUNGEONS: NormalDungeonRoom[] = [
  {
    Id: 'D1',
    Title: 'Slime Cave',
    Description: 'A damp cave filled with oozing slimes.',
    Icon: 'slime',
    Type: DungeonType.Normal,
    StagesBase: 1,
    MidStages: [25, 50, 75],
    StagesMax: 100,
    XpBase: 10,
    GoldBase: 10,
    Locked: false
  },
  {
    Id: 'D2',
    Title: 'Brute Lair',
    Description: 'A dark cave infested with mischievous brutes.',
    Icon: 'brute',
    Type: DungeonType.Normal,
    StagesBase: 1,
    MidStages: [25, 50, 75],
    StagesMax: 100,
    XpBase: 12,
    GoldBase: 15,
    Locked: false
  },
  {
    Id: 'D3',
    Title: 'Snake Den',
    Description: 'A winding den crawling with venomous snakes.',
    Icon: 'snake',
    Type: DungeonType.Normal,
    StagesBase: 1,
    MidStages: [20, 35, 50, 65, 80],
    StagesMax: 100,
    XpBase: 14,
    GoldBase: 20,
    Locked: false
  },
  {
    Id: 'D4',
    Title: 'Golem Quarry',
    Description: 'A rocky quarry guarded by stone golems.',
    Icon: 'rockgolem',
    Type: DungeonType.Normal,
    StagesBase: 1,
    MidStages: [20, 40, 60, 80],
    StagesMax: 100,
    XpBase: 18,
    GoldBase: 25,
    Locked: true
  }
];

export const CAPSTONE_DUNGEONS: CapstoneDungeonRoom[] = [
  {
    Id: 'C1',
    Title: 'Trial of the Spectres',
    Description: 'Prove your worth against the spectral guardians.',
    Icon: 'spectre',
    Type: DungeonType.Capstone,
    StagesBase: 1,
    MidStages: [20, 40],
    StagesMax: 60,
    XpBase: 25,
    GoldBase: 40,
    Prerequisites: { Gold: 500, Key: null },
    Rewards: { Gold: 2500, Key: 'Silver Key' as DungeonRoomKey },
    Locked: true
  },
  {
    Id: 'C2',
    Title: 'Trial of Arcana',
    Description: 'Arcane creatures test your mastery.',
    Icon: 'harpy',
    Type: DungeonType.Capstone,
    StagesBase: 1,
    MidStages: [20, 40],
    StagesMax: 60,
    XpBase: 30,
    GoldBase: 60,
    Prerequisites: { Gold: 2500, Key: 'Silver Key' as DungeonRoomKey },
    Rewards: { Gold: 10000, Key: 'Magic Key' as DungeonRoomKey },
    Locked: true
  },
  {
    Id: 'C3',
    Title: 'Trial of the Dragons',
    Description: 'The final trial guarded by ancient dragons.',
    Icon: 'hydra',
    Type: DungeonType.Capstone,
    StagesBase: 1,
    MidStages: [20, 40],
    StagesMax: 60,
    XpBase: 35,
    GoldBase: 80,
    Prerequisites: { Gold: 10000, Key: 'Magic Key' as DungeonRoomKey },
    Rewards: { Gold: 50000, Key: 'Golden Key' as DungeonRoomKey },
    Locked: true
  }
];

export function GetAllDungeons(): DungeonRoom[] {
  return [...NORMAL_DUNGEONS, ...CAPSTONE_DUNGEONS];
}

export function GetDungeonById(id: string): DungeonRoom | null {
  return [...NORMAL_DUNGEONS, ...CAPSTONE_DUNGEONS].find((d) => d.Id === id) ?? null;
}
