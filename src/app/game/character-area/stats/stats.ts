import { AttributesService, LevelService, StatsService } from '../../../../shared/services';
import { Component, LOCALE_ID, inject } from '@angular/core';
import { DecimalPipe, PercentPipe } from '@angular/common';

import { AttributesSpecifications } from '../../../../shared/specifications';
import { IconComponent } from '../../../../shared/components';
import { StatisticsService } from '../../../../shared/services/character/statistics.service';

@Component({
  selector: 'app-stats',
  imports: [IconComponent],
  templateUrl: './stats.html',
  styleUrl: './stats.scss'
})
export class Stats {
  private attributesService = inject(AttributesService);
  private statsService = inject(StatsService);
  private levelService = inject(LevelService);
  private statisticsService = inject(StatisticsService);
  private canChangeAttributes = inject(AttributesSpecifications);

  private readonly decimalPipe: DecimalPipe;
  private readonly percentPipe: PercentPipe;

  protected AttributesExpanded: boolean = true;
  protected StatsExpanded: boolean = false;
  protected StatisticsExpanded: boolean = false;

  constructor() {
    const locale = inject(LOCALE_ID);

    this.decimalPipe = new DecimalPipe(locale);
    this.percentPipe = new PercentPipe(locale);
  }

  get ShowAttributePoints(): boolean {
    return this.levelService.UnspentAttributePoints() > 0;
  }

  get AttributePoints(): string | undefined {
    return this.levelService.TotalAttributePoints() > 0
      ? this.levelService.UnspentAttributePoints() +
          ' / ' +
          this.levelService.TotalAttributePoints()
      : undefined;
  }

  get CanIncreaseAttributes(): boolean {
    return this.canChangeAttributes.CanIncrease();
  }

  get Attributes(): { label: string; value: string | null }[] {
    return [
      {
        label: 'Strength',
        value: this.decimalPipe.transform(this.attributesService.Strength(), '1.0-0')
      },
      {
        label: 'Intelligence',
        value: this.decimalPipe.transform(this.attributesService.Intelligence(), '1.0-0')
      },
      {
        label: 'Dexterity',
        value: this.decimalPipe.transform(this.attributesService.Dexterity(), '1.0-0')
      }
    ];
  }

  get Stats(): { label: string; value: string | null }[] {
    return [
      {
        label: 'Attack Speed',
        value: this.percentPipe.transform(this.statsService.AttackSpeed(), '1.0-0')
      },
      {
        label: 'Critical Hit Chance',
        value: this.percentPipe.transform(this.statsService.CriticalHitChance(), '1.0-0')
      },
      {
        label: 'Critical Hit Damage',
        value: this.percentPipe.transform(this.statsService.CriticalHitDamage(), '1.0-0')
      },
      {
        label: 'Multi Hit Chance',
        value: this.percentPipe.transform(this.statsService.MultiHitChance(), '1.0-0')
      },
      {
        label: 'Multi Hit Damage',
        value: this.percentPipe.transform(this.statsService.MultiHitDamage(), '1.0-0')
      }
    ];
  }

  get Statistics(): { label: string; value: string | null }[] {
    return [
      {
        label: 'Highest Single Hit',
        value: this.decimalPipe.transform(
          this.statisticsService.DamageStatistics().HighestSingleHit,
          '1.0-0'
        )
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
  }

  protected CanDecreaseAttribute(attribute: string): boolean {
    return this.canChangeAttributes.CanDecrease(
      attribute as 'Strength' | 'Intelligence' | 'Dexterity'
    );
  }

  protected increaseAttribute(attribute: string) {
    this.attributesService.IncreaseAttribute(
      attribute as 'Strength' | 'Intelligence' | 'Dexterity'
    );
  }

  protected decreaseAttribute(attribute: string) {
    this.attributesService.DecreaseAttribute(
      attribute as 'Strength' | 'Intelligence' | 'Dexterity'
    );
  }
}
