import {
  AttackEvent,
  Boss,
  BossStats,
  ChargeEvent,
  ClearEvent,
  CombatEvent,
  CreateAttackEvent,
  CreateChargeEvent,
  CreateClearEvent,
  CreateDamageEvent,
  CreateDamageOverTimeEvent,
  CreateDeathEvent,
  CreateMissEvent,
  CreateStageAdvanceEvent,
  DamageEvent,
  DamageOverTimeEvent,
  DeathEvent,
  HealEvent,
  Hero,
  HeroStats,
  MissEvent,
  StageAdvanceEvent
} from '../../../models';
import { ChanceUtils, ClampUtils } from '../../../../shared/utils';
import { CombatLogService, StatisticsService } from '../../../services';
import { DELAYS, STATS_CONFIG } from '../../../constants';
import { HealLife, TakeDamage } from '../life.utils';
import { Injectable, inject } from '@angular/core';

import { CombatState } from './combat.state';
import { ComputeNextIntervalMs } from '../attack-interval-computing';
import { DamageResult } from './models/damage-result';

/**
 * Event Handler Service
 */
@Injectable({ providedIn: 'root' })
export class EventHandler {
  private readonly CombatState = inject<CombatState>(CombatState);
  private readonly Logger = inject<CombatLogService>(CombatLogService);
  private readonly Statistics = inject<StatisticsService>(StatisticsService);

  private readonly EventDelayMs = 10;

  /**
   * Handles a combat event
   * @param event The combat event to handle
   */
  public async HandleEvent(event: CombatEvent): Promise<void> {
    this.CombatState.Events$.next(event);

    switch (event.Type) {
      case 'Attack':
        this.HandleAttackEvent(event);
        break;

      case 'Miss':
        this.HandleMissEvent(event);
        this.Logger.Miss(event);
        break;

      case 'Damage':
        this.HandleDamageEvent(event);
        this.Logger.Damage(event);
        break;

      case 'DamageOverTime':
        this.HandleDamageOverTimeEvent(event);
        break;

      case 'Charge':
        this.HandleChargeEvent(event);
        break;

      case 'Clear':
        this.HandleClearEvent(event);
        break;

      case 'Heal':
        this.HandleHealEvent(event);
        this.Logger.Heal(event);
        break;

      case 'Death':
        this.Logger.Death(event);
        this.HandleDeathEvent(event);
        break;

      case 'StageAdvance':
        this.HandleStageAdvanceEvent(event);
        break;
    }
  }

  /** ATTACK */
  private HandleAttackEvent(event: AttackEvent): void {
    const actor = event.Actor;
    const target = event.Target;

    if (!actor || !target) return;

    // 1) Hit-Check mit Accuracy/Evasion
    const isHit: boolean = this.CalculateHit(
      (actor.Stats as HeroStats).Accuracy,
      (target.Stats as BossStats).Evasion
    );

    // Miss-Event
    if (!isHit) {
      const missEvent: MissEvent = CreateMissEvent(event.AtMs + this.EventDelayMs, actor, target);
      this.CombatState.Queue.Push(missEvent);
    }
    // Hit-Event
    else {
      const hero = event.Actor as Hero;

      if (hero) {
        this.HandleHeroHitEvent(hero, event);
      }
    }

    // Nächsten Angriff des Actors planen
    actor.AttackInterval.CooldownProgressMs = 0;
    const nextAttackAt = ComputeNextIntervalMs(event.AtMs, actor.AttackInterval);
    const nextAttackEvent: AttackEvent = CreateAttackEvent(nextAttackAt, actor, target);

    this.CombatState.Queue.Push(nextAttackEvent);
  }

