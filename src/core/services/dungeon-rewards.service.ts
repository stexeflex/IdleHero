import { CompletionFactor, MidBossFactor, StageFactor } from '../systems/economy';
import { Injectable, inject } from '@angular/core';

import { DungeonRoom } from '../models';
import { GoldService } from './gold.service';
import { LevelService } from './level.service';
import { Rewards } from '../models/economy/rewards';

@Injectable({ providedIn: 'root' })
export class DungeonRewardsService {
  private readonly Gold = inject(GoldService);
  private readonly Level = inject(LevelService);

  /**
   * Computes rewards for a single stage within a dungeon.
   * @param dungeon The dungeon definition containing base reward values.
   * @param stageId The stage number for which to compute rewards.
   * @returns The computed rewards (gold and experience).
   */
  public ComputeStageRewards(dungeon: DungeonRoom, stageId: number): Rewards {
    const f = StageFactor(stageId);
    const gold = Math.round(dungeon.GoldBase * f);
    const xp = Math.round(dungeon.XpBase * f);
    return {
      Gold: gold,
      Experience: xp
    };
  }

  /**
   * Grants rewards for a single stage by applying them to services.
   * @param dungeon The dungeon definition containing base reward values.
   * @param stageId The stage number to grant rewards for.
   * @returns The granted rewards (gold and experience).
   */
  public GrantStageRewards(dungeon: DungeonRoom, stageId: number): Rewards {
    const rewards = this.ComputeStageRewards(dungeon, stageId);
    this.Gold.Add(rewards.Gold);
    this.Level.AddExperience(rewards.Experience);
    return rewards;
  }

  /**
   * Computes rewards for a mid-boss within a dungeon.
   * @param dungeon The dungeon definition containing base reward values.
   * @param stageId The stage number where the mid-boss occurs.
   * @returns The computed rewards (gold and experience).
   */
  public ComputeMidBossRewards(dungeon: DungeonRoom, stageId: number): Rewards {
    const base = this.ComputeStageRewards(dungeon, stageId);
    const m = MidBossFactor();
    return {
      Gold: Math.round(base.Gold * m),
      Experience: Math.round(base.Experience * m)
    };
  }

  /**
   * Grants rewards for a mid-boss by applying them to services.
   * @param dungeon The dungeon definition containing base reward values.
   * @param stageId The stage number where the mid-boss occurs.
   * @returns The granted rewards (gold and experience).
   */
  public GrantMidBossRewards(dungeon: DungeonRoom, stageId: number): Rewards {
    const rewards = this.ComputeMidBossRewards(dungeon, stageId);
    this.Gold.Add(rewards.Gold);
    this.Level.AddExperience(rewards.Experience);
    return rewards;
  }

  /**
   * Computes completion rewards for finishing a dungeon.
   * Uses the final stage as basis and applies a completion factor.
   * @param dungeon The dungeon definition containing base reward values.
   * @returns The computed rewards (gold and experience).
   */
  public ComputeCompletionRewards(dungeon: DungeonRoom): Rewards {
    const finalStage = Math.max(dungeon.StagesBase, dungeon.StagesMax);
    const base = this.ComputeStageRewards(dungeon, finalStage);
    const c = CompletionFactor();
    return {
      Gold: Math.round(base.Gold * c),
      Experience: Math.round(base.Experience * c)
    };
  }

  /**
   * Grants completion rewards for finishing a dungeon by applying them to services.
   * @param dungeon The dungeon definition containing base reward values.
   * @returns The granted rewards (gold and experience).
   */
  public GrantCompletionRewards(dungeon: DungeonRoom): Rewards {
    const rewards = this.ComputeCompletionRewards(dungeon);
    this.Gold.Add(rewards.Gold);
    this.Level.AddExperience(rewards.Experience);
    return rewards;
  }
}
