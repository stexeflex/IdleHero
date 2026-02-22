import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Exp, Gold, RuneIcon, Separator } from '../../../../shared/components';

import { DungeonRunService } from '../../../../core/systems/combat';

@Component({
  selector: 'app-dungeon-rewards',
  imports: [Gold, Exp, RuneIcon, Separator],
  templateUrl: './dungeon-rewards.html',
  styleUrl: './dungeon-rewards.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DungeonRewardsScreen {
  private readonly dungeonRun = inject(DungeonRunService);

  protected readonly Gold = this.dungeonRun.Gold;
  protected readonly Experience = this.dungeonRun.Experience;
  protected readonly Runes = this.dungeonRun.Runes;
  protected readonly RuneCount = this.dungeonRun.RuneCount;

  protected readonly IsRunning = this.dungeonRun.IsRunning;
  protected readonly ElapsedTime = this.dungeonRun.ElapsedFormatted;
}
