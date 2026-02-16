import { BehaviorSubject, Subject } from 'rxjs';
import {
  Boss,
  CombatEvent,
  CreateAttackEvent,
  Hero,
  InitialActorState,
  InitialHeroCharge,
  InitialLife,
  NoArmor,
  ResetLife
} from '../../../models';
import {
  CombatLogService,
  CombatStatsService,
  DungeonRoomService,
  PlayerHeroService
} from '../../../services';
import {
  ComputeAttackInterval,
  ComputeFirstIntervalMs,
  ComputeInitialAttackInterval
} from '../attack-interval-computing';
import { Injectable, inject, signal } from '@angular/core';

import { EventQueue } from './event.queue';
import { GameSaverService } from '../../../../persistence';
import { TimestampUtils } from '../../../../shared/utils';

/**
 * Combat State Service
 */
@Injectable({ providedIn: 'root' })
export class CombatState {
  // Services
  private readonly PlayerHero = inject<PlayerHeroService>(PlayerHeroService);
  private readonly DungeonRoom = inject<DungeonRoomService>(DungeonRoomService);
  private readonly CombatStats = inject<CombatStatsService>(CombatStatsService);
  private readonly Log = inject<CombatLogService>(CombatLogService);
  private readonly GameSaver = inject<GameSaverService>(GameSaverService);

  // Combat State
  public readonly InProgress = signal<boolean>(false);

  // Event Queue
  public readonly Queue = new EventQueue<CombatEvent>();

  // Combat Actors: Hero & Boss
  public Hero = signal<Hero | undefined>(undefined);
  public Boss = signal<Boss | undefined>(undefined);

  // Observables für UI
  public readonly Events$ = new Subject<CombatEvent>();
  public readonly Hero$ = new BehaviorSubject<Hero | undefined>(undefined);
  public readonly Boss$ = new BehaviorSubject<Boss | undefined>(undefined);

  public Leave() {
    this.DungeonRoom.ExitDungeon();
  }

  public Prestige() {
    this.InProgress.set(false);
    this.Queue.Clear();
    this.DungeonRoom.Prestige();
    this.Hero.set(undefined);
    this.Boss.set(undefined);
    this.PublishState();

    this.GameSaver.SaveGame();
  }

  public Cleared() {
    this.Log.Info(`${this.DungeonRoom.CurrentDungeon()?.Title.toUpperCase()}: Dungeon Cleared!`);
    this.Queue.Clear();
    this.Boss.set(undefined);
    this.PublishState();

    this.GameSaver.SaveGame();
  }

  /**
   * Setup Combat with Actors
   * @param actors Combat Actors to setup
   */
  public SetupCombat(dungeonId: string) {
    this.Log.Clear();
    this.Queue.Clear();
    this.InProgress.set(true);

    this.GameSaver.SaveGame();

    // Set Combat Actors
    const hero: Hero = this.SetupHero();
    const firstBoss: Boss = this.SetupBoss(dungeonId);

    this.Hero.set(hero);
    this.Boss.set(firstBoss);

    // Add first Combat Event for Hero
    const now = TimestampUtils.GetTimestamp();
    this.SetFirstEvent(hero, firstBoss, now);
    this.PublishState();

    // Log combat start
    this.Log.Info(`${this.DungeonRoom.CurrentDungeon()?.Title.toUpperCase()}: Starting Battle!`);
  }

  /**
   * Update Hero's Stat Sources
   */
  public UpdateHero() {
    this.Hero.update((hero) => {
      if (!hero) return hero;

      // Compute Stats for Hero
      hero.Stats = this.CombatStats.Effective();
      hero.AttackInterval = ComputeAttackInterval(hero.Stats.AttackSpeed, hero.AttackInterval);
    });

    this.PublishState();
  }

  /**
   * Prepare Stage Advance: Clear certain queued events and delay others to sync with Boss respawn animation
   */
  public PrepareStageAdvance() {
    this.Queue.Clear(['Charge', 'Clear']);
    // this.DelayEventsBy(DELAYS.BOSS_RESPAWN_ANIMATION_MS, ['Charge', 'Clear']);
  }

