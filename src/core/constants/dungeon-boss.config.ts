import { Gooey, KingSlime, Slime, Slug } from '../systems/combat/dungeons/boss.factory';

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
      [20, Slug],
      [40, KingSlime]
    ]),
    BossPools: new Map<number, BossFactory[]>([
      [1, [Gooey]],
      [10, [Gooey, Slime]],
      [20, [Slime, Slug]],
      [30, [Slug]]
    ])
  }
};
