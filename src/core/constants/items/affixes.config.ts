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
  DAMAGE_PCT_TIERS,
  MULTIHIT_CHAIN_TIERS,
  MULTIHIT_DAMAGE_TIERS,
  PENETRATION_TIERS
} from './affix-tier-specs.config';
import {
  AffixDefinition,
  EmptyStatSource,
  FlatAdditiveLabel,
  PercentageAdditiveLabel
} from '../../models';

import { TimestampUtils } from '../../../shared/utils';

const ATTRIBUTES_AFFIX_DEFINITIONS: AffixDefinition[] = [
  {
    Id: 'affix_strength_flat',
    Groups: ['Attributes'],
    AllowedSlots: ['Weapon', 'OffHand', 'Head', 'Chest', 'Legs', 'Feet'],
    Tiers: ATTRIBUTE_TIERS,
    Effect: {
      ToLabel: (value: number) => FlatAdditiveLabel('Strength', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(
          source + `_affix_strength_flat_${TimestampUtils.GetTimestampNow()}`
        );
        s.Strength.Flat = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_intelligence_flat',
    Groups: ['Attributes'],
    AllowedSlots: ['Weapon', 'OffHand', 'Head', 'Chest', 'Legs', 'Feet'],
    Tiers: ATTRIBUTE_TIERS,
    Effect: {
      ToLabel: (value: number) => FlatAdditiveLabel('Intelligence', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(
          source + `_affix_intelligence_flat_${TimestampUtils.GetTimestampNow()}`
        );
        s.Intelligence.Flat = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_dexterity_flat',
    Groups: ['Attributes'],
    AllowedSlots: ['Weapon', 'OffHand', 'Head', 'Chest', 'Legs', 'Feet'],
    Tiers: ATTRIBUTE_TIERS,
    Effect: {
      ToLabel: (value: number) => FlatAdditiveLabel('Dexterity', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(
          source + `_affix_dexterity_flat_${TimestampUtils.GetTimestampNow()}`
        );
        s.Dexterity.Flat = value;
        return s;
      }
    }
  }
];
const OFFENSE_AFFIX_DEFINITIONS: AffixDefinition[] = [
  {
    Id: 'affix_damage_flat',
    Groups: ['Offense'],
    AllowedSlots: ['Weapon'],
    Tiers: DAMAGE_FLAT_TIERS,
    Effect: {
      ToLabel: (value: number) => FlatAdditiveLabel('Damage', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(
          source + `_affix_damage_flat_${TimestampUtils.GetTimestampNow()}`
        );
        s.Damage.Flat = value;
        return s;
      }
    }
  },
  // {
  //   Id: 'affix_damage_percent',
  //   Groups: ['Offense'],
  //   AllowedSlots: ['Weapon'],
  //   Tiers: DAMAGE_PCT_TIERS,
  //   Effect: {
  //     ToLabel: (value: number) => PercentageAdditiveLabel('Damage', value),
  //     MapToStatSource: (source: string, value: number) => {
  //       const s = EmptyStatSource(source + `_affix_damage_percent_${TimestampUtils.GetTimestampNow()}`);
  //       s.Damage.Multiplier = value;
  //       return s;
  //     }
  //   }
  // },
  {
    Id: 'affix_bleed_chance_percent',
    Groups: ['Offense'],
    AllowedSlots: ['Head', 'Chest', 'Legs', 'Feet'],
    Tiers: CHANCE_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Chance', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(
          source + `_affix_bleed_chance_percent_${TimestampUtils.GetTimestampNow()}`
        );
        s.Bleeding.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_crit_chance_percent',
    Groups: ['Offense'],
    AllowedSlots: ['Head', 'Chest', 'Legs', 'Feet'],
    Tiers: CHANCE_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Critical Hit Chance', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(
          source + `_affix_crit_chance_percent_${TimestampUtils.GetTimestampNow()}`
        );
        s.CriticalHit.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_multihit_chance_percent',
    Groups: ['Offense'],
    AllowedSlots: ['Head', 'Chest', 'Legs', 'Feet'],
    Tiers: CHANCE_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Chance', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(
          source + `_affix_multihit_chance_percent_${TimestampUtils.GetTimestampNow()}`
        );
        s.MultiHit.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_bleeding_damage_percent',
    Groups: ['Offense'],
    AllowedSlots: ['Weapon', 'OffHand', 'Chest', 'Legs'],
    Tiers: BLEEDING_DAMAGE_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Damage', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(
          source + `_affix_bleeding_damage_percent_${TimestampUtils.GetTimestampNow()}`
        );
        s.Bleeding.MultiplierDamage = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_crit_damage_percent',
    Groups: ['Offense'],
    AllowedSlots: ['Weapon', 'OffHand', 'Chest', 'Legs'],
    Tiers: CRIT_DAMAGE_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Critical Hit Damage', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(
          source + `_affix_crit_damage_percent_${TimestampUtils.GetTimestampNow()}`
        );
        s.CriticalHit.MultiplierDamage = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_multihit_damage_percent',
    Groups: ['Offense'],
    AllowedSlots: ['Weapon', 'OffHand', 'Chest', 'Legs'],
    Tiers: MULTIHIT_DAMAGE_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Damage', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(
          source + `_affix_multihit_damage_percent_${TimestampUtils.GetTimestampNow()}`
        );
        s.MultiHit.MultiplierDamage = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_multihit_chain_percent',
    Groups: ['Offense'],
    AllowedSlots: ['Head', 'OffHand', 'Feet'],
    Tiers: MULTIHIT_CHAIN_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Chain', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(
          source + `_affix_multihit_chain_percent_${TimestampUtils.GetTimestampNow()}`
        );
        s.MultiHit.ChainFactor = value;
        return s;
      }
    }
  }
];
const DEFENSE_AFFIX_DEFINITIONS: AffixDefinition[] = [];
const UTILITY_AFFIX_DEFINITIONS: AffixDefinition[] = [
  {
    Id: 'affix_attack_speed_percent',
    Groups: ['Utility'],
    AllowedSlots: ['Weapon', 'OffHand', 'Feet'],
    Tiers: ATTACK_SPEED_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Attack Speed', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(
          source + `_affix_attack_speed_percent_${TimestampUtils.GetTimestampNow()}`
        );
        s.AttackSpeed.Multiplier = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_accuracy_percent',
    Groups: ['Utility'],
    AllowedSlots: ['Head', 'Chest', 'Legs', 'Feet'],
    Tiers: ACCURACY_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Accuracy', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(
          source + `_affix_accuracy_percent_${TimestampUtils.GetTimestampNow()}`
        );
        s.Accuracy.Multiplier = value;
        return s;
      }
    }
  }
  // {
  //   Id: 'affix_armor_penetration_percent',
  //   Groups: ['Utility'],
  //   AllowedSlots: ['Weapon', 'OffHand', 'Head', 'Chest', 'Legs', 'Feet'],
  //   Tiers: PENETRATION_TIERS,
  //   Effect: {
  //     ToLabel: (value: number) => PercentageAdditiveLabel('Armor Penetration', value),
  //     MapToStatSource: (source: string, value: number) => {
  //       const s = EmptyStatSource(source + `_affix_armor_penetration_percent_${TimestampUtils.GetTimestampNow()}`);
  //       s.ArmorPenetration.Multiplier = value;
  //       return s;
  //     }
  //   }
  // },
  // {
  //   Id: 'affix_resistance_penetration_percent',
  //   Groups: ['Utility'],
  //   AllowedSlots: ['Weapon', 'OffHand', 'Head', 'Chest', 'Legs', 'Feet'],
  //   Tiers: PENETRATION_TIERS,
  //   Effect: {
  //     ToLabel: (value: number) => PercentageAdditiveLabel('Resistance Penetration', value),
  //     MapToStatSource: (source: string, value: number) => {
  //       const s = EmptyStatSource(
  //         source + `_affix_resistance_penetration_percent_${TimestampUtils.GetTimestampNow()}`
  //       );
  //       s.ResistancePenetration.Multiplier = value;
  //       return s;
  //     }
  //   }
  // }
];

