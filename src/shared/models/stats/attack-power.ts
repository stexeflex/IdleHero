import { STATS_CONFIG } from '../../constants';

export class AttackPower {
  public static Calculate(strength: number, modifier: number = 1): number {
    // Formula: Base + (Faktor * (Strength - 1)^Exponent) * Modifier
    return Math.round(
      (STATS_CONFIG.ATTACK_POWER.BASE +
        STATS_CONFIG.ATTACK_POWER.ATTACK_POWER_PER_STRENGTH *
          Math.pow(strength - 1, STATS_CONFIG.ATTACK_POWER.EXPONENT)) *
        modifier
    );
  }
}
