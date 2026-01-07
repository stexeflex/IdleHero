export class AttackPower {
  private static readonly BASE_ATTACK_POWER: number = 1;
  private static readonly ATTACK_POWER_PER_STRENGTH: number = 1;
  private static readonly EXPONENT: number = 1.5;

  public static Calculate(strength: number): number {
    // Formula: Base + (Faktor * (Strength - 1)^Exponent)
    return Math.round(
      AttackPower.BASE_ATTACK_POWER +
        AttackPower.ATTACK_POWER_PER_STRENGTH * Math.pow(strength - 1, AttackPower.EXPONENT)
    );
  }
}
