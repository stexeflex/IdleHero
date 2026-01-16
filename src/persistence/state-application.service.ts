import {
  CurrencyService,
  GameStateService,
  HeroService,
  InventoryService,
  LevelService,
  StatsService
} from '../shared/services';

import { Injectable } from '@angular/core';
import { Schema } from './models/schema';

@Injectable({ providedIn: 'root' })
export class StateApplicationService {
  constructor(
    private gameStateService: GameStateService,
    private heroService: HeroService,
    private levelService: LevelService,
    private statsService: StatsService,
    private inventoryService: InventoryService,
    private currencyService: CurrencyService
  ) {}

  public ApplyState(schema: Schema): void {
    this.gameStateService.GameCreated.set(schema.GameState.GameCreated);
    this.heroService.Init(schema.Hero);
    this.levelService.Init(schema.Level);
    this.statsService.Init(schema.Stats);
    this.inventoryService.Init(schema.Inventory);
    this.currencyService.Init(schema.Currency);
  }
}
