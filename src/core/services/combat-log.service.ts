import {
  CombatLogEntry,
  CombatLogType,
  DamageLogEntry,
  DeathLogEntry,
  HealLogEntry,
  InfoLogEntry,
  MissLogEntry
} from '../models/combat/combat-log';
import { DamageEvent, DeathEvent, HealEvent, MissEvent } from '../models';
import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CombatLogService {
  private readonly EntriesState = signal<CombatLogEntry[]>([]);

  public readonly Entries = computed<CombatLogEntry[]>(() => this.EntriesState());

  /** Clears all log entries. */
  public Clear(): void {
    this.EntriesState.set([]);
  }

  /** Adds an info message to the log. */
  public Info(message: string): InfoLogEntry {
    const entry: InfoLogEntry = {
      Type: CombatLogType.Info,
      TimestampMs: performance.now(),
      Message: message
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

  /** Records a miss from source to target. */
  public Miss(event: MissEvent): MissLogEntry {
    const entry: MissLogEntry = {
      Type: CombatLogType.Miss,
      TimestampMs: event.AtMs,
      Actor: event.Actor,
      Target: event.Target,
      HitChance: event.HitChance
    };
    this.Push(entry);

    this.Heal({
      Type: 'Heal',
      AtMs: event.AtMs,
      Actor: event.Target,
      Target: event.Target,
      Amount: 15
    });

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

  private Push(entry: CombatLogEntry): void {
    this.EntriesState.update((list) => {
      list.unshift(entry);
      return [...list];
    });
  }
}
