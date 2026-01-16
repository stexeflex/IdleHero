import { Component, Inject, LOCALE_ID } from '@angular/core';

import { DecimalPipe, PercentPipe } from '@angular/common';
import { LevelService, StatsService } from '../../../../shared/services';
import { IconComponent } from '../../../../shared/components';
import { CanChangeAttributesSpecification } from '../../../../shared/specifications';

@Component({
  selector: 'app-stats',
  imports: [IconComponent],
  templateUrl: './stats.html',
  styleUrl: './stats.scss'
})
export class Stats {
  private readonly decimalPipe: DecimalPipe;
  private readonly percentPipe: PercentPipe;

  protected AttributesExpanded: boolean = true;
  protected StatsExpanded: boolean = true;

  constructor(
    @Inject(LOCALE_ID) locale: string,
    private statsService: StatsService,
    private levelService: LevelService,
    private canChangeAttributes: CanChangeAttributesSpecification
  ) {
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

  get Attributes(): { label: string; value: string | null }[] {
    return [
      {
        label: 'Strength',
        value: this.decimalPipe.transform(this.statsService.Strength(), '1.0-0')
      },
      {
        label: 'Intelligence',
        value: this.decimalPipe.transform(this.statsService.Intelligence(), '1.0-0')
      },
      {
        label: 'Dexterity',
        value: this.decimalPipe.transform(this.statsService.Dexterity(), '1.0-0')
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

  get CanIncreaseAttributes(): boolean {
    return this.canChangeAttributes.CanIncreaseAttributes();
  }

  protected CanDecreaseAttribute(attribute: string): boolean {
    return this.canChangeAttributes.CanDecreaseAttribute(
      attribute as 'Strength' | 'Intelligence' | 'Dexterity'
    );
  }

  protected increaseAttribute(attribute: string) {
    this.statsService.IncreaseAttribute(attribute as 'Strength' | 'Intelligence' | 'Dexterity');
  }

  protected decreaseAttribute(attribute: string) {
    this.statsService.DecreaseAttribute(attribute as 'Strength' | 'Intelligence' | 'Dexterity');
  }
}
