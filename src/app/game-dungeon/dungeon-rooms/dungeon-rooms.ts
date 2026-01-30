import { Component, computed, inject } from '@angular/core';
import { IconComponent, PanelHeader } from '../../../shared/components';

import { DungeonRoomService } from '../../../core/services';
import { DungeonType } from '../../../core/models';
import { GetAllDungeons } from '../../../core/constants';

@Component({
  selector: 'app-dungeon-rooms',
  imports: [PanelHeader, IconComponent],
  templateUrl: './dungeon-rooms.html',
  styleUrl: './dungeon-rooms.scss'
})
export class DungeonRooms {
  private readonly dungeonRoom = inject(DungeonRoomService);

  // Data
  public readonly Dungeons = GetAllDungeons();
  public readonly NormalDungeons = computed(() =>
    this.Dungeons.filter((d) => d.Type === DungeonType.Normal)
  );
  public readonly CapstoneDungeons = computed(() =>
    this.Dungeons.filter((d) => d.Type === DungeonType.Capstone)
  );

  // Actions
  public EnterDungeon(id: string): void {
    this.dungeonRoom.EnterDungeon(id);
  }

  public CanEnter(id: string): boolean {
    return this.dungeonRoom.CanEnter(id);
  }
}
