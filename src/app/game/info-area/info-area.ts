import { Component, inject } from '@angular/core';
import { CurrencyService, StatisticsService } from '../../../shared/services';
import { Gold, IconComponent, Separator } from '../../../shared/components';

import { DecimalPipe } from '@angular/common';
import { DungeonRoomKey } from '../../../shared/models';
import { GoldService } from '../../../core/services';

@Component({
  selector: 'app-info-area',
  imports: [Gold, Separator, IconComponent],
  templateUrl: './info-area.html',
  styleUrl: './info-area.scss'
})
export class InfoArea {
  private readonly goldService = inject<GoldService>(GoldService);
  private readonly currencyService = inject<CurrencyService>(CurrencyService);
  private readonly statisticsService = inject<StatisticsService>(StatisticsService);

  protected get GoldAmount(): number {
    return this.goldService.Balance();
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
