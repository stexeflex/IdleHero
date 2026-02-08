import {
  Boss,
  BossIcon,
  InitialActorState,
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

//#region SLIMES
export function Gooey(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'slime-cave-1',
    Name: 'Gooey Slime',
    BossIcon: BossIcon('gooeydaemon', true),
    Life: InitialLife(100)
  };
}

export function Slime(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'slime-cave-2',
    Name: 'Slime',
    BossIcon: BossIcon('slime', true),
    Life: InitialLife(250)
  };
}

export function Slug(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'slime-cave-mid',
    Name: 'Slug',
    BossIcon: BossIcon('graspingslug', true),
    Life: InitialLife(1000)
  };
}

export function KingSlime(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'slime-cave-boss',
    Name: 'Cyclop',
    BossIcon: BossIcon('jawlesscyclop'),
    Life: InitialLife(5000)
  };
}
//#endregion SLIMES

//#region BRUTES
export function Troglodyte(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'brute-lair-1',
    Name: 'Troglodyte',
    BossIcon: BossIcon('troglodyte', true),
    Life: InitialLife(250)
  };
}
export function EvilMinion(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'brute-lair-2',
    Name: 'Evil Minion',
    BossIcon: BossIcon('evilminion', true),
    Life: InitialLife(750)
  };
}
export function BullyMinion(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'brute-lair-mid-1',
    Name: 'Bully Minion',
    BossIcon: BossIcon('bullyminion', true),
    Life: InitialLife(3000)
  };
}
export function Brute(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'brute-lair-mid-2',
    Name: 'Brute',
    BossIcon: BossIcon('brute'),
    Life: InitialLife(6000)
  };
}
export function Minotaur(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'brute-lair-boss',
    Name: 'Minotaur',
    BossIcon: BossIcon('minotaur'),
    Life: InitialLife(15000)
  };
}
//#endregion BRUTES
