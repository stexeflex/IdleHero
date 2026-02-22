export interface DamageStatistics {
  HighestSingleHit: number;
  HighestBleedingTick: number;
  HighestCriticalHit: number;

  HighestMultiHit: number;
  HighestCriticalMultiHit: number;
  HighestMultiHitChain: number;

  HighestChargedSingleHit: number;
  HighestChargedBleedingTick: number;
  HighestChargedCriticalHit: number;
  HighestChargedMultiHit: number;
  HighestChargedCriticalMultiHit: number;

  HighestHit: number;
  HighestChargedHit: number;

  HighestSplashHit: number;

  HighestTotalHit: number;
}

export function InitialDamageStatistics(): DamageStatistics {
  return {
    HighestSingleHit: 0,
    HighestBleedingTick: 0,
    HighestCriticalHit: 0,

    HighestMultiHit: 0,
    HighestCriticalMultiHit: 0,
    HighestMultiHitChain: 0,

    HighestChargedSingleHit: 0,
    HighestChargedBleedingTick: 0,
    HighestChargedCriticalHit: 0,
    HighestChargedMultiHit: 0,
    HighestChargedCriticalMultiHit: 0,

    HighestHit: 0,
    HighestChargedHit: 0,

    HighestSplashHit: 0,

    HighestTotalHit: 0
  };
}