  /** CALCULATE HITS & DAMAGE */
  private HandleHeroHitEvent(hero: Hero, event: AttackEvent): void {
    const actor = hero;
    const target = event.Target;
    const damages: DamageResult[] = [];

    // Multi-Hit Chain berechnen
    const totalHits: number = this.RollMultiHitChain(
      actor.Stats.MultiHitChance,
      actor.Stats.MultiHitChainFactor,
      STATS_CONFIG.CAPS.MAX_CHAIN_HITS
    );

    // Single Hits
    if (totalHits === 1) {
      const damageResult: DamageResult = this.CalculateHeroDamage(actor, false);
      damages.push(damageResult);
    }
    // Multi-Hits
    else if (totalHits > 1) {
      // First default Hit
      const damageResult: DamageResult = this.CalculateHeroDamage(actor, false);
      damages.push(damageResult);

      // Additional Hits with Multi-Hit Bonus
      for (let hitNumber = 1; hitNumber < totalHits; hitNumber++) {
        const damageResult: DamageResult = this.CalculateHeroDamage(actor, true);
        damages.push(damageResult);
      }
    }

    // Bleeding
    if (this.TargetIsBleeding(target as Boss)) {
      const bleedDamage: DamageResult = this.CalculateBleedDamage(actor, damages);
      damages.push(bleedDamage);

      const nextTick = this.NextBleedingTick(target as Boss);

      const damageOverTimeEvent: DamageOverTimeEvent = CreateDamageOverTimeEvent(
        event.AtMs + this.EventDelayMs,
        'Bleed',
        target,
        nextTick,
        STATS_CONFIG.BASE.BLEEDING_TICKS
      );
      this.CombatState.Queue.Push(damageOverTimeEvent);
    } else if (this.TargetIsNotBleeding(target as Boss)) {
      const createdBleeding: boolean = this.CalculateBleedHit(actor);

      if (createdBleeding) {
        const damageOverTimeEvent: DamageOverTimeEvent = CreateDamageOverTimeEvent(
          event.AtMs + this.EventDelayMs,
          'Bleed',
          target,
          0,
          STATS_CONFIG.BASE.BLEEDING_TICKS
        );

        this.CombatState.Queue.Push(damageOverTimeEvent);
      }
    }

    // Damage Event
    const damageEvent: DamageEvent = CreateDamageEvent(
      event.AtMs + this.EventDelayMs,
      actor,
      target,
      damages
    );
    this.CombatState.Queue.Push(damageEvent);

    // Charge Event
    if (!hero.Charge.Charged) {
      const chargeEvent = CreateChargeEvent(
        event.AtMs + this.EventDelayMs,
        hero,
        hero.Stats.ChargeGain
      );
      this.CombatState.Queue.Push(chargeEvent);
    }
  }

  /** MISSED HIT */
  private HandleMissEvent(event: MissEvent): void {
    if (this.TargetIsBleeding(event.Target as Boss)) {
      const nextTick = this.NextBleedingTick(event.Target as Boss);

      const damageOverTimeEvent: DamageOverTimeEvent = CreateDamageOverTimeEvent(
        event.AtMs + this.EventDelayMs,
        'Bleed',
        event.Target,
        nextTick,
        STATS_CONFIG.BASE.BLEEDING_TICKS
      );
      this.CombatState.Queue.Push(damageOverTimeEvent);
    }
  }

  /** DEAL DAMAGE */
  private HandleDamageEvent(event: DamageEvent): void {
    const target = event.Target;

    if (!target) return;
    if (!target.Life.Alive) return;

    this.UpdateDamageStatistics(event.Damage);

    for (const dmg of event.Damage) {
      target.Life = TakeDamage(target.Life, dmg.Amount);

      if (!target.Life.Alive) {
        const deathEvent: DeathEvent = CreateDeathEvent(event.AtMs, target);
        this.CombatState.Queue.Push(deathEvent);
        break;
      }
    }

    this.CombatState.PublishState();
  }

  /** DAMAGE OVER TIME */
  private HandleDamageOverTimeEvent(event: DamageOverTimeEvent): void {
    const target = event.Target;

    if (!target) return;
    if (!target.Life.Alive) return;

    this.SetBleeding(target as Boss, event.Tick);

    // Clear Bleeding after last Tick
    if (event.Tick === event.TotalTicks) {
      const clearDotEvent = CreateClearEvent(
        event.AtMs + DELAYS.BLEEDING_CLEAR_MS,
        target,
        'Bleed'
      );
      this.CombatState.Queue.Push(clearDotEvent);
    }

    this.CombatState.PublishState();
  }

