import {
  Actor,
  AttackEvent,
  ChargeEvent,
  ClearEvent,
  CombatEvent,
  DamageEvent,
  DamageOverTimeEvent,
  DeathEvent,
  HealEvent,
  MissEvent,
  Target
} from './combat-event';
import { DamageResult, GetRawDamages, HasMultiHits } from '../../systems/combat';

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

export function CreateMissEvent(atMs: number, actor: Actor, target: Target): MissEvent {
  return {
    Type: 'Miss',
    AtMs: atMs,
    Actor: actor,
    Target: target
  };
}

export function CreateDamageEvent(
  atMs: number,
  actor: Actor,
  target: Target,
  damage: DamageResult[]
): DamageEvent {
  const rawDamages = GetRawDamages(damage);
  return {
    Type: 'Damage',
    AtMs: atMs,
    Actor: actor,
    Target: target,
    Damage: damage,
    IsMultiHit: HasMultiHits(damage)
  };
}

export function CreateDamageOverTimeEvent(
  atMs: number,
  dotType: 'Bleed',
  target: Target,
  tickCount: number,
  totalTicks: number
): DamageOverTimeEvent {
  return {
    Type: 'DamageOverTime',
    DotType: dotType,
    AtMs: atMs,
    Target: target,
    Tick: tickCount,
    TotalTicks: totalTicks
  };
}

export function CreateChargeEvent(
  atMs: number,
  actor: Actor,
  amount: number,
  source: ChargeEvent['Source']
): ChargeEvent {
  return {
    Type: 'Charge',
    AtMs: atMs,
    Actor: actor,
    Amount: amount,
    Source: source
  };
}

export function CreateClearEvent(
  atMs: number,
  target: Target,
  clearingType: 'Charge' | 'Bleed'
): ClearEvent {
  return {
    Type: 'Clear',
    AtMs: atMs,
    Target: target,
    ClearingType: clearingType
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

export function CreateStageAdvanceEvent(atMs: number): CombatEvent {
  return {
    Type: 'StageAdvance',
    AtMs: atMs
  };
}
