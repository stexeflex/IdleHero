import { Injectable, signal } from '@angular/core';

import { BossHealth } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BossService {
  private _maxHealth = signal(BossHealth.HEALTH_BASE);
  public MaxHealth = this._maxHealth.asReadonly();

  private _currentHealth = signal(BossHealth.HEALTH_BASE);
  public CurrentHealth = this._currentHealth.asReadonly();

  public get IsDefeated(): boolean {
    return this.CurrentHealth() <= 0;
  }

  public TakeDamage(damage: number) {
    this._currentHealth.update((health) => Math.max(0, health - damage));
  }

  public SetBossForStage(stage: number) {
    this._maxHealth.update(() => BossHealth.CalculateForStage(stage));
    this._currentHealth.set(this.MaxHealth());
  }

  public Reset() {
    this._maxHealth.set(BossHealth.HEALTH_BASE);
    this._currentHealth.set(BossHealth.HEALTH_BASE);
  }
}
