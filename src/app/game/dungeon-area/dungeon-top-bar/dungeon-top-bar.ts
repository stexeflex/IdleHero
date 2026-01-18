import { Component, input } from '@angular/core';
import { HealthBar, Separator } from '../../../../shared/components';

import { DungeonRoomId } from '../../../../shared/models';

@Component({
  selector: 'app-dungeon-top-bar',
  imports: [Separator, HealthBar],
  templateUrl: './dungeon-top-bar.html',
  styleUrl: './dungeon-top-bar.scss'
})
export class DungeonTopBar {
  readonly currentRoomId = input.required<DungeonRoomId>();
  readonly currentStage = input.required<number>();

  readonly showBossHealthBar = input.required<boolean>();
  readonly currentBossHealth = input.required<number>();
  readonly maxBossHealth = input.required<number>();
}
