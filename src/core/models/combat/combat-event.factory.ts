import {
  Actor,
  AttackEvent,
  ClearDamageOverTimeEvent,
  CombatEvent,
  DamageEvent,
  DamageOverTimeEvent,
  DeathEvent,
  HealEvent,
  MissEvent,
  Target
} from './combat-event';

import { DamageResult } from '../../systems/combat';

export function CreateEvent(overrides: Partial<CombatEvent>): CombatEvent {
  return {
    ...overrides
  } as CombatEvent;
}

export function CreateAttackEvent(atMs: number, actor: Actor, target: Target): AttackEvent {
  return {
    Type: 'Attack',
    AtMs: atMs,
    Actor: actor,
    Target: target
  };
}

export function CreateMissEvent(
  atMs: number,
  actor: Actor,
  target: Target,
  hitChance: number
): MissEvent {
  return {
    Type: 'Miss',
    AtMs: atMs,
    Actor: actor,
    Target: target,
    HitChance: hitChance
  };
}

export function CreateDamageEvent(
  atMs: number,
  actor: Actor,
  target: Target,
  damage: DamageResult[]
): DamageEvent {
  return {
    Type: 'Damage',
    AtMs: atMs,
    Actor: actor,
    Target: target,
    Damage: damage,
    IsMultiHit: damage.length > 1
  };
}

export function CreateDamageOverTimeEvent(
  atMs: number,
  dotType: 'Bleed',
  target: Target,
  damage: DamageResult,
  tickCount: number,
  totalTicks: number
): DamageOverTimeEvent {
  return {
    Type: 'DamageOverTime',
    DotType: dotType,
    AtMs: atMs,
    Target: target,
    Damage: damage,
    Tick: tickCount,
    TotalTicks: totalTicks
  };
}

export function CreateClearDamageOverTimeEvent(
  atMs: number,
  dotType: 'Bleed',
  target: Target
): ClearDamageOverTimeEvent {
  return {
    Type: 'ClearDamageOverTime',
    DotType: dotType,
    AtMs: atMs,
    Target: target
  };
}

export function CreateHealEvent(
  atMs: number,
  actor: Actor,
  target: Target,
  healing: number
): HealEvent {
  return {
    Type: 'Heal',
    AtMs: atMs,
    Actor: actor,
    Target: target,
    Amount: healing
  };
}

export function CreateDeathEvent(atMs: number, actor: Actor): DeathEvent {
  return {
    Type: 'Death',
    AtMs: atMs,
    Actor: actor
  };
}
