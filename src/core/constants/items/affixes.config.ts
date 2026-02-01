import {
  ACCURACY_TIERS,
  ATTACK_SPEED_TIERS,
  ATTRIBUTE_TIERS,
  BLEEDING_DAMAGE_TIERS,
  CHANCE_TIERS,
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
  PercentageMultiplicativeLabel
} from '../../models';

const ATTRIBUTES_AFFIX_DEFINITIONS: AffixDefinition[] = [
  {
    Id: 'affix_strength_flat',
    Groups: ['Attributes'],
    AllowedSlots: ['Weapon', 'OffHand', 'Head', 'Chest', 'Legs', 'Boots'],
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
    AllowedSlots: ['Weapon', 'OffHand', 'Head', 'Chest', 'Legs', 'Boots'],
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
    AllowedSlots: ['Weapon', 'OffHand', 'Head', 'Chest', 'Legs', 'Boots'],
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
      ToLabel: (value: number) => PercentageMultiplicativeLabel('Damage', value),
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
    AllowedSlots: ['Head', 'Chest', 'Legs', 'Boots'],
    Tiers: CHANCE_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageMultiplicativeLabel('Bleeding Chance', value),
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
    AllowedSlots: ['Head', 'Chest', 'Legs', 'Boots'],
    Tiers: CHANCE_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageMultiplicativeLabel('Crit Chance', value),
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
    AllowedSlots: ['Head', 'Chest', 'Legs', 'Boots'],
    Tiers: CHANCE_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageMultiplicativeLabel('Multi Hit Chance', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(source + `_affix_multihit_chance_percent_${performance.now()}`);
        s.MultiHit.MultiplierChance = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_bleeding_damage_flat',
    Groups: ['Offense'],
    AllowedSlots: ['Weapon', 'OffHand', 'Chest', 'Legs'],
    Tiers: BLEEDING_DAMAGE_TIERS,
    Effect: {
      ToLabel: (value: number) => FlatAdditiveLabel('Bleeding Damage', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(source + `_affix_bleeding_damage_flat_${performance.now()}`);
        s.Bleeding.FlatDamage = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_crit_damage_flat',
    Groups: ['Offense'],
    AllowedSlots: ['Weapon', 'OffHand', 'Chest', 'Legs'],
    Tiers: CRIT_DAMAGE_TIERS,
    Effect: {
      ToLabel: (value: number) => FlatAdditiveLabel('Crit Damage', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(source + `_affix_crit_damage_flat_${performance.now()}`);
        s.CriticalHit.FlatDamage = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_multihit_damage_flat',
    Groups: ['Offense'],
    AllowedSlots: ['Weapon', 'OffHand', 'Chest', 'Legs'],
    Tiers: MULTIHIT_DAMAGE_TIERS,
    Effect: {
      ToLabel: (value: number) => FlatAdditiveLabel('Multi Hit Damage', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(source + `_affix_multihit_damage_flat_${performance.now()}`);
        s.MultiHit.FlatDamage = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_multihit_chain_percent',
    Groups: ['Offense'],
    AllowedSlots: ['Head', 'Boots'],
    Tiers: MULTIHIT_CHAIN_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageMultiplicativeLabel('Multi Hit Chain', value),
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
    AllowedSlots: ['Weapon', 'OffHand', 'Boots'],
    Tiers: ATTACK_SPEED_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageMultiplicativeLabel('Attack Speed', value),
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
    AllowedSlots: ['Weapon', 'OffHand', 'Head', 'Chest', 'Legs', 'Boots'],
    Tiers: ACCURACY_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageMultiplicativeLabel('Accuracy', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(source + `_affix_accuracy_percent_${performance.now()}`);
        s.Accuracy.Multiplier = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_armor_penetration_percent',
    Groups: ['Utility'],
    AllowedSlots: ['Weapon', 'OffHand', 'Head', 'Chest', 'Legs', 'Boots'],
    Tiers: PENETRATION_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageMultiplicativeLabel('Armor Penetration', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(source + `_affix_armor_penetration_percent_${performance.now()}`);
        s.ArmorPenetration.Multiplier = value;
        return s;
      }
    }
  },
  {
    Id: 'affix_resistance_penetration_percent',
    Groups: ['Utility'],
    AllowedSlots: ['Weapon', 'OffHand', 'Head', 'Chest', 'Legs', 'Boots'],
    Tiers: PENETRATION_TIERS,
    Effect: {
      ToLabel: (value: number) => PercentageMultiplicativeLabel('Resistance Penetration', value),
      MapToStatSource: (source: string, value: number) => {
        const s = EmptyStatSource(
          source + `_affix_resistance_penetration_percent_${performance.now()}`
        );
        s.ResistancePenetration.Multiplier = value;
        return s;
      }
    }
  }
];

export const AFFIX_DEFINITIONS: AffixDefinition[] = [
  ...ATTRIBUTES_AFFIX_DEFINITIONS,
  ...OFFENSE_AFFIX_DEFINITIONS,
  ...DEFENSE_AFFIX_DEFINITIONS,
  ...UTILITY_AFFIX_DEFINITIONS
];
