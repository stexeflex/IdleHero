import { STATS_CONFIG } from '../../constants';

export class CriticalHitChance {
  /**
   * Berechnet die Crit-Chance mit Diminishing Returns.
   * Formel: 1 - (Base * Int * Gear) * Modifier
   */
  public static Calculate(intelligence: number, bonus: number, modifier: number = 1): number {
    // 1. Chance durch Intelligenz (1% pro Punkt)
    const intChance = (intelligence - 1) * STATS_CONFIG.CHC.CHC_PER_INTELLIGENCE;

    // 2. Multiplikative Kombination der Basis-Chancen
    // Wir berechnen die Wahrscheinlichkeit, NICHT zu critten
    const chanceNotToCrit = (1 - STATS_CONFIG.CHC.BASE) * (1 - intChance) * (1 - bonus);

    // 3. Finale Chance berechnen
    let finalChance = 1 - chanceNotToCrit;

    // 4. Modifier anwenden
    finalChance *= modifier;

    // 5. Hard-Cap
    return Math.min(finalChance, STATS_CONFIG.CHC.MAX);
  }
}
