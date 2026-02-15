import {
  Brute,
  BullyMinion,
  CobraSnake,
  EvilMinion,
  Gooey,
  KingSlime,
  MambaSnake,
  Minotaur,
  PythonSnake,
  RattleSnake,
  SandSnake,
  SeaSerpent,
  Slime,
  Slug,
  Troglodyte,
  VileFluid,
  ViperSnake
} from '../systems/combat/dungeons/boss.factory';

import { Boss } from '../models';

export type BossFactory = () => Boss;

export interface DungeonBossConfig {
  /**
   * Stage specific Bosses
   * e.g., key=1 means "at stage 1, spawn this Boss"
   */
  StageSpecific: Map<number, BossFactory>;

  /**
   * Boss Pools per stage range
   * e.g., key=20 means "from stage 20 onwards until next defined key"
   */
  BossPools: Map<number, BossFactory[]>;
}

export const DUNGEON_BOSS_CONFIGS: Record<string, DungeonBossConfig> = {
  D1: {
    StageSpecific: new Map<number, BossFactory>([
      [1, Gooey],
      [25, VileFluid],
      [50, Slime],
      [75, Slug],
      [100, KingSlime]
    ]),
    BossPools: new Map<number, BossFactory[]>([
      [1, [Gooey]],
      [15, [Gooey, VileFluid]],
      [35, [Gooey, VileFluid, Slime]],
      [50, [VileFluid, Slime]],
      [65, [Slime, Slug]],
      [85, [Slug]],
      [90, [Slug, KingSlime]]
    ])
  },
  D2: {
    StageSpecific: new Map<number, BossFactory>([
      [1, Troglodyte],
      [25, EvilMinion],
      [50, BullyMinion],
      [75, Brute],
      [100, Minotaur]
    ]),
    BossPools: new Map<number, BossFactory[]>([
      [1, [Troglodyte]],
      [15, [Troglodyte, EvilMinion]],
      [35, [Troglodyte, EvilMinion, BullyMinion]],
      [50, [EvilMinion, BullyMinion]],
      [65, [BullyMinion, Brute]],
      [85, [Brute]],
      [90, [Brute, Minotaur]]
    ])
  },
  D3: {
    StageSpecific: new Map<number, BossFactory>([
      [1, RattleSnake],
      [20, ViperSnake],
      [35, SandSnake],
      [50, MambaSnake],
      [65, PythonSnake],
      [80, CobraSnake],
      [100, SeaSerpent]
    ]),
    BossPools: new Map<number, BossFactory[]>([
      [1, [RattleSnake]],
      [10, [RattleSnake, ViperSnake]],
      [20, [RattleSnake, ViperSnake, SandSnake]],
      [30, [ViperSnake, SandSnake]],
      [40, [ViperSnake, SandSnake, MambaSnake]],
      [50, [SandSnake, MambaSnake]],
      [60, [SandSnake, MambaSnake, PythonSnake]],
      [70, [MambaSnake, PythonSnake]],
      [80, [MambaSnake, PythonSnake, CobraSnake]],
      [90, [CobraSnake, SeaSerpent]]
    ])
  }
};

/**
 * Parameters for boss HP scaling per dungeon.
 *
 * Formula:
 * HP   = H0 * EXP     * POLY
 * H(n) = H0 * r^(n-1) * (1 + a*(n-1)^b)
 */
export interface DungeonBossScalingParams {
  BossBaseHealth: number; // Base health for the Boss at stage 1
  r: number; // exponential per-stage multiplier (e.g., 1.08 – 1.15)
  a: number; // polynomial coefficient (e.g., 0.003 – 0.02)
  b: number; // polynomial exponent (e.g., 1.5 – 2.5)
  MidBossMultiplier: number; // multiplier for mid-boss stages (e.g., ×3–×6)
  EndBossMultiplier: number; // multiplier for end-boss stages (e.g., ×8–×20)
}

export const DUNGEON_BOSS_SCALING: Record<string, DungeonBossScalingParams> = {
  D1: {
    BossBaseHealth: 100,
    r: 1.038,
    a: 0.0012,
    b: 1.7,
    MidBossMultiplier: 4,
    EndBossMultiplier: 8
  },
  D2: {
    BossBaseHealth: 250,
    r: 1.038,
    a: 0.0012,
    b: 1.7,
    MidBossMultiplier: 4,
    EndBossMultiplier: 8
  },
  D3: {
    BossBaseHealth: 350,
    r: 1.038,
    a: 0.0012,
    b: 1.7,
    MidBossMultiplier: 4,
    EndBossMultiplier: 8
  }
};

export function GetBossConfigForDungeon(dungeonId: string): DungeonBossConfig {
  return DUNGEON_BOSS_CONFIGS[dungeonId];
}

export function GetScalingParamsForDungeon(dungeonId: string): DungeonBossScalingParams {
  return DUNGEON_BOSS_SCALING[dungeonId];
}
