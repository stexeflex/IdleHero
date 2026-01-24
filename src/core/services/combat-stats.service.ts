import { BaseStats, CombatStats, ComputedStats, InitialBaseStats } from '../models';
import { Injectable, computed, inject, signal } from '@angular/core';

import { AttributesService } from './attributes.service';
import { ComputeStats } from '../systems/combat';
import { GearLoadoutService } from './gear-loadout.service';

@Injectable({ providedIn: 'root' })
export class CombatStatsService {
  private readonly Attributes = inject<AttributesService>(AttributesService);
  private readonly GearLoadout = inject<GearLoadoutService>(GearLoadoutService);

  private readonly BaseStats = signal<BaseStats>(InitialBaseStats());

  /**
   * The effective combat stats, computed from the current stats
   */
  public readonly Effective = computed<ComputedStats>(() => {
    const baseStats = this.BaseStats();
    const attributes = this.Attributes.Effective();
    const statSources = this.GearLoadout.StatSources();

    // Compute effective combat stats
    return ComputeStats(attributes, baseStats, statSources);
  });

  /**
   * Sets the combat stats
   * @param stats the combat stats to set
   */
  public SetBaseStats(stats: BaseStats): void {
    this.BaseStats.set({ ...stats });
  }

  /**
   * Gets a copy of the current combat stats
   * @returns the current combat stats
   */
  public GetBaseStats(): BaseStats {
    return { ...this.BaseStats() };
  }
}
