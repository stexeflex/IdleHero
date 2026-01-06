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
    this.battleLoop();
  }

  public Pause() {
    this._gameInProgress.set(false);
  }

  public Prestige() {
    this.Pause();
    this.bossService.Reset();
    this.stageService.Reset();
  }

  private async battleLoop(): Promise<void> {
    while (this.InProgress()) {
      const damage = this.playerService.Attack();
      const attackDelay = (1 / this.playerService.AttackSpeed()) * 1000;

      console.log('Dealing Damage:', damage);
      this.bossService.TakeDamage(damage);

      // Attack Delay #1
      await TimeoutUtils.wait(attackDelay / 2);

      if (this.bossService.IsDefeated) {
        console.log('Boss Defeated!');

        const experience = this.stageService.GetExperience();
        console.log('Gained Experience:', experience);
        this.playerService.Level().GainExperience(experience);

        this.stageService.NextStage();
        this.bossService.NextLevel();
      }

      // Attack Delay #2
      await TimeoutUtils.wait(attackDelay / 2);
    }
  }
}
