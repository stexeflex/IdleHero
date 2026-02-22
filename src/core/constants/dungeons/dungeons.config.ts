import {
  CapstoneDungeonRoom,
  DungeonRoom,
  DungeonRoomKey,
  DungeonType,
  NormalDungeonRoom
} from '../../models/combat/dungeon-room';

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

    Rewards: {
      XpBase: 10,
      GoldBase: 10,
      RuneDropChances: { Common: 0.08, Magic: 0.01, Rare: 0.0, Epic: 0.0, Legendary: 0.0 },
      Key: null
    },

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

    Rewards: {
      XpBase: 15,
      GoldBase: 25,
      RuneDropChances: { Common: 0.15, Magic: 0.08, Rare: 0.01, Epic: 0.0, Legendary: 0.0 },
      Key: null
    },

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

    Rewards: {
      XpBase: 20,
      GoldBase: 35,
      RuneDropChances: { Common: 0.0, Magic: 0.15, Rare: 0.08, Epic: 0.01, Legendary: 0.0 },
      Key: null
    },

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

    Rewards: {
      XpBase: 25,
      GoldBase: 65,
      RuneDropChances: { Common: 0.0, Magic: 0.0, Rare: 0.15, Epic: 0.08, Legendary: 0.01 },
      Key: 'Silver Key' as DungeonRoomKey
    },

    Locked: false
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

    Rewards: {
      XpBase: 100,
      GoldBase: 100,
      RuneDropChances: { Common: 0.0, Magic: 0.0, Rare: 0.0, Epic: 0.2, Legendary: 0.1 },
      Key: 'Magic Key' as DungeonRoomKey
    },

    Prerequisites: { Key: 'Silver Key' as DungeonRoomKey },

    Locked: false
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

    Rewards: {
      XpBase: 150,
      GoldBase: 150,
      RuneDropChances: { Common: 0.0, Magic: 0.0, Rare: 0.0, Epic: 0.35, Legendary: 0.2 },
      Key: 'Golden Key' as DungeonRoomKey
    },

    Prerequisites: { Key: 'Magic Key' as DungeonRoomKey },

    Locked: false
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

    Rewards: {
      XpBase: 200,
      GoldBase: 200,
      RuneDropChances: { Common: 0.0, Magic: 0.0, Rare: 0.0, Epic: 0.5, Legendary: 0.25 },
      Key: 'Epic Key' as DungeonRoomKey
    },

    Prerequisites: { Key: 'Golden Key' as DungeonRoomKey },

    Locked: false
  }
];

export function GetAllDungeons(): DungeonRoom[] {
  return [...NORMAL_DUNGEONS, ...CAPSTONE_DUNGEONS];
}

export function GetDungeonById(id: string): DungeonRoom | null {
  return [...NORMAL_DUNGEONS, ...CAPSTONE_DUNGEONS].find((d) => d.Id === id) ?? null;
}
