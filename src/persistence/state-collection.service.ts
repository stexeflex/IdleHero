import {
  AttributesService,
  CurrencyService,
  GameStateService,
  HeroService,
  InventoryService,
  LevelService
} from '../shared/services';

import { Injectable } from '@angular/core';
import { Schema } from './models/schema';

@Injectable({ providedIn: 'root' })
export class StateCollectionService {
  constructor(
    private gameStateService: GameStateService,
    private heroService: HeroService,
    private levelService: LevelService,
    private attributesService: AttributesService,
    private inventoryService: InventoryService,
    private currencyService: CurrencyService
  ) {}

  public CollectStates(): Schema {
    const schema = new Schema();

    // Game State
    schema.GameState.GameCreated = this.gameStateService.GameCreated();

    // Hero
    schema.Hero = this.heroService.CollectSchema();

    // Level
    schema.Level = this.levelService.CollectSchema();

    // Stats
    schema.Attributes = this.attributesService.CollectSchema();

    // Inventory
    schema.Inventory = this.inventoryService.CollectSchema();

    // Currency
    schema.Currency = this.currencyService.CollectSchema();

    return schema;
  }
}
