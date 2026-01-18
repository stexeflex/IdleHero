import { CurrencyService, GameStateService } from '../services';

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VendorSpecifications {
  constructor(
    private gameStateService: GameStateService,
    private currencyService: CurrencyService
  ) {}

  public CanBuy(): boolean {
    return !this.gameStateService.IsGameInProgress;
  }

  public CanSell(): boolean {
    return !this.gameStateService.IsGameInProgress;
  }

  public EnoughGold(amount: number): boolean {
    return this.currencyService.Gold() >= amount;
  }
}
