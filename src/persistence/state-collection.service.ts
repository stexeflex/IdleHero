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
export class StateCollectionService {
  private statisticsService = inject(StatisticsService);
  private heroService = inject(HeroService);
  private levelService = inject(LevelService);
  private attributesService = inject(AttributesService);
  private skillsService = inject(SkillsService);
  private inventoryService = inject(InventoryService);
  private currencyService = inject(CurrencyService);

  public CollectStates(): Schema {
    const schema = new Schema();

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
