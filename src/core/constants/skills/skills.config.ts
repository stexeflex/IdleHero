import {
  ActiveSkillDefinition,
  EmptyStatSource,
  FlatAdditiveLabel,
  PassiveSkillDefinition,
  Passives,
  PercentageAdditiveLabel,
  StatSkillDefinition
} from '../../models';

import { TimestampUtils } from '../../../shared/utils';

const ATTACK_POWER_I_SKILL: StatSkillDefinition = {
  Id: 'ATP_I',
  Name: 'Vile Strike',
  Description: 'Increases the damage of your attacks.',
  Tier: 'I',
  Type: 'StatBoost',
  Levels: [
    { Level: 1, Value: 5, Type: 'Flat' },
    { Level: 2, Value: 10, Type: 'Flat' },
    { Level: 3, Value: 20, Type: 'Flat' }
  ],
  Effect: {
    ToLabel: (value: number) => FlatAdditiveLabel('Damage', value),
    MapToStatSource: (source: string, value: number) => {
      const s = EmptyStatSource(source + `_${TimestampUtils.GetTimestampNow()}`);
      s.Damage.Value = value;
      return s;
    }
  }
};

const ATTACK_POWER_II_SKILL: StatSkillDefinition = {
  Id: 'ATP_II',
  Name: 'Vile Strike+',
  Description: 'Increases the damage of your attacks even further.',
  Tier: 'II',
  Type: 'StatBoost',
  Levels: [
    { Level: 1, Value: 30, Type: 'Flat' },
    { Level: 2, Value: 40, Type: 'Flat' },
    { Level: 3, Value: 50, Type: 'Flat' }
  ],
  Effect: {
    ToLabel: (value: number) => FlatAdditiveLabel('Damage', value),
    MapToStatSource: (source: string, value: number) => {
      const s = EmptyStatSource(source + `_${TimestampUtils.GetTimestampNow()}`);
      s.Damage.Value = value;
      return s;
    }
  }
};

const ATTACK_POWER_III_SKILL: StatSkillDefinition = {
  Id: 'ATP_III',
  Name: 'Vile Strike++',
  Description: 'Increases the damage of your attacks to the maximum level.',
  Tier: 'III',
  Type: 'StatBoost',
  Levels: [
    { Level: 1, Value: 50, Type: 'Flat' },
    { Level: 2, Value: 75, Type: 'Flat' },
    { Level: 3, Value: 100, Type: 'Flat' }
  ],
  Effect: {
    ToLabel: (value: number) => FlatAdditiveLabel('Damage', value),
    MapToStatSource: (source: string, value: number) => {
      const s = EmptyStatSource(source + `_${TimestampUtils.GetTimestampNow()}`);
      s.Damage.Value = value;
      return s;
    }
  }
};

const ATTACK_SPEED_SKILL: StatSkillDefinition = {
  Id: 'IAS',
  Name: 'Haste',
  Description: 'Increases the speed of your attacks.',
  Tier: 'I',
  Type: 'StatBoost',
  Levels: [
    { Level: 1, Value: 0.05, Type: 'Percent' },
    { Level: 2, Value: 0.1, Type: 'Percent' },
    { Level: 3, Value: 0.15, Type: 'Percent' },
    { Level: 4, Value: 0.2, Type: 'Percent' },
    { Level: 5, Value: 0.25, Type: 'Percent' }
  ],
  Effect: {
    ToLabel: (value: number) => PercentageAdditiveLabel('Attack Speed', value),
    MapToStatSource: (source: string, value: number) => {
      const s = EmptyStatSource(source + `_${TimestampUtils.GetTimestampNow()}`);
      s.AttackSpeed.Value = value;
      return s;
    }
  }
};

const BLEEDING_TICKS_SKILL: StatSkillDefinition = {
  Id: 'BTS',
  Name: 'Hemorrhage',
  Description: 'Increases the number of bleeding ticks applied by your attacks.',
  Tier: 'II',
  Type: 'StatBoost',
  Levels: [
    { Level: 1, Value: 1, Type: 'Flat' },
    { Level: 2, Value: 2, Type: 'Flat' },
    { Level: 3, Value: 3, Type: 'Flat' }
  ],
  Effect: {
    ToLabel: (value: number) => FlatAdditiveLabel('Bleeding Ticks', value),
    MapToStatSource: (source: string, value: number) => {
      const s = EmptyStatSource(source + `_${TimestampUtils.GetTimestampNow()}`);
      s.Bleeding.Ticks = value;
      return s;
    }
  }
};

