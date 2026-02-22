import {
  ACCURACY_TIERS,
  ATTACK_SPEED_TIERS,
  ATTRIBUTE_TIERS,
  BLEEDING_DAMAGE_TIERS,
  CHANCE_TIERS,
  CHARGED_DURATION_TIERS,
  CHARGING_STRIKE_DAMAGE_TIERS,
  CHARGING_STRIKE_GAIN_TIERS,
  CRIT_DAMAGE_TIERS,
  DAMAGE_FLAT_TIERS,
  MULTIHIT_CHAIN_TIERS,
  MULTIHIT_DAMAGE_TIERS
} from './affix-tier-specs.config';
import {
  AffixDefinition,
  EmptyStatSource,
  FlatAdditiveLabel,
  PercentageAdditiveLabel
} from '../../models';

import { TimestampUtils } from '../../../shared/utils';

const OFFENSE_AFFIX_DEFINITIONS: AffixDefinition[] = [
  {
    Id: 'affix_damage',
    Groups: ['Offense'],
    AllowedSlots: ['Weapon'],
    Tiers: DAMAGE_FLAT_TIERS,
    Effect: {
      ToLabel: (value: number) => FlatAdditiveLabel('Damage', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(source + `_affix_damage_${TimestampUtils.GetTimestampNow()}`);
        s.Damage.Value = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_bhc',
    Groups: ['Offense'],
    AllowedSlots: ['OffHand', 'Head', 'Chest', 'Legs', 'Feet'],
    Tiers: CHANCE_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Chance', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(source + `_affix_bhc_${TimestampUtils.GetTimestampNow()}`);
        s.Bleeding.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_chc',
    Groups: ['Offense'],
    AllowedSlots: ['OffHand', 'Head', 'Chest', 'Legs', 'Feet'],
    Tiers: CHANCE_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Critical Hit Chance', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(source + `_affix_chc_${TimestampUtils.GetTimestampNow()}`);
        s.CriticalHit.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_mhc',
    Groups: ['Offense'],
    AllowedSlots: ['OffHand', 'Head', 'Chest', 'Legs', 'Feet'],
    Tiers: CHANCE_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Chance', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(source + `_affix_mhc_${TimestampUtils.GetTimestampNow()}`);
        s.MultiHit.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_bhd',
    Groups: ['Offense'],
    AllowedSlots: ['Weapon', 'OffHand', 'Chest', 'Legs'],
    Tiers: BLEEDING_DAMAGE_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Damage', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(source + `_affix_bhd_${TimestampUtils.GetTimestampNow()}`);
        s.Bleeding.Damage = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_chd',
    Groups: ['Offense'],
    AllowedSlots: ['Weapon', 'OffHand', 'Chest', 'Legs'],
    Tiers: CRIT_DAMAGE_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Critical Hit Damage', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(source + `_affix_chd_${TimestampUtils.GetTimestampNow()}`);
        s.CriticalHit.Damage = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_mhd',
    Groups: ['Offense'],
    AllowedSlots: ['Weapon', 'OffHand', 'Chest', 'Legs'],
    Tiers: MULTIHIT_DAMAGE_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Damage', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(source + `_affix_mhd_${TimestampUtils.GetTimestampNow()}`);
        s.MultiHit.Damage = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_mh_chain',
    Groups: ['Offense'],
    AllowedSlots: ['Head', 'OffHand', 'Feet'],
    Tiers: MULTIHIT_CHAIN_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Chain', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(source + `_affix_mh_chain_${TimestampUtils.GetTimestampNow()}`);
        s.MultiHit.ChainFactor = value;
        return s;
      }
    }
  }
];
const DEFENSE_AFFIX_DEFINITIONS: AffixDefinition[] = [];
const UTILITY_AFFIX_DEFINITIONS: AffixDefinition[] = [
  {
    Id: 'affix_ias',
    Groups: ['Utility'],
    AllowedSlots: ['Weapon', 'Feet'],
    Tiers: ATTACK_SPEED_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Attack Speed', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(source + `_affix_ias_${TimestampUtils.GetTimestampNow()}`);
        s.AttackSpeed.Value = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_acc',
    Groups: ['Utility'],
    AllowedSlots: ['Head', 'Chest', 'Legs', 'Feet'],
    Tiers: ACCURACY_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Accuracy', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(source + `_affix_acc_${TimestampUtils.GetTimestampNow()}`);
        s.Accuracy.Value = value;
        return s;
      }
    }
  }
];

const CHARGING_STRIKE_AFFIX_DEFINITIONS: AffixDefinition[] = [
  {
    Id: 'affix_cs_gain',
    Groups: ['Charging Strike'],
    AllowedSlots: ['Weapon', 'OffHand'],
    Tiers: CHARGING_STRIKE_GAIN_TIERS,
    Effect: {
      ToLabel: (value: number) => FlatAdditiveLabel('Charge Gain per Hit', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(source + `_affix_cs_gain_${TimestampUtils.GetTimestampNow()}`);
        s.ChargingStrike.ChargeGain = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_csd',
    Groups: ['Charging Strike'],
    AllowedSlots: ['Weapon', 'OffHand'],
    Tiers: CHARGING_STRIKE_DAMAGE_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Charged Damage', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(source + `_affix_csd_${TimestampUtils.GetTimestampNow()}`);
        s.ChargingStrike.ChargeDamage = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_cs_duration',
    Groups: ['Charging Strike'],
    AllowedSlots: ['OffHand', 'Chest'],
    Tiers: CHARGED_DURATION_TIERS,
    Effect: {
      ToLabel: (value: number) => FlatAdditiveLabel('s Charged Duration', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(
          source + `_affix_cs_duration_${TimestampUtils.GetTimestampNow()}`
        );
        s.ChargingStrike.ChargeDuration = value;
        return s;
      }
    }
  }
];

export const AFFIX_DEFINITIONS: AffixDefinition[] = [
  ...OFFENSE_AFFIX_DEFINITIONS,
  ...DEFENSE_AFFIX_DEFINITIONS,
  ...UTILITY_AFFIX_DEFINITIONS,
  ...CHARGING_STRIKE_AFFIX_DEFINITIONS
];
