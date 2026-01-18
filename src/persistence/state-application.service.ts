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
export class StateApplicationService {
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

  public ApplyState(schema: Schema): void {
    this.gameStateService.GameCreated.set(schema.GameState.GameCreated);
    this.statisticsService.Init(schema.Statistics);
    this.heroService.Init(schema.Hero);
    this.levelService.Init(schema.Level);
    this.attributesService.Init(schema.Attributes);
    this.skillsService.Init(schema.Skills);
    this.inventoryService.Init(schema.Inventory);
    this.currencyService.Init(schema.Currency);
  }
}
