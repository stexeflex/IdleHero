import {
  AttributesService,
  CurrencyService,
  HeroService,
  InventoryService,
  LevelService,
  SkillsService
} from '../shared/services';
import { Injectable, inject } from '@angular/core';

import { Schema } from './models/schema';
import { StatisticsService } from '../shared/services/character/statistics.service';

@Injectable({ providedIn: 'root' })
export class StateApplicationService {
  private statisticsService = inject(StatisticsService);
  private heroService = inject(HeroService);
  private levelService = inject(LevelService);
  private attributesService = inject(AttributesService);
  private skillsService = inject(SkillsService);
  private inventoryService = inject(InventoryService);
  private currencyService = inject(CurrencyService);

  public ApplyState(schema: Schema): void {
    this.statisticsService.Init(schema.Statistics);
    this.heroService.Init(schema.Hero);
    this.levelService.Init(schema.Level);
    this.attributesService.Init(schema.Attributes);
    this.skillsService.Init(schema.Skills);
    this.inventoryService.Init(schema.Inventory);
    this.currencyService.Init(schema.Currency);
  }
}
