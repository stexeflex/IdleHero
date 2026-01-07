export class MultiHitDamage {
  public static Calculate(baseDamage: number, multiHitMultiplier: number): number {
    // Formula: baseDamage * multiHitMultiplier
    return Math.ceil(baseDamage * multiHitMultiplier);
  }
}
