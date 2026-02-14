import { Component, inject } from '@angular/core';
import { DungeonKeyService, GoldService, StatisticsService } from '../../../core/services';
import { Gold, IconComponent, Separator } from '../../../shared/components';

import { DungeonRoomKey } from '../../../core/models';

@Component({
  selector: 'app-info-area',
  imports: [Gold, Separator, IconComponent],
  templateUrl: './info-area.html',
  styleUrl: './info-area.scss'
})
export class InfoArea {
  private readonly goldService = inject<GoldService>(GoldService);
  private readonly dungeonKeyService = inject<DungeonKeyService>(DungeonKeyService);
  private readonly statisticsService = inject<StatisticsService>(StatisticsService);

  protected get GoldAmount(): number {
    return this.goldService.Balance();
  }

  protected get MaxStages(): string {
    const stageStatistics = this.statisticsService.DungeonStatistics();
    const stages =
      Object.entries(stageStatistics.Capstone)
        .map(([roomId, stage]) => `${roomId} - ${stage}`)
        .join(' | ') || 'C1 - 0';
    return stages;
  }

  protected get HasAnyKey(): boolean {
    return this.dungeonKeyService.Keys().length > 0;
  }

  protected HasKey(key: DungeonRoomKey): boolean {
    return this.dungeonKeyService.HasKey(key);
  }
}
