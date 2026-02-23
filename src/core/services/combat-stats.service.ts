import { Attributes, ComputedHeroStats, HeroStats, InitialHeroStats, StatSource } from '../models';
import { ComputeAttributes, ComputeStats } from '../systems/stats';
import { Injectable, computed, inject, signal } from '@angular/core';

import { AmuletService } from './amulet.service';
import { AttributesService } from './attributes.service';
import { CombatSkillsService } from './combat-skills.service';
import { GearLoadoutService } from './gear-loadout.service';
import { SkillsService } from './skills.service';

@Injectable({ providedIn: 'root' })
export class CombatStatsService {
  private readonly AttributesService = inject<AttributesService>(AttributesService);
  private readonly GearLoadout = inject<GearLoadoutService>(GearLoadoutService);
  private readonly AmuletRunes = inject<AmuletService>(AmuletService);
  private readonly Skills = inject<SkillsService>(SkillsService);
  private readonly CombatSkills = inject<CombatSkillsService>(CombatSkillsService);

  private readonly BaseStats = signal<HeroStats>(InitialHeroStats());

  /**
   * The effective attributes, computed from base attributes, allocated points and gear bonuses.
   */
  public readonly EffectiveAttributes = computed<Attributes>(() => {
    const attributes = this.AttributesService.Effective();
    const itemSources = this.GearLoadout.StatSources();

    const statSources: StatSource[] = [...itemSources];

    // Compute effective attributes
    return ComputeAttributes(attributes, statSources);
  });

  /**
   * The effective combat stats, computed from the current stats
   */
  public readonly Effective = computed<ComputedHeroStats>(() => {
    const baseStats = this.BaseStats();
    const attributes = this.EffectiveAttributes();
    const itemSources = this.GearLoadout.StatSources();
    const amuletRunes = this.AmuletRunes.StatSources();
    const skillSources = this.Skills.StatSources();
    const temporarySkillSources = this.CombatSkills.ActiveStatSources();

    const statSources: StatSource[] = [
      ...itemSources,
      ...amuletRunes,
      ...skillSources,
      ...temporarySkillSources
    ];

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
    const damagePerHit = this.DamagePerHit();

    /*
     * Damage Per Second (DPS):
     * damagePerSecond = damagePerHit * AttackSpeed
     */
    return Math.round(damagePerHit * stats.AttackSpeed);
  });

  /**
   * The Damage Per Hit (DPH) value based on effective stats
   */
  public readonly DamagePerHit = computed<number>(() => {
    const stats = this.Effective();
    const criticalMultiHitEnabled = this.Skills.Passives().CriticalMultiHit;

    /**
     * Deterministic Damage per Hit Calculation:
     *
     * rawDamagePerAttack         = firstHitDamage + additionalMultiHitDamage
     *
     * - firstHitDamage           => Damage * (1 + CriticalHitChance * (CriticalHitDamage - 1))
     * - additionalMultiHitDamage => Damage * MultiHitDamage * additionalHits * multiHitCritMultiplier
     * - additionalHits           => Sum of probabilities for each additional chain hit
     * - multiHitCritMultiplier   => (1 + CriticalHitChance * (CriticalHitDamage - 1)) when
     *                               CriticalMultiHit passive is enabled, otherwise 1
     *
     * Bleeding is modeled as an uptime-based value:
     *
     * bleedDamagePerAttack       = rawDamagePerAttack * BleedingDamage * bleedUptime
     * - bleedUptime              => (BleedingChance * BleedingTicks) / (1 + BleedingChance * BleedingTicks)
     *
     * Damage per Hit (DPH):
     * damagePerAttack            = rawDamagePerAttack + bleedDamagePerAttack
     */
    const rawDamagePerAttack = this.CalculateExpectedRawDamagePerAttack(
      stats,
      criticalMultiHitEnabled
    );
    const bleedUptime = this.CalculateBleedUptime(stats.BleedingChance, stats.BleedingTicks);
    const bleedDamagePerAttack = rawDamagePerAttack * stats.BleedingDamage * bleedUptime;

    const damagePerAttack = rawDamagePerAttack + bleedDamagePerAttack;
    return Math.round(damagePerAttack);
  });

  private CalculateExpectedRawDamagePerAttack(
    stats: ComputedHeroStats,
    criticalMultiHitEnabled: boolean
  ): number {
    const critMultiplier = 1 + stats.CriticalHitChance * (stats.CriticalHitDamage - 1);
    const firstHitDamage = stats.Damage * critMultiplier;

    const additionalHits = this.CalculateExpectedAdditionalMultiHits(
      stats.MultiHitChance,
      stats.MultiHitChainFactor,
      stats.MultiHitChain
    );

    const multiHitCritMultiplier = criticalMultiHitEnabled ? critMultiplier : 1;
    const additionalMultiHitDamage =
      stats.Damage * stats.MultiHitDamage * additionalHits * multiHitCritMultiplier;
    return firstHitDamage + additionalMultiHitDamage;
  }

  private CalculateExpectedAdditionalMultiHits(
    multiHitChance: number,
    multiHitChainFactor: number,
    multiHitChain: number
  ): number {
    const maxAdditionalHits = Math.max(0, Math.ceil(multiHitChain) - 1);

    let additionalHits = 0;
    let currentChance = multiHitChance; // Chance für einen weiteren Hit
    let probability = 1; // Wahrscheinlichkeit, genau diesen Hit zu erreichen

    for (let rollIndex = 0; rollIndex < maxAdditionalHits; rollIndex++) {
      probability = currentChance * probability;
      additionalHits += probability;
      currentChance *= multiHitChainFactor;
    }

    console.log(`Expected Additional Hits: ${additionalHits.toFixed(2)}`);

    return additionalHits;
  }

  private CalculateBleedUptime(bleedingChance: number, bleedingTicks: number): number {
    const expectedCycleBleedingAttacks = bleedingChance * bleedingTicks;
    return expectedCycleBleedingAttacks / (1 + expectedCycleBleedingAttacks);
  }

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
