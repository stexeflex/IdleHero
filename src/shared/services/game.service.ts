import { AttackResult, ExperienceGainResult, StageRewards } from '../models';
import { Injectable, signal } from '@angular/core';

import { BattleLogService } from './battle-log.service';
import { BossService } from './boss.service';
import { LevelService } from './level.service';
import { StageService } from './stage.service';
import { StatsService } from './stats.service';
import { TimeoutUtils } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(
    private stageService: StageService,
    private statsService: StatsService,
    private levelService: LevelService,
    private bossService: BossService,
    private battleLogService: BattleLogService
  ) {}

  private _gameInProgress = signal(false);
  public InProgress = this._gameInProgress.asReadonly();

  private get AttackDelay(): number {
    // Calculate attack delay in milliseconds based on player's attack speed
    return (1 / this.statsService.AttackSpeed()) * 1000;
  }

  /* Start the game loop */
  public Start() {
    this.battleLogService.ClearLogs();
    this.battleLogService.StartGame();

    this._gameInProgress.set(true);
    this.BattleLoop();
  }

  /* Prestige the game */
  public Prestige() {
    this.battleLogService.Prestige(this.stageService.Current());

    this._gameInProgress.set(false);
    this.bossService.Reset();
    this.stageService.Reset();
  }

  private async BattleLoop(): Promise<void> {
    while (this.InProgress()) {
      /* Attack Delay */
      await TimeoutUtils.wait(this.AttackDelay);

      if (!this.InProgress()) {
        break;
      }

      /* Attack */
      await this.AttackPhase();

      if (!this.InProgress()) {
        break;
      }

      /* Boss Defeated */
      if (this.bossService.IsDefeated) {
        const rewards: StageRewards = this.stageService.GetRewards();
        this.battleLogService.BossDefeated(rewards);

        /* Boss Respawn Delay */
        await TimeoutUtils.wait(500);

        if (!this.InProgress()) {
          break;
        }

        await this.RewardPhase(rewards);

        if (!this.InProgress()) {
          break;
        }

        this.NextStage();
      }
    }
  }

  private async AttackPhase() {
    /* Perform Attack */
    const attackResult: AttackResult = this.statsService.Attack();
    this.battleLogService.AttackLog(attackResult);

    /* Deal Damage */
    this.bossService.TakeDamage(attackResult.Damage);
  }

  private async RewardPhase(rewards: StageRewards) {
    let experienceGainResult: ExperienceGainResult = await this.levelService.GainExperience(
      rewards.Experience
    );

    if (!this.InProgress()) {
      return;
    }

    if (experienceGainResult.LeveledUp) {
      this.PlayerLevelUp();

      while (experienceGainResult.ExperienceOverflow > 0) {
        experienceGainResult = await this.levelService.GainExperience(
          experienceGainResult.ExperienceOverflow
        );

        if (!this.InProgress()) {
          return;
        }

        if (!experienceGainResult.LeveledUp) {
          break;
        } else {
          this.PlayerLevelUp();
        }
      }
    }
  }

  private PlayerLevelUp() {
    this.battleLogService.LevelUp(this.levelService.Current, this.levelService.Current + 1);
    this.statsService.LevelUp();
  }

  private NextStage() {
    this.stageService.NextStage();
    this.bossService.SetBossForStage(this.stageService.Current());
  }
}
