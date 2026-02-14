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
  DamageEvent,
  DamageOverTimeEvent,
  DeathEvent,
  HealEvent,
  Hero,
  HeroStats,
  MissEvent
} from '../../../models';
import { CombatLogService, StatisticsService } from '../../../services';
import { HealLife, TakeDamage } from '../life.utils';
import { Injectable, inject } from '@angular/core';

import { ClampUtils } from '../../../../shared/utils';
import { CombatState } from './combat.state';
import { ComputeNextIntervalMs } from '../attack-interval-computing';
import { DamageResult } from './models/damage-result';
import { STATS_CONFIG } from '../../../constants';

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
        this.Logger.DoT(event);
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
        await this.HandleDeathEvent(event);
        break;
    }
  }

  private HandleAttackEvent(event: AttackEvent): void {
    const actor = event.Actor;
    const target = event.Target;

    if (!actor || !target) return;

    // 1) Hit-Check mit Accuracy/Evasion
    const { hitChance, isHit } = this.CalculateHit(
      STATS_CONFIG.BASE.HIT_CHANCE,
      (actor.Stats as HeroStats).Accuracy,
      (target.Stats as BossStats).Evasion
    );

    // Miss-Event
    if (!isHit) {
      const missEvent: MissEvent = CreateMissEvent(
        event.AtMs + this.EventDelayMs,
        actor,
        target,
        hitChance
      );
      this.CombatState.Queue.Push(missEvent);
    }
    // Hit-Event
    else {
      const hero = event.Actor as Hero;

      if (hero) {
        this.HandleHeroHitEvent(hero, event);
      }

      // const boss = event.Actor as Boss;
      // if (boss) {
      //   this.HandleBossHitEvent(boss, event);
      // }
    }

    // Nächsten Angriff des Actors planen
    actor.AttackInterval.CooldownProgressMs = 0;
    const nextAttackAt = ComputeNextIntervalMs(event.AtMs, actor.AttackInterval);
    const nextAttackEvent: AttackEvent = CreateAttackEvent(nextAttackAt, actor, target);

    this.CombatState.Queue.Push(nextAttackEvent);
  }

  private HandleHeroHitEvent(hero: Hero, event: AttackEvent): void {
    const actor = hero;
    const target = event.Target;
    const damages: DamageResult[] = [];
    let bleedDamage: DamageResult | undefined = undefined;

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

      // Bleed Hit
      bleedDamage = this.CreateBleedDamage(actor);
    }
    // Multi-Hits
    else if (totalHits > 1) {
      // First default Hit
      const damageResult: DamageResult = this.CalculateHeroDamage(actor, false);
      damages.push(damageResult);

      // Bleed Hit
      bleedDamage = this.CreateBleedDamage(actor);

      // Additional Hits with Multi-Hit Bonus
      for (let hitNumber = 1; hitNumber < totalHits; hitNumber++) {
        const damageResult: DamageResult = this.CalculateHeroDamage(actor, true);
        damages.push(damageResult);

        // Bleed Hit
        if (bleedDamage === undefined) {
          bleedDamage = this.CreateBleedDamage(actor);
        }
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

    // Bleed Event
    if (bleedDamage) {
      const damageOverTimeEvent: DamageOverTimeEvent = CreateDamageOverTimeEvent(
        event.AtMs + STATS_CONFIG.BASE.BLEEDING_TICK_INTERVAL_MS,
        'Bleed',
        target,
        bleedDamage,
        1,
        STATS_CONFIG.BASE.BLEEDING_TICKS
      );

      this.SetBleeding(target as Boss, 0);
      this.CombatState.Queue.Push(damageOverTimeEvent);
      this.CombatState.PublishState();
    }

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

  private HandleMissEvent(event: MissEvent): void {
    // Nur für Log/Animation relevant
  }

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

  private HandleDamageOverTimeEvent(event: DamageOverTimeEvent): void {
    const target = event.Target;

    if (!target) return;
    if (!target.Life.Alive) return;

    this.Statistics.UpdateDamage({ HighestBleedingTick: event.Damage.Amount });
    this.SetBleeding(target as Boss, event.Tick);
    target.Life = TakeDamage(target.Life, event.Damage.Amount);

    if (!target.Life.Alive) {
      const deathEvent: DeathEvent = CreateDeathEvent(event.AtMs, target);
      this.CombatState.Queue.Push(deathEvent);
    }
    // Next DoT Tick
    else if (event.Tick < event.TotalTicks) {
      const nextDot = CreateDamageOverTimeEvent(
        event.AtMs + STATS_CONFIG.BASE.BLEEDING_TICK_INTERVAL_MS,
        event.DotType,
        target,
        event.Damage,
        event.Tick + 1,
        event.TotalTicks
      );

      this.CombatState.Queue.Push(nextDot);
    } else {
      const clearDotEvent = CreateClearEvent(
        event.AtMs + STATS_CONFIG.BASE.BLEEDING_TICK_INTERVAL_MS,
        target,
        'Bleed'
      );
      this.CombatState.Queue.Push(clearDotEvent);
    }

    this.CombatState.PublishState();
  }

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

      const factor = 2;
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

  private HandleHealEvent(event: HealEvent): void {
    const target = event.Target;

    if (!target) return;
    if (!target.Life.Alive) return;

    target.Life = HealLife(target.Life, event.Amount);

    this.CombatState.PublishState();
  }

  private async HandleDeathEvent(event: DeathEvent): Promise<void> {
    // Boss besiegt
    if (!!(event.Actor as Boss)) {
      // Heal Hero after defeating Boss
      // let hero = this.CombatState.Hero();
      // if (!hero) return;
      // if (!hero.Life.Alive) return;
      // hero = {
      //   ...hero,
      //   Life: ResetLife(hero.Life)
      // };
      // this.CombatState.Hero.set(hero);

      await this.CombatState.AdvanceToNextBoss();
    }
    // Hero besiegt
    else if (!!(event.Actor as Hero)) {
      // Combat beenden
      // this.CombatState.InProgress.set(false);
    }
  }

  //#region Helpers
  private CalculateHit(
    baseHitChance: number,
    actorAccuracy: number | undefined,
    targetEvasion: number | undefined
  ): { hitChance: number; isHit: boolean } {
    const hitChance = ClampUtils.clamp01(
      baseHitChance + (actorAccuracy ?? 0) - (targetEvasion ?? 0)
    );
    const isHit = Math.random() < hitChance;
    return { hitChance, isHit };
  }

  private RollMultiHitChain(chance: number, chainFactor: number, maxChainHits: number): number {
    let hits = 1; // der erste Hit ist der Basis-Treffer
    let currentChance = chance; // Chance für einen weiteren Hit

    for (let i = 0; i < maxChainHits - 1; i++) {
      if (Math.random() < currentChance) {
        hits++;
        currentChance *= chainFactor; // abnehmende Chance
      } else {
        break;
      }
    }

    return hits;
  }

  private CalculateDamage(damage: number, chc: number, chd: number): DamageResult {
    const isCritical = Math.random() < (chc ?? 0);

    if (isCritical) {
      damage = Math.round(damage * (chd ?? 1));
    }

    return { Amount: damage, IsCharged: false, IsCritical: isCritical, IsBleeding: false };
  }

  private CalculateBleedHit(hero: Hero): DamageResult {
    const isBleedHit = Math.random() < (hero.Stats.BleedingChance ?? 0);
    const damage = isBleedHit
      ? Math.max(Math.round(hero.Stats.Damage * (hero.Stats.BleedingDamage ?? 0)), 1)
      : 0;

    return { Amount: damage, IsCharged: false, IsCritical: false, IsBleeding: isBleedHit };
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

  private CreateBleedDamage(hero: Hero): DamageResult | undefined {
    const boss = this.CombatState.Boss();
    if (!boss) return undefined;
    if (boss.State.IsBleeding) return undefined;

    const isBleedHitResult: DamageResult = this.CalculateBleedHit(hero);
    if (!isBleedHitResult.IsBleeding) return undefined;

    return isBleedHitResult;
  }

  private SetBleeding(boss: Boss, tick: number): void {
    boss.State.IsBleeding = true;
    boss.State.BleedingState = {
      Tick: tick,
      TotalTicks: STATS_CONFIG.BASE.BLEEDING_TICKS
    };
  }

  private UpdateDamageStatistics(damage: DamageResult[]): void {
    // Single Hit Statistics
    if (damage.length === 1) {
      if (damage[0].IsCharged) {
        this.Statistics.UpdateDamage({ HighestChargedHit: damage[0].Amount });
        this.Statistics.UpdateDamage({ HighestChargedTotalHit: damage[0].Amount });
      } else if (damage[0].IsCritical) {
        this.Statistics.UpdateDamage({ HighestCriticalHit: damage[0].Amount });
        this.Statistics.UpdateDamage({ HighestTotalHit: damage[0].Amount });
      } else {
        this.Statistics.UpdateDamage({ HighestSingleHit: damage[0].Amount });
        this.Statistics.UpdateDamage({ HighestTotalHit: damage[0].Amount });
      }
    }
    // Multi-Hit Statistics
    else {
      const totalDamage = damage.reduce((sum, d) => sum + d.Amount, 0);

      // Charged
      if (damage.some((d) => d.IsCharged)) {
        const highestChargedHit = damage
          .filter((d) => d.IsCharged && !d.IsCritical)
          .reduce((max, d) => (d.Amount > max ? d.Amount : max), 0);
        this.Statistics.UpdateDamage({ HighestChargedMultiHit: highestChargedHit });

        const highestChargedCriticalHit = damage
          .filter((d) => d.IsCharged && d.IsCritical)
          .reduce((max, d) => (d.Amount > max ? d.Amount : max), 0);
        this.Statistics.UpdateDamage({ HighestChargedCriticalMultiHit: highestChargedCriticalHit });

        this.Statistics.UpdateDamage({ HighestChargedTotalHit: totalDamage });
      }
      // Default
      else {
        const highestMultiHit = damage
          .filter((d) => !d.IsCritical)
          .reduce((max, d) => (d.Amount > max ? d.Amount : max), 0);
        this.Statistics.UpdateDamage({ HighestMultiHit: highestMultiHit });

        const highestCriticalMultiHit = damage
          .filter((d) => d.IsCritical)
          .reduce((max, d) => (d.Amount > max ? d.Amount : max), 0);
        this.Statistics.UpdateDamage({ HighestCriticalMultiHit: highestCriticalMultiHit });

        this.Statistics.UpdateDamage({ HighestTotalHit: totalDamage });
      }

      const totalHits = damage.length;
      this.Statistics.UpdateDamage({ HighestMultiHitChain: totalHits });
    }
  }
  //#endregion
}
