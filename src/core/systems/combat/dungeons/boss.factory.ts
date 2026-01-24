import {
  InitialArmor,
  InitialAttackInterval,
  InitialCombatStats,
  InitialLife,
  NoArmor
} from '../../../models';

import { Boss } from '../../../models/combat/actors/boss.';

export function Slime(): Boss {
  return {
    Id: 'slime-001',
    Name: 'Slime',

    Life: InitialLife(10),
    Armor: NoArmor(),
    Stats: InitialCombatStats(0.5, 2, 0.0, 0.0),
    AttackInterval: InitialAttackInterval(0.5)
  };
}

export function KingSlime(): Boss {
  return {
    Id: 'slime-king-020',
    Name: 'King Slime',

    Life: InitialLife(80),
    Armor: InitialArmor(5),
    Stats: InitialCombatStats(0.6, 6, 0.05, 0.02),
    AttackInterval: InitialAttackInterval(0.6)
  };
}

export function Goblin(): Boss {
  return {
    Id: 'goblin-002',
    Name: 'Goblin',

    Life: InitialLife(18),
    Armor: InitialArmor(1),
    Stats: InitialCombatStats(0.8, 3, 0.1, 0.1),
    AttackInterval: InitialAttackInterval(0.8)
  };
}

export function Wolf(): Boss {
  return {
    Id: 'wolf-003',
    Name: 'Wolf',

    Life: InitialLife(22),
    Armor: InitialArmor(0),
    Stats: InitialCombatStats(1.2, 5, 0.2, 0.15),
    AttackInterval: InitialAttackInterval(1.2)
  };
}
