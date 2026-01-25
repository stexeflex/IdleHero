import { CombatEngine, CombatState } from '../../../core/systems/combat';
import { Component, inject, signal } from '@angular/core';

import { DungeonRoom } from './dungeon-room/dungeon-room';
import { DungeonRoomSelection } from './dungeon-room-selection/dungeon-room-selection';
import { DungeonRoomService } from '../../../core/services';
import { PanelHeader } from '../../../shared/components';

@Component({
  selector: 'app-dungeon-area-v1',
  imports: [DungeonRoomSelection, PanelHeader, DungeonRoom],
  templateUrl: './dungeon-area.html',
  styleUrl: './dungeon-area.scss'
})
export class DungeonAreaV1 {
  private readonly combatState = inject(CombatState);
  private readonly combatEngine = inject(CombatEngine);
  private readonly dungeonRoomService = inject(DungeonRoomService);

  // Dungeon State
  protected InDungeon = signal<boolean>(false);

  protected onStart() {
    const dungeonRoom = this.dungeonRoomService.CurrentDungeon();

    if (dungeonRoom) {
      this.combatState.SetupCombat(dungeonRoom.Id);
      this.combatEngine.Start();
    }
  }

  protected onPrestige(): void {
    this.combatEngine.Stop();
  }

  protected onLeave(): void {
    this.InDungeon.set(false);
  }

  protected onDungeonRoomSelected(dungeonId: string): void {
    if (this.dungeonRoomService.EnterDungeon(dungeonId)) {
      this.InDungeon.set(true);
    }
  }
}