  /** CHARGED */
  private HandleChargeEvent(event: ChargeEvent): void {
    const actor = event.Actor as Hero;

    if (!actor) return;
    if (!actor.Life.Alive) return;

    actor.Charge.Current = ClampUtils.clamp(
      actor.Charge.Current + event.Amount,
      0,
      actor.Charge.Max
    );

    // Max Charge
    if (actor.Charge.Current >= actor.Charge.Max) {
      actor.Charge.Charged = true;

      const factor = 4;
      const ticks = actor.Stats.ChargeDuration * factor;
      const chargeDecreasePerSecond = actor.Charge.Max / actor.Stats.ChargeDuration;

      for (let i = 1; i <= ticks; i++) {
        const clearChargeEvent = CreateChargeEvent(
          event.AtMs + (i * 1000) / factor,
          actor,
          Math.floor(-chargeDecreasePerSecond / factor)
        );
        this.CombatState.Queue.Push(clearChargeEvent);
      }
    }
    // Clear Charge
    else if (actor.Charge.Current === 0) {
      const clearEvent = CreateClearEvent(event.AtMs + 1000, actor, 'Charge');
      this.CombatState.Queue.Push(clearEvent);
    }

    this.CombatState.PublishState();
  }

  /** STATE CLEARANCE */
  private HandleClearEvent(event: ClearEvent): void {
    switch (event.ClearingType) {
      case 'Charge': {
        const target = event.Target as Hero;

        if (!target) return;
        if (!target.Charge.Charged) return;

        target.Charge.Current = 0;
        target.Charge.Charged = false;
        break;
      }
      case 'Bleed': {
        const target = event.Target as Boss;

        if (!target) return;
        if (!target.State.IsBleeding) return;

        target.State.IsBleeding = false;
        target.State.BleedingState = null;
        break;
      }
    }

    this.CombatState.PublishState();
  }

  /** HEALING */
  private HandleHealEvent(event: HealEvent): void {
    const target = event.Target;

    if (!target) return;
    if (!target.Life.Alive) return;

    target.Life = HealLife(target.Life, event.Amount);

    this.CombatState.PublishState();
  }

  /** BOSS DEATH */
  private HandleDeathEvent(event: DeathEvent): void {
    // Boss besiegt
    if (!!(event.Actor as Boss)) {
      this.CombatState.PrepareStageAdvance();
      const stageAdvanceEvent = CreateStageAdvanceEvent(
        event.AtMs + DELAYS.BOSS_RESPAWN_ANIMATION_MS
      );
      this.CombatState.Queue.Push(stageAdvanceEvent);
    }
  }

  /** STAGE ADVANCE */
  private HandleStageAdvanceEvent(event: StageAdvanceEvent): void {
    this.CombatState.AdvanceToNextBoss();
  }

  //#region Helpers
  private CalculateHit(
    actorAccuracy: number | undefined,
    targetEvasion: number | undefined
  ): boolean {
    // const hitChance = ClampUtils.clamp01(
    //   baseHitChance + (actorAccuracy ?? 0) - (targetEvasion ?? 0)
    // );
    // const isHit = ChanceUtils.success(hitChance);
    // return { hitChance, isHit };

    const isHit = ChanceUtils.success(actorAccuracy ?? 0);
    return isHit;
  }

  private RollMultiHitChain(chance: number, chainFactor: number, maxChainHits: number): number {
    let hits = 1; // der erste Hit ist der Basis-Treffer
    let currentChance = chance; // Chance für einen weiteren Hit

    for (let i = 0; i < maxChainHits - 1; i++) {
      const isHit = ChanceUtils.success(currentChance);

      if (isHit) {
        hits++;
        currentChance *= chainFactor; // abnehmende Chance
      } else {
        break;
      }
    }

    return hits;
  }

  private CalculateDamage(damage: number, chc: number, chd: number): DamageResult {
    const isCritical = ChanceUtils.success(chc ?? 0);

    if (isCritical) {
      damage = Math.round(damage * (chd ?? 1));
    }

    return { Amount: damage, IsCharged: false, IsCritical: isCritical, IsBleeding: false };
  }

  private CalculateBleedHit(hero: Hero): boolean {
    const isBleedHit = ChanceUtils.success(hero.Stats.BleedingChance ?? 0);
    return isBleedHit;
  }

  private TargetIsBleeding(target: Boss): boolean {
    return (
      target.State.IsBleeding &&
      (target.State.BleedingState?.Tick || 0) < (target.State.BleedingState?.TotalTicks || 0)
    );
  }

  private TargetIsNotBleeding(target: Boss): boolean {
    return !target.State.IsBleeding;
  }

  private SetBleeding(boss: Boss, tick: number): void {
    boss.State.IsBleeding = true;
    boss.State.BleedingState = {
      Tick: tick,
      TotalTicks: STATS_CONFIG.BASE.BLEEDING_TICKS
    };
  }

