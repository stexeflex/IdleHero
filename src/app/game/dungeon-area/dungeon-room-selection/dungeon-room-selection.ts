import { ChangeDetectionStrategy, Component, Signal, inject, output, signal } from '@angular/core';
import { CurrencyService, DungeonRoomService } from '../../../../shared/services';
import { DungeonRoom, DungeonRoomId } from '../../../../shared/models';
import { Gold, IconComponent, Separator } from '../../../../shared/components';

import { DecimalPipe } from '@angular/common';
import { DungeonSpecifications } from '../../../../shared/specifications';

@Component({
  selector: 'app-dungeon-room-selection',
  imports: [DecimalPipe, IconComponent, Gold, Separator],
  templateUrl: './dungeon-room-selection.html',
  styleUrl: './dungeon-room-selection.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DungeonRoomSelection {
  private readonly currency = inject(CurrencyService);
  private readonly dungeonRooms = inject(DungeonRoomService);
  private readonly dungeonSpecifications = inject(DungeonSpecifications);

  readonly onEnterRoom = output<DungeonRoomId>();

  protected readonly gold: Signal<number> = this.currency.Gold;
  protected readonly rooms: DungeonRoom[] = this.dungeonRooms.GetRooms();

  protected currentRoomIndex = signal<number>(0);
  protected get currentRoom(): DungeonRoom {
    return this.rooms[this.currentRoomIndex()];
  }

  protected get minRoomIndex(): number {
    return 0;
  }

  protected get maxRoomIndex(): number {
    return this.rooms.length - 1;
  }

  protected CanEnter(room: DungeonRoom): boolean {
    return this.dungeonSpecifications.CanEnterDungeonRoom(room.Id);
  }

  protected KeyRequirementMet(room: DungeonRoom): boolean {
    return this.dungeonSpecifications.KeyRequirementMet(room);
  }

  protected ShowRoomInfo(room: DungeonRoom): boolean {
    switch (room.Id) {
      case 1:
        return this.currency.HasKey(this.dungeonRooms.GetRoom(2)!.Prerequisites.Key!);
      case 2:
        return this.currency.HasKey(this.dungeonRooms.GetRoom(2)!.Prerequisites.Key!);
      case 3:
        return this.currency.HasKey(this.dungeonRooms.GetRoom(3)!.Prerequisites.Key!);
      default:
        return false;
    }
  }

  protected NextRoom() {
    const nextIndex = this.currentRoomIndex() + 1;

    if (nextIndex < this.rooms.length) {
      this.currentRoomIndex.set(nextIndex);
    }
  }

  protected PreviousRoom() {
    const prevIndex = this.currentRoomIndex() - 1;

    if (prevIndex >= 0) {
      this.currentRoomIndex.set(prevIndex);
    }
  }

  protected enterDungeon(room: DungeonRoom): void {
    if (!this.CanEnter(room)) {
      return;
    }

    this.onEnterRoom.emit(room.Id);
  }
}
