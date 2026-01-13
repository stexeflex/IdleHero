import { BossDamageResult, BossHealth } from '../../models';
import { Injectable, signal } from '@angular/core';

import { GAME_CONFIG } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class BossService {
  private _maxHealth = signal(GAME_CONFIG.BOSS.BASE_HEALTH);
  public MaxHealth = this._maxHealth.asReadonly();

  private _currentHealth = signal(GAME_CONFIG.BOSS.BASE_HEALTH);
  public CurrentHealth = this._currentHealth.asReadonly();

  public get IsDefeated(): boolean {
    return this.CurrentHealth() <= 0;
  }

  public TakeDamage(damage: number): BossDamageResult {
    const damageDealt = Math.min(damage, this.CurrentHealth());
    this._currentHealth.update((health) => Math.max(0, health - damageDealt));

    return {
      DamageDealt: damageDealt,
      IsBossDefeated: this.IsDefeated
    } as BossDamageResult;
  }

  public SetBossForStage(stage: number) {
    this._maxHealth.update(() => BossHealth.CalculateForStage(stage));
    this._currentHealth.set(this.MaxHealth());
  }

  public Reset() {
    this._maxHealth.set(GAME_CONFIG.BOSS.BASE_HEALTH);
    this._currentHealth.set(GAME_CONFIG.BOSS.BASE_HEALTH);
  }
}
