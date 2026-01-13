import { STATS_CONFIG } from '../../constants';

export class AttackSpeed {
  /**
   * Berechnet die Angriffe pro Sekunde (APS)
   */
  public static Calculate(dexterity: number, bonus: number, modifier: number = 1): number {
    // 1. Dexterity Bonus berechnen (1% Speed pro Punkt)
    const dexBonus = (dexterity - 1) * STATS_CONFIG.ATTACK_SPEED.ATTACK_SPEED_PER_DEXTERITY;

    // 2. Additive Boni zusammenrechnen (IAS - Increased Attack Speed)
    // Dex und Gear werden meist addiert, um extremen Power-Creep zu vermeiden
    const totalAdditiveBonus = 1 + dexBonus + bonus;

    // 3. Multiplikatoren anwenden
    const finalAps = STATS_CONFIG.ATTACK_SPEED.BASE * totalAdditiveBonus * modifier;

    return Number(finalAps.toFixed(2));
  }
}
