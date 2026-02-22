import { STATS_CONFIG } from '../../../constants';

export interface ChargeState {
  Current: number;
  Max: number;
  Charged: boolean;
}

export function InitialHeroCharge(): ChargeState {
  return {
    Current: 0,
    Max: STATS_CONFIG.BASE.CHARGE_MAX,
    Charged: false
  };
}
