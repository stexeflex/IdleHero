export class CriticalHitChance {
  private static readonly BASE_CHC: number = 0.05;
  private static readonly MAX_CHC: number = 1;

  public static Calculate(intelligence: number): number {
    // Formula: BASE_CHC + (Intelligence - 1) / 100
    return Math.min(
      CriticalHitChance.BASE_CHC + (intelligence - 1) / 100,
      CriticalHitChance.MAX_CHC
    );
  }
}
