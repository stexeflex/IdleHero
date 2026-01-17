import {
  BattleLogService,
  BossService,
  GameStateService,
  HeroService,
  StageService
} from '../services';
import { EffectRef, Injectable, OnDestroy, effect } from '@angular/core';

import { AttackTickHandler } from './models/attack-tick-handler';
import { BATTLE_CONFIG } from '../constants';
import { BattleEngine } from './battle.engine';
import { BattleLogic } from './functions/attack-tick.function';
import { BattleState } from './battle.state';
import { FrameHandler } from './models/frame-handler';
import { MessageType } from '../models';
import { OrchestrationLogic } from './functions/frame-tick.function';

@Injectable({ providedIn: 'root' })
export class BattleService implements OnDestroy {
  private attackTickSubscriptions: Array<() => void> = [];
  private frameSubscriptions: Array<() => void> = [];
  private effects: EffectRef[] = [];

  constructor(
    private gameStateService: GameStateService,
    private battleEngine: BattleEngine,
    private battleLogic: BattleLogic,
    private orchestrationLogic: OrchestrationLogic,
    private battleState: BattleState,
    private heroService: HeroService,
    private stageService: StageService,
    private bossService: BossService,
    private battleLogService: BattleLogService
  ) {
    const battleEndedEffect = effect(() => {
      this.OnBattleEnded();
    });
    this.effects.push(battleEndedEffect);
  }

  ngOnDestroy(): void {
    this.Stop();
  }

  /**
   * Start the battle engine loop.
   */
  public Battle() {
    if (this.battleEngine.isRunning()) {
      return;
    }

    // Register per-frame handlers
    for (const handler of this.orchestrationLogic.FrameTickHandler) {
      this.AddFrameHandler(handler);
    }

    // Register battle-phase handlers for each attack tick
    for (const handler of this.battleLogic.AttackTickHandler) {
      this.AddAttackTickHandler(handler);
    }

    // Prepare logging
    this.battleLogService.ClearLogs();
    this.battleLogService.StartGame();

    // Start the engine
    this.gameStateService.SetGameInProgress();
    this.battleEngine.Start();
  }

  /**
   * Stop the battle engine and process prestige.
   */
  public Prestige() {
    this.Stop();

    // Process prestige
    this.battleLogService.Prestige(this.stageService.Current());
    this.heroService.Prestige(this.stageService.Current());
    this.bossService.Reset();
    this.stageService.Reset();
  }

  private Stop() {
    this.gameStateService.SetGameIdle();
    this.battleEngine.Stop();

    // Clean up subscriptions
    this.UnsubscribeAll();
  }

  private UnsubscribeAll() {
    for (const unsubscribe of this.attackTickSubscriptions) {
      unsubscribe();
    }
    this.attackTickSubscriptions = [];

    for (const unsubscribe of this.frameSubscriptions) {
      unsubscribe();
    }
    this.frameSubscriptions = [];

    for (const effectRef of this.effects) {
      effectRef.destroy();
    }
  }

  /**
   * Register a handler to run on each computed attack tick.
   * - The handler receives the engine's tick context to enable time-aware logic
   *   (e.g., cooldowns or effects that depend on elapsed time).
   * - `inAngular` can be set to true when the handler updates UI-bound signals/state.
   */
  private AddAttackTickHandler(handler: AttackTickHandler, inAngular: boolean = false) {
    const unsubscribe = this.battleEngine.OnAttackTick(
      (ctx) => {
        // Forward tick context to retain timing data and attack index.
        handler(ctx);
      },
      { inAngular: inAngular }
    );
    this.attackTickSubscriptions.push(unsubscribe);
  }

  /**
   * Register a per-frame handler (runs every animation frame).
   * Keep work minimal here; prefer attack-tick handlers for combat resolution.
   */
  private AddFrameHandler(handler: FrameHandler, inAngular: boolean = false): () => void {
    const unsubscribe = this.battleEngine.OnFrame(
      (now, deltaSec) => {
        // Lightweight per-frame logic aligned with rAF cadence.
        handler(now, deltaSec);
      },
      { inAngular: inAngular }
    );
    this.frameSubscriptions.push(unsubscribe);
    return unsubscribe;
  }

  private OnBattleEnded() {
    const battleEnded: boolean = this.battleState.battleEnded();

    if (battleEnded) {
      if (this.stageService.Current() == BATTLE_CONFIG.STAGE.MAX) {
        this.Prestige();
        this.battleLogService.AddLog({
          Message: 'VICTORY!',
          Type: MessageType.Info
        });
      } else {
        this.Prestige();
      }
    }
  }
}
