import { Life } from '../../models';

export function TakeDamage(life: Life, damage: number): Life {
  life.Hp = Math.max(0, life.Hp - damage);

  if (life.Hp <= 0) {
    life.Alive = false;
  }

  return life;
}

export function HealLife(life: Life, amount: number): Life {
  if (!life.Alive) return life;

  life.Hp = Math.min(life.MaxHp, life.Hp + amount);

  return life;
}
