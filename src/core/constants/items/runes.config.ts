import {
  EmptyStatSource,
  FlatAdditiveLabel,
  PercentageAdditiveLabel,
  RuneDefinition,
  RuneQuality,
  StatSource
} from '../../models';
import {
  RUNE_ACCURACY,
  RUNE_ATTACK_SPEED,
  RUNE_BLEEDING_DAMAGE,
  RUNE_CHANCE,
  RUNE_CHARGE_DAMAGE,
  RUNE_CHARGE_GAIN,
  RUNE_CRIT_DAMAGE,
  RUNE_MULTI_HIT_CHAIN,
  RUNE_MULTI_HIT_DAMAGE
} from './rune-quality-specs.config';

import { TimestampUtils } from '../../../shared/utils';

export const RUNE_QUALITY_ORDER: RuneQuality[] = ['Common', 'Magic', 'Rare', 'Epic', 'Legendary'];

export const RUNE_DEFINITIONS: RuneDefinition[] = [
  {
    Id: 'ACU',
    Name: 'Accuracy Rune',
    Qualities: RUNE_ACCURACY,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Accuracy', value),
      MapToStatSource: (source: string, value: number): StatSource => {
        const s = EmptyStatSource(
          source + '_rune_accuracy' + `_${TimestampUtils.GetTimestampNow()}`
        );
        s.Accuracy.Multiplier = value;
        return s;
      }
    }
  },
  {
    Id: 'IAS',
    Name: 'Attack Speed Rune',
    Qualities: RUNE_ATTACK_SPEED,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Attack Speed', value),
      MapToStatSource: (source: string, value: number): StatSource => {
        const s = EmptyStatSource(
          source + '_rune_attack_speed' + `_${TimestampUtils.GetTimestampNow()}`
        );
        s.AttackSpeed.Multiplier = value;
        return s;
      }
    }
  },
  {
    Id: 'BHC',
    Name: 'Bleeding Chance Rune',
    Qualities: RUNE_CHANCE,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Chance', value),
      MapToStatSource: (source: string, value: number): StatSource => {
        const s = EmptyStatSource(
          source + '_rune_bleeding_chance' + `_${TimestampUtils.GetTimestampNow()}`
        );
        s.Bleeding.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 'BHD',
    Name: 'Bleeding Damage Rune',
    Qualities: RUNE_BLEEDING_DAMAGE,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Damage', value),
      MapToStatSource: (source: string, value: number): StatSource => {
        const s = EmptyStatSource(
          source + '_rune_bleeding_damage' + `_${TimestampUtils.GetTimestampNow()}`
        );
        s.Bleeding.MultiplierDamage = value;
        return s;
      }
    }
  },
  {
    Id: 'CHC',
    Name: 'Critical Hit Chance Rune',
    Qualities: RUNE_CHANCE,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Critical Hit Chance', value),
      MapToStatSource: (source: string, value: number): StatSource => {
        const s = EmptyStatSource(
          source + '_rune_critical_hit_chance' + `_${TimestampUtils.GetTimestampNow()}`
        );
        s.CriticalHit.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 'CHD',
    Name: 'Critical Hit Damage Rune',
    Qualities: RUNE_CRIT_DAMAGE,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Critical Hit Damage', value),
      MapToStatSource: (source: string, value: number): StatSource => {
        const s = EmptyStatSource(
          source + '_rune_critical_hit_damage' + `_${TimestampUtils.GetTimestampNow()}`
        );
        s.CriticalHit.MultiplierDamage = value;
        return s;
      }
    }
  },
  {
    Id: 'MHC',
    Name: 'Multi Hit Chance Rune',
    Qualities: RUNE_CHANCE,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Chance', value),
      MapToStatSource: (source: string, value: number): StatSource => {
        const s = EmptyStatSource(
          source + '_rune_multi_hit_chance' + `_${TimestampUtils.GetTimestampNow()}`
        );
        s.MultiHit.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 'MHD',
    Name: 'Multi Hit Damage Rune',
    Qualities: RUNE_MULTI_HIT_DAMAGE,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Damage', value),
      MapToStatSource: (source: string, value: number): StatSource => {
        const s = EmptyStatSource(
          source + '_rune_multi_hit_damage' + `_${TimestampUtils.GetTimestampNow()}`
        );
        s.MultiHit.MultiplierDamage = value;
        return s;
      }
    }
  },
  {
    Id: 'MHF',
    Name: 'Multi Hit Chain Rune',
    Qualities: RUNE_MULTI_HIT_CHAIN,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Chain', value),
      MapToStatSource: (source: string, value: number): StatSource => {
        const s = EmptyStatSource(
          source + '_rune_multi_hit_chain' + `_${TimestampUtils.GetTimestampNow()}`
        );
        s.MultiHit.ChainFactor = value;
        return s;
      }
    }
  },
  {
    Id: 'CSG',
    Name: 'Charging Strike Gain Rune',
    Qualities: RUNE_CHARGE_GAIN,
    Effect: {
      ToLabel: (value: number) => FlatAdditiveLabel('Charge Gain per Hit', value),
      MapToStatSource: (source: string, value: number): StatSource => {
        const s = EmptyStatSource(
          source + '_rune_charge_gain' + `_${TimestampUtils.GetTimestampNow()}`
        );
        s.ChargingStrike.ChargeGain = value;
        return s;
      }
    }
  },
  {
    Id: 'CSD',
    Name: 'Charging Strike Damage Rune',
    Qualities: RUNE_CHARGE_DAMAGE,
    Effect: {
      ToLabel: (value: number) => FlatAdditiveLabel('Charged Damage', value),
      MapToStatSource: (source: string, value: number): StatSource => {
        const s = EmptyStatSource(
          source + '_rune_charge_damage' + `_${TimestampUtils.GetTimestampNow()}`
        );
        s.ChargingStrike.ChargeDamage = value;
        return s;
      }
    }
  }
];
