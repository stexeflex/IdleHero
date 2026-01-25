import { CombatStatsService, LevelService } from '../../../../../core/services';
import { Component, LOCALE_ID, inject, signal } from '@angular/core';

import { DecimalPipe } from '@angular/common';
import { HeroService } from '../../../../../shared/services';
import { NumberValue } from '../../../../../shared/components';

@Component({
  selector: 'app-info',
  imports: [NumberValue],
  templateUrl: './info.html',
  styleUrl: './info.scss'
})
export class Info {
  private readonly locale = inject(LOCALE_ID);
  private heroService = inject(HeroService);
  private statsService = inject(CombatStatsService);
  private levelService = inject(LevelService);

  private readonly PLACEHOLDER = '-';
  private readonly decimalPipe: DecimalPipe;

  constructor() {
    this.decimalPipe = new DecimalPipe(this.locale);
  }

  get HeroInfo(): { name: string; level: number } {
    return {
      name: this.heroService.Name(),
      level: this.levelService.Level()
    };
  }

  get SummaryStats(): { label: string; value: string }[] {
    return [
      {
        label: 'Attack Power',
        value: this.decimalPipe.transform(this.statsService.AttackPower()) || this.PLACEHOLDER
      },
      {
        label: 'DPS',
        value: this.decimalPipe.transform(this.statsService.DamagePerSecond()) || this.PLACEHOLDER
      }
    ];
  }
}
