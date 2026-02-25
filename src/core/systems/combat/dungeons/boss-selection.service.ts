import {
  BossFactory,
  DUNGEON_SPECIAL_BOSS_CONFIG,
  DungeonBossConfig,
  GetBossConfigForDungeon,
  GetDungeonById
} from '../../../constants';
import { ChanceUtils, RandomUtils } from '../../../../shared/utils';
import { Djinn, Mimic } from './boss.factory';
import { GetHealthForBossAtStage, SetHealth } from './boss-health.utils';

import { Boss } from '../../../models';
import { Injectable } from '@angular/core';

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
    // Weighted special boss spawn
    else {
      const specialBoss = this.ResolveSpecialBossForStage();
      if (specialBoss) {
        boss = specialBoss;
      } else {
        const pool = this.ResolvePoolForStage(dungeonBossConfig, stageId);
        const idx = RandomUtils.stableIndex(`${dungeonId}:${stageId}`, pool.length);
        boss = pool[idx]();
      }
    }

    // Random Boss from Pool
    if (!boss) {
      const pool = this.ResolvePoolForStage(dungeonBossConfig, stageId);
      const idx = RandomUtils.stableIndex(`${dungeonId}:${stageId}`, pool.length);
      boss = pool[idx]();
    }

    // Set Boss health based on stage and dungeon config
    const hpForStage = GetHealthForBossAtStage(dungeonId, stageId);
    boss = SetHealth(boss, hpForStage);

    return boss;
  }

  private ResolveSpecialBossForStage(): Boss | null {
    const mimicRate = this.NormalizeSpawnRate(DUNGEON_SPECIAL_BOSS_CONFIG.MIMIC_SPAWN_RATE);
    const djinnRate = this.NormalizeSpawnRate(DUNGEON_SPECIAL_BOSS_CONFIG.DJINN_SPAWN_RATE);

    const combinedRate = Math.min(1, mimicRate + djinnRate);
    if (combinedRate <= 0) return null;

    const roll = ChanceUtils.Roll();
    if (roll >= combinedRate) return null;

    const mimicThreshold = Math.min(mimicRate, combinedRate);

    if (roll < mimicThreshold) return Mimic();
    else return Djinn();
  }

  private NormalizeSpawnRate(spawnRate: number): number {
    if (spawnRate <= 0) return 0;
    if (spawnRate >= 1) return 1;
    return spawnRate;
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
