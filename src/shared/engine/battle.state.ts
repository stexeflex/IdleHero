import {
  AttackResult,
  BossDamageResult,
  Buff,
  ExperienceGainResult,
  StageRewards
} from '../models';
import { Injectable, computed, inject, signal } from '@angular/core';

import { BuffsService } from '../services';

/**
 * BattleState
 * Centralized state for the battle loop, using Angular signals.
 * Keeps UI-friendly state separate from engine scheduling.
 */
@Injectable({ providedIn: 'root' })
export class BattleState {
  private readonly buffsService: BuffsService = inject(BuffsService);

  /** Battle has ended */
  readonly battleEnded = signal<boolean>(false);

  /** Attacks made in the current battle */
  readonly attackCounter = signal<number>(0);
  attacks: AttackResult[] = [];

  /** Attack overflow */
  readonly splashDamageEnabled = computed(() => {
    const splashBuff: Buff | undefined = this.buffsService
      .Buffs()
      .find((b) => b.Name === 'Splash Area Damage');
    return splashBuff ? splashBuff.IsActive : false;
  });
  readonly attackOverflow = signal<number>(0);

  /** Most recent attack result */
  readonly attackResult = signal<AttackResult | null>(null);

  /** Most recent boss damage result */
  readonly bossFightResult = signal<BossDamageResult | null>(null);

  /** Rewards for the current stage */
  readonly rewards = signal<StageRewards | null>(null);

  /** Experience gain result from the most recent reward */
  readonly experienceGainResult = signal<ExperienceGainResult | null>(null);

  /** Whether a stage/boss transition animation is in progress */
  readonly isTransitioning = signal<boolean>(false);

  /** Respawn animation progress (0 → 1) */
  readonly respawnProgress = signal<number>(0);

  /** Internal counters for frame-driven transitions */
  private transitionRemainingSec = 0;
  private transitionTotalSec = 0;

  public Reset(): void {
    this.battleEnded.set(false);
    this.attackCounter.set(0);
    this.attacks = [];
    this.attackOverflow.set(0);
    this.attackResult.set(null);
    this.bossFightResult.set(null);
    this.rewards.set(null);
    this.experienceGainResult.set(null);
    this.endTransition();
  }

  /** Begin a transition with a given duration in milliseconds */
  beginTransition(durationMs: number): void {
    const totalSec = Math.max(durationMs, 0) / 1000;
    this.transitionTotalSec = totalSec;
    this.transitionRemainingSec = totalSec;
    this.respawnProgress.set(0);
    this.isTransitioning.set(totalSec > 0);
  }

  /** Advance the transition by a delta in seconds; updates progress and ends when complete */
  advanceTransition(deltaSec: number): void {
    if (!this.isTransitioning()) return;

    const safeDelta = Math.min(Math.max(deltaSec, 0), 0.25);
    this.transitionRemainingSec = Math.max(this.transitionRemainingSec - safeDelta, 0);
    const p =
      this.transitionTotalSec > 0 ? 1 - this.transitionRemainingSec / this.transitionTotalSec : 1;
    this.respawnProgress.set(Math.min(Math.max(p, 0), 1));

    if (this.transitionRemainingSec <= 0) {
      this.endTransition();
    }
  }

  /** Explicitly end the current transition */
  endTransition(): void {
    this.transitionRemainingSec = 0;
    this.transitionTotalSec = 0;
    this.respawnProgress.set(1);
    this.isTransitioning.set(false);
  }
}