  private NextBleedingTick(target: Boss): number {
    return (target.State.BleedingState?.Tick || 0) + 1;
  }

  private CalculateBleedDamage(hero: Hero, currentDamages: DamageResult[]): DamageResult {
    const sum = currentDamages.reduce((acc, dmg) => acc + dmg.Amount, 0);
    const damage = Math.max(Math.round(sum * (hero.Stats.BleedingDamage ?? 0)), 1);
    return { Amount: damage, IsCharged: false, IsCritical: false, IsBleeding: true };
  }

  private CalculateHeroDamage(hero: Hero, multiHit: boolean): DamageResult {
    const actor = hero;
    const damageResult: DamageResult = this.CalculateDamage(
      actor.Stats.Damage,
      actor.Stats.CriticalHitChance,
      actor.Stats.CriticalHitDamage
    );

    if (multiHit) {
      damageResult.Amount = Math.round(damageResult.Amount * hero.Stats.MultiHitDamage);
    }

    if (hero.Charge.Charged) {
      damageResult.Amount = Math.round(damageResult.Amount * hero.Stats.ChargeDamage);
      damageResult.IsCharged = true;
    }

    return damageResult;
  }

  private UpdateDamageStatistics(damage: DamageResult[]): void {
    const totalDamage = damage.reduce((sum, d) => sum + d.Amount, 0);
    const damageWithoutBleed = damage.filter((d) => !d.IsBleeding);
    const totalDamageWithoutBleed = damageWithoutBleed.reduce((sum, d) => sum + d.Amount, 0);
    const bleedingDamage = damage.filter((d) => d.IsBleeding);

    // Single Hit Statistics
    if (damageWithoutBleed.length === 1) {
      if (damageWithoutBleed[0].IsCharged && damageWithoutBleed[0].IsCritical) {
        this.Statistics.UpdateDamage({ HighestChargedCriticalHit: totalDamageWithoutBleed });
        this.Statistics.UpdateDamage({ HighestChargedTotalHit: totalDamage });
      } else if (damageWithoutBleed[0].IsCharged) {
        this.Statistics.UpdateDamage({ HighestChargedHit: totalDamageWithoutBleed });
        this.Statistics.UpdateDamage({ HighestChargedTotalHit: totalDamage });
      } else if (damageWithoutBleed[0].IsCritical) {
        this.Statistics.UpdateDamage({ HighestCriticalHit: totalDamageWithoutBleed });
        this.Statistics.UpdateDamage({ HighestTotalHit: totalDamage });
      } else {
        this.Statistics.UpdateDamage({ HighestSingleHit: totalDamageWithoutBleed });
        this.Statistics.UpdateDamage({ HighestTotalHit: totalDamage });
      }
    }
    // Multi-Hit Statistics
    else {
      this.Statistics.UpdateDamage({ HighestMultiHitChain: damageWithoutBleed.length });

      if (damageWithoutBleed.some((d) => d.IsCharged && d.IsCritical)) {
        this.Statistics.UpdateDamage({ HighestChargedCriticalMultiHit: totalDamageWithoutBleed });
        this.Statistics.UpdateDamage({ HighestChargedTotalHit: totalDamage });
      } else if (damageWithoutBleed.some((d) => d.IsCharged)) {
        this.Statistics.UpdateDamage({ HighestChargedMultiHit: totalDamageWithoutBleed });
        this.Statistics.UpdateDamage({ HighestChargedTotalHit: totalDamage });
      } else if (damageWithoutBleed.some((d) => d.IsCritical)) {
        this.Statistics.UpdateDamage({ HighestCriticalMultiHit: totalDamageWithoutBleed });
        this.Statistics.UpdateDamage({ HighestTotalHit: totalDamage });
      } else {
        this.Statistics.UpdateDamage({ HighestMultiHit: totalDamageWithoutBleed });
        this.Statistics.UpdateDamage({ HighestTotalHit: totalDamage });
      }
    }

    // Bleeding Tick Statistics
    const bleedingDamageAmount = bleedingDamage.reduce((sum, d) => sum + d.Amount, 0);

    if (damageWithoutBleed.some((d) => d.IsCharged)) {
      this.Statistics.UpdateDamage({ HighestChargedBleedingTick: bleedingDamageAmount });
    } else {
      this.Statistics.UpdateDamage({ HighestBleedingTick: bleedingDamageAmount });
    }
  }
  //#endregion
}
