import {
  BuffSkillDefinition,
  EffectSkillDefinition,
  EmptyStatSource,
  FlatAdditiveLabel,
  PassiveSkillDefinition,
  Passives,
  PercentageAdditiveLabel,
  SkillEffects,
  StatSkillDefinition
} from '../../models';

import { TimestampUtils } from '../../../shared/utils';

//#region Stat Skill Definitions
const ATTACK_POWER_I_SKILL: StatSkillDefinition = {
  Id: 'STAT_ATP_I',
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
  Id: 'STAT_ATP_II',
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
  Id: 'STAT_ATP_III',
  Name: 'Vile Strike++',
  Description: 'Increases the damage of your attacks to their maximum potential.',
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
  Id: 'STAT_IAS',
  Name: 'Quickening',
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
  Id: 'STAT_BLEEDING_TICKS',
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
  Id: 'STAT_MAX_MH_CHAIN',
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
  Id: 'STAT_CS_LOSS',
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
  Id: 'STAT_CS_DURATION',
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
//#endregion Stat Skill Definitions

//#region Passive Skill Definitions
const MULTI_HIT_CRIT_SKILL: PassiveSkillDefinition = {
  Id: 'PASSIVE_CRITICAL_MH',
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
  Id: 'PASSIVE_SPLASH_DAMAGE',
  Name: 'Overflowing Splashes',
  Description: 'Your damage overflow from attacks hits the next enemy.',
  Tier: 'III',
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
//#endregion Passive Skill Definitions

//#region Buff Skill Definitions
const BUFF_ATTACK_SPEED_SKILL: BuffSkillDefinition = {
  Id: 'BUFF_ATTACK_SPEED',
  Name: 'Haste',
  Description: 'Your movements accelerate to a relentless pace for a short duration.',
  Tier: 'I',
  Type: 'Buff',
  Duration: 20,
  Cooldown: 60,
  Icon: 'runningninja',
  ToLabel: () => [PercentageAdditiveLabel('Attack Speed', 0.5)],
  MapToStatSource: (source: string) => {
    const s = EmptyStatSource(source + `_${TimestampUtils.GetTimestampNow()}`);
    s.AttackSpeed.Value = 0.5;
    return s;
  }
};

const BUFF_BLEED_CHANCE_SKILL: BuffSkillDefinition = {
  Id: 'BUFF_BLEED_CHANCE',
  Name: 'Weeping Wounds',
  Description:
    'Inflicts your attacks with an increased chance to cause bleeding for a short duration.',
  Tier: 'I',
  Type: 'Buff',
  Duration: 20,
  Cooldown: 60,
  Icon: 'drippingblade',
  ToLabel: () => [PercentageAdditiveLabel('Bleed Chance', 0.25)],
  MapToStatSource: (source: string) => {
    const s = EmptyStatSource(source + `_${TimestampUtils.GetTimestampNow()}`);
    s.Bleeding.Chance = 0.25;
    return s;
  }
};

const BUFF_CRIT_CHANCE_SKILL: BuffSkillDefinition = {
  Id: 'BUFF_CRIT_CHANCE',
  Name: 'Critical Focus',
  Description: 'You lock onto every vulnerability with absolute precision for a short duration.',
  Tier: 'I',
  Type: 'Buff',
  Duration: 20,
  Cooldown: 60,
  Icon: 'lightningtrio',
  ToLabel: () => [PercentageAdditiveLabel('Critical Hit Chance', 0.25)],
  MapToStatSource: (source: string) => {
    const s = EmptyStatSource(source + `_${TimestampUtils.GetTimestampNow()}`);
    s.CriticalHit.Chance = 0.25;
    return s;
  }
};

const BUFF_MULTI_HIT_CHANCE_SKILL: BuffSkillDefinition = {
  Id: 'BUFF_MULTI_HIT_CHANCE',
  Name: 'Frenzy',
  Description:
    'Puts yourself in a frenzy, increasing the chance for your attacks to strike multiple times for a short duration.',
  Tier: 'I',
  Type: 'Buff',
  Duration: 20,
  Cooldown: 60,
  Icon: 'crossedswords',
  ToLabel: () => [
    PercentageAdditiveLabel('Multi Hit Chance', 0.25),
    PercentageAdditiveLabel('Multi Hit Chain', 0.1)
  ],
  MapToStatSource: (source: string) => {
    const s = EmptyStatSource(source + `_${TimestampUtils.GetTimestampNow()}`);
    s.MultiHit.Chance = 0.25;
    s.MultiHit.ChainFactor = 0.1;
    return s;
  }
};

export const BUFF_SKILL_DEFINITIONS: BuffSkillDefinition[] = [
  BUFF_ATTACK_SPEED_SKILL,
  BUFF_BLEED_CHANCE_SKILL,
  BUFF_CRIT_CHANCE_SKILL,
  BUFF_MULTI_HIT_CHANCE_SKILL
];
//#endregion Buff Skill Definitions

//#region Effect Skill Definitions
const EFFECT_WARCRY_SKILL: EffectSkillDefinition = {
  Id: 'BUFF_WAR_CRY',
  Name: 'War Cry',
  Description:
    'Unleashes a powerful war cry increasing your damage against the current boss for a short duration.',
  Tier: 'III',
  Type: 'Effect',
  Icon: 'wolfhead',
  Levels: [{ Level: 1, Value: 0.25, Type: 'Percent' }],
  MapToEffect: (effects: SkillEffects, value: number) => {
    effects.WarCry = {
      ...effects.WarCry,
      DamageIncreasePercent: value
    };
    return effects;
  }
};

const EFFECT_STRICKEN_SKILL: EffectSkillDefinition = {
  Id: 'BUFF_STRICKEN',
  Name: 'Bane of the Stricken',
  Description:
    'Each attack you make against the current boss increases the damage it takes from your attacks.',
  Tier: 'III',
  Type: 'Effect',
  Icon: 'imbricatedarrows',
  Levels: [
    { Level: 1, Value: 0.008, Type: 'Percent' },
    { Level: 2, Value: 0.01, Type: 'Percent' },
    { Level: 3, Value: 0.012, Type: 'Percent' },
    { Level: 4, Value: 0.014, Type: 'Percent' },
    { Level: 5, Value: 0.016, Type: 'Percent' }
  ],
  MapToEffect: (effects: SkillEffects, value: number) => {
    effects.Stricken = {
      ...effects.Stricken,
      DamageIncreasePerHit: value
    };
    return effects;
  }
};

export const EFFECT_SKILL_DEFINITIONS: EffectSkillDefinition[] = [
  EFFECT_WARCRY_SKILL,
  EFFECT_STRICKEN_SKILL
];
//#endregion Effect Skill Definitions

export const ALL_SKILL_DEFINITIONS = [
  ...STAT_SKILL_DEFINITIONS,
  ...PASSIVE_SKILL_DEFINITIONS,
  ...BUFF_SKILL_DEFINITIONS,
  ...EFFECT_SKILL_DEFINITIONS
];
