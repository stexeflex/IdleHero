import {
  AttackEvent,
  CombatEvent,
  CreateAttackEvent,
  CreateDamageEvent,
  CreateDeathEvent,
  CreateMissEvent,
  CreateMultiHitEvent,
  DamageEvent,
  DeathEvent,
  HealEvent,
  MissEvent,
  MultiHitEvent,
  ResetLife
} from '../../../models';
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
  private readonly CombatState: CombatState = inject<CombatState>(CombatState);
  private readonly HeroId = 'hero';

  /**
   * Handles a combat event
   * @param event The combat event to handle
   */
  public HandleEvent(event: CombatEvent): void {
    this.CombatState.Events$.next(event);

    switch (event.Type) {
      case 'Attack':
        this.HandleAttackEvent(event);
        break;

      case 'Miss':
        this.HandleMissEvent(event);
        break;

      case 'Damage':
        this.HandleDamageEvent(event);
        break;

      case 'MultiHit':
        this.HandleMultiHitEvent(event);
        break;

      case 'Heal':
        this.HandleHealEvent(event);
        break;

      case 'Death':
        this.HandleDeathEvent(event);
        break;
    }
  }

  private HandleAttackEvent(event: AttackEvent): void {
    const actor = this.CombatState.Hero();
    const target = this.CombatState.Boss();

    if (!actor || !target) return;

    // 1) Hit-Check mit Accuracy/Evasion
    const { hitChance, isHit } = this.CalculateHit(
      STATS_CONFIG.BASE.BASE_HIT_CHANCE,
      actor.Stats.Accuracy,
      target.Stats.Evasion
    );

    // Miss-Event
    if (!isHit) {
      const missEvent: MissEvent = CreateMissEvent(event.AtMs, this.HeroId, target.Id, hitChance);
      this.CombatState.Queue.Push(missEvent);
    } else {
      // 2) Multi-Hit Chain berechnen
      const totalHits: number = this.RollMultiHitChain(
        actor.Stats.MultiHitChance,
        actor.Stats.MultiHitChainFactor,
        STATS_CONFIG.CAPS.MAX_CHAIN_HITS
      );

      // 3a) Single Hits
      if (totalHits == 1) {
        const damageResult: DamageResult = this.CalculateDamage(
          actor.Stats.Damage,
          actor.Stats.CriticalHitChance,
          actor.Stats.CriticalHitDamage
        );
        const damageEvent: DamageEvent = CreateDamageEvent(
          event.AtMs,
          this.HeroId,
          target.Id,
          damageResult.Amount,
          damageResult.IsCritical
        );

        this.CombatState.Queue.Push(damageEvent);
      }
      // 3b) Multi-Hits
      else {
        const damageResult: DamageResult = this.CalculateDamage(
          actor.Stats.Damage,
          actor.Stats.CriticalHitChance,
          actor.Stats.CriticalHitDamage
        );
        const multiHitEvent: MultiHitEvent = CreateMultiHitEvent(
          event.AtMs,
          this.HeroId,
          target.Id,
          1,
          totalHits,
          damageResult.Amount,
          damageResult.IsCritical
        );

        this.CombatState.Queue.Push(multiHitEvent);
      }
    }

    // 4) Nächsten Angriff des Actors planen
    actor.AttackInterval.CooldownProgressMs = 0;
    const nextAttackAt = ComputeNextIntervalMs(event.AtMs, actor.AttackInterval);
    const nextAttackEvent: AttackEvent = CreateAttackEvent(nextAttackAt, this.HeroId, target.Id);
    this.CombatState.Queue.Push(nextAttackEvent);
  }

  private HandleMissEvent(event: MissEvent): void {
    // Nur für Log/Animation relevant
  }

  private HandleDamageEvent(event: DamageEvent): void {
    const target = this.CombatState.Boss();

    if (!target) return;

    target.Life = TakeDamage(target.Life, event.Amount);

    if (!target.Life.Alive) {
      const deathEvent: DeathEvent = CreateDeathEvent(event.AtMs, target.Id);
      this.CombatState.Queue.Push(deathEvent);
      this.CombatState.Events$.next(deathEvent);
    }

    this.CombatState.Boss.set(target);
    this.CombatState.PublishState();
  }

  private HandleMultiHitEvent(event: MultiHitEvent): void {
    const target = this.CombatState.Boss();

    if (!target) return;

    target.Life = TakeDamage(target.Life, event.Amount);

    if (!target.Life.Alive) {
      const deathEvent: DeathEvent = CreateDeathEvent(event.AtMs, target.Id);

      this.CombatState.Queue.Push(deathEvent);
      this.CombatState.Events$.next(deathEvent);
    }
    // Nächsten Hit der Chain planen
    else if (event.HitNumber < event.TotalHits) {
      const actor = this.CombatState.Hero();

      if (!actor) return;

      const damageResult: DamageResult = this.CalculateDamage(
        actor.Stats.Damage,
        actor.Stats.CriticalHitChance,
        actor.Stats.CriticalHitDamage
      );

      const nextHitEvent: MultiHitEvent = {
        ...event,
        // gleicher Zeitpunkt; optional +i*0.1ms falls Animationen nacheinander
        AtMs: event.AtMs,
        HitNumber: event.HitNumber + 1,
        Amount: damageResult.Amount,
        IsCritical: damageResult.IsCritical
      };

      this.CombatState.Queue.Push(nextHitEvent);
    }

    this.CombatState.Boss.set(target);
    this.CombatState.PublishState();
  }

  private HandleHealEvent(event: HealEvent): void {
    const target = this.CombatState.Hero();

    if (!target) return;
    if (!target.Life.Alive) return;

    target.Life = HealLife(target.Life, event.Amount);

    this.CombatState.Hero.set(target);
    this.CombatState.PublishState();
  }

  private HandleDeathEvent(event: DeathEvent): void {
    // Wellenwechsel, Loot, XP, etc.

    if (event.ActorId !== this.HeroId) {
      // Heal Hero after defeating Boss
      let hero = this.CombatState.Hero();

      if (!hero) return;
      if (!hero.Life.Alive) return;

      hero = {
        ...hero,
        Life: ResetLife(hero.Life)
      };

      this.CombatState.Hero.set(hero);
      this.CombatState.PublishState();
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

    return { Amount: damage, IsCritical: isCritical };
  }
  //#endregion
}
