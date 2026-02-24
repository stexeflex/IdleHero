/**
 * Parameters for boss HP scaling per dungeon.
 *
 * Formula:
 * HP   = H0 * EXP     * POLY
 * H(n) = H0 * r^(n-1) * (1 + a*(n-1)^b)
 */
export interface DungeonBossScalingParams {
  BossBaseHealth: number; // Base health for the Boss at stage 1
  r: number; // exponential per-stage multiplier (e.g., 1.08 – 1.15)
  a: number; // polynomial coefficient (e.g., 0.003 – 0.02)
  b: number; // polynomial exponent (e.g., 1.5 – 2.5)
  MidBossMultiplier: number; // multiplier for mid-boss stages (e.g., ×3–×6)
  EndBossMultiplier: number; // multiplier for end-boss stages (e.g., ×8–×20)
}

export const DUNGEON_BOSS_SCALING: Record<string, DungeonBossScalingParams> = {
  D1: {
    BossBaseHealth: 100,
    r: 1.038,
    a: 0.0012,
    b: 1.7,
    MidBossMultiplier: 3,
    EndBossMultiplier: 6
  },
  D2: {
    BossBaseHealth: 1_000,
    r: 1.038,
    a: 0.0012,
    b: 1.7,
    MidBossMultiplier: 4,
    EndBossMultiplier: 7
  },
  D3: {
    BossBaseHealth: 50_000,
    r: 1.022,
    a: 0.0012,
    b: 1.5,
    MidBossMultiplier: 4,
    EndBossMultiplier: 6
  },
  D4: {
    BossBaseHealth: 200_000,
    r: 1.016,
    a: 0.001,
    b: 1.45,
    MidBossMultiplier: 3,
    EndBossMultiplier: 7
  }
};

export function GetScalingParamsForDungeon(dungeonId: string): DungeonBossScalingParams {
  return DUNGEON_BOSS_SCALING[dungeonId];
}
