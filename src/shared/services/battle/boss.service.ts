import { BossDamageResult, BossHealth } from '../../models';
import { Injectable, Signal, WritableSignal, signal } from '@angular/core';

import { BATTLE_CONFIG } from '../../constants';
import { CreaturesIconName } from '../../components';

@Injectable({
  providedIn: 'root'
})
export class BossService {
  private _maxHealth = signal(BATTLE_CONFIG.BOSS.BASE_HEALTH);
  public MaxHealth = this._maxHealth.asReadonly();

  private _currentHealth = signal(BATTLE_CONFIG.BOSS.BASE_HEALTH);
  public CurrentHealth = this._currentHealth.asReadonly();

  public _bossIcon: WritableSignal<CreaturesIconName> = signal('wyvern');
  public BossIcon: Signal<CreaturesIconName> = this._bossIcon.asReadonly();

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
    this._bossIcon.update(() => this.NextBossIcon());
  }

  public Reset() {
    this._maxHealth.set(BATTLE_CONFIG.BOSS.BASE_HEALTH);
    this._currentHealth.set(BATTLE_CONFIG.BOSS.BASE_HEALTH);
  }

  private NextBossIcon(): CreaturesIconName {
    const icons: CreaturesIconName[] = ['wyvern', 'haunting', 'spectre', 'gargoyle'];
    const currentIcon = this.BossIcon();
    const currentIndex = icons.indexOf(currentIcon);
    const nextIndex = (currentIndex + 1) % icons.length;
    return icons[nextIndex];
  }
}
