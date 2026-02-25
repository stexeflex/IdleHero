import { Component, computed, inject } from '@angular/core';

import { DungeonRoomService } from '../../core/services';
import { DungeonRooms } from './dungeon-rooms/dungeon-rooms';
import { InnerDungeon } from './dungeon/inner-dungeon';

@Component({
  selector: 'app-game-dungeon',
  imports: [DungeonRooms, InnerDungeon],
  templateUrl: './game-dungeon.html',
  styleUrl: './game-dungeon.scss'
})
export class GameDungeon {
  private readonly dungeonRoom = inject(DungeonRoomService);

  // State
  public readonly CurrentDungeon = this.dungeonRoom.CurrentDungeon;

  // Derived view states
  public readonly IsInDungeon = computed<boolean>(() => this.CurrentDungeon() !== null);

  // Actions
  public EnterDungeon(id: string): void {
    this.dungeonRoom.EnterDungeon(id);
  }

  public CanEnter(id: string): boolean {
    return this.dungeonRoom.CanEnter(id);
  }
}
