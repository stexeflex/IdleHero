import {
  AmuletService,
  AttributesService,
  DungeonKeyService,
  GearLoadoutService,
  GoldService,
  InventoryService,
  LevelService,
  PlayerHeroService,
  RuneService,
  SkillsService,
  StatisticsService
} from '../core/services';
import { InitialSchema, Schema } from './models/schema';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StateCollectionService {
  private heroService = inject(PlayerHeroService);
  private levelService = inject(LevelService);
  private attributesService = inject(AttributesService);
  private goldService = inject(GoldService);
  private dungeonKeyService = inject(DungeonKeyService);
  private loadoutService = inject(GearLoadoutService);
  private amuletService = inject(AmuletService);
  private runeService = inject(RuneService);
  private inventoryService = inject(InventoryService);
  private skillsService = inject(SkillsService);
  private statisticsService = inject(StatisticsService);

  public CollectStates(): Schema {
    const schema: Schema = InitialSchema();

    // Hero
    schema.Player = this.heroService.Get();

    // Level
    schema.Level = this.levelService.GetState();

    // Attributes
    schema.Attributes.Allocated = this.attributesService.GetAllocated();
    schema.Attributes.Unallocated = this.attributesService.UnallocatedPoints();

    // Currency
    schema.Gold = this.goldService.GetState();
    schema.DungeonKeys = this.dungeonKeyService.GetState();

    // Loadout & Inventory
    schema.Loadout = this.loadoutService.GetState();
    schema.Amulet = this.amuletService.GetState();
    schema.RuneInventory = this.runeService.GetState();
    schema.Inventory = this.inventoryService.GetState();

    // Skills
    schema.Skills = this.skillsService.GetState();

    // Statistics
    schema.Statistics.Dungeon = this.statisticsService.DungeonStatistics();
    schema.Statistics.Damage = this.statisticsService.DamageStatistics();

    return schema;
  }
}
