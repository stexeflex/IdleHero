import { Component, inject } from '@angular/core';
import { Gold, IconComponent, Separator } from '../../../shared/components';
import { GoldService, StatisticsService } from '../../../core/services';

import { CurrencyService } from '../../../shared/services';
import { DungeonRoomKey } from '../../../shared/models';

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
    const stageStatistics = this.statisticsService.DungeonStatistics();
    const stages =
      Object.entries(stageStatistics.Capstone)
        .map(([roomId, stage]) => `${roomId} - ${stage}`)
        .join(' | ') || 'C1 - 0';
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
