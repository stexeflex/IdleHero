export interface GoldState {
  Balance: number;
  TotalEarned: number;
  TotalSpent: number;
}

export function InitialGoldState(initialBalance = 0): GoldState {
  return {
    Balance: Math.max(0, Math.floor(initialBalance)),
    TotalEarned: Math.max(0, Math.floor(initialBalance)),
    TotalSpent: 0
  };
}
