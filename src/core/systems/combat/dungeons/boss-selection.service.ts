import { BossFactory, DUNGEON_BOSS_CONFIGS, DungeonBossConfig } from '../../../constants';
import { GetHealthForBossAtStage, SetHealth } from './boss-health.utils';

import { Boss } from '../../../models';
import { Injectable } from '@angular/core';
import { RandomUtils } from '../../../../shared/utils';

@Injectable({ providedIn: 'root' })
export class BossSelectionService {
  /**
   * Selects a Boss for the given dungeon configuration and stage.
   * @param dungeonId The ID of the dungeon room.
   * @param stageId The stage number within the dungeon.
   * @returns The selected Boss instance.
   */
  public GetBoss(dungeonId: string, stageId: number): Boss {
    const dungeonConfig = this.GetDungeonConfig(dungeonId);

    let boss = null;

    // Stage specific Boss
    if (dungeonConfig.StageSpecific.has(stageId)) {
      const factory = dungeonConfig.StageSpecific.get(stageId)!;
      boss = factory();
    }
    // Random Boss from Pool
    else {
      const pool = this.ResolvePoolForStage(dungeonConfig, stageId);
      const idx = RandomUtils.stableIndex(`${dungeonId}:${stageId}`, pool.length);
      boss = pool[idx]();
    }

    // Set Boss health based on stage and dungeon config
    const hpForStage = GetHealthForBossAtStage(dungeonId, stageId);
    boss = SetHealth(boss, hpForStage);

    return boss;
  }

  private GetDungeonConfig(dungeonId: string): DungeonBossConfig {
    const dungeonConfig = DUNGEON_BOSS_CONFIGS[dungeonId];

    if (!dungeonConfig) {
      throw new Error(`No boss config found for dungeonConfigId=${dungeonId}`);
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
