import {
  Boss,
  InitialActorState,
  InitialArmor,
  InitialAttackInterval,
  InitialBossStats,
  InitialLife,
  NoArmor
} from '../../../models';

function DefaultBoss(): Partial<Boss> {
  return {
    Armor: NoArmor(),
    Stats: InitialBossStats(0, 0, 0),
    AttackInterval: InitialAttackInterval(0),
    State: InitialActorState()
  };
}

export function Gooey(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'slime-cave-1',
    Name: 'Gooey Slime',
    BossIcon: 'gooeydaemon',
    Life: InitialLife(100)
  };
}

export function Slime(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'slime-cave-2',
    Name: 'Slime',
    BossIcon: 'slime',
    Life: InitialLife(250)
  };
}

export function Slug(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'slime-cave-mid',
    Name: 'Slug',
    BossIcon: 'graspingslug',
    Life: InitialLife(1000)
  };
}

export function KingSlime(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'slime-cave-boss',
    Name: 'Cylop',
    BossIcon: 'jawlesscyclop',
    Life: InitialLife(5000)
  };
}
