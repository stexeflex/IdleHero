import {
  AttackEvent,
  CombatEvent,
  DamageEvent,
  DeathEvent,
  HealEvent,
  MissEvent,
  MultiHitEvent
} from './combat-event';

export function CreateEvent(overrides: Partial<CombatEvent>): CombatEvent {
  return {
    ...overrides
  } as CombatEvent;
}

export function CreateAttackEvent(atMs: number, actorId: string, targetId: string): AttackEvent {
  return {
    Type: 'Attack',
    AtMs: atMs,
    ActorId: actorId,
    TargetId: targetId
  };
}

export function CreateMissEvent(
  atMs: number,
  actorId: string,
  targetId: string,
  hitChance: number
): MissEvent {
  return {
    Type: 'Miss',
    AtMs: atMs,
    ActorId: actorId,
    TargetId: targetId,
    HitChance: hitChance
  };
}

export function CreateDamageEvent(
  atMs: number,
  actorId: string,
  targetId: string,
  damage: number,
  isCritical: boolean
): DamageEvent {
  return {
    Type: 'Damage',
    AtMs: atMs,
    ActorId: actorId,
    TargetId: targetId,
    Amount: damage,
    IsCritical: isCritical
  };
}

export function CreateMultiHitEvent(
  atMs: number,
  actorId: string,
  targetId: string,
  hitNumber: number,
  totalHits: number,
  damage: number,
  isCritical: boolean
): MultiHitEvent {
  return {
    Type: 'MultiHit',
    AtMs: atMs,
    ActorId: actorId,
    TargetId: targetId,
    HitNumber: hitNumber,
    TotalHits: totalHits,
    Amount: damage,
    IsCritical: isCritical
  };
}

export function CreateHealEvent(
  atMs: number,
  actorId: string,
  targetId: string,
  healing: number
): HealEvent {
  return {
    Type: 'Heal',
    AtMs: atMs,
    ActorId: actorId,
    TargetId: targetId,
    Amount: healing
  };
}

export function CreateDeathEvent(atMs: number, actorId: string): DeathEvent {
  return {
    Type: 'Death',
    AtMs: atMs,
    ActorId: actorId
  };
}
