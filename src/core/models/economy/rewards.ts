export interface Rewards {
  Gold: number;
  Experience: number;
}

export function ZeroRewards(): Rewards {
  return { Gold: 0, Experience: 0 };
}
