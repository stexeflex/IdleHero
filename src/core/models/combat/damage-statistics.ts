export interface DamageStatistics {
  HighestSingleHit: number;
  HighestBleedingTick: number;
  HighestCriticalHit: number;

  HighestMultiHit: number;
  HighestCriticalMultiHit: number;
  HighestMultiHitChain: number;

  HighestChargedHit: number;
  HighestChargedBleedingTick: number;
  HighestChargedCriticalHit: number;
  HighestChargedMultiHit: number;
  HighestChargedCriticalMultiHit: number;

  HighestTotalHit: number;
  HighestChargedTotalHit: number;

  HighestSplashHit: number;
}

export function InitialDamageStatistics(): DamageStatistics {
  return {
    HighestSingleHit: 0,
    HighestBleedingTick: 0,
    HighestCriticalHit: 0,

    HighestMultiHit: 0,
    HighestCriticalMultiHit: 0,
    HighestMultiHitChain: 0,

    HighestChargedHit: 0,
    HighestChargedBleedingTick: 0,
    HighestChargedCriticalHit: 0,
    HighestChargedMultiHit: 0,
    HighestChargedCriticalMultiHit: 0,

    HighestTotalHit: 0,
    HighestChargedTotalHit: 0,

    HighestSplashHit: 0
  };
}
