import { Component, LOCALE_ID, computed, inject, signal } from '@angular/core';

import { DecimalPipe } from '@angular/common';
import { Separator } from '../../../shared/components';
import { StatisticsService } from '../../../core/services';

interface StatisticItem {
  label: string;
  value: any | null;
}

@Component({
  selector: 'app-statistics-flyout',
  imports: [Separator],
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
    const damageStats = this.statisticsService.DamageStatistics();

    return [
      {
        label: 'Highest Single Hit',
        value: this.decimalPipe.transform(damageStats.HighestSingleHit, '1.0-0')
      },
      {
        label: 'Highest Bleeding Tick',
        value: this.decimalPipe.transform(damageStats.HighestBleedingTick, '1.0-0')
      },
      {
        label: 'Highest Critical Hit',
        value: this.decimalPipe.transform(damageStats.HighestCriticalHit, '1.0-0')
      },
      {
        label: 'Highest Multi Hit',
        value: this.decimalPipe.transform(damageStats.HighestMultiHit, '1.0-0')
      },
      {
        label: 'Highest Critical Multi Hit',
        value: this.decimalPipe.transform(damageStats.HighestCriticalMultiHit, '1.0-0')
      },
      {
        label: 'Highest Multi Hit Chain',
        value: this.decimalPipe.transform(damageStats.HighestMultiHitChain, '1.0-0')
      },
      {
        label: 'Highest Total Hit',
        value: this.decimalPipe.transform(damageStats.HighestTotalHit, '1.0-0')
      }
      // {
      //   label: 'Highest Splash Hit',
      //   value: this.decimalPipe.transform(damageStats.HighestSplashHit, '1.0-0')
      // }
    ];
  });

  protected readonly ChargedStatistics = computed<StatisticItem[]>(() => {
    const damageStats = this.statisticsService.DamageStatistics();

    return [
      {
        label: 'Highest Charged Single Hit',
        value: this.decimalPipe.transform(damageStats.HighestChargedHit, '1.0-0')
      },
      {
        label: 'Highest Charged Multi Hit',
        value: this.decimalPipe.transform(damageStats.HighestChargedMultiHit, '1.0-0')
      },
      {
        label: 'Highest Charged Critical Multi Hit',
        value: this.decimalPipe.transform(damageStats.HighestChargedCriticalMultiHit, '1.0-0')
      },
      {
        label: 'Highest Charged Total Hit',
        value: this.decimalPipe.transform(damageStats.HighestChargedTotalHit, '1.0-0')
      }
    ];
  });
}
