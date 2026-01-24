export interface AttackInterval {
  AttackIntervalMs: number;
  CooldownProgressMs: number;
}

export function InitialAttackInterval(attackSpeed: number): AttackInterval {
  return {
    AttackIntervalMs: 1000 / attackSpeed,
    CooldownProgressMs: 0
  };
}
