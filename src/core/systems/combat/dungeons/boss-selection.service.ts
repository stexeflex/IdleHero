import {
  BossFactory,
  DUNGEON_MIMIC_BOSS_CONFIG,
  DungeonBossConfig,
  GetBossConfigForDungeon,
  GetDungeonById
} from '../../../constants';
import { ChanceUtils, RandomUtils } from '../../../../shared/utils';
import { GetHealthForBossAtStage, SetHealth } from './boss-health.utils';

import { Boss } from '../../../models';
import { Injectable } from '@angular/core';
import { Mimic } from './boss.factory';

@Injectable({ providedIn: 'root' })
export class BossSelectionService {
  /**
   * Selects a Boss for the given dungeon configuration and stage.
   * @param dungeonId The ID of the dungeon room.
   * @param stageId The stage number within the dungeon.
   * @returns The selected Boss instance.
   */
  public GetBoss(dungeonId: string, stageId: number): Boss {
    const dungeonConfig = GetDungeonById(dungeonId);
    const dungeonBossConfig = GetBossConfigForDungeon(dungeonId);

    let boss = null;
    const hasStageSpecificBoss = dungeonBossConfig.StageSpecific.has(stageId);

    // Stage specific Boss
    if (hasStageSpecificBoss) {
      const factory = dungeonBossConfig.StageSpecific.get(stageId)!;
      boss = factory();

      if (stageId !== dungeonConfig?.StagesBase && stageId !== dungeonConfig?.StagesMax) {
        boss.IsElite = true;
      } else if (stageId === dungeonConfig?.StagesMax) {
        boss.IsEndboss = true;
      }
    }
    // Mimic Spawn
    else if (this.IsMimicStageBoss(dungeonId, stageId)) {
      boss = Mimic();
    }
    // Random Boss from Pool
    else {
      const pool = this.ResolvePoolForStage(dungeonBossConfig, stageId);
      const idx = RandomUtils.stableIndex(`${dungeonId}:${stageId}`, pool.length);
      boss = pool[idx]();
    }

    // Set Boss health based on stage and dungeon config
    const hpForStage = GetHealthForBossAtStage(dungeonId, stageId);
    boss = SetHealth(boss, hpForStage);

    return boss;
  }

  private IsMimicStageBoss(dungeonId: string, stageId: number): boolean {
    const dungeonBossConfig = GetBossConfigForDungeon(dungeonId);
    if (dungeonBossConfig.StageSpecific.has(stageId)) return false;

    const spawnRate = DUNGEON_MIMIC_BOSS_CONFIG.MIMIC_SPAWN_RATE;
    if (spawnRate <= 0) return false;
    if (spawnRate >= 1) return true;

    const success = ChanceUtils.success(spawnRate);
    return success;
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
