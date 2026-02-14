import { CombatEngine, CombatState } from '../../../core/systems/combat';
import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { IconComponent, PanelHeader } from '../../../shared/components';

import { CombatLog } from './combat-log/combat-log';
import { DELAYS } from '../../../shared/constants';
import { DungeonArena } from './dungeon-arena/dungeon-arena';
import { DungeonRoomService } from '../../../core/services';

@Component({
  selector: 'app-inner-dungeon',
  imports: [PanelHeader, IconComponent, DungeonArena, CombatLog],
  templateUrl: './inner-dungeon.html',
  styleUrl: './inner-dungeon.scss'
})
export class InnerDungeon implements OnDestroy {
  private restartTimer?: number;

  // Service injections
  private readonly combat = inject(CombatState);
  private readonly engine = inject(CombatEngine);
  private readonly dungeonRoom = inject(DungeonRoomService);

  // State
  protected readonly RestartDelay = signal<boolean>(false);
  public readonly CurrentDungeon = this.dungeonRoom.CurrentDungeon;
  public readonly CurrentStage = this.dungeonRoom.CurrentStage;
  public readonly InCombat = this.combat.InProgress;

  // Derived view states
  public readonly IsInArena = computed<boolean>(() => this.InCombat());

  ngOnDestroy(): void {
    if (this.restartTimer) {
      clearTimeout(this.restartTimer);
    }
  }

  // Actions
  public StartBattle(): void {
    const current = this.CurrentDungeon();
    if (!current) return;
    this.combat.SetupCombat(current.Id);
    this.engine.Start();
  }

  public Prestige(): void {
    // Delay before the player can start a new game
    this.DelayRestart();

    // End fight and keep player in dungeon arena
    this.engine.Stop();
  }

  public ExitDungeon(): void {
    this.dungeonRoom.ExitDungeon();
  }

  private DelayRestart() {
    this.RestartDelay.set(true);

    if (this.restartTimer) clearTimeout(this.restartTimer);

    this.restartTimer = setTimeout(() => {
      this.RestartDelay.set(false);
    }, DELAYS.BATTLE_RESTART_MS);
  }
}
