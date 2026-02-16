import {
  BleedLogEntry,
  CombatLogEntry,
  CombatLogType,
  DamageLogEntry,
  DeathLogEntry,
  HealLogEntry,
  InfoLogEntry,
  MissLogEntry,
  RewardsLogEntry
} from '../models/combat/combat-log';
import {
  DamageEvent,
  DamageOverTimeEvent,
  DeathEvent,
  HealEvent,
  MissEvent,
  Rewards
} from '../models';
import { Injectable, computed, signal } from '@angular/core';

import { TimestampUtils } from '../../shared/utils';

@Injectable({ providedIn: 'root' })
export class CombatLogService {
  private readonly MAX_ENTRIES = 250;

  private readonly EntriesState = signal<CombatLogEntry[]>([]);

  public readonly Entries = computed<CombatLogEntry[]>(() => this.EntriesState());

  /** Clears all log entries. */
  public Clear(): void {
    this.EntriesState.set([]);
  }

  //#region LOG MESSAGE HELPER METHODS
  /** Adds an info message to the log. */
  public Info(message: string): InfoLogEntry {
    const entry: InfoLogEntry = {
      Type: CombatLogType.Info,
      TimestampMs: TimestampUtils.GetTimestamp(),
      Message: message
    };
    this.Push(entry);
    return entry;
  }

  public Rewards(stage: number, rewards: Rewards): RewardsLogEntry {
    const entry: RewardsLogEntry = {
      Type: CombatLogType.Rewards,
      TimestampMs: TimestampUtils.GetTimestamp(),
      Stage: stage,
      Rewards: rewards
    };
    this.Push(entry);
    return entry;
  }

  /** Records damage from source to target. */
  public Damage(event: DamageEvent): DamageLogEntry {
    const entry: DamageLogEntry = {
      Type: CombatLogType.Damage,
      TimestampMs: event.AtMs,
      Actor: event.Actor,
      Target: event.Target,
      Damage: event.Damage,
      IsMultiHit: event.IsMultiHit
    };
    this.Push(entry);
    return entry;
  }

  public DoT(event: DamageOverTimeEvent): BleedLogEntry {
    const entry: BleedLogEntry = {
      Type: CombatLogType.Bleed,
      TimestampMs: event.AtMs,
      Target: event.Target,
      Damage: event.Damage,
      Tick: event.Tick,
      TotalTicks: event.TotalTicks
    };
    this.Push(entry);
    return entry;
  }

  /** Records a miss from source to target. */
  public Miss(event: MissEvent): MissLogEntry {
    const entry: MissLogEntry = {
      Type: CombatLogType.Miss,
      TimestampMs: event.AtMs,
      Actor: event.Actor,
      Target: event.Target
    };
    this.Push(entry);
    return entry;
  }

  /** Records healing applied to target. */
  public Heal(event: HealEvent): HealLogEntry {
    const entry: HealLogEntry = {
      Type: CombatLogType.Heal,
      TimestampMs: event.AtMs,
      Actor: event.Actor,
      Target: event.Target,
      Amount: event.Amount
    };
    this.Push(entry);
    return entry;
  }

  /** Records a death for an actor. */
  public Death(event: DeathEvent): DeathLogEntry {
    const entry: DeathLogEntry = {
      Type: CombatLogType.Death,
      TimestampMs: event.AtMs,
      Actor: event.Actor
    };
    this.Push(entry);
    return entry;
  }
  //#endregion LOG MESSAGE HELPER METHODS

  private Push(entry: CombatLogEntry): void {
    this.EntriesState.update((list) => {
      list.unshift(entry);
      // Keep only the latest X entries to prevent unbounded growth
      return [...list].slice(0, this.MAX_ENTRIES);
    });
  }
}
