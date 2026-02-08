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

const ATTRIBUTES_AFFIX_DEFINITIONS: AffixDefinition[] = [
  {
    Id: 'affix_strength_flat',
    Groups: ['Attributes'],
    AllowedSlots: ['Weapon', 'OffHand', 'Head', 'Chest', 'Legs', 'Feet'],
    Tiers: ATTRIBUTE_TIERS,
    Effect: {
      ToLabel: (value: number) => FlatAdditiveLabel('Strength', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(source + `_affix_strength_flat_${performance.now()}`);
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
        const s = EmptyStatSource(source + `_affix_intelligence_flat_${performance.now()}`);
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
        const s = EmptyStatSource(source + `_affix_dexterity_flat_${performance.now()}`);
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
        const s = EmptyStatSource(source + `_affix_damage_flat_${performance.now()}`);
        s.Damage.Flat = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_damage_percent',
    Groups: ['Offense'],
    AllowedSlots: ['Weapon'],
    Tiers: DAMAGE_PCT_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Damage', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(source + `_affix_damage_percent_${performance.now()}`);
        s.Damage.Multiplier = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_bleed_chance_percent',
    Groups: ['Offense'],
    AllowedSlots: ['Head', 'Chest', 'Legs', 'Feet'],
    Tiers: CHANCE_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Chance', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(source + `_affix_bleed_chance_percent_${performance.now()}`);
        s.Bleeding.MultiplierChance = value;
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
      ToLabel: (value: number) => PercentageAdditiveLabel('Crit Chance', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(source + `_affix_crit_chance_percent_${performance.now()}`);
        s.CriticalHit.MultiplierChance = value;
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
        const s = EmptyStatSource(source + `_affix_multihit_chance_percent_${performance.now()}`);
        s.MultiHit.MultiplierChance = value;
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
        const s = EmptyStatSource(source + `_affix_bleeding_damage_percent_${performance.now()}`);
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
      ToLabel: (value: number) => PercentageAdditiveLabel('Crit Damage', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(source + `_affix_crit_damage_percent_${performance.now()}`);
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
        const s = EmptyStatSource(source + `_affix_multihit_damage_percent_${performance.now()}`);
        s.MultiHit.MultiplierDamage = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_multihit_chain_percent',
    Groups: ['Offense'],
    AllowedSlots: ['Head', 'Feet'],
    Tiers: MULTIHIT_CHAIN_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Chain', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(source + `_affix_multihit_chain_percent_${performance.now()}`);
        s.MultiHit.MultiplierChainFactor = value;
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
        const s = EmptyStatSource(source + `_affix_attack_speed_percent_${performance.now()}`);
        s.AttackSpeed.Multiplier = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_accuracy_percent',
    Groups: ['Utility'],
    AllowedSlots: ['Weapon', 'OffHand', 'Head', 'Chest', 'Legs', 'Feet'],
    Tiers: ACCURACY_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Accuracy', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(source + `_affix_accuracy_percent_${performance.now()}`);
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
  //       const s = EmptyStatSource(source + `_affix_armor_penetration_percent_${performance.now()}`);
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
  //         source + `_affix_resistance_penetration_percent_${performance.now()}`
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
    AllowedSlots: ['Weapon', 'OffHand', 'Head', 'Chest', 'Legs'],
    Tiers: CHARGING_STRIKE_GAIN_TIERS,
    Effect: {
      ToLabel: (value: number) => FlatAdditiveLabel('Charge Gain per Hit', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(source + `_affix_charging_strike_gain_flat_${performance.now()}`);
        s.ChargingStrike.ChargeGain = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_charging_strike_damage_percent',
    Groups: ['Charging Strike'],
    AllowedSlots: ['Weapon', 'OffHand', 'Chest', 'Legs'],
    Tiers: CHARGING_STRIKE_DAMAGE_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Charging Strike Damage', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(
          source + `_affix_charging_strike_damage_percent_${performance.now()}`
        );
        s.ChargingStrike.ChargeDamage = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_charging_strike_duration_flat',
    Groups: ['Charging Strike'],
    AllowedSlots: ['OffHand', 'Head', 'Feet'],
    Tiers: CHARGED_DURATION_TIERS,
    Effect: {
      ToLabel: (value: number) => FlatAdditiveLabel('s Charge Duration', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(
          source + `_affix_charging_strike_duration_flat_${performance.now()}`
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
