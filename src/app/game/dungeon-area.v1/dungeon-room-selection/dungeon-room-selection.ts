import { CapstoneDungeonRoom, DungeonRoom, DungeonType } from '../../../../core/models';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
  signal
} from '@angular/core';
import { Gold, IconComponent, Separator } from '../../../../shared/components';

import { DecimalPipe } from '@angular/common';
import { DungeonRoomService } from '../../../../core/services';
import { GetAllDungeons } from '../../../../core/constants';

interface DungeonRoomView extends DungeonRoom {
  CanEnter: boolean;
  Capstone?: CapstoneDungeonRoom;
}

@Component({
  selector: 'app-dungeon-room-selection',
  imports: [DecimalPipe, IconComponent, Separator, Gold],
  templateUrl: './dungeon-room-selection.html',
  styleUrl: './dungeon-room-selection.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DungeonRoomSelection {
  // Services
  private readonly dungeonRooms = inject(DungeonRoomService);

  // Outputs
  public readonly onEnterRoom = output<string>();

  // State
  protected currentRoomIndex = signal<number>(0);
  protected minRoomIndex: number = 0;
  protected get maxRoomIndex(): number {
    return this.Rooms.length - 1;
  }

  // Dungeon Rooms
  protected readonly Rooms: DungeonRoomView[] = GetAllDungeons().map((room) => ({
    ...room,
    CanEnter: this.dungeonRooms.CanEnter(room.Id),
    Capstone: room.Type === DungeonType.Capstone ? (room as CapstoneDungeonRoom) : undefined
  }));

  // Currently selected Room
  protected readonly CurrentRoom = computed<DungeonRoomView>(() => {
    const idx = this.currentRoomIndex();
    return this.Rooms[idx];
  });

  protected ShowRoomInfo(room: DungeonRoom): boolean {
    if (room.Type === DungeonType.Capstone) {
      const capstoneRoom = room as CapstoneDungeonRoom;
      return this.dungeonRooms.CanEnter(capstoneRoom.Id + 1) || false;
    } else {
      return true;
    }
  }

  protected NextRoom() {
    const nextIndex = this.currentRoomIndex() + 1;

    if (nextIndex < this.Rooms.length) {
      this.currentRoomIndex.set(nextIndex);
    }
  }

  protected PreviousRoom() {
    const prevIndex = this.currentRoomIndex() - 1;

    if (prevIndex >= 0) {
      this.currentRoomIndex.set(prevIndex);
    }
  }

  protected EnterDungeon(room: DungeonRoomView): void {
    if (!room.CanEnter) return;
    this.onEnterRoom.emit(room.Id);
  }
}
