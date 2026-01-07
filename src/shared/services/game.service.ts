import { Injectable, signal } from '@angular/core';

import { BossService } from './boss.service';
import { PlayerService } from './player.service';
import { StageService } from './stage.service';
import { TimeoutUtils } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(
    private stageService: StageService,
    private playerService: PlayerService,
    private bossService: BossService
  ) {}

  private _gameInProgress = signal(false);
  public InProgress = this._gameInProgress.asReadonly();

  public Start() {
    this._gameInProgress.set(true);
    this.BattleLoop();
  }

  public Prestige() {
    this._gameInProgress.set(false);
    this.bossService.Reset();
    this.stageService.Reset();
  }

  private async BattleLoop(): Promise<void> {
    while (this.InProgress()) {
      /* Attack */
      await this.AttackPhase();

      if (!this.InProgress()) {
        return;
      }

      /* Boss Defeated */
      if (this.bossService.IsDefeated) {
        console.log('Boss Defeated!');

        /* Boss Respawn Delay */
        await TimeoutUtils.wait(500);

        this.RewardPhase();
        this.NextStage();
      }
    }
  }

  private async AttackPhase() {
    /* Attack Delay */
    const attackDelay = this.CalculateAttackDelay();
    await TimeoutUtils.wait(attackDelay);

    if (!this.InProgress()) {
      return;
    }

    /* Deal Damage */
    const damage = this.playerService.Attack();
    console.log('Dealing Damage:', damage);
    this.bossService.TakeDamage(damage);
  }

  private CalculateAttackDelay(): number {
    // Calculate attack delay in milliseconds based on player's attack speed
    return (1 / this.playerService.AttackSpeed()) * 1000;
  }

  private RewardPhase() {
    const experience = this.stageService.Experience;
    console.log('Gained Experience:', experience);
    this.playerService.Level().GainExperience(experience);
  }

  private NextStage() {
    this.stageService.NextStage();
    this.bossService.SetBossForStage(this.stageService.CurrentStage());
  }
}
