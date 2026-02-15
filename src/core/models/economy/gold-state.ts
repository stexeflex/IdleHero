import { CURRENCY_CONFIG } from '../../constants';

export interface GoldState {
  Balance: number;
  TotalEarned: number;
  TotalSpent: number;
}

export function InitialGoldState(initialBalance = CURRENCY_CONFIG.GOLD.STARTING_AMOUNT): GoldState {
  return {
    Balance: Math.max(0, Math.floor(initialBalance)),
    TotalEarned: Math.max(0, Math.floor(initialBalance)),
    TotalSpent: 0
  };
}
