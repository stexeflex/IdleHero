import { Attributes, ComputedHeroStats, HeroStats, InitialHeroStats } from '../models';
import { ComputeAttributes, ComputeStats } from '../systems/combat';
import { Injectable, computed, inject, signal } from '@angular/core';

import { AttributesService } from './attributes.service';
import { GearLoadoutService } from './gear-loadout.service';

@Injectable({ providedIn: 'root' })
export class CombatStatsService {
  private readonly AttributesService = inject<AttributesService>(AttributesService);
  private readonly GearLoadout = inject<GearLoadoutService>(GearLoadoutService);

  private readonly BaseStats = signal<HeroStats>(InitialHeroStats());

  /**
   * The effective attributes, computed from base attributes, allocated points and gear bonuses.
   */
  public readonly EffectiveAttributes = computed<Attributes>(() => {
    const attributes = this.AttributesService.Effective();
    const statSources = this.GearLoadout.StatSources();

    // Compute effective attributes
    return ComputeAttributes(attributes, statSources);
  });

  /**
   * The effective combat stats, computed from the current stats
   */
  public readonly Effective = computed<ComputedHeroStats>(() => {
    const baseStats = this.BaseStats();
    const attributes = this.EffectiveAttributes();
    const statSources = this.GearLoadout.StatSources();

    // Compute effective combat stats
    return ComputeStats(attributes, baseStats, statSources);
  });

  /**
   * The Attack Power value based on effective stats
   */
  public readonly AttackPower = computed<number>(() => {
    const stats = this.Effective();
    return stats.Damage;
  });

  /**
   * The Damage Per Second (DPS) value based on effective stats
   */
  public readonly DamagePerSecond = computed<number>(() => {
    const stats = this.Effective();
    return Math.round(stats.Damage * stats.AttackSpeed);
  });

  /**
   * Sets the combat stats
   * @param stats the combat stats to set
   */
  public SetBaseStats(stats: HeroStats): void {
    this.BaseStats.set({ ...stats });
  }

  /**
   * Gets a copy of the current combat stats
   * @returns the current combat stats
   */
  public GetBaseStats(): HeroStats {
    return { ...this.BaseStats() };
  }
}
