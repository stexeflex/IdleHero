import { CombatStatsService, LevelService, PlayerHeroService } from '../../../../../core/services';
import { Component, LOCALE_ID, inject } from '@angular/core';
import { IconComponent, NumberValue } from '../../../../../shared/components';

import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-info',
  imports: [NumberValue, IconComponent],
  templateUrl: './info.html',
  styleUrl: './info.scss'
})
export class Info {
  private readonly locale = inject(LOCALE_ID);
  private heroService = inject(PlayerHeroService);
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
