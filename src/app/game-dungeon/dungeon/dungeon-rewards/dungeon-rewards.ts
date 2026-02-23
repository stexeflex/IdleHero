import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Exp, Gold, IconComponent, RuneIcon, Separator } from '../../../../shared/components';

import { DungeonRoomService } from '../../../../core/services';
import { DungeonRunService } from '../../../../core/systems/combat';

@Component({
  selector: 'app-dungeon-rewards',
  imports: [Gold, Exp, RuneIcon, Separator, IconComponent],
  templateUrl: './dungeon-rewards.html',
  styleUrl: './dungeon-rewards.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DungeonRewardsScreen {
  private readonly dungeonRoom = inject(DungeonRoomService);
  private readonly dungeonRun = inject(DungeonRunService);

  // Current Dungeon Info
  protected readonly CurrentDungeonId = this.dungeonRoom.CurrentDungeonId;

  // Current Run Info
  protected readonly DungeonId = this.dungeonRun.DungeonId;
  protected readonly StageReached = this.dungeonRun.StageReached;
  protected readonly MimicsDefeated = this.dungeonRun.MimicsDefeated;

  // Dungeon Run Rewards
  protected readonly Gold = this.dungeonRun.Gold;
  protected readonly Experience = this.dungeonRun.Experience;
  protected readonly Runes = this.dungeonRun.Runes;
  protected readonly RuneCount = this.dungeonRun.RuneCount;

  // Run State
  protected readonly IsRunning = this.dungeonRun.IsRunning;
  protected readonly ElapsedTime = this.dungeonRun.ElapsedFormatted;

  protected Show(): boolean {
    return this.CurrentDungeonId() === this.DungeonId();
  }
}
