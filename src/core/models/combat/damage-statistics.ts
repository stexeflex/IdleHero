export interface DamageStatistics {
  HighestSingleHit: number;
  HighestChargedHit: number;
  HighestBleedingTick: number;
  HighestCriticalHit: number;

  HighestMultiHit: number;
  HighestChargedMultiHit: number;
  HighestCriticalMultiHit: number;
  HighestChargedCriticalMultiHit: number;
  HighestMultiHitChain: number;

  HighestTotalHit: number;
  HighestChargedTotalHit: number;

  HighestSplashHit: number;
}

export function InitialDamageStatistics(): DamageStatistics {
  return {
    HighestSingleHit: 0,
    HighestChargedHit: 0,
    HighestBleedingTick: 0,
    HighestCriticalHit: 0,

    HighestMultiHit: 0,
    HighestChargedMultiHit: 0,
    HighestCriticalMultiHit: 0,
    HighestChargedCriticalMultiHit: 0,
    HighestMultiHitChain: 0,

    HighestTotalHit: 0,
    HighestChargedTotalHit: 0,

    HighestSplashHit: 0
  };
}
