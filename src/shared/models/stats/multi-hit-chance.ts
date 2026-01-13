import { STATS_CONFIG } from '../../constants';

export class MultiHitChance {
  /**
   * Berechnet die Multi-Hit-Chance mit Diminishing Returns.
   * Formel: 1 - (Base * Dex * Gear) * Modifier
   */
  public static Calculate(dexterity: number, bonus: number, modifier: number = 1): number {
    // 1. Chance durch Dexterity (0.5% pro Punkt)
    const dexChance = (dexterity - 1) * STATS_CONFIG.MHC.MHC_PER_DEXTERITY;

    // 2. Multiplikative Kombination der Basis-Chancen
    // Wir berechnen die Wahrscheinlichkeit, NICHT zu multi-hitten
    const chanceNotToMultiHit = (1 - STATS_CONFIG.MHC.BASE) * (1 - dexChance) * (1 - bonus);

    // 3. Finale Chance berechnen
    let finalChance = 1 - chanceNotToMultiHit;

    // 4. Modifier anwenden
    finalChance *= modifier;

    // 5. Hard-Cap
    return Math.min(finalChance, STATS_CONFIG.MHC.MAX);
  }
}