const MULTI_HIT_CHAIN_SKILL: StatSkillDefinition = {
  Id: 'MAX_MH_CHAIN',
  Name: 'Chain Reaction',
  Description: 'Increases the maximum chain length of your multi hit attacks.',
  Tier: 'II',
  Type: 'StatBoost',
  Levels: [
    { Level: 1, Value: 1, Type: 'Flat' },
    { Level: 2, Value: 2, Type: 'Flat' },
    { Level: 3, Value: 3, Type: 'Flat' },
    { Level: 4, Value: 4, Type: 'Flat' },
    { Level: 5, Value: 5, Type: 'Flat' },
    { Level: 6, Value: 6, Type: 'Flat' }
  ],
  Effect: {
    ToLabel: (value: number) => FlatAdditiveLabel('Multi Hit Chain', value),
    MapToStatSource: (source: string, value: number) => {
      const s = EmptyStatSource(source + `_${TimestampUtils.GetTimestampNow()}`);
      s.MultiHit.Chain = value;
      return s;
    }
  }
};

const CHARGING_STRIKE_LOSS_SKILL: StatSkillDefinition = {
  Id: 'CSLS',
  Name: 'Unyielding Charge',
  Description: 'Reduces the charge loss from missed attacks on your Charging Strike.',
  Tier: 'I',
  Type: 'StatBoost',
  Levels: [
    { Level: 1, Value: -0.25, Type: 'Percent' },
    { Level: 2, Value: -0.5, Type: 'Percent' },
    { Level: 3, Value: -0.75, Type: 'Percent' },
    { Level: 4, Value: -1.0, Type: 'Percent' }
  ],
  Effect: {
    ToLabel: (value: number) => PercentageAdditiveLabel('Charge Loss', value),
    MapToStatSource: (source: string, value: number) => {
      const s = EmptyStatSource(source + `_${TimestampUtils.GetTimestampNow()}`);
      s.ChargingStrike.ChargeLossPercentage = value;
      return s;
    }
  }
};

const CHARGING_STRIKE_DURATION_SKILL: StatSkillDefinition = {
  Id: 'CSD',
  Name: 'Enduring Charge',
  Description: 'Increases the duration of your Charging Strike.',
  Tier: 'III',
  Type: 'StatBoost',
  Levels: [
    { Level: 1, Value: 1, Type: 'Flat' },
    { Level: 2, Value: 2, Type: 'Flat' },
    { Level: 3, Value: 3, Type: 'Flat' },
    { Level: 4, Value: 4, Type: 'Flat' },
    { Level: 5, Value: 5, Type: 'Flat' }
  ],
  Effect: {
    ToLabel: (value: number) => FlatAdditiveLabel('Second(s) Charge Duration', value),
    MapToStatSource: (source: string, value: number) => {
      const s = EmptyStatSource(source + `_${TimestampUtils.GetTimestampNow()}`);
      s.ChargingStrike.ChargeDuration = value;
      return s;
    }
  }
};

export const STAT_SKILL_DEFINITIONS: StatSkillDefinition[] = [
  ATTACK_POWER_I_SKILL,
  ATTACK_POWER_II_SKILL,
  ATTACK_POWER_III_SKILL,
  ATTACK_SPEED_SKILL,
  BLEEDING_TICKS_SKILL,
  MULTI_HIT_CHAIN_SKILL,
  CHARGING_STRIKE_LOSS_SKILL,
  CHARGING_STRIKE_DURATION_SKILL
];

export const ACTIVE_SKILL_DEFINITIONS: ActiveSkillDefinition[] = [];

const MULTI_HIT_CRIT_SKILL: PassiveSkillDefinition = {
  Id: 'CRITICAL_MH',
  Name: 'Deadly Flurry',
  Description: 'Your multi hit attacks have a chance to critically strike on each hit.',
  Tier: 'II',
  Type: 'Passive',
  MapToPassiveEffect: (passives: Passives) => {
    passives.CriticalMultiHit = true;
    return passives;
  }
};

const SPLASH_DAMAGE_SKILL: PassiveSkillDefinition = {
  Id: 'SPLASH_DAMAGE',
  Name: 'Overflowing Splashes',
  Description: 'Your damage overflow from attacks hits the next enemy.',
  Tier: 'II',
  Type: 'Passive',
  MapToPassiveEffect: (passives: Passives) => {
    passives.SplashDamage = true;
    return passives;
  }
};

export const PASSIVE_SKILL_DEFINITIONS: PassiveSkillDefinition[] = [
  MULTI_HIT_CRIT_SKILL,
  SPLASH_DAMAGE_SKILL
];
