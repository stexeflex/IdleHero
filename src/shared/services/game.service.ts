import {
  AttackPhaseResult,
  AttackResult,
  AttackType,
  BossDamageResult,
  Buff,
  ExperienceGainResult,
  StageRewards
} from '../models';
import { Injectable, signal } from '@angular/core';

import { BattleLogService } from './battle-log.service';
import { BossService } from './boss.service';
import { BuffsService } from './buffs-service';
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
    private battleLogService: BattleLogService,
    private buffsService: BuffsService
  ) {}

  private _gameInProgress = signal(false);
  public InProgress = this._gameInProgress.asReadonly();

  private get AttackDelay(): number {
    // Calculate attack delay in milliseconds based on player's attack speed
    return (1 / this.statsService.AttackSpeed()) * 1000;
  }

  private get IsSplashDamageEnabled(): boolean {
    const splashBuff: Buff | undefined = this.buffsService
      .Buffs()
      .find((b) => b.Name === 'Splash Area Damage');
    return splashBuff ? splashBuff.IsActive : false;
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
    let attackPowerOverflow: number = 0;

    while (this.InProgress()) {
      if (!this.IsSplashDamageEnabled) {
        attackPowerOverflow = 0;
      }

      /* Attack Delay */
      await TimeoutUtils.wait(this.AttackDelay);

      if (!this.InProgress()) {
        break;
      }

      /* Attack */
      const attackPhaseResult: AttackPhaseResult = this.AttackPhase(attackPowerOverflow);
      attackPowerOverflow = attackPhaseResult.AttackPowerOverflow;

      /* Boss Defeated */
      if (attackPhaseResult.IsBossDefeated && this.InProgress()) {
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

  private AttackPhase(attackPowerOverflow: number = 0): AttackPhaseResult {
    /* Perform Attack */
    let attackResult: AttackResult = this.statsService.Attack();

    if (attackPowerOverflow > 0) {
      attackResult.Damage += attackPowerOverflow;
      attackResult.AttackType |= AttackType.Splash;
    }

    this.battleLogService.AttackLog(attackResult);

    /* Deal Damage */
    const bossDamageResult: BossDamageResult = this.bossService.TakeDamage(attackResult.Damage);

    if (bossDamageResult.DamageDealt < attackResult.Damage) {
      attackPowerOverflow = Math.max(attackResult.Damage - bossDamageResult.DamageDealt, 0);
    }

    return {
      AttackPowerOverflow: attackPowerOverflow,
      IsBossDefeated: bossDamageResult.IsBossDefeated
    } as AttackPhaseResult;
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
