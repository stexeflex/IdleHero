import { GEAR_CONFIG } from '../constants';
import { GameStateService } from '../services';
import { Gear } from '../models';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GearSpecifications {
  constructor(private gameStateService: GameStateService) {}

  public CanUpgrade(Item: Gear): boolean {
    if (this.gameStateService.IsGameInProgress) {
      return false;
    }

    return Item?.Level < GEAR_CONFIG.LEVEL.MAX;
  }
}
