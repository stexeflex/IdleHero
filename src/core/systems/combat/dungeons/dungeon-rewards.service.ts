import { CapstoneDungeonRoom, DungeonRoom, DungeonType, Rewards } from '../../../models';
import { CombatLogService, RuneService } from '../../../services';
import {
  CompletionFactor,
  ComputeDampedExperience,
  MidBossFactor,
  StageFactor
} from '../../progression';
import { Injectable, inject } from '@angular/core';

import { DropRandomRuneForDungeon } from '../../runes';
import { DungeonKeyService } from '../../../services/dungeon-key.service';
import { DungeonRunService } from './dungeon-run.service';
import { GoldService } from '../../../services/gold.service';
import { LevelService } from '../../../services/level.service';
import { StatisticsService } from '../../../services/statistics.service';

@Injectable({ providedIn: 'root' })
export class DungeonRewardsService {
  private readonly Level = inject(LevelService);
  private readonly Gold = inject(GoldService);
  private readonly Keys = inject(DungeonKeyService);
  private readonly Runes = inject(RuneService);
  private readonly Log = inject<CombatLogService>(CombatLogService);
  private readonly Statistics = inject(StatisticsService);
  private readonly DungeonRun = inject(DungeonRunService);

  /**
   * Computes rewards for a single stage within a dungeon.
   * @param dungeon The dungeon definition containing base reward values.
   * @param stageId The stage number for which to compute rewards.
   * @returns The computed rewards (gold, experience, and rune).
   */
  public ComputeStageRewards(dungeon: DungeonRoom, stageId: number): Rewards {
    const f = StageFactor(stageId);
    const gold = Math.round(dungeon.Rewards.GoldBase * f);
    const xp = ComputeDampedExperience(dungeon, stageId, this.Statistics.DungeonStatistics());
    const rune = stageId === 1 ? null : DropRandomRuneForDungeon(dungeon.Id);
    const runeIsUpgrade = rune ? this.Runes.IsUpgrade(rune) : false;

    return {
      Gold: gold,
      Experience: xp,
      Rune: runeIsUpgrade ? rune : null
    };
  }

  /**
   * Grants rewards for a single stage by applying them to services.
   * @param dungeon The dungeon definition containing base reward values.
   * @param stageId The stage number to grant rewards for.
   * @returns The granted rewards (gold, experience, and rune).
   */
  public GrantStageRewards(dungeon: DungeonRoom, stageId: number): Rewards {
    const rewards = this.ComputeStageRewards(dungeon, stageId);
    this.Log.Rewards(stageId, rewards);
    this.Gold.Add(rewards.Gold);
    this.Level.AddExperience(rewards.Experience);
    if (rewards.Rune) this.Runes.AddOrUpgradeRune(rewards.Rune);
    this.DungeonRun.AddRewards(rewards);
    return rewards;
  }

  /**
   * Computes rewards for a mid-boss within a dungeon.
   * @param dungeon The dungeon definition containing base reward values.
   * @param stageId The stage number where the mid-boss occurs.
   * @returns The computed rewards (gold, experience, and rune).
   */
  public ComputeMidBossRewards(dungeon: DungeonRoom, stageId: number): Rewards {
    const base = this.ComputeStageRewards(dungeon, stageId);

    const mGold = MidBossFactor('GOLD');
    const mExp = MidBossFactor('EXPERIENCE');
    const rune = DropRandomRuneForDungeon(dungeon.Id);
    const runeIsUpgrade = rune ? this.Runes.IsUpgrade(rune) : false;

    const rewards = {
      Gold: Math.round(base.Gold * mGold),
      Experience: Math.round(base.Experience * mExp),
      Rune: runeIsUpgrade ? rune : null
    };

    return rewards;
  }

  /**
   * Grants rewards for a mid-boss by applying them to services.
   * @param dungeon The dungeon definition containing base reward values.
   * @param stageId The stage number where the mid-boss occurs.
   * @returns The granted rewards (gold, experience, and rune).
   */
  public GrantMidBossRewards(dungeon: DungeonRoom, stageId: number): Rewards {
    const rewards = this.ComputeMidBossRewards(dungeon, stageId);
    this.Log.Rewards(stageId, rewards);
    this.Gold.Add(rewards.Gold);
    this.Level.AddExperience(rewards.Experience);
    if (rewards.Rune) this.Runes.AddOrUpgradeRune(rewards.Rune);
    this.DungeonRun.AddRewards(rewards);
    return rewards;
  }

  /**
   * Computes completion rewards for finishing a dungeon.
   * Uses the final stage as basis and applies a completion factor.
   * @param dungeon The dungeon definition containing base reward values.
   * @returns The computed rewards (gold, experience, and rune).
   */
  public ComputeCompletionRewards(dungeon: DungeonRoom): Rewards {
    const finalStage = Math.max(dungeon.StagesBase, dungeon.StagesMax);
    const base = this.ComputeStageRewards(dungeon, finalStage);

    const cGold = CompletionFactor('GOLD');
    const cExp = CompletionFactor('EXPERIENCE');
    const rune = DropRandomRuneForDungeon(dungeon.Id);
    const runeIsUpgrade = rune ? this.Runes.IsUpgrade(rune) : false;

    const rewards = {
      Gold: Math.round(base.Gold * cGold),
      Experience: Math.round(base.Experience * cExp),
      Rune: runeIsUpgrade ? rune : null
    };
    return rewards;
  }

  /**
   * Grants completion rewards for finishing a dungeon by applying them to services.
   * @param dungeon The dungeon definition containing base reward values.
   * @returns The granted rewards (gold, experience, and rune).
   */
  public GrantCompletionRewards(dungeon: DungeonRoom): Rewards {
    let rewards = this.ComputeCompletionRewards(dungeon);

    // If capstone dungeon, also grant any key reward
    if (dungeon.Type === DungeonType.Capstone) {
      const capstoneDungeon = dungeon as CapstoneDungeonRoom;

      if (capstoneDungeon.CapstoneRewards.Key) {
        this.Keys.AddKey(capstoneDungeon.CapstoneRewards.Key);
      }

      rewards = {
        ...rewards,
        // Override gold and key rewards with capstone-specific values
        Gold: capstoneDungeon.CapstoneRewards.Gold,
        Key: capstoneDungeon.CapstoneRewards.Key || null
      };
    }

    this.Log.Rewards(dungeon.StagesMax, rewards);
    this.Gold.Add(rewards.Gold);
    this.Level.AddExperience(rewards.Experience);
    if (rewards.Rune) this.Runes.AddOrUpgradeRune(rewards.Rune);
    this.DungeonRun.AddRewards(rewards);

    return rewards;
  }
}
