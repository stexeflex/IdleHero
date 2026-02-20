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
  StatisticsService
} from '../core/services';
import { Injectable, inject } from '@angular/core';

import { Schema } from './models/schema';

@Injectable({ providedIn: 'root' })
export class StateApplicationService {
  private heroService = inject(PlayerHeroService);
  private levelService = inject(LevelService);
  private attributesService = inject(AttributesService);
  private goldService = inject(GoldService);
  private dungeonKeyService = inject(DungeonKeyService);
  private loadoutService = inject(GearLoadoutService);
  private amuletService = inject(AmuletService);
  private runeService = inject(RuneService);
  private inventoryService = inject(InventoryService);
  private statisticsService = inject(StatisticsService);

  public ApplyState(schema: Schema): void {
    // Hero
    this.heroService.Set(schema.Player.Name, schema.Player.CharacterIcon);

    // Level
    this.levelService.SetLevel(schema.Level.Level, schema.Level.ExperienceInLevel);

    // Attributes
    this.attributesService.SetAllocated(schema.Attributes.Allocated);
    this.attributesService.SetUnallocated(schema.Attributes.Unallocated);

    // Currency
    this.goldService.SetState(schema.Gold);
    this.dungeonKeyService.SetState(schema.DungeonKeys);

    // Loadout & Inventory
    this.loadoutService.SetState(schema.Loadout);
    this.amuletService.SetState(schema.Amulet);
    this.runeService.SetState(schema.RuneInventory);
    this.inventoryService.SetState(schema.Inventory);

    // Statistics
    this.statisticsService.SetState(schema.Statistics);
  }
}
