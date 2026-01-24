import {
  BattleLogService,
  BossService,
  CurrencyService,
  LevelService,
  StageService
} from '../../../services';
import { BossDamageResult, ExperienceGainResult, StageRewards } from '../../../models';

import { BattleState } from '../battle.state';
import { DELAYS } from '../../../constants';
import { DungeonSpecifications } from '../../../specifications';
import { FrameHandler } from '../models/frame-handler';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OrchestrationLogic {
  private battleState = inject(BattleState);
  private stageService = inject(StageService);
  private bossService = inject(BossService);
  private battleLogService = inject(BattleLogService);
  private currencyService = inject(CurrencyService);
  private levelService = inject(LevelService);
  private dungeonSpecifications = inject(DungeonSpecifications);


  /**
   * Per-frame work driven by requestAnimationFrame.
   * Keep work minimal; use this primarily for animations and smoothing UI.
   */
  public get FrameTickHandler(): Array<FrameHandler> {
    return [
      /* Stage Transition */
      (now, deltaSec) => {
        if (this.battleState.battleEnded()) return;
        if (!this.battleState.isTransitioning()) return;

        this.battleState.advanceTransition(deltaSec);

        // If transition just ended, advance to next stage
        if (!this.battleState.isTransitioning() && this.battleState.respawnProgress() >= 1) {
          if (this.dungeonSpecifications.DungeonRoomCleared()) {
            this.battleState.battleEnded.set(true);
          } else {
            this.stageService.NextStage();
            this.bossService.NextBoss();
          }
        }
      },
      /* Boss Defeated */
      (now, deltaSec) => {
        if (this.battleState.battleEnded()) return;
        if (this.battleState.isTransitioning()) return;

        const bossFightResult: BossDamageResult | null = this.battleState.bossFightResult();
        if (bossFightResult === null) return;

        // Clear boss fight result after one frame to avoid stale data
        this.battleState.bossFightResult.set(null);

        if (bossFightResult.IsBossDefeated) {
          // Begin transition when boss is defeated
          this.battleState.beginTransition(DELAYS.BOSS_RESPAWN_ANIMATION_MS);

          const rewards: StageRewards = this.stageService.GetRewards();
          this.battleState.rewards.set(rewards);
        }
      },
      /* Rewards */
      (now, deltaSec) => {
        if (this.battleState.battleEnded()) return;

        const rewards = this.battleState.rewards();
        if (rewards === null) return;

        // Clear rewards after one frame to avoid stale data
        this.battleState.rewards.set(null);

        this.battleLogService.BossDefeated(rewards);

        this.currencyService.AddGold(rewards.Gold);
        const experienceGainResult: ExperienceGainResult = this.levelService.GainExperience(
          rewards.Experience
        );
        this.battleState.experienceGainResult.set(experienceGainResult);
      },
      /* Experience Gain */
      (now, deltaSec) => {
        if (this.battleState.battleEnded()) return;

        let experienceGainResult = this.battleState.experienceGainResult();
        if (experienceGainResult === null) return;

        // Clear experience gain result after one frame to avoid stale data
        this.battleState.experienceGainResult.set(null);

        if (experienceGainResult.LeveledUp) {
          this.LogPlayerLevelUp();

          while (experienceGainResult.ExperienceOverflow > 0) {
            experienceGainResult = this.levelService.GainExperience(
              experienceGainResult.ExperienceOverflow
            );

            if (!experienceGainResult.LeveledUp) {
              break;
            } else {
              this.LogPlayerLevelUp();
            }
          }
        }
      }
    ];
  }

  private LogPlayerLevelUp() {
    this.battleLogService.LevelUp(this.levelService.Level(), this.levelService.Level() + 1);
  }
}
