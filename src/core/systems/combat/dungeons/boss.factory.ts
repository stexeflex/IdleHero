import {
  Boss,
  InitialArmor,
  InitialAttackInterval,
  InitialCombatStats,
  InitialLife,
  NoArmor
} from '../../../models';

export function Gooey(): Boss {
  return {
    Id: 'slime-cave-1',
    Name: 'Gooey Slime',
    BossIcon: 'gooeydaemon',

    Life: InitialLife(100),
    Armor: NoArmor(),
    Stats: InitialCombatStats(0.5, 2, 0.0, 0.0),
    AttackInterval: InitialAttackInterval(0.5)
  };
}

export function Slime(): Boss {
  return {
    Id: 'slime-cave-2',
    Name: 'Slime',
    BossIcon: 'slime',

    Life: InitialLife(250),
    Armor: NoArmor(),
    Stats: InitialCombatStats(0.5, 2, 0.0, 0.0),
    AttackInterval: InitialAttackInterval(0.5)
  };
}

export function Slug(): Boss {
  return {
    Id: 'slime-cave-mid',
    Name: 'Slug',
    BossIcon: 'graspingslug',

    Life: InitialLife(1000),
    Armor: InitialArmor(1),
    Stats: InitialCombatStats(0.5, 2, 0.0, 0.0),
    AttackInterval: InitialAttackInterval(0.5)
  };
}

export function KingSlime(): Boss {
  return {
    Id: 'slime-cave-boss',
    Name: 'Cylop',
    BossIcon: 'jawlesscyclop',

    Life: InitialLife(2000),
    Armor: InitialArmor(5),
    Stats: InitialCombatStats(0.6, 6, 0.05, 0.02),
    AttackInterval: InitialAttackInterval(0.6)
  };
}
