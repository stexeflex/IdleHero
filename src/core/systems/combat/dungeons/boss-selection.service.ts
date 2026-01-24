import { BossFactory, DUNGEON_BOSS_CONFIGS, DungeonBossConfig } from './dungeon-boss.config';

import { Boss } from '../../../models/combat/actors/boss.';
import { Injectable } from '@angular/core';
import { RandomUtils } from '../../../../shared/utils';

@Injectable({ providedIn: 'root' })
export class BossSelectionService {
  GetBoss(dungeonConfigId: string, stageId: number): Boss {
    const dungeonConfig = this.GetDungeonConfig(dungeonConfigId);

    // Stage specific Boss
    if (dungeonConfig.StageSpecific.has(stageId)) {
      const factory = dungeonConfig.StageSpecific.get(stageId)!;
      return factory();
    }
    // Random Boss from Pool
    else {
      const pool = this.ResolvePoolForStage(dungeonConfig, stageId);
      const idx = RandomUtils.stableIndex(`${dungeonConfigId}:${stageId}`, pool.length);
      return pool[idx]();
    }
  }

  private GetDungeonConfig(dungeonConfigId: string): DungeonBossConfig {
    const dungeonConfig = DUNGEON_BOSS_CONFIGS[dungeonConfigId];

    if (!dungeonConfig) {
      throw new Error(`No boss config found for dungeonConfigId=${dungeonConfigId}`);
    }

    return dungeonConfig;
  }

  private ResolvePoolForStage(config: DungeonBossConfig, stageId: number): BossFactory[] {
    // Find the highest pool key that is <= stageId
    let poolKey: number | null = null;

    for (const key of config.BossPools.keys()) {
      if (key <= stageId && (poolKey === null || key > poolKey)) {
        poolKey = key;
      }
    }

    if (poolKey === null) {
      throw new Error(`No boss pool defined for stageId=${stageId}`);
    }

    const pool = config.BossPools.get(poolKey) ?? [];

    if (!pool.length) {
      throw new Error(`Empty boss pool at key=${poolKey} for stageId=${stageId}`);
    }

    return pool;
  }
}
