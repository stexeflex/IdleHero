import { AttackInterval } from '../../models';

export function ComputeFirstIntervalMs(now: number, attackInterval: AttackInterval): number {
  return now + (attackInterval.AttackIntervalMs - attackInterval.CooldownProgressMs);
}

export function ComputeNextIntervalMs(
  lastIntervalMs: number,
  attackInterval: AttackInterval
): number {
  return lastIntervalMs + attackInterval.AttackIntervalMs;
}

export function ComputeInitialAttackInterval(attackSpeed: number): AttackInterval {
  const attackIntervalMs = Math.round(1000 / attackSpeed);
  return {
    AttackIntervalMs: attackIntervalMs,
    CooldownProgressMs: 0
  };
}

export function ComputeAttackInterval(
  attackSpeed: number,
  attackInterval: AttackInterval
): AttackInterval {
  const nextInterval = Math.round(1000 / attackSpeed);
  const prevInterval: number = attackInterval.AttackIntervalMs;

  const cooldownProgressMs: number = ComputeCooldown(
    prevInterval,
    nextInterval,
    attackInterval.CooldownProgressMs
  );

  return {
    AttackIntervalMs: nextInterval,
    CooldownProgressMs: cooldownProgressMs
  };
}

export function ComputeBossRespawnDelayMs(attackInterval: AttackInterval | undefined): number {
  return Math.max(0.4, attackInterval?.AttackIntervalMs ?? 1000);
}

function ComputeCooldown(
  prevAttackInterval: number,
  nextAttackInterval: number,
  cooldownProgressMs: number
): number {
  let progressPercent = 0;

  if (prevAttackInterval > 0) {
    progressPercent = Math.min(1, cooldownProgressMs / prevAttackInterval);
  }

  const remainingMs = Math.max(0, Math.round((1 - progressPercent) * nextAttackInterval));
  const newProgressMs = nextAttackInterval - remainingMs;

  return newProgressMs;
}
