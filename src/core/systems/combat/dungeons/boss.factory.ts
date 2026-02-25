import {
  Boss,
  BossIcon,
  InitialActorState,
  InitialAttackInterval,
  InitialBossStats,
  InitialLife,
  NoArmor
} from '../../../models';

import { DUNGEON_SPECIAL_BOSS_CONFIG } from '../../../constants';

function DefaultBoss(): Partial<Boss> {
  return {
    Life: InitialLife(0),
    Armor: NoArmor(),
    Stats: InitialBossStats(0, 0, 0),
    AttackInterval: InitialAttackInterval(0),
    State: InitialActorState(),
    IsElite: false,
    IsEndboss: false
  };
}

export function Mimic(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: DUNGEON_SPECIAL_BOSS_CONFIG.MIMIC_ID,
    Name: 'Mimic',
    BossIcon: BossIcon('mimicchest', true)
  };
}

export function Djinn(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: DUNGEON_SPECIAL_BOSS_CONFIG.DJINN_ID,
    Name: 'Djinn',
    BossIcon: BossIcon('djinn', false)
  };
}

//#region SLIMES
export function Gooey(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'slime-cave-1',
    Name: 'Gooey Slime',
    BossIcon: BossIcon('gooeydaemon', true)
  };
}

export function VileFluid(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'slime-cave-2',
    Name: 'Vile Fluid',
    BossIcon: BossIcon('vilefluid', false)
  };
}

export function Slime(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'slime-cave-3',
    Name: 'Slime',
    BossIcon: BossIcon('slime', true)
  };
}

export function Slug(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'slime-cave-4',
    Name: 'Slug',
    BossIcon: BossIcon('graspingslug', true)
  };
}

export function KingSlime(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'slime-cave-boss',
    Name: 'Cyclop',
    BossIcon: BossIcon('jawlesscyclop')
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
    BossIcon: BossIcon('troglodyte', true)
  };
}
export function EvilMinion(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'brute-lair-2',
    Name: 'Evil Minion',
    BossIcon: BossIcon('evilminion', true)
  };
}
export function BullyMinion(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'brute-lair-3',
    Name: 'Bully Minion',
    BossIcon: BossIcon('bullyminion', true)
  };
}
export function Brute(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'brute-lair-4',
    Name: 'Brute',
    BossIcon: BossIcon('brute')
  };
}
export function Minotaur(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'brute-lair-boss',
    Name: 'Minotaur',
    BossIcon: BossIcon('minotaur')
  };
}
//#endregion BRUTES

//#region SNAKES
export function RattleSnake(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'snake-den-1',
    Name: 'Rattle Snake',
    BossIcon: BossIcon('rattlesnake')
  };
}
export function ViperSnake(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'snake-den-2',
    Name: 'Viper',
    BossIcon: BossIcon('poisonsnake')
  };
}
export function SandSnake(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'snake-den-3',
    Name: 'Sand Snake',
    BossIcon: BossIcon('sandsnake', true)
  };
}
export function MambaSnake(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'snake-den-4',
    Name: 'Mamba',
    BossIcon: BossIcon('snake', true)
  };
}
export function PythonSnake(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'snake-den-5',
    Name: 'Python',
    BossIcon: BossIcon('snaketongue')
  };
}
export function CobraSnake(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'snake-den-5',
    Name: 'Cobra',
    BossIcon: BossIcon('cobra', true)
  };
}
export function SeaSerpent(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'snake-den-boss',
    Name: 'Sea Serpent',
    BossIcon: BossIcon('seaserpent', true)
  };
}
//#endregion SNAKES

//#region GOLEMS
export function RockGolem(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'golem-quarry-1',
    Name: 'Rock Golem',
    BossIcon: BossIcon('rockgolem', false)
  };
}
export function IceGolem(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'golem-quarry-2',
    Name: 'Ice Golem',
    BossIcon: BossIcon('icegolem', false)
  };
}
export function ShamblingMound(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'golem-quarry-3',
    Name: 'Shambling Mound',
    BossIcon: BossIcon('shamblingmound', true)
  };
}
export function RobotGolem(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'golem-quarry-4',
    Name: 'Robot Golem',
    BossIcon: BossIcon('robotgolem', false)
  };
}
export function BattleMechGolem(): Boss {
  const boss = DefaultBoss() as Boss;
  return {
    ...boss,
    Id: 'golem-quarry-boss',
    Name: 'Battle Mech Golem',
    BossIcon: BossIcon('battlemech', false)
  };
}
//#endregion GOLEMS