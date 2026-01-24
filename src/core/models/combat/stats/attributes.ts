export interface Attributes {
  Strength: number;
  Intelligence: number;
  Dexterity: number;
}

export function InitialAttributes(): Attributes {
  return {
    Strength: 1,
    Intelligence: 1,
    Dexterity: 1
  };
}
