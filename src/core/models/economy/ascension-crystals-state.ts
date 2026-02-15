export interface AscensionCrystalsState {
  Balance: number;
  TotalEarned: number;
  TotalSpent: number;
}

export function InitialAscensionCrystalsState(initialBalance = 0): AscensionCrystalsState {
  return {
    Balance: Math.max(0, Math.floor(initialBalance)),
    TotalEarned: Math.max(0, Math.floor(initialBalance)),
    TotalSpent: 0
  };
}
