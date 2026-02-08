import { Component, LOCALE_ID, computed, inject, signal } from '@angular/core';

import { DecimalPipe } from '@angular/common';
import { StatisticsService } from '../../../shared/services';

interface StatisticItem {
  label: string;
  value: any | null;
}

@Component({
  selector: 'app-statistics-flyout',
  imports: [],
  templateUrl: './statistics-flyout.html',
  styleUrl: './statistics-flyout.scss'
})
export class StatisticsFlyout {
  private readonly locale = inject(LOCALE_ID);
  private readonly decimalPipe: DecimalPipe = new DecimalPipe(this.locale);

  private readonly statisticsService = inject(StatisticsService);

  protected readonly IsOpen = signal<boolean>(false);

  protected ToggleFlyout(): void {
    this.IsOpen.set(!this.IsOpen());
  }

  protected readonly Statistics = computed<StatisticItem[]>(() => {
    return [
      {
        label: 'Highest Single Hit',
        value: this.decimalPipe.transform(
          this.statisticsService.DamageStatistics().HighestSingleHit,
          '1.0-0'
        )
      },
      {
        label: 'Highest Bleeding Tick',
        value: this.decimalPipe.transform(0, '1.0-0')
      },
      {
        label: 'Highest Critical Hit',
        value: this.decimalPipe.transform(
          this.statisticsService.DamageStatistics().HighestCriticalHit,
          '1.0-0'
        )
      },
      {
        label: 'Highest Multi Hit',
        value: this.decimalPipe.transform(
          this.statisticsService.DamageStatistics().HighestMultiHit,
          '1.0-0'
        )
      },
      {
        label: 'Highest Multi Hit Chain',
        value: this.decimalPipe.transform(0, '1.0-0')
      },
      {
        label: 'Highest Critical Multi Hit',
        value: this.decimalPipe.transform(
          this.statisticsService.DamageStatistics().HighestCriticalMultiHit,
          '1.0-0'
        )
      },
      {
        label: 'Highest Splash Hit',
        value: this.decimalPipe.transform(
          this.statisticsService.DamageStatistics().HighestSplashHit,
          '1.0-0'
        )
      }
    ];
  });
}
