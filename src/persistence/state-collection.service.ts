import {
  AttributesService,
  CurrencyService,
  GameStateService,
  HeroService,
  InventoryService,
  LevelService,
  SkillsService
} from '../shared/services';

import { Injectable } from '@angular/core';
import { Schema } from './models/schema';
import { StatisticsService } from '../shared/services/character/statistics.service';

@Injectable({ providedIn: 'root' })
export class StateCollectionService {
  constructor(
    private gameStateService: GameStateService,
    private statisticsService: StatisticsService,
    private heroService: HeroService,
    private levelService: LevelService,
    private attributesService: AttributesService,
    private skillsService: SkillsService,
    private inventoryService: InventoryService,
    private currencyService: CurrencyService
  ) {}

  public CollectStates(): Schema {
    const schema = new Schema();

    // Game State
    schema.GameState.GameCreated = this.gameStateService.GameCreated();

    // Statistics
    schema.Statistics = this.statisticsService.CollectSchema(schema.Statistics);

    // Hero
    schema.Hero = this.heroService.CollectSchema(schema.Hero);

    // Level
    schema.Level = this.levelService.CollectSchema(schema.Level);

    // Stats
    schema.Attributes = this.attributesService.CollectSchema(schema.Attributes);

    // Skills
    schema.Skills = this.skillsService.CollectSchema(schema.Skills);

    // Inventory
    schema.Inventory = this.inventoryService.CollectSchema(schema.Inventory);

    // Currency
    schema.Currency = this.currencyService.CollectSchema(schema.Currency);

    return schema;
  }
}
