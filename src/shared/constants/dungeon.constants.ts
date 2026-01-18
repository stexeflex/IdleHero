import { DungeonRoomKey } from '../models/dungeon/dungeon-room';

export const DUNGEON_CONFIG = {
  DUNGEONS: {
    TOTAL: 3
  },
  1: {
    PREREQUISITES: {
      GOLD_COST: 0,
      KEY: null
    },
    STAGES: {
      BASE: 1,
      MAX: 50
    },
    BOSS: {
      BASE_HEALTH: 5,
      HEALTH_EXP_GROWTH_RATE: 1.25
    },
    REWARDS: {
      BASE_EXPERIENCE_REWARD: 20,
      EXPERIENCE_REWARD_PER_STAGE: 10,
      BASE_GOLD_REWARD: 10,
      GOLD_REWARD_PER_STAGE: 2
    },
    ROOM_REWARDS: {
      GOLD: 1000,
      KEY: 'Silver Key' as DungeonRoomKey
    }
  },
  2: {
    PREREQUISITES: {
      GOLD_COST: 1000,
      KEY: 'Silver Key' as DungeonRoomKey
    },
    STAGES: {
      BASE: 1,
      MAX: 75
    },
    BOSS: {
      BASE_HEALTH: 1000000,
      HEALTH_EXP_GROWTH_RATE: 1.25
    },
    REWARDS: {
      BASE_EXPERIENCE_REWARD: 100,
      EXPERIENCE_REWARD_PER_STAGE: 50,
      BASE_GOLD_REWARD: 50,
      GOLD_REWARD_PER_STAGE: 25
    },
    ROOM_REWARDS: {
      GOLD: 5000,
      KEY: 'Magic Key' as DungeonRoomKey
    }
  },
  3: {
    PREREQUISITES: {
      GOLD_COST: 10000,
      KEY: 'Magic Key' as DungeonRoomKey
    },
    STAGES: {
      BASE: 1,
      MAX: 100
    },
    BOSS: {
      BASE_HEALTH: 10000000,
      HEALTH_EXP_GROWTH_RATE: 1.35
    },
    REWARDS: {
      BASE_EXPERIENCE_REWARD: 1000,
      EXPERIENCE_REWARD_PER_STAGE: 500,
      BASE_GOLD_REWARD: 100,
      GOLD_REWARD_PER_STAGE: 50
    },
    ROOM_REWARDS: {
      GOLD: 20000,
      KEY: 'Golden Key' as DungeonRoomKey
    }
  }
};
