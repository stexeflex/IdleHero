import { ATTRIBUTES_CONFIG } from '../../../constants';

export interface Attributes {
  Strength: number;
  Intelligence: number;
  Dexterity: number;
}

export function InitialAttributes(): Attributes {
  return {
    Strength: ATTRIBUTES_CONFIG.BASE.STRENGTH,
    Intelligence: ATTRIBUTES_CONFIG.BASE.INTELLIGENCE,
    Dexterity: ATTRIBUTES_CONFIG.BASE.DEXTERITY
  };
}

export function ZeroAttributes(): Attributes {
  return {
    Strength: 0,
    Intelligence: 0,
    Dexterity: 0
  };
}
