import { GetDungeonById } from '../../../constants/dungeons/dungeons.config';
import {
  DungeonBossScalingParams,
  GetScalingParamsForDungeon
} from '../../../constants/dungeons/dungeon-boss-scaling.config';

import type { Boss } from '../../../models';

export function SetHealth(boss: Boss, health: number): Boss {
  return {
    ...boss,
    Life: {
      ...boss.Life,
      Hp: health,
      MaxHp: health
    }
  };
}

/**
 * Calculates the health of a Boss at a given stage in a Dungeon based on the Dungeon's Boss configuration.
 * @param dungeonId The Dungeon Id to calculate for.
 * @param stage The stage number to calculate for.
 * @returns The calculated Boss health for the given stage.
 */
export function GetHealthForBossAtStage(dungeonId: string, stage: number): number {
  const dungeon = GetDungeonById(dungeonId)!;
  const scaling = GetScalingParamsForDungeon(dungeonId);

  if (!dungeon || !scaling) {
    return 1;
  }

  // Single-stage boss dungeons use config HP directly (no stage scaling curve).
  if (dungeon.StagesMax <= 1) {
    return Math.max(1, Math.round(scaling.BossBaseHealth));
  }

  let hp = ComputeBossBaseHealth(stage, scaling);

  if (stage === dungeon.StagesMax) {
    hp *= scaling.EndBossMultiplier;
  }

  if (dungeon.MidStages.includes(stage)) {
    hp *= scaling.MidBossMultiplier;
  }

  return Math.max(1, Math.round(hp));
}

/**
 * The formula incorporates both exponential and polynomial growth to create a challenging progression curve.
 *
 * Formula: H(n) = H0 * r^(n-1) * (1 + a*(n-1)^b)
 *
 * H(n):    Boss-Leben Stage n (n=1..X)
 * H0:      Basisleben Stage 1 = 100
 * r:       exponentieller Faktor pro Stage (z.B. 1.08 – 1.15)
 * a:       polynomialer Skalierungs-Koeffizient (z.B. 0.003 – 0.02)
 * b:       Polynom-Exponent (1.5 – 2.5)
 *
 * M_mid:   Zwischenboss-Multiplikator (z.B. ×3–×6)
 * M_end:   Endboss-Multiplikator (z.B. ×8–×20)
 *
 * Example 1:
 * H0 = 100, r = 1.12, a = 0.01, b = 2.0, M_mid = 3, M_end = 10
 *
 * H(1) = 100
 * H(10) ≈ 502
 * H(20) ≈ 3.972 (Zwischenboss ≈ 11.916 mit M_mid=3)
 * H(30) ≈ 25.173
 * H(40) ≈ 135.600 (Endboss ≈ 1 356.000 mit M_end=10)
 *
 * Example 2:
 * H0 = 100, r = 1.038, a = 0.0012, b = 1.7, M_mid = 4, M_end = 8
 *
 * H(1) = 100
 * H(10) ≈ 147
 * H(30) ≈ 403 (Zwischenboss ≈ 1.612 mit M_mid=4)
 * H(60) ≈ 2.013 (Zwischenboss ≈ 8.052 mit M_mid=4)
 * H(100) ≈ 15.907 (Endboss ≈ 127.256 mit M_end=8)
 *
 * @param stage The stage number to calculate for.
 * @param scaling The scaling parameters for the dungeon.
 * @returns The base health of the boss at the given stage.
 */
function ComputeBossBaseHealth(stage: number, scaling: DungeonBossScalingParams): number {
  const H0 = scaling.BossBaseHealth;
  const n = Math.max(1, Math.floor(stage));
  const exp = Math.pow(scaling.r, n - 1);
  const poly = 1 + scaling.a * Math.pow(n - 1, scaling.b);

  const hp = H0 * exp * poly;

  return Math.max(1, Math.round(hp));
}
