import {
  AttackEvent,
  Boss,
  BossStats,
  CombatEvent,
  CreateAttackEvent,
  CreateDamageEvent,
  CreateDeathEvent,
  CreateMissEvent,
  DamageEvent,
  DeathEvent,
  HealEvent,
  Hero,
  HeroStats,
  MissEvent,
  ResetLife
} from '../../../models';
import { HealLife, TakeDamage } from '../life.utils';
import { Injectable, inject } from '@angular/core';

import { ClampUtils } from '../../../../shared/utils';
import { CombatLogService } from '../../../services';
import { CombatState } from './combat.state';
import { ComputeNextIntervalMs } from '../attack-interval-computing';
import { DELAYS } from '../../../../shared/constants';
import { DamageResult } from './models/damage-result';
import { STATS_CONFIG } from '../../../constants';

/**
 * Event Handler Service
 */
@Injectable({ providedIn: 'root' })
export class EventHandler {
  private readonly CombatState: CombatState = inject<CombatState>(CombatState);
  private readonly Logger: CombatLogService = inject<CombatLogService>(CombatLogService);

  private readonly DelayMs = 10;

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
        event.AtMs + this.DelayMs,
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

      const boss = event.Actor as Boss;

      if (boss) {
        // HandleBossHitEvent(boss, event);
      }
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

    // Multi-Hit Chain berechnen
    const totalHits: number = this.RollMultiHitChain(
      actor.Stats.MultiHitChance,
      actor.Stats.MultiHitChainFactor,
      STATS_CONFIG.CAPS.MAX_CHAIN_HITS
    );

    // Single Hits
    if (totalHits === 1) {
      const damages: DamageResult[] = [];
      const damageResult: DamageResult = this.CalculateHeroDamage(actor, false);
      damages.push(damageResult);

      const damageEvent: DamageEvent = CreateDamageEvent(
        event.AtMs + this.DelayMs,
        actor,
        target,
        damages
      );

      this.CombatState.Queue.Push(damageEvent);
    }
    // Multi-Hits
    else if (totalHits > 1) {
      const damages: DamageResult[] = [];

      // First default Hit
      const damageResult: DamageResult = this.CalculateHeroDamage(actor, false);
      damages.push(damageResult);

      // Additional Hits with Multi-Hit Bonus
      for (let hitNumber = 1; hitNumber < totalHits; hitNumber++) {
        const damageResult: DamageResult = this.CalculateHeroDamage(actor, true);
        damages.push(damageResult);
      }

      const damageEvent: DamageEvent = CreateDamageEvent(
        event.AtMs + this.DelayMs,
        actor,
        target,
        damages
      );

      this.CombatState.Queue.Push(damageEvent);
    }
  }

  private HandleMissEvent(event: MissEvent): void {
    // Nur für Log/Animation relevant
  }

  private HandleDamageEvent(event: DamageEvent): void {
    const target = event.Target;

    if (!target) return;

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
      let hero = this.CombatState.Hero();

      if (!hero) return;
      if (!hero.Life.Alive) return;

      hero = {
        ...hero,
        Life: ResetLife(hero.Life)
      };

      await new Promise((resolve) => setTimeout(resolve, DELAYS.BOSS_RESPAWN_ANIMATION_MS));

      this.CombatState.Hero.set(hero);
      this.CombatState.AdvanceToNextBoss();

      await new Promise((resolve) => setTimeout(resolve, DELAYS.BOSS_RESPAWN_ANIMATION_MS));
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

    return { Amount: damage, IsCritical: isCritical };
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

    return damageResult;
  }
  //#endregion
}
