export class CriticalHitChance {
  private static readonly BASE_CHC: number = 0.01;
  private static readonly MAX_CHC: number = 1;
  private static readonly CHC_PER_INTELLIGENCE: number = 0.01;

  /**
   * Berechnet die Crit-Chance mit Diminishing Returns.
   * Formel: 1 - (Base * Int * Gear) * Modifier
   */
  public static Calculate(intelligence: number, bonus: number, modifier: number = 1): number {
    // // Formula: BASE_CHC + (Intelligence - 1) / 100  * Bonus * Modifier
    // return Math.min(
    //   (CriticalHitChance.BASE_CHC + (intelligence - 1) / 100) * (1 + bonus) * modifier,
    //   CriticalHitChance.MAX_CHC
    // );

    // 1. Chance durch Intelligenz (1% pro Punkt)
    const intChance = (intelligence - 1) * CriticalHitChance.CHC_PER_INTELLIGENCE;

    // 2. Multiplikative Kombination der Basis-Chancen
    // Wir berechnen die Wahrscheinlichkeit, NICHT zu critten
    const chanceNotToCrit = (1 - CriticalHitChance.BASE_CHC) * (1 - intChance) * (1 - bonus);

    // 3. Finale Chance berechnen
    let finalChance = 1 - chanceNotToCrit;

    // 4. Modifier anwenden
    finalChance *= modifier;

    // 5. Hard-Cap
    return Math.min(finalChance, CriticalHitChance.MAX_CHC);
  }
}
