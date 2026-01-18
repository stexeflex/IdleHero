import {
  BattleLogService,
  BossService,
  CurrencyService,
  DungeonRoomService,
  GameStateService,
  HeroService,
  StageService
} from '../services';
import { EffectRef, Injectable, OnDestroy, effect } from '@angular/core';

import { AttackTickHandler } from './models/attack-tick-handler';
import { BattleEngine } from './battle.engine';
import { BattleLogic } from './functions/attack-tick.function';
import { BattleState } from './battle.state';
import { DungeonRoomId } from '../models';
import { DungeonSpecifications } from '../specifications';
import { FrameHandler } from './models/frame-handler';
import { OrchestrationLogic } from './functions/frame-tick.function';
import { StatisticsService } from '../services/character/statistics.service';

@Injectable({ providedIn: 'root' })
export class BattleService implements OnDestroy {
  private attackTickSubscriptions: Array<() => void> = [];
  private frameSubscriptions: Array<() => void> = [];
  private battleEndedEffect: EffectRef | null = null;

  constructor(
    private gameStateService: GameStateService,
    private battleEngine: BattleEngine,
    private battleLogic: BattleLogic,
    private orchestrationLogic: OrchestrationLogic,
    private battleState: BattleState,
    private statisticsService: StatisticsService,
    private dungeonRoomService: DungeonRoomService,
    private stageService: StageService,
    private bossService: BossService,
    private battleLogService: BattleLogService,
    private dungeonSpecifications: DungeonSpecifications,
    private currencyService: CurrencyService
  ) {
    if (this.battleEndedEffect) this.battleEndedEffect.destroy();

    this.battleEndedEffect = effect(() => {
      if (this.battleState.battleEnded()) {
        this.battleState.battleEnded.set(false);
        this.OnBattleEnded();
      }
    });
  }

  ngOnDestroy(): void {
    this.Stop();
    this.battleEndedEffect?.destroy();
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

    // Reset game state
    this.battleState.Reset();
    this.stageService.Reset();
    this.bossService.Reset();

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
    this.statisticsService.RecordPrestige(
      this.dungeonRoomService.Current(),
      this.stageService.Current()
    );
  }

  private AutoPrestige() {
    this.Stop();

    // Process prestige
    this.statisticsService.RecordPrestige(
      this.dungeonRoomService.Current(),
      this.stageService.Current()
    );
  }

  private Stop() {
    this.gameStateService.SetGameIdle();
    this.battleEngine.Stop();

    // Clean up subscriptions
    this.UnsubscribeAll();
  }

  private OnBattleEnded() {
    // Auto-prestige if the dungeon room is cleared
    if (this.dungeonSpecifications.DungeonRoomCleared()) {
      const dungeonRoom: DungeonRoomId = this.dungeonRoomService.Current();
      this.AutoPrestige();
      this.OnDungeonRoomCleared(dungeonRoom);
    }
    // Manual prestige if the dungeon room is not cleared
    else {
      this.Prestige();
    }
  }

  private OnDungeonRoomCleared(dungeonRoomId: DungeonRoomId) {
    const room = this.dungeonRoomService.GetRoom(dungeonRoomId);

    if (room) {
      this.battleLogService.DungeonCleared(room);

      this.currencyService.AddGold(room.Rewards.Gold);

      if (room.Rewards.Key) {
        this.currencyService.ObtainKey(room.Rewards.Key);
      }
    }
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
}
