export const LEVELING_CONFIG = {
  BASE_LEVEL: 1,
  LEVEL_CAP: 50,
  BASE_XP_TO_NEXT: 100,
  /**
   * Exponent for the (total XP) power curve.
   * Higher values make mid/endgame levels take longer.
   * Calibrated so that level 1 -> 2 always costs BASE_XP_TO_NEXT.
   */
  TOTAL_XP_EXPONENT: 2.8
};
