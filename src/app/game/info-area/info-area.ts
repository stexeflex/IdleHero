import { Component, inject } from '@angular/core';
import { Gold, IconComponent, Separator } from '../../../shared/components';

import { CurrencyService } from '../../../shared/services';
import { DecimalPipe } from '@angular/common';
import { DungeonRoomKey } from '../../../shared/models';
import { StatisticsService } from '../../../shared/services/character/statistics.service';

@Component({
  selector: 'app-info-area',
  imports: [DecimalPipe, Gold, Separator, IconComponent],
  templateUrl: './info-area.html',
  styleUrl: './info-area.scss'
})
export class InfoArea {
  readonly currencyService = inject<CurrencyService>(CurrencyService);
  readonly statisticsService = inject<StatisticsService>(StatisticsService);

  protected get GoldAmount(): number {
    return this.currencyService.Gold();
  }

  protected get PrestigeLevel(): number {
    return this.statisticsService.PrestigeLevel();
  }

  protected get MaxStages(): string {
    const stageStatistics = this.statisticsService.StageStatistics();
    const stages =
      Object.entries(stageStatistics.HighestStageReached)
        .map(([roomId, stage]) => `${roomId} - ${stage}`)
        .join(' | ') || '1 - 0';
    return stages;
  }

  protected get HasAnyKey(): boolean {
    return (
      this.currencyService.SilverKey() ||
      this.currencyService.MagicKey() ||
      this.currencyService.GoldenKey()
    );
  }

  protected HasKey(key: DungeonRoomKey): boolean {
    return this.currencyService.HasKey(key);
  }
}
