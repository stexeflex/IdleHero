import {
  AttributesService,
  DungeonKeyService,
  GearLoadoutService,
  GoldService,
  InventoryService,
  LevelService,
  PlayerHeroService,
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
  private inventoryService = inject(InventoryService);
  private statisticsService = inject(StatisticsService);

  public ApplyState(schema: Schema): void {
    // Hero
    this.heroService.Set(schema.Player.Name, schema.Player.CharacterIcon);

    // Level
    this.levelService.SetState(schema.Level);

    // Attributes
    this.attributesService.SetAllocated(schema.Attributes);

    // Currency
    this.goldService.SetState(schema.Gold);
    this.dungeonKeyService.SetState(schema.DungeonKeys);

    // Loadout & Inventory
    this.loadoutService.SetState(schema.Loadout);
    this.inventoryService.SetState(schema.Inventory);

    // Statistics
    this.statisticsService.UpdateDungeon(schema.Statistics.Dungeon);
    this.statisticsService.UpdateDamage(schema.Statistics.Damage);
  }
}
