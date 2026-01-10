export class CriticalHitChance {
  private static readonly BASE_CHC: number = 0.05;
  private static readonly MAX_CHC: number = 1;

  public static Calculate(intelligence: number, modifier: number = 1): number {
    // Formula: BASE_CHC + (Intelligence - 1) / 100 * Modifier
    return Math.min(
      (CriticalHitChance.BASE_CHC + (intelligence - 1) / 100) * modifier,
      CriticalHitChance.MAX_CHC
    );
  }
}