const CHARGING_STRIKE_AFFIX_DEFINITIONS: AffixDefinition[] = [
  {
    Id: 'affix_charging_strike_gain_flat',
    Groups: ['Charging Strike'],
    AllowedSlots: ['OffHand'],
    Tiers: CHARGING_STRIKE_GAIN_TIERS,
    Effect: {
      ToLabel: (value: number) => FlatAdditiveLabel('Charge Gain per Hit', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(
          source + `_affix_charging_strike_gain_flat_${TimestampUtils.GetTimestampNow()}`
        );
        s.ChargingStrike.ChargeGain = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_charging_strike_damage_percent',
    Groups: ['Charging Strike'],
    AllowedSlots: ['Weapon'],
    Tiers: CHARGING_STRIKE_DAMAGE_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Charged Damage', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(
          source + `_affix_charging_strike_damage_percent_${TimestampUtils.GetTimestamp()}`
        );
        s.ChargingStrike.ChargeDamage = value;
        return s;
      }
    }
  }
  // {
  //   Id: 'affix_charging_strike_duration_flat',
  //   Groups: ['Charging Strike'],
  //   AllowedSlots: ['OffHand', 'Head', 'Feet'],
  //   Tiers: CHARGED_DURATION_TIERS,
  //   Effect: {
  //     ToLabel: (value: number) => FlatAdditiveLabel('s Charged Duration', value),
  //     MapToStatSource: (source: string, value: number) => {
  //       const s = EmptyStatSource(
  //         source + `_affix_charging_strike_duration_flat_${TimestampUtils.GetTimestampNow()}`
  //       );
  //       s.ChargingStrike.ChargeDuration = value;
  //       return s;
  //     }
  //   }
  // }
];

export const AFFIX_DEFINITIONS: AffixDefinition[] = [
  ...OFFENSE_AFFIX_DEFINITIONS,
  ...DEFENSE_AFFIX_DEFINITIONS,
  ...UTILITY_AFFIX_DEFINITIONS,
  ...CHARGING_STRIKE_AFFIX_DEFINITIONS
];
