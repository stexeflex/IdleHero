import { DecimalPipe } from '@angular/common';
import { HeroService, LevelService, StatsService } from '../../../../../shared/services';

import { Component, Inject, LOCALE_ID } from '@angular/core';
import { NumberValue } from '../../../../../shared/components';

@Component({
  selector: 'app-info',
  imports: [NumberValue],
  templateUrl: './info.html',
  styleUrl: './info.scss'
})
export class Info {
  private readonly PLACEHOLDER = '-';

  private readonly decimalPipe: DecimalPipe;

  private get DamagePerSecond(): number {
    return Math.round(this.statsService.AttackPower() * this.statsService.AttackSpeed());
  }

  constructor(
    @Inject(LOCALE_ID) locale: string,
    protected heroService: HeroService,
    protected statsService: StatsService,
    protected levelService: LevelService
  ) {
    this.decimalPipe = new DecimalPipe(locale);
  }

  get SummaryStats(): { label: string; value: string }[] {
    return [
      {
        label: 'Attack Power',
        value: this.decimalPipe.transform(this.statsService.AttackPower()) || this.PLACEHOLDER
      },
      {
        label: 'DPS',
        value: this.decimalPipe.transform(this.DamagePerSecond) || this.PLACEHOLDER
      }
    ];
  }
}
