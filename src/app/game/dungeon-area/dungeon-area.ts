import { Component, inject, signal } from '@angular/core';

import { BattleService } from '../../../shared/engine';
import { DungeonRoom } from './dungeon-room/dungeon-room';
import { DungeonRoomId } from '../../../shared/models';
import { DungeonRoomSelection } from './dungeon-room-selection/dungeon-room-selection';
import { DungeonRoomService } from '../../../shared/services';
import { PanelHeader } from '../../../shared/components';

@Component({
  selector: 'app-dungeon-area',
  imports: [DungeonRoomSelection, PanelHeader, DungeonRoom],
  templateUrl: './dungeon-area.html',
  styleUrl: './dungeon-area.scss'
})
export class DungeonArea {
  private readonly battleService = inject(BattleService);
  private readonly dungeonRoomService = inject(DungeonRoomService);

  // Dungeon State
  protected InDungeon = signal<boolean>(false);

  protected onStart() {
    this.InDungeon.set(true);
    this.battleService.Battle();
  }

  protected onPrestige(): void {
    this.battleService.Prestige();
  }

  protected onLeave(): void {
    this.InDungeon.set(false);
  }

  protected onDungeonRoomSelected(dungeonRoomId: DungeonRoomId): void {
    this.dungeonRoomService.Set(dungeonRoomId);
    this.InDungeon.set(true);
  }
}
