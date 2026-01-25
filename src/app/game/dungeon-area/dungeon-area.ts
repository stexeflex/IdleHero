import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { DungeonRoomService } from '../../../core/services/dungeon-room.service';
import { DungeonRooms } from './dungeon-rooms/dungeon-rooms';
import { InnerDungeon } from './dungeon/inner-dungeon';

@Component({
  selector: 'app-dungeon-area',
  imports: [DungeonRooms, InnerDungeon],
  templateUrl: './dungeon-area.html',
  styleUrl: './dungeon-area.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DungeonArea {
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
