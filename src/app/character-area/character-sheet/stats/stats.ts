import { Component, Inject, LOCALE_ID } from '@angular/core';

import { PercentPipe } from '@angular/common';
import { GameService, PlayerService } from '../../../../shared/services';

@Component({
  selector: 'app-stats',
  imports: [],
  templateUrl: './stats.html',
  styleUrl: './stats.scss'
})
export class Stats {
  private readonly percentPipe: PercentPipe;

  constructor(
    @Inject(LOCALE_ID) locale: string,
    protected playerService: PlayerService,
    protected gameService: GameService
  ) {
    this.percentPipe = new PercentPipe(locale);
  }

  get Attributes(): { label: string; value: number }[] {
    return [
      { label: 'Strength', value: this.playerService.Strength() },
      { label: 'Intelligence', value: this.playerService.Intelligence() },
      { label: 'Dexterity', value: this.playerService.Dexterity() }
    ];
  }

  get Stats(): { label: string; value: string | null }[] {
    return [
      {
        label: 'Attack Speed',
        value: this.percentPipe.transform(this.playerService.AttackSpeed(), '1.0-0')
      },
      {
        label: 'Critical Hit Chance',
        value: this.percentPipe.transform(this.playerService.CriticalHitChance(), '1.0-0')
      },
      {
        label: 'Critical Hit Damage',
        value: this.percentPipe.transform(this.playerService.CriticalHitDamage(), '1.0-0')
      }
    ];
  }

  CanIncreaseSkillPoints(): boolean {
    return !this.gameService.InProgress() && this.playerService.Level().UnspentSkillPoints > 0;
  }

  CanDecreaseSkillPoints(attribute: string): boolean {
    switch (attribute) {
      case 'Strength':
        return !this.gameService.InProgress() && this.playerService.Strength() > 1;
      case 'Intelligence':
        return !this.gameService.InProgress() && this.playerService.Intelligence() > 1;
      case 'Dexterity':
        return !this.gameService.InProgress() && this.playerService.Dexterity() > 1;
      default:
        return false;
    }
  }

  protected increaseAttribute(attribute: string) {
    switch (attribute) {
      case 'Strength':
        this.playerService.IncreaseAttribute('Strength');
        break;
      case 'Intelligence':
        this.playerService.IncreaseAttribute('Intelligence');
        break;
      case 'Dexterity':
        this.playerService.IncreaseAttribute('Dexterity');
        break;
    }
  }

  protected decreaseAttribute(attribute: string) {
    switch (attribute) {
      case 'Strength':
        this.playerService.DecreaseAttribute('Strength');
        break;
      case 'Intelligence':
        this.playerService.DecreaseAttribute('Intelligence');
        break;
      case 'Dexterity':
        this.playerService.DecreaseAttribute('Dexterity');
        break;
    }
  }
}
