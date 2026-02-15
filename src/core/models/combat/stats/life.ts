export interface Life {
  Hp: number;
  MaxHp: number;
  Alive: boolean;
}

export function InitialLife(hp: number): Life {
  return {
    Hp: hp,
    MaxHp: hp,
    Alive: true
  };
}

export function ResetLife(life: Life): Life {
  return {
    Hp: life.MaxHp,
    MaxHp: life.MaxHp,
    Alive: true
  };
}
