import { Injectable, NgZone, computed, inject, signal } from '@angular/core';

import { AttackTickContext } from './models/attack-tick-context';
import { AttackTickHandler } from './models/attack-tick-handler';
import { FrameHandler } from './models/frame-handler';
import { StatsService } from '../services/character/stats.service';

/**
 * Battle Engine
 *
 * High-performance, extensible battle loop for an idle RPG.
 * - Uses requestAnimationFrame and a fixed-step accumulator to derive attack ticks.
 * - Runs outside Angular's zone to avoid unnecessary change detection and jank.
 * - Provides registration APIs for per-frame tasks and per-attack ticks.
 * - Attack timing is based on attacks-per-second (APS) from `StatsService` and scales smoothly.
 *
 * Design goals:
 * - Smooth: avoid `setInterval`; prefer rAF with delta accumulation.
 * - Accurate: ticks are produced from elapsed time × APS; no drift.
 * - Safe: cap burst processing per frame to prevent long blocking work.
 * - Extensible: handlers can opt-in to run inside Angular's zone when UI updates are needed.
 */
@Injectable({ providedIn: 'root' })
export class BattleEngine {
  /**
   * Hard caps to keep the loop responsive under high APS or long frame gaps.
   * - `maxTicksPerFrame`: avoids processing unbounded ticks in one frame.
   * - `maxDeltaClampSec`: clamps massive pauses (tab background, breakpoint resumes).
   */
  private readonly maxTicksPerFrame = 8;
  private readonly maxDeltaClampSec = 0.25;

  /** Engine control state (signals for efficient UI binding) */
  readonly isRunning = signal(false);

  /** Live APS derived from stats; read on each frame for up-to-date timing. */
  readonly attacksPerSecond = computed(() => this.stats.AttackSpeed());

  /** Internal loop state */
  private rafId: number | null = null;
  private lastNow = 0; // last rAF timestamp
  private accumulator = 0; // accumulated "attack credits" in units of ticks
  private attackCounter = 0; // monotonically increasing attack index

  /** Registered handlers */
  private frameHandlers: { handler: FrameHandler; inAngular: boolean }[] = [];
  private attackHandlers: { handler: AttackTickHandler; inAngular: boolean }[] = [];

  /** Dependencies */
  private readonly zone = inject(NgZone);
  private readonly stats = inject(StatsService);

  /**
   * Starts the battle loop.
   * - Executes outside Angular's zone to keep change detection calm.
   * - Safe to call multiple times; only starts if currently stopped.
   */
  public Start(): void {
    if (this.isRunning()) {
      return;
    }

    this.isRunning.set(true);

    // Initialize timing state
    this.lastNow = performance.now();
    this.accumulator = 0;

    this.zone.runOutsideAngular(() => {
      this.rafId = requestAnimationFrame(this.loop);
    });
  }

  /** Stops the battle loop and clears pending rAF. */
  public Stop(): void {
    if (!this.isRunning()) {
      return;
    }

    this.isRunning.set(false);

    if (this.rafId != null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Registers a per-frame handler (executed every animation frame).
   * @param handler Function receiving (now, deltaSec)
   * @param options `inAngular`: run inside Angular's zone for UI updates (default false)
   * @returns Unsubscribe function
   */
  public OnFrame(handler: FrameHandler, options?: { inAngular?: boolean }): () => void {
    const entry = { handler, inAngular: !!options?.inAngular };
    this.frameHandlers.push(entry);

    return () => {
      const idx = this.frameHandlers.indexOf(entry);
      if (idx >= 0) this.frameHandlers.splice(idx, 1);
    };
  }

  /**
   * Registers an attack-tick handler (executed once per computed attack tick).
   * @param handler Function receiving an `AttackTickContext`
   * @param options `inAngular`: run inside Angular's zone for UI updates (default false)
   * @returns Unsubscribe function
   */
  public OnAttackTick(handler: AttackTickHandler, options?: { inAngular?: boolean }): () => void {
    const entry = { handler, inAngular: !!options?.inAngular };
    this.attackHandlers.push(entry);

    return () => {
      const idx = this.attackHandlers.indexOf(entry);
      if (idx >= 0) this.attackHandlers.splice(idx, 1);
    };
  }

  /**
   * Core rAF loop: accumulate time, derive ticks from APS, and dispatch handlers.
   * - Uses a fixed-step accumulator: `accumulator += deltaSec * APS`.
   * - Each whole unit in `accumulator` is one attack tick.
   * - Per-frame handlers are executed once per frame with raw timing.
   */
  private loop = (now: number): void => {
    // guard against late callbacks after stop()
    if (!this.isRunning()) {
      return;
    }

    const rawDeltaSec = (now - this.lastNow) / 1000;
    // Clamp extreme gaps to avoid huge bursts on resume from background/Debugger
    const deltaSec = Math.min(rawDeltaSec, this.maxDeltaClampSec);
    this.lastNow = now;

    // Dispatch per-frame work first (physics, cooldowns, FX updates, etc.)
    this.dispatchFrame(now, deltaSec);

    // Accumulate attack credits based on current APS
    const aps = this.attacksPerSecond();
    if (aps > 0) {
      this.accumulator += deltaSec * aps;
    }

    // Process whole ticks; cap to keep the frame snappy
    let ticksToRun = Math.floor(this.accumulator);
    if (ticksToRun > this.maxTicksPerFrame) {
      ticksToRun = this.maxTicksPerFrame;
    }

    for (let i = 0; i < ticksToRun; i++) {
      // Consume one tick worth of accumulated credits
      this.accumulator -= 1;
      this.attackCounter++;
      this.dispatchAttackTick(now, deltaSec);
    }

    // Schedule next frame outside Angular's zone
    this.rafId = requestAnimationFrame(this.loop);
  };

  /** Execute per-frame handlers, with optional zone re-entry. */
  private dispatchFrame(now: number, deltaSec: number): void {
    if (this.frameHandlers.length === 0) return;

    for (const { handler, inAngular } of this.frameHandlers) {
      if (inAngular) {
        this.zone.run(() => handler(now, deltaSec));
      } else {
        handler(now, deltaSec);
      }
    }
  }

  /** Execute attack-tick handlers, with optional zone re-entry. */
  private dispatchAttackTick(now: number, deltaSec: number): void {
    if (this.attackHandlers.length === 0) return;

    const ctx: AttackTickContext = {
      now,
      elapsedSec: deltaSec,
      attackIndex: this.attackCounter
    };

    for (const { handler, inAngular } of this.attackHandlers) {
      if (inAngular) {
        this.zone.run(() => handler(ctx));
      } else {
        handler(ctx);
      }
    }
  }
}
