import {
  AnyDungeonRoom,
  BossDungeonRoom,
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
      GoldBase: 25,
      RuneDropChances: { Common: 0.06, Magic: 0.008, Rare: 0.0, Epic: 0.0, Legendary: 0.0 },
      Key: null
    },

    Prerequisites: {
      Level: 1
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
      XpBase: 50,
      GoldBase: 100,
      RuneDropChances: { Common: 0.1, Magic: 0.06, Rare: 0.008, Epic: 0.0, Legendary: 0.0 },
      Key: null
    },

    Prerequisites: {
      Level: 10
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
      XpBase: 250,
      GoldBase: 500,
      RuneDropChances: { Common: 0.0, Magic: 0.1, Rare: 0.06, Epic: 0.01, Legendary: 0.0 },
      Key: null
    },

    Prerequisites: {
      Level: 20
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
      XpBase: 1000,
      GoldBase: 2000,
      RuneDropChances: { Common: 0.0, Magic: 0.0, Rare: 0.1, Epic: 0.06, Legendary: 0.01 },
      Key: 'Silver Key' as DungeonRoomKey
    },

    Prerequisites: {
      Level: 30
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
      GoldBase: 150,
      RuneDropChances: { Common: 0.0, Magic: 0.0, Rare: 0.0, Epic: 0.18, Legendary: 0.08 },
      Key: 'Magic Key' as DungeonRoomKey
    },

    Prerequisites: { Key: 'Silver Key' as DungeonRoomKey },

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

    Rewards: {
      XpBase: 150,
      GoldBase: 240,
      RuneDropChances: { Common: 0.0, Magic: 0.0, Rare: 0.0, Epic: 0.25, Legendary: 0.125 },
      Key: 'Golden Key' as DungeonRoomKey
    },

    Prerequisites: { Key: 'Magic Key' as DungeonRoomKey },

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

    Rewards: {
      XpBase: 200,
      GoldBase: 350,
      RuneDropChances: { Common: 0.0, Magic: 0.0, Rare: 0.0, Epic: 0.325, Legendary: 0.175 },
      Key: 'Epic Key' as DungeonRoomKey
    },

    Prerequisites: { Key: 'Golden Key' as DungeonRoomKey },

    Locked: true
  }
];

export const BOSS_ROOMS: BossDungeonRoom[] = [
  {
    Id: 'B1',
    Title: 'Demon Overlord',
    Description: 'A brutal demon commander ruling over the abyss.',
    Icon: 'demonoverlord',
    Type: DungeonType.Boss,
    StagesBase: 1,
    MidStages: [],
    StagesMax: 1,
    
    Rewards: {
      XpBase: 20, // currently unused, but if multible bosses are added, this could still be of use
      GoldBase: 40,
      RuneDropChances: { Common: 0.1, Magic: 0.05, Rare: 0.01, Epic: 0.001, Legendary: 0.0001 },
      Key: null
    },

    Locked: false
  },
  {
    Id: 'B2',
    Title: 'Angel Paragon',
    Description: 'A celestial guardian forged from divine light.',
    Icon: 'angelparagon',
    Type: DungeonType.Boss,
    StagesBase: 1,
    MidStages: [],
    StagesMax: 1,
    
    Rewards: {
      XpBase: 20,
      GoldBase: 40,
      RuneDropChances: { Common: 0.1, Magic: 0.05, Rare: 0.01, Epic: 0.001, Legendary: 0.0001 },
      Key: null
    },

    Locked: false
  }
];

export function GetAllDungeons(): DungeonRoom[] {
  return [...NORMAL_DUNGEONS, ...CAPSTONE_DUNGEONS];
}

export function GetDungeonById(id: string): AnyDungeonRoom | null {
  return [...NORMAL_DUNGEONS, ...CAPSTONE_DUNGEONS, ...BOSS_ROOMS].find((d) => d.Id === id) ?? null;
}
