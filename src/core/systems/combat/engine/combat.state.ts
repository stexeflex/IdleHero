import { BehaviorSubject, Subject } from 'rxjs';
import { Boss, CombatEvent, CreateAttackEvent, Hero, InitialLife } from '../../../models';
import {
  ComputeAttackInterval,
  ComputeFirstIntervalMs,
  ComputeInitialAttackInterval
} from '../attack-interval-computing';
import { Injectable, inject, signal } from '@angular/core';

import { BossSelectionService } from '../dungeons/boss-selection.service';
import { CombatStatsService } from '../../../services';
import { EventQueue } from './event.queue';

/**
 * Combat State Service
 */
@Injectable({ providedIn: 'root' })
export class CombatState {
  private readonly BossSelectionService = inject<BossSelectionService>(BossSelectionService);
  private readonly CombatStatsService = inject<CombatStatsService>(CombatStatsService);

  // Combat State
  public readonly Queue = new EventQueue<CombatEvent>();

  // Combat Actors: Hero & Boss
  public Hero = signal<Hero | undefined>(undefined);
  public Boss = signal<Boss | undefined>(undefined);

  // Observables für UI
  public readonly Events$ = new Subject<CombatEvent>();
  public readonly Hero$ = new BehaviorSubject<Hero | undefined>(undefined);
  public readonly Boss$ = new BehaviorSubject<Boss | undefined>(undefined);

  /**
   * Setup Combat with Actors
   * @param actors Combat Actors to setup
   */
  public SetupCombat(dungeonId: number) {
    const computedStats = this.CombatStatsService.Effective();

    const hero: Hero = {
      Life: InitialLife(100),
      Stats: computedStats,
      AttackInterval: ComputeInitialAttackInterval(computedStats.AttackSpeed)
    };

    const firstBoss: Boss = this.BossSelectionService.GetBoss(dungeonId.toString(), 1);

    // Set Combat Actors
    this.Hero.set(hero);
    this.Boss.set(firstBoss);

    // Add first Combat Event for Hero
    const now = performance.now();
    const firstAt: number = ComputeFirstIntervalMs(now, hero.AttackInterval);
    const attackEvent: CombatEvent = CreateAttackEvent(firstAt, 'hero', firstBoss.Id);

    this.Queue.Push(attackEvent);

    this.PublishState();
  }

  /**
   * Update Hero's Stat Sources
   */
  public UpdateHero() {
    this.Hero.update((hero) => {
      if (!hero) return hero;

      // Compute Stats for Hero
      hero.Stats = this.CombatStatsService.Effective();
      hero.AttackInterval = ComputeAttackInterval(hero.Stats.AttackSpeed, hero.AttackInterval);
    });

    this.PublishState();
  }

  /**
   * Publish current Combat State
   */
  public PublishState() {
    this.Hero$.next(this.Hero());
    this.Boss$.next(this.Boss());
  }
}
