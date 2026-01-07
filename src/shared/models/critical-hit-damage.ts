export class CriticalHitDamage {
  public static Calculate(baseDamage: number, critMultiplier: number): number {
    // Formula: baseDamage * critMultiplier
    return Math.ceil(baseDamage * critMultiplier);
  }
}
