import { BehaviorSubject, Subject } from 'rxjs';
import {
  Boss,
  CombatEvent,
  CreateAttackEvent,
  Hero,
  InitialActorState,
  InitialHeroCharge,
  InitialLife,
  InitialSkillEffects,
  NoArmor,
  ResetLife
} from '../../../models';
import {
  CombatLogService,
  CombatSkillsService,
  CombatStatsService,
  DungeonRoomService,
  PlayerHeroService,
  SkillsService
} from '../../../services';
import {
  ComputeAttackInterval,
  ComputeFirstIntervalMs,
  ComputeInitialAttackInterval
} from '../attack-interval-computing';
import { Injectable, effect, inject, signal } from '@angular/core';

import { DungeonRunService } from '../dungeons/dungeon-run.service';
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
  private readonly DungeonRun = inject<DungeonRunService>(DungeonRunService);
  private readonly CombatStats = inject<CombatStatsService>(CombatStatsService);
  private readonly Skills = inject<SkillsService>(SkillsService);
  private readonly CombatSkills = inject<CombatSkillsService>(CombatSkillsService);
  private readonly Log = inject<CombatLogService>(CombatLogService);
  private readonly GameSaver = inject<GameSaverService>(GameSaverService);

  // Combat State
  public readonly InProgress = signal<boolean>(false);
  public readonly Completed = signal<boolean>(false);

  // Event Queue
  public readonly Queue = new EventQueue<CombatEvent>();

  // Combat Actors: Hero & Boss
  public Hero = signal<Hero | undefined>(undefined);
  public Boss = signal<Boss | undefined>(undefined);

  // Observables for UI
  public readonly Events$ = new Subject<CombatEvent>();
  public readonly Hero$ = new BehaviorSubject<Hero | undefined>(undefined);
  public readonly Boss$ = new BehaviorSubject<Boss | undefined>(undefined);

  public constructor() {
    effect(() => {
      this.CombatSkills.StatusRevision();
      const isInProgress = this.InProgress();
      if (!isInProgress) return;
      this.UpdateHero();
    });
  }

  public Leave() {
    this.Reset();
    this.DungeonRoom.ExitDungeon();
  }

  public Prestige() {
    this.DungeonRoom.Prestige(false);
    this.Reset();
    this.GameSaver.SaveGame();
  }

  private ClearedDungeon() {
    this.Completed.set(true);
    this.DungeonRun.StopRun(this.DungeonRoom.CurrentStage());

    this.Log.Info(`${this.DungeonRoom.CurrentDungeon()?.Title.toUpperCase()}: Dungeon Cleared!`);

    this.DungeonRoom.Prestige(true);
    this.CombatSkills.Reset();
    this.Queue.Clear();
    this.ClearActors();
    this.GameSaver.SaveGame();
  }

  private Reset() {
    this.InProgress.set(false);
    this.Completed.set(false);
    this.CombatSkills.Reset();
    this.DungeonRun.StopRun(this.DungeonRoom.CurrentStage());
    this.Queue.Clear();
    this.Log.Clear();
    this.ClearActors();
    this.DungeonRoom.SetStage(1);
  }

  private ClearActors() {
    this.Hero.set(undefined);
    this.Boss.set(undefined);
    this.PublishState();
  }

  /**
   * Setup Combat with Actors
   * @param actors Combat Actors to setup
   */
  public SetupCombat() {
    this.Reset();
    this.InProgress.set(true);
    this.GameSaver.SaveGame();
    this.DungeonRun.StartRun(this.DungeonRoom.CurrentDungeonId()!);

    // Set Combat Actors
    const hero: Hero = this.SetupHero();
    const firstBoss: Boss = this.SetupBoss();

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
      return hero;
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
  public AdvanceToNextBoss(atMs: number): void {
    if (this.Boss()?.Life.Alive) return;

    const advanced: boolean = this.DungeonRoom.AdvanceStage();

    if (!advanced) {
      this.ClearedDungeon();
      return;
    }

    const nextBoss = this.DungeonRoom.CurrentBoss();
    if (!nextBoss) return;

    nextBoss.Life = ResetLife(nextBoss.Life);
    this.Boss.set(nextBoss);

    this.SetFirstEvent(this.Hero()!, nextBoss, atMs);
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
    const passives = this.Skills.Passives();

    const hero: Hero = {
      Name: this.PlayerHero.Name(),
      HeroIcon: this.PlayerHero.CharacterIcon(),
      Life: InitialLife(100),
      Armor: NoArmor(),
      Stats: computedStats,
      AttackInterval: ComputeInitialAttackInterval(computedStats.AttackSpeed),
      State: InitialActorState(),
      Passives: passives,
      Effects: InitialSkillEffects(),
      Charge: InitialHeroCharge(),
      SplashDamage: 0
    };

    return hero;
  }

  private SetupBoss(): Boss {
    const boss: Boss = this.DungeonRoom.CurrentBoss()!;
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
