import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BossService {
  private MAX_HEALTH_DEFAULT = 5;
  private HEALTH_GROWTH_RATE = 1.25;

  private _maxHealth = signal(this.MAX_HEALTH_DEFAULT);
  public MaxHealth = this._maxHealth.asReadonly();

  private _currentHealth = signal(this.MAX_HEALTH_DEFAULT);
  public CurrentHealth = this._currentHealth.asReadonly();

  public get IsDefeated(): boolean {
    return this.CurrentHealth() <= 0;
  }

  public TakeDamage(damage: number) {
    this._currentHealth.update((health) => Math.max(0, health - damage));
  }

  public NextLevel() {
    this._maxHealth.update((maxHealth) => Math.floor(maxHealth * this.HEALTH_GROWTH_RATE));
    this._currentHealth.set(this.MaxHealth());
  }

  public Reset() {
    this._maxHealth.set(this.MAX_HEALTH_DEFAULT);
    this._currentHealth.set(this.MaxHealth());
  }
}
