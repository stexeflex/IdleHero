import { Component, computed, inject, signal } from '@angular/core';
import { TabDefinition, TabStrip } from '../../shared/components';

import { DungeonBosses } from './dungeon-bosses/dungeon-bosses';
import { DungeonRoomService } from '../../core/services';
import { DungeonRooms } from './dungeon-rooms/dungeon-rooms';
import { InnerDungeon } from './dungeon/inner-dungeon';

@Component({
  selector: 'app-game-dungeon',
  imports: [DungeonRooms, DungeonBosses, InnerDungeon, TabStrip],
  templateUrl: './game-dungeon.html',
  styleUrl: './game-dungeon.scss'
})
export class GameDungeon {
  private readonly dungeonRoom = inject(DungeonRoomService);

  protected readonly TabIds = {
    Dungeons: 'dungeons',
    Bosses: 'bosses'
  } as const;

  // State
  public readonly CurrentDungeon = this.dungeonRoom.CurrentDungeon;

  // Derived view states
  public readonly IsInDungeon = computed<boolean>(() => this.CurrentDungeon() !== null);

  protected get Tabs(): TabDefinition[] {
    return [
      { id: this.TabIds.Dungeons, label: 'DUNGEONS', disabled: false },
      { id: this.TabIds.Bosses, label: 'BOSSES', disabled: false }
    ];
  }

  protected SelectedTab = signal<TabDefinition['id']>(this.TabIds.Dungeons);

  protected onTabSelected(tabId: TabDefinition['id']): void {
    this.SelectedTab.set(tabId);
  }

  // Actions
  public EnterDungeon(id: string): void {
    this.dungeonRoom.EnterDungeon(id);
  }

  public CanEnter(id: string): boolean {
    return this.dungeonRoom.CanEnter(id);
  }
}
