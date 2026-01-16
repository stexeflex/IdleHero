import { GameService, LevelService, StatsService } from '../services';

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CanChangeAttributesSpecification {
  constructor(
    private statsService: StatsService,
    private levelService: LevelService,
    private gameService: GameService
  ) {}

  public CanIncreaseAttributes(): boolean {
    return !this.gameService.InProgress() && this.levelService.UnspentAttributePoints() > 0;
  }

  public CanDecreaseAttribute(attribute: 'Strength' | 'Intelligence' | 'Dexterity'): boolean {
    if (this.gameService.InProgress()) {
      return false;
    }

    if (this.levelService.SpentAttributePoints() <= 0) {
      return false;
    }

    switch (attribute) {
      case 'Strength':
        return this.statsService.StrengthStat() > 1;
      case 'Intelligence':
        return this.statsService.IntelligenceStat() > 1;
      case 'Dexterity':
        return this.statsService.DexterityStat() > 1;

      default:
        return false;
    }
  }
}
