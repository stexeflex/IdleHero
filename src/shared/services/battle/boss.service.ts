import { BossDamageResult, BossHealth } from '../../models';
import { Injectable, Signal, WritableSignal, computed, inject, signal } from '@angular/core';

import { CreaturesIconName } from '../../components';
import { DungeonRoomService } from './dungeon-room.service';
import { StageService } from './stage.service';

@Injectable({
  providedIn: 'root'
})
export class BossService {
  readonly dungeonRoomService = inject(DungeonRoomService);
  readonly stageService = inject(StageService);

  public MaxHealth = computed(() => {
    const room = this.dungeonRoomService.Current();
    const stage = this.stageService.Current();
    return BossHealth.CalculateForStage(room, stage);
  });

  private _currentHealth = signal(this.MaxHealth());
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

  public NextBoss() {
    this._currentHealth.set(this.MaxHealth());
    this._bossIcon.set(this.NextBossIcon());
  }

  public Reset() {
    this._currentHealth.set(this.MaxHealth());
    this._bossIcon.set('wyvern');
  }

  private NextBossIcon(): CreaturesIconName {
    const icons: CreaturesIconName[] = ['wyvern', 'haunting', 'spectre', 'gargoyle'];
    const currentIcon = this.BossIcon();
    const currentIndex = icons.indexOf(currentIcon);
    const nextIndex = (currentIndex + 1) % icons.length;
    return icons[nextIndex];
  }
}
