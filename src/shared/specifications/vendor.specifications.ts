import { CurrencyService, GameStateService } from '../services';

import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VendorSpecifications {
  private gameStateService = inject(GameStateService);
  private currencyService = inject(CurrencyService);


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
