export class MultiHitChance {
  private static readonly BASE_MHC: number = 0.0;
  private static readonly MAX_MHC: number = 0.5;
  private static readonly MHC_PER_DEXTERITY: number = 0.005;

  public static Calculate(dexterity: number): number {
    // Formula: BASE_MHC + (Dexterity - 1) * MHC_PER_DEXTERITY
    return Math.min(
      MultiHitChance.BASE_MHC + (dexterity - 1) * MultiHitChance.MHC_PER_DEXTERITY,
      MultiHitChance.MAX_MHC
    );
  }
}
