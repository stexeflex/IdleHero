export interface Armor {
  Armor: number;
  MaxArmor: number;
}

export function InitialArmor(armor: number): Armor {
  return {
    Armor: armor,
    MaxArmor: armor
  };
}

export function NoArmor(): Armor {
  return {
    Armor: 0,
    MaxArmor: 0
  };
}
