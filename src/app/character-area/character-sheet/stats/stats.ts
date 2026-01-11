import { Component, Inject, LOCALE_ID } from '@angular/core';

import { PercentPipe } from '@angular/common';
import { GameService, LevelService, StatsService } from '../../../../shared/services';
import { IconComponent } from '../../../../shared/components';

@Component({
  selector: 'app-stats',
  imports: [IconComponent],
  templateUrl: './stats.html',
  styleUrl: './stats.scss'
})
export class Stats {
  private readonly percentPipe: PercentPipe;

  constructor(
    @Inject(LOCALE_ID) locale: string,
    private statsService: StatsService,
    private levelService: LevelService,
    private gameService: GameService
  ) {
    this.percentPipe = new PercentPipe(locale);
  }

  get ShowSkillPoints(): boolean {
    return this.levelService.UnspentSkillPoints() > 0;
  }

  get SkillPoints(): string | undefined {
    return this.levelService.TotalSkillPoints() > 0
      ? this.levelService.UnspentSkillPoints() + ' / ' + this.levelService.TotalSkillPoints()
      : undefined;
  }

  get Attributes(): { label: string; value: number }[] {
    return [
      {
        label: 'Strength',
        value: this.statsService.Strength()
      },
      {
        label: 'Intelligence',
        value: this.statsService.Intelligence()
      },
      {
        label: 'Dexterity',
        value: this.statsService.Dexterity()
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

  CanIncreaseSkillPoints(): boolean {
    return !this.gameService.InProgress() && this.levelService.UnspentSkillPoints() > 0;
  }

  CanDecreaseSkillPoints(attribute: string): boolean {
    if (this.levelService.SpentSkillPoints() <= 0) {
      return false;
    }

    switch (attribute) {
      case 'Strength':
        return !this.gameService.InProgress() && this.statsService.Strength() > 1;
      case 'Intelligence':
        return !this.gameService.InProgress() && this.statsService.Intelligence() > 1;
      case 'Dexterity':
        return !this.gameService.InProgress() && this.statsService.Dexterity() > 1;
      default:
        return false;
    }
  }

  protected increaseAttribute(attribute: string) {
    switch (attribute) {
      case 'Strength':
        this.statsService.IncreaseAttribute('Strength');
        break;
      case 'Intelligence':
        this.statsService.IncreaseAttribute('Intelligence');
        break;
      case 'Dexterity':
        this.statsService.IncreaseAttribute('Dexterity');
        break;
    }
  }

  protected decreaseAttribute(attribute: string) {
    switch (attribute) {
      case 'Strength':
        this.statsService.DecreaseAttribute('Strength');
        break;
      case 'Intelligence':
        this.statsService.DecreaseAttribute('Intelligence');
        break;
      case 'Dexterity':
        this.statsService.DecreaseAttribute('Dexterity');
        break;
    }
  }
}
