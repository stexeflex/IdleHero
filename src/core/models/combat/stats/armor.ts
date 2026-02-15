export type ArmorType = 'Physical' | 'Magical';

export interface Armor {
  Armor: number;
  MaxArmor: number;
  Type: ArmorType;
}

export function InitialArmor(armor: number): Armor {
  return {
    Armor: armor,
    MaxArmor: armor,
    Type: 'Physical'
  };
}

export function NoArmor(): Armor {
  return {
    Armor: 0,
    MaxArmor: 0,
    Type: 'Physical'
  };
}