  /**
   * Advance to the next Boss in the Dungeon Room
   */
  public AdvanceToNextBoss(): void {
    if (this.Boss()?.Life.Alive) return;

    const advanced: boolean = this.DungeonRoom.AdvanceStage();

    if (!advanced) {
      this.Cleared();
      return;
    }

    const nextBoss = this.DungeonRoom.CurrentBoss();
    if (!nextBoss) return;

    const now = TimestampUtils.GetTimestamp();
    this.SetFirstEvent(this.Hero()!, nextBoss, now);
    nextBoss.Life = ResetLife(nextBoss.Life);
    this.Boss.set(nextBoss);
    this.PublishState();
  }

  /**
   * Publish current Combat State
   */
  public PublishState() {
    this.Hero$.next(this.Hero());
    this.Boss$.next(this.Boss());
  }

  //#region Setup
  private SetupHero(): Hero {
    const computedStats = this.CombatStats.Effective();

    const hero: Hero = {
      Name: this.PlayerHero.Name(),
      HeroIcon: this.PlayerHero.CharacterIcon(),
      Life: InitialLife(100),
      Armor: NoArmor(),
      Stats: computedStats,
      AttackInterval: ComputeInitialAttackInterval(computedStats.AttackSpeed),
      State: InitialActorState(),
      Charge: InitialHeroCharge()
    };

    return hero;
  }

  private SetupBoss(dungeonId: string): Boss {
    const boss: Boss | null = this.DungeonRoom.CurrentBoss();

    if (!boss) {
      throw new Error(`No boss found for dungeon ID: ${dungeonId}`);
    }

    boss.Life = ResetLife(boss.Life);
    return boss;
  }

  private SetFirstEvent(hero: Hero, boss: Boss, atMs: number): void {
    const firstAt: number = ComputeFirstIntervalMs(atMs, hero.AttackInterval);
    const attackEvent: CombatEvent = CreateAttackEvent(firstAt, hero, boss);
    this.Queue.Push(attackEvent);
  }
  //#endregion Setup

  //#region Event Queue Management
  private DelayEventsBy(delayMs: number, exceptTypes: string[] = []): void {
    this.Queue.UpdateAll((event) => {
      if (exceptTypes.includes(event.Type)) return event;
      return { ...event, AtMs: event.AtMs + delayMs };
    });
  }

  // Clean up/retarget queued events referencing the old boss
  private UpdateEventQueueOnStageAdvance(oldBoss: Boss | null, nextBoss: Boss): void {
    if (!oldBoss) return;

    const oldId = oldBoss.Id;

    this.Queue.UpdateAll((event) => {
      switch (event.Type) {
        case 'Attack': {
          const isOldActor = 'Id' in event.Actor && (event.Actor as Boss).Id === oldId;
          const isOldTarget = 'Id' in event.Target && (event.Target as Boss).Id === oldId;
          if (isOldActor) return null; // drop attacks from old boss
          if (isOldTarget) return { ...event, Target: nextBoss };
          return event;
        }
        case 'Miss': {
          const isOldActor = 'Id' in event.Actor && (event.Actor as Boss).Id === oldId;
          const isOldTarget = 'Id' in event.Target && (event.Target as Boss).Id === oldId;
          if (isOldActor) return null; // drop misses from old boss
          if (isOldTarget) return null; // do not apply leftover misses to the new boss
          return event;
        }
        case 'Damage': {
          const isOldActor = 'Id' in event.Actor && (event.Actor as Boss).Id === oldId;
          const isOldTarget = 'Id' in event.Target && (event.Target as Boss).Id === oldId;
          if (isOldActor) return null; // drop damage from old boss
          if (isOldTarget) return { ...event, Target: nextBoss };
          return event;
        }
        case 'DamageOverTime': {
          const isOldTarget = 'Id' in event.Target && (event.Target as Boss).Id === oldId;
          if (isOldTarget) return null; // do not apply leftover DoTs to the new boss
          return event;
        }
        case 'Heal': {
          const isOldActor = 'Id' in event.Actor && (event.Actor as Boss).Id === oldId;
          const isOldTarget = 'Id' in event.Target && (event.Target as Boss).Id === oldId;
          if (isOldActor) return null; // drop heals cast by old boss
          if (isOldTarget) return null; // do not heal the new boss from leftover events
          return event;
        }
        case 'Death': {
          const isOldActor = 'Id' in event.Actor && (event.Actor as Boss).Id === oldId;
          if (isOldActor) return null; // drop pending death events of old boss
          return event;
        }
        default:
          return event;
      }
    });
  }
  //#endregion Event Queue Management
}
