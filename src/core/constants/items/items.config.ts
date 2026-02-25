import {
  EmptyStatSource,
  FlatAdditiveLabel,
  ItemLevel,
  ItemVariantDefinition,
  PercentageAdditiveLabel,
  StatSource
} from '../../models';

import { ITEM_LEVEL_CONFIG } from './items-rules.config';

function ScaleLinearValueCurve(
  baseValue: number,
  incrementPerLevel: number
): Record<ItemLevel, number> {
  const values: Partial<Record<ItemLevel, number>> = {};
  for (let level = 1 as ItemLevel; level <= ITEM_LEVEL_CONFIG.LEVEL.MAX; level++) {
    values[level] = baseValue + incrementPerLevel * (level - 1);
  }
  return values as Record<ItemLevel, number>;
}

//#region WEAPONS
const WEAPON_BASE_DAMAGE_REFERENCE_BASE10: Record<ItemLevel, number> = {
  1: 10,
  2: 12,
  3: 14,
  4: 16,
  5: 20,
  6: 25,
  7: 30,
  8: 35,
  9: 40,
  10: 50,
  11: 60,
  12: 70,
  13: 80,
  14: 90,
  15: 100,
  16: 120,
  17: 140,
  18: 160,
  19: 180,
  20: 200,
  21: 225,
  22: 250,
  23: 275,
  24: 300,
  25: 325,
  26: 350,
  27: 375,
  28: 400,
  29: 450,
  30: 500
};

function ScaleWeaponBaseDamageCurve(targetBase: number): Record<ItemLevel, number> {
  const scaleFactor = targetBase / 10;

  const scaled: Partial<Record<ItemLevel, number>> = {};

  for (const [levelKey, referenceValue] of Object.entries(WEAPON_BASE_DAMAGE_REFERENCE_BASE10)) {
    const level = Number(levelKey) as ItemLevel;
    scaled[level] = Math.round(referenceValue * scaleFactor);
  }

  scaled[1] = targetBase;
  return scaled as Record<ItemLevel, number>;
}

export const WEAPON_BASE_DAMAGE_CONFIG = {
  BASE_DAMAGE_BASE5: ScaleWeaponBaseDamageCurve(5),
  BASE_DAMAGE_BASE6: ScaleWeaponBaseDamageCurve(6),
  BASE_DAMAGE_BASE7: ScaleWeaponBaseDamageCurve(7),
  BASE_DAMAGE_BASE8: ScaleWeaponBaseDamageCurve(8),
  BASE_DAMAGE_BASE9: ScaleWeaponBaseDamageCurve(9),
  BASE_DAMAGE_BASE10: WEAPON_BASE_DAMAGE_REFERENCE_BASE10,
  BASE_DAMAGE_BASE12: ScaleWeaponBaseDamageCurve(12),
  BASE_DAMAGE_BASE13: ScaleWeaponBaseDamageCurve(13),
  BASE_DAMAGE_BASE14: ScaleWeaponBaseDamageCurve(14),
  BASE_DAMAGE_BASE16: ScaleWeaponBaseDamageCurve(16),
  BASE_DAMAGE_BASE17: ScaleWeaponBaseDamageCurve(17),
  BASE_DAMAGE_BASE18: ScaleWeaponBaseDamageCurve(18),
  BASE_DAMAGE_BASE20: ScaleWeaponBaseDamageCurve(20),
  BASE_DAMAGE_BASE22: ScaleWeaponBaseDamageCurve(22),
  BASE_DAMAGE_BASE25: ScaleWeaponBaseDamageCurve(25),
  BASE_DAMAGE_BASE30: ScaleWeaponBaseDamageCurve(30)
};

export const WEAPON_INNATE_CONFIG = {
  DAMAGE_BASE1: ScaleLinearValueCurve(1, 1),

  BLEED_CHANCE_BASE1: ScaleLinearValueCurve(0.01, 0.01),
  CRIT_CHANCE_BASE1: ScaleLinearValueCurve(0.01, 0.01),
  MULTI_HIT_CHANCE_BASE1: ScaleLinearValueCurve(0.01, 0.01),

  BLEED_CHANCE_BASE6: ScaleLinearValueCurve(0.06, 0.01),
  CRIT_CHANCE_BASE6: ScaleLinearValueCurve(0.06, 0.01),
  MULTI_HIT_CHANCE_BASE6: ScaleLinearValueCurve(0.06, 0.01),

  CHANCE_BASE_T3: {
    1: 0.06,
    2: 0.07,
    3: 0.08,
    4: 0.09,
    5: 0.1,
    6: 0.11,
    7: 0.12,
    8: 0.13,
    9: 0.14,
    10: 0.15,
    11: 0.16,
    12: 0.17,
    13: 0.18,
    14: 0.19,
    15: 0.2,
    16: 0.21,
    17: 0.22,
    18: 0.23,
    19: 0.24,
    20: 0.25,
    21: 0.27,
    22: 0.3,
    23: 0.32,
    24: 0.35,
    25: 0.37,
    26: 0.4,
    27: 0.42,
    28: 0.45,
    29: 0.47,
    30: 0.5
  } as Record<ItemLevel, number>,

  BLEED_DAMAGE_BASE: {
    1: 0.08,
    2: 0.11,
    3: 0.15,
    4: 0.19,
    5: 0.23,
    6: 0.26,
    7: 0.3,
    8: 0.34,
    9: 0.38,
    10: 0.38,
    11: 0.41,
    12: 0.45,
    13: 0.49,
    14: 0.53,
    15: 0.56,
    16: 0.6,
    17: 0.64,
    18: 0.68,
    19: 0.75,
    20: 0.75,
    21: 0.83,
    22: 0.9,
    23: 0.98,
    24: 1.05,
    25: 1.13,
    26: 1.2,
    27: 1.28,
    28: 1.35,
    29: 1.43,
    30: 1.5
  } as Record<ItemLevel, number>,

  CRIT_DAMAGE_BASE: {
    1: 0.1,
    2: 0.15,
    3: 0.2,
    4: 0.25,
    5: 0.3,
    6: 0.35,
    7: 0.4,
    8: 0.45,
    9: 0.5,
    10: 0.5,
    11: 0.55,
    12: 0.6,
    13: 0.65,
    14: 0.7,
    15: 0.75,
    16: 0.8,
    17: 0.85,
    18: 0.9,
    19: 1.0,
    20: 1.0,
    21: 1.1,
    22: 1.2,
    23: 1.3,
    24: 1.4,
    25: 1.5,
    26: 1.6,
    27: 1.7,
    28: 1.8,
    29: 1.9,
    30: 2.0
  } as Record<ItemLevel, number>,

  MULTI_HIT_DAMAGE_BASE: {
    1: 0.09,
    2: 0.13,
    3: 0.17,
    4: 0.21,
    5: 0.26,
    6: 0.3,
    7: 0.34,
    8: 0.38,
    9: 0.43,
    10: 0.43,
    11: 0.47,
    12: 0.51,
    13: 0.55,
    14: 0.6,
    15: 0.64,
    16: 0.68,
    17: 0.72,
    18: 0.77,
    19: 0.85,
    20: 0.85,
    21: 0.94,
    22: 1.02,
    23: 1.11,
    24: 1.19,
    25: 1.28,
    26: 1.36,
    27: 1.45,
    28: 1.53,
    29: 1.62,
    30: 1.7
  } as Record<ItemLevel, number>
};

const WEAPON_SWORDS_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 't1_weapon_sword_starter',
    Name: 'Short Sword',
    Icon: 'gladius',
    Slot: 'Weapon',
    Type: 'Sword',
    Tier: 'I',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE10,
    WeaponBaseAttackSpeed: 1.0,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.BLEED_CHANCE_BASE1,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t1_weapon_sword_starter_innate');
        s.Bleeding.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't2_weapon_sword_1',
    Name: 'Shard Sword',
    Icon: 'shardsword',
    Slot: 'Weapon',
    Type: 'Sword',
    Tier: 'II',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE10,
    WeaponBaseAttackSpeed: 1.0,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.BLEED_CHANCE_BASE6,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_weapon_sword_1_innate');
        s.Bleeding.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't2_weapon_sword_2',
    Name: 'Broadsword',
    Icon: 'broadsword',
    Slot: 'Weapon',
    Type: 'Sword',
    Tier: 'II',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE10,
    WeaponBaseAttackSpeed: 1.0,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Critical Hit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.CRIT_CHANCE_BASE6,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_weapon_sword_2_innate');
        s.CriticalHit.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't2_weapon_sword_3',
    Name: 'Katana',
    Icon: 'katana',
    Slot: 'Weapon',
    Type: 'Sword',
    Tier: 'II',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE8,
    WeaponBaseAttackSpeed: 1.5,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.MULTI_HIT_CHANCE_BASE6,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_weapon_sword_3_innate');
        s.MultiHit.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't3_weapon_sword_1',
    Name: 'Claymore',
    Icon: 'piercingsword',
    Slot: 'Weapon',
    Type: 'Sword',
    Tier: 'III',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE10,
    WeaponBaseAttackSpeed: 1.0,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Damage', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.BLEED_DAMAGE_BASE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_weapon_sword_1_innate');
        s.Bleeding.Damage = value;
        return s;
      }
    }
  },
  {
    Id: 't3_weapon_sword_2',
    Name: 'Relic Blade',
    Icon: 'relicblade',
    Slot: 'Weapon',
    Type: 'Sword',
    Tier: 'III',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE10,
    WeaponBaseAttackSpeed: 1.0,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.CHANCE_BASE_T3,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_weapon_sword_2_innate');
        s.Bleeding.Chance = value;
        return s;
      }
    }
  }
];
const WEAPON_AXES_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 't2_weapon_axe_1',
    Name: 'Marauder Axe',
    Icon: 'sharpaxe',
    Slot: 'Weapon',
    Type: 'Axe',
    Tier: 'II',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE13,
    WeaponBaseAttackSpeed: 0.8,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.BLEED_CHANCE_BASE6,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_weapon_axe_1_innate');
        s.Bleeding.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't2_weapon_axe_2',
    Name: 'Battle Axe',
    Icon: 'battleaxe',
    Slot: 'Weapon',
    Type: 'Axe',
    Tier: 'II',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE13,
    WeaponBaseAttackSpeed: 0.8,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Damage', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.BLEED_DAMAGE_BASE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_weapon_axe_2_innate');
        s.Bleeding.Damage = value;
        return s;
      }
    }
  },
  {
    Id: 't3_weapon_axe_1',
    Name: 'War Axe',
    Icon: 'waraxe',
    Slot: 'Weapon',
    Type: 'Axe',
    Tier: 'III',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE13,
    WeaponBaseAttackSpeed: 0.8,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Damage', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.BLEED_DAMAGE_BASE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_weapon_axe_1_innate');
        s.Bleeding.Damage = value;
        return s;
      }
    }
  },
  {
    Id: 't3_weapon_axe_2',
    Name: 'Halberd',
    Icon: 'halberd',
    Slot: 'Weapon',
    Type: 'Axe',
    Tier: 'III',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE13,
    WeaponBaseAttackSpeed: 0.8,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.CHANCE_BASE_T3,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_weapon_axe_2_innate');
        s.Bleeding.Chance = value;
        return s;
      }
    }
  }
];
const WEAPON_BOWS_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 't1_weapon_bow_starter',
    Name: 'Short Bow',
    Icon: 'highshot',
    Slot: 'Weapon',
    Type: 'Bow',
    Tier: 'I',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE9,
    WeaponBaseAttackSpeed: 1.1,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.MULTI_HIT_CHANCE_BASE1,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t1_weapon_bow_starter_innate');
        s.MultiHit.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't2_weapon_bow_1',
    Name: 'Hunting Bow',
    Icon: 'pocketbow',
    Slot: 'Weapon',
    Type: 'Bow',
    Tier: 'II',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE9,
    WeaponBaseAttackSpeed: 1.1,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.MULTI_HIT_CHANCE_BASE6,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_weapon_bow_1_innate');
        s.MultiHit.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't2_weapon_bow_2',
    Name: 'Siege Crossbow',
    Icon: 'crossbow',
    Slot: 'Weapon',
    Type: 'Bow',
    Tier: 'II',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE9,
    WeaponBaseAttackSpeed: 1.1,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Damage', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.MULTI_HIT_DAMAGE_BASE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_weapon_bow_2_innate');
        s.MultiHit.Damage = value;
        return s;
      }
    }
  },
  {
    Id: 't3_weapon_bow_1',
    Name: 'Double Shot',
    Icon: 'doubleshot',
    Slot: 'Weapon',
    Type: 'Bow',
    Tier: 'III',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE9,
    WeaponBaseAttackSpeed: 1.1,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.CHANCE_BASE_T3,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_weapon_bow_1_innate');
        s.MultiHit.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't3_weapon_bow_2',
    Name: 'Battle Bow',
    Icon: 'heavyarrow',
    Slot: 'Weapon',
    Type: 'Bow',
    Tier: 'III',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE9,
    WeaponBaseAttackSpeed: 1.1,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Damage', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.MULTI_HIT_DAMAGE_BASE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_weapon_bow_2_innate');
        s.MultiHit.Damage = value;
        return s;
      }
    }
  }
];
const WEAPON_DAGGER_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 't1_weapon_dagger_starter',
    Name: 'Simple Dagger',
    Icon: 'bowieknife',
    Slot: 'Weapon',
    Type: 'Dagger',
    Tier: 'I',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE8,
    WeaponBaseAttackSpeed: 1.2,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Critical Hit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.CRIT_CHANCE_BASE1,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t1_weapon_dagger_starter_innate');
        s.CriticalHit.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't2_weapon_dagger_1',
    Name: 'Curvy Dagger',
    Icon: 'curvyknife',
    Slot: 'Weapon',
    Type: 'Dagger',
    Tier: 'II',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE8,
    WeaponBaseAttackSpeed: 1.2,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Damage', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.BLEED_DAMAGE_BASE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_weapon_dagger_1_innate');
        s.Bleeding.Damage = value;
        return s;
      }
    }
  },
  {
    Id: 't2_weapon_dagger_2',
    Name: 'Jagged Dagger',
    Icon: 'knifethrust',
    Slot: 'Weapon',
    Type: 'Dagger',
    Tier: 'II',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE8,
    WeaponBaseAttackSpeed: 1.2,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.MULTI_HIT_CHANCE_BASE6,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_weapon_dagger_2_innate');
        s.MultiHit.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't2_weapon_dagger_3',
    Name: 'Deadly Dagger',
    Icon: 'plaindagger',
    Slot: 'Weapon',
    Type: 'Dagger',
    Tier: 'II',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE8,
    WeaponBaseAttackSpeed: 1.2,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Damage', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.MULTI_HIT_DAMAGE_BASE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_weapon_dagger_3_innate');
        s.MultiHit.Damage = value;
        return s;
      }
    }
  },
  {
    Id: 't3_weapon_dagger_1',
    Name: 'Obsidian Dagger',
    Icon: 'broaddagger',
    Slot: 'Weapon',
    Type: 'Dagger',
    Tier: 'III',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE9,
    WeaponBaseAttackSpeed: 1.2,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Damage', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.BLEED_DAMAGE_BASE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_weapon_dagger_1_innate');
        s.Bleeding.Damage = value;
        return s;
      }
    }
  }
];
const WEAPON_STAFF_WAND_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 't2_weapon_wand_1',
    Name: 'Orb Wand',
    Icon: 'orbwand',
    Slot: 'Weapon',
    Type: 'Wand',
    Tier: 'II',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE8,
    WeaponBaseAttackSpeed: 1.2,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Critical Hit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.CRIT_CHANCE_BASE6,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_weapon_wand_1_innate');
        s.CriticalHit.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't2_weapon_staff_2',
    Name: 'Mentor Staff',
    Icon: 'flangedmace',
    Slot: 'Weapon',
    Type: 'Staff',
    Tier: 'II',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE8,
    WeaponBaseAttackSpeed: 1.2,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Critical Hit Damage', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.CRIT_DAMAGE_BASE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_weapon_staff_2_innate');
        s.CriticalHit.Damage = value;
        return s;
      }
    }
  },
  {
    Id: 't3_weapon_wand_1',
    Name: 'Lunar Wand',
    Icon: 'lunarwand',
    Slot: 'Weapon',
    Type: 'Wand',
    Tier: 'III',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE9,
    WeaponBaseAttackSpeed: 1.2,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Critical Hit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.CHANCE_BASE_T3,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_weapon_wand_1_innate');
        s.CriticalHit.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't3_weapon_staff_1',
    Name: 'Wizard Staff',
    Icon: 'wizardstaff',
    Slot: 'Weapon',
    Type: 'Staff',
    Tier: 'III',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE9,
    WeaponBaseAttackSpeed: 1.2,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Critical Hit Damage', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.CRIT_DAMAGE_BASE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_weapon_staff_1_innate');
        s.CriticalHit.Damage = value;
        return s;
      }
    }
  }
];

const WEAPON_VARIANTS: ItemVariantDefinition[] = [
  ...WEAPON_SWORDS_VARIANTS,
  ...WEAPON_AXES_VARIANTS,
  ...WEAPON_BOWS_VARIANTS,
  ...WEAPON_DAGGER_VARIANTS,
  ...WEAPON_STAFF_WAND_VARIANTS
];
//#endregion WEAPONS

const INNATE_BLEED_DAMAGE = ScaleLinearValueCurve(0.08, 0.035);
const INNATE_CRIT_DAMAGE = ScaleLinearValueCurve(0.05, 0.05);
const INNATE_MULTI_DAMAGE = ScaleLinearValueCurve(0.04, 0.0425);

const INNATE_ACCURACY = ScaleLinearValueCurve(0.01, 0.0075);
const INNATE_IAS = ScaleLinearValueCurve(0.01, 0.0075);
const INNATE_BLEED_CHANCE = ScaleLinearValueCurve(0.01, 0.01);
const INNATE_CRIT_CHANCE = ScaleLinearValueCurve(0.01, 0.01);
const INNATE_MULTI_CHANCE = ScaleLinearValueCurve(0.01, 0.01);
const INNATE_CSD = ScaleLinearValueCurve(0.025, 0.025);
const INNATE_CS_GAIN_T2 = ScaleLinearValueCurve(-8, 1);
const INNATE_CS_GAIN_T3 = ScaleLinearValueCurve(-18, 1.15);

//#region OFFHANDS
const OFFHAND_SHIELDS_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 't1_offhand_shield_starter',
    Name: 'Wooden Shield',
    Icon: 'roundshield',
    Slot: 'OffHand',
    Type: 'Shield',
    Tier: 'I',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Damage', value),
      ValuesByLevel: INNATE_BLEED_DAMAGE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t1_offhand_shield_starter_innate');
        s.Bleeding.Damage = value;
        return s;
      }
    }
  },
  {
    Id: 't2_offhand_shield_1',
    Name: 'Viking Shield',
    Icon: 'vikingshield',
    Slot: 'OffHand',
    Type: 'Shield',
    Tier: 'II',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Chance', value),
      ValuesByLevel: INNATE_BLEED_CHANCE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_offhand_shield_1_innate');
        s.Bleeding.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't2_offhand_shield_2',
    Name: 'Templar Shield',
    Icon: 'templarshield',
    Slot: 'OffHand',
    Type: 'Shield',
    Tier: 'II',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Damage', value),
      ValuesByLevel: INNATE_BLEED_DAMAGE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_offhand_shield_2_innate');
        s.Bleeding.Damage = value;
        return s;
      }
    }
  },
  {
    Id: 't3_offhand_shield_1',
    Name: 'Dragon Shield',
    Icon: 'dragonshield',
    Slot: 'OffHand',
    Type: 'Shield',
    Tier: 'III',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Chance', value),
      ValuesByLevel: INNATE_BLEED_CHANCE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_offhand_shield_1_innate');
        s.Bleeding.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't3_offhand_shield_2',
    Name: 'Spiked Shield',
    Icon: 'spikedshield',
    Slot: 'OffHand',
    Type: 'Shield',
    Tier: 'III',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Damage', value),
      ValuesByLevel: INNATE_BLEED_DAMAGE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_offhand_shield_2_innate');
        s.Bleeding.Damage = value;
        return s;
      }
    }
  }
];

const OFFHAND_ORBS_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 't2_offhand_orb_1',
    Name: 'Spellbook',
    Icon: 'bookmarklet',
    Slot: 'OffHand',
    Type: 'Orb',
    Tier: 'II',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Critical Hit Damage', value),
      ValuesByLevel: INNATE_CRIT_DAMAGE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_offhand_orb_1_innate');
        s.CriticalHit.Damage = value;
        return s;
      }
    }
  },
  {
    Id: 't3_offhand_orb_1',
    Name: 'Orbit of the Void',
    Icon: 'orbit',
    Slot: 'OffHand',
    Type: 'Orb',
    Tier: 'III',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Critical Hit Chance', value),
      ValuesByLevel: INNATE_CRIT_CHANCE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_offhand_orb_1_innate');
        s.CriticalHit.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't3_offhand_orb_2',
    Name: 'Dragon Balls',
    Icon: 'dragonballs',
    Slot: 'OffHand',
    Type: 'Orb',
    Tier: 'III',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Critical Hit Damage', value),
      ValuesByLevel: INNATE_CRIT_DAMAGE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_offhand_orb_2_innate');
        s.CriticalHit.Damage = value;
        return s;
      }
    }
  }
];

const OFFHAND_QUIVERS_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 't1_offhand_quiver_starter',
    Name: 'Leather Quiver',
    Icon: 'quiver',
    Slot: 'OffHand',
    Type: 'Quiver',
    Tier: 'I',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Damage', value),
      ValuesByLevel: INNATE_MULTI_DAMAGE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t1_offhand_quiver_starter_innate');
        s.MultiHit.Damage = value;
        return s;
      }
    }
  },
  {
    Id: 't2_offhand_quiver_1',
    Name: 'Hunting Quiver',
    Icon: 'quiver',
    Slot: 'OffHand',
    Type: 'Quiver',
    Tier: 'II',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Damage', value),
      ValuesByLevel: INNATE_MULTI_DAMAGE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_offhand_quiver_1_innate');
        s.MultiHit.Damage = value;
        return s;
      }
    }
  },
  {
    Id: 't3_offhand_quiver_1',
    Name: 'Elite Quiver',
    Icon: 'quiver',
    Slot: 'OffHand',
    Type: 'Quiver',
    Tier: 'III',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Damage', value),
      ValuesByLevel: INNATE_MULTI_DAMAGE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_offhand_quiver_1_innate');
        s.MultiHit.Damage = value;
        return s;
      }
    }
  }
];

const OFFHAND_DAGGERS_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 't1_offhand_dagger_starter',
    Name: 'Throwing Daggers',
    Icon: 'daggers',
    Slot: 'OffHand',
    Type: 'Dagger',
    Tier: 'I',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Critical Hit Damage', value),
      ValuesByLevel: INNATE_CRIT_DAMAGE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t1_offhand_dagger_starter_innate');
        s.CriticalHit.Damage = value;
        return s;
      }
    }
  }
];

const OFFHAND_SHURIKEN_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 't2_offhand_shuriken_1',
    Name: 'Throwing Shuriken',
    Icon: 'starshuriken',
    Slot: 'OffHand',
    Type: 'Shuriken',
    Tier: 'II',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Critical Hit Chance', value),
      ValuesByLevel: INNATE_CRIT_CHANCE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_offhand_shuriken_1_innate');
        s.CriticalHit.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't3_offhand_shuriken_1',
    Name: 'Star Shuriken',
    Icon: 'northstarshuriken',
    Slot: 'OffHand',
    Type: 'Shuriken',
    Tier: 'III',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Critical Hit Chance', value),
      ValuesByLevel: INNATE_CRIT_CHANCE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_offhand_shuriken_1_innate');
        s.CriticalHit.Chance = value;
        return s;
      }
    }
  }
];

const OFFHAND_VARIANTS: ItemVariantDefinition[] = [
  ...OFFHAND_SHIELDS_VARIANTS,
  ...OFFHAND_ORBS_VARIANTS,
  ...OFFHAND_QUIVERS_VARIANTS,
  ...OFFHAND_DAGGERS_VARIANTS,
  ...OFFHAND_SHURIKEN_VARIANTS
];
//#endregion OFFHANDS

//#region HEAD
const HEAD_HELMET_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 't1_head_helmet_1',
    Name: 'Iron Helmet',
    Icon: 'closedbarbute',
    Slot: 'Head',
    Type: 'Helmet',
    Tier: 'I',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Accuracy', value),
      ValuesByLevel: INNATE_ACCURACY,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t1_head_helmet_1_innate');
        s.Accuracy.Value = value;
        return s;
      }
    }
  },
  {
    Id: 't2_head_helmet_1',
    Name: 'Brutal Helmet',
    Icon: 'brutalhelm',
    Slot: 'Head',
    Type: 'Helmet',
    Tier: 'II',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Accuracy', value),
      ValuesByLevel: INNATE_ACCURACY,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_head_helmet_1_innate');
        s.Accuracy.Value = value;
        return s;
      }
    }
  },
  {
    Id: 't3_head_helmet_1',
    Name: 'Centurion Helmet',
    Icon: 'centurionhelmet',
    Slot: 'Head',
    Type: 'Helmet',
    Tier: 'III',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Chance', value),
      ValuesByLevel: INNATE_BLEED_CHANCE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_head_helmet_1_innate');
        s.Bleeding.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't3_head_helmet_2',
    Name: 'Helm of Command',
    Icon: 'elfhelmet',
    Slot: 'Head',
    Type: 'Helmet',
    Tier: 'III',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Chance', value),
      ValuesByLevel: INNATE_MULTI_CHANCE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_head_helmet_2_innate');
        s.MultiHit.Chance = value;
        return s;
      }
    }
  }
];
const HEAD_HOOD_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 't1_head_hood_1',
    Name: 'Cloth Hood',
    Icon: 'hood',
    Slot: 'Head',
    Type: 'Hood',
    Tier: 'I',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Accuracy', value),
      ValuesByLevel: INNATE_ACCURACY,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t1_head_hood_1_innate');
        s.Accuracy.Value = value;
        return s;
      }
    }
  },
  {
    Id: 't2_head_hood_1',
    Name: 'Cowled Hood',
    Icon: 'cowled',
    Slot: 'Head',
    Type: 'Hood',
    Tier: 'II',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Accuracy', value),
      ValuesByLevel: INNATE_ACCURACY,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_head_hood_1_innate');
        s.Accuracy.Value = value;
        return s;
      }
    }
  }
];
const HEAD_HAT_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 't1_head_hat_1',
    Name: 'Apprentice Hat',
    Icon: 'pilgrimhat',
    Slot: 'Head',
    Type: 'Hat',
    Tier: 'I',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Accuracy', value),
      ValuesByLevel: INNATE_ACCURACY,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t1_head_hat_1_innate');
        s.Accuracy.Value = value;
        return s;
      }
    }
  },
  {
    Id: 't1_head_hat_2',
    Name: 'Bycocket',
    Icon: 'robinhoodhat',
    Slot: 'Head',
    Type: 'Hat',
    Tier: 'I',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Accuracy', value),
      ValuesByLevel: INNATE_ACCURACY,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t1_head_hat_2_innate');
        s.Accuracy.Value = value;
        return s;
      }
    }
  },
  {
    Id: 't2_head_hat_1',
    Name: 'Outback Hat',
    Icon: 'outbackhat',
    Slot: 'Head',
    Type: 'Hat',
    Tier: 'II',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Accuracy', value),
      ValuesByLevel: INNATE_ACCURACY,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_head_hat_1_innate');
        s.Accuracy.Value = value;
        return s;
      }
    }
  },
  {
    Id: 't3_head_hat_1',
    Name: 'Wizard Hat',
    Icon: 'pointyhat',
    Slot: 'Head',
    Type: 'Hat',
    Tier: 'III',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Critical Hit Chance', value),
      ValuesByLevel: INNATE_CRIT_CHANCE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_head_hat_1_innate');
        s.CriticalHit.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't3_head_hat_2',
    Name: 'Turban of the Sun',
    Icon: 'turban',
    Slot: 'Head',
    Type: 'Hat',
    Tier: 'III',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Accuracy', value),
      ValuesByLevel: INNATE_ACCURACY,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_head_hat_2_innate');
        s.Accuracy.Value = value;
        return s;
      }
    }
  }
];
const HEAD_CROWN_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 't2_head_crown_1',
    Name: 'Crenelated Crown',
    Icon: 'crenelcrown',
    Slot: 'Head',
    Type: 'Crown',
    Tier: 'II',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Accuracy', value),
      ValuesByLevel: INNATE_ACCURACY,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_head_crown_1_innate');
        s.Accuracy.Value = value;
        return s;
      }
    }
  },
  {
    Id: 't3_head_crown_1',
    Name: 'Jewel Crown',
    Icon: 'jewelcrown',
    Slot: 'Head',
    Type: 'Crown',
    Tier: 'III',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Accuracy', value),
      ValuesByLevel: INNATE_ACCURACY,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_head_crown_1_innate');
        s.Accuracy.Value = value;
        return s;
      }
    }
  }
];

export const HEAD_VARIANTS: ItemVariantDefinition[] = [
  ...HEAD_HELMET_VARIANTS,
  ...HEAD_HOOD_VARIANTS,
  ...HEAD_HAT_VARIANTS,
  ...HEAD_CROWN_VARIANTS
];
//#endregion HEAD

//#region CHEST
const CHEST_CHESTPLATE_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 't1_chest_chestplate_1',
    Name: 'Plate Mail',
    Icon: 'chestarmor',
    Slot: 'Chest',
    Type: 'Chestplate',
    Tier: 'I',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Chance', value),
      ValuesByLevel: INNATE_BLEED_CHANCE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t1_chest_chestplate_1_innate');
        s.Bleeding.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't2_chest_chestplate_1',
    Name: 'Battle Armor',
    Icon: 'abdominalarmor',
    Slot: 'Chest',
    Type: 'Chestplate',
    Tier: 'II',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Chance', value),
      ValuesByLevel: INNATE_BLEED_CHANCE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_chest_chestplate_1_innate');
        s.Bleeding.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't2_chest_chestplate_2',
    Name: 'Cape Armor',
    Icon: 'capearmor',
    Slot: 'Chest',
    Type: 'Chestplate',
    Tier: 'II',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Critical Hit Chance', value),
      ValuesByLevel: INNATE_CRIT_CHANCE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_chest_chestplate_2_innate');
        s.CriticalHit.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't3_chest_chestplate_1',
    Name: 'Warlord Plate',
    Icon: 'abdominalarmor',
    Slot: 'Chest',
    Type: 'Chestplate',
    Tier: 'III',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Damage', value),
      ValuesByLevel: INNATE_BLEED_DAMAGE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_chest_chestplate_1_innate');
        s.Bleeding.Damage = value;
        return s;
      }
    }
  },
  {
    Id: 't3_chest_chestplate_2',
    Name: 'Cape Armor',
    Icon: 'capearmor',
    Slot: 'Chest',
    Type: 'Chestplate',
    Tier: 'III',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Critical Hit Damage', value),
      ValuesByLevel: INNATE_CRIT_DAMAGE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_chest_chestplate_2_innate');
        s.CriticalHit.Damage = value;
        return s;
      }
    }
  }
];
const CHEST_TUNIC_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 't1_chest_tunic_1',
    Name: 'Leather Tunic',
    Icon: 'leatherarmor',
    Slot: 'Chest',
    Type: 'Tunic',
    Tier: 'I',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Chance', value),
      ValuesByLevel: INNATE_MULTI_CHANCE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t1_chest_tunic_1_innate');
        s.MultiHit.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't2_chest_tunic_1',
    Name: 'Improved Tunic',
    Icon: 'leatherarmor',
    Slot: 'Chest',
    Type: 'Tunic',
    Tier: 'II',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Chance', value),
      ValuesByLevel: INNATE_MULTI_CHANCE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_chest_tunic_1_innate');
        s.MultiHit.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't2_chest_tunic_2',
    Name: 'Balor Coat',
    Icon: 'piratecoat',
    Slot: 'Chest',
    Type: 'Tunic',
    Tier: 'II',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Charged Damage', value),
      ValuesByLevel: INNATE_CSD,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_chest_tunic_2_innate');
        s.ChargingStrike.ChargeDamage = value;
        return s;
      }
    }
  },
  {
    Id: 't3_chest_tunic_1',
    Name: 'Archon Tunic',
    Icon: 'leatherarmor',
    Slot: 'Chest',
    Type: 'Tunic',
    Tier: 'III',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Damage', value),
      ValuesByLevel: INNATE_MULTI_DAMAGE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_chest_tunic_1_innate');
        s.MultiHit.Damage = value;
        return s;
      }
    }
  },
  {
    Id: 't3_chest_tunic_2',
    Name: 'Etched Jacket',
    Icon: 'piratecoat',
    Slot: 'Chest',
    Type: 'Tunic',
    Tier: 'III',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Charged Damage', value),
      ValuesByLevel: INNATE_CSD,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_chest_tunic_2_innate');
        s.ChargingStrike.ChargeDamage = value;
        return s;
      }
    }
  }
];
const CHEST_SHIRT_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 't1_chest_shirt_1',
    Name: 'Buttoned Shirt',
    Icon: 'shirt',
    Slot: 'Chest',
    Type: 'Shirt',
    Tier: 'I',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Critical Hit Chance', value),
      ValuesByLevel: INNATE_CRIT_CHANCE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t1_chest_shirt_1_innate');
        s.CriticalHit.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't1_chest_shirt_2',
    Name: 'Light Top',
    Icon: 'sleevelesstop',
    Slot: 'Chest',
    Type: 'Shirt',
    Tier: 'I',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Charged Damage', value),
      ValuesByLevel: INNATE_CSD,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t1_chest_shirt_2_innate');
        s.ChargingStrike.ChargeDamage = value;
        return s;
      }
    }
  }
];
export const CHEST_VARIANTS: ItemVariantDefinition[] = [
  ...CHEST_CHESTPLATE_VARIANTS,
  ...CHEST_TUNIC_VARIANTS,
  ...CHEST_SHIRT_VARIANTS
];
//#endregion CHEST

//#region LEGS
const LEGS_PANTS_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 't1_legs_pants_1',
    Name: 'Trousers',
    Icon: 'trousers',
    Slot: 'Legs',
    Type: 'Pants',
    Tier: 'I',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Chance', value),
      ValuesByLevel: INNATE_BLEED_CHANCE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t1_legs_pants_1_innate');
        s.Bleeding.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't1_legs_pants_2',
    Name: 'Shorts',
    Icon: 'underwearshorts',
    Slot: 'Legs',
    Type: 'Pants',
    Tier: 'I',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Chance', value),
      ValuesByLevel: INNATE_MULTI_CHANCE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t1_legs_pants_2_innate');
        s.MultiHit.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't2_legs_pants_1',
    Name: 'Armored Pants',
    Icon: 'armoredpants',
    Slot: 'Legs',
    Type: 'Pants',
    Tier: 'II',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Chance', value),
      ValuesByLevel: INNATE_BLEED_CHANCE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_legs_pants_1_innate');
        s.Bleeding.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't2_legs_pants_2',
    Name: 'Loin Cloth',
    Icon: 'loincloth',
    Slot: 'Legs',
    Type: 'Pants',
    Tier: 'II',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Chance', value),
      ValuesByLevel: INNATE_MULTI_CHANCE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_legs_pants_2_innate');
        s.MultiHit.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't3_legs_pants_1',
    Name: 'Immortal Pants',
    Icon: 'armoredpants',
    Slot: 'Legs',
    Type: 'Pants',
    Tier: 'III',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleeding Chance', value),
      ValuesByLevel: INNATE_BLEED_CHANCE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_legs_pants_1_innate');
        s.Bleeding.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't3_legs_pants_2',
    Name: 'Savage Pants',
    Icon: 'loincloth',
    Slot: 'Legs',
    Type: 'Pants',
    Tier: 'III',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Chance', value),
      ValuesByLevel: INNATE_MULTI_CHANCE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_legs_pants_2_innate');
        s.MultiHit.Chance = value;
        return s;
      }
    }
  }
];
const LEGS_SKIRT_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 't1_legs_skirt_1',
    Name: 'Skirt',
    Icon: 'skirt',
    Slot: 'Legs',
    Type: 'Skirt',
    Tier: 'I',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Critical Hit Chance', value),
      ValuesByLevel: INNATE_CRIT_CHANCE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t1_legs_skirt_1_innate');
        s.CriticalHit.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't2_legs_skirt_1',
    Name: 'Metal Skirt',
    Icon: 'metalskirt',
    Slot: 'Legs',
    Type: 'Skirt',
    Tier: 'II',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Critical Hit Chance', value),
      ValuesByLevel: INNATE_CRIT_CHANCE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_legs_skirt_1_innate');
        s.CriticalHit.Chance = value;
        return s;
      }
    }
  },
  {
    Id: 't3_legs_skirt_1',
    Name: 'Unholy Plates',
    Icon: 'metalskirt',
    Slot: 'Legs',
    Type: 'Skirt',
    Tier: 'III',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Critical Hit Chance', value),
      ValuesByLevel: INNATE_CRIT_CHANCE,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_legs_skirt_1_innate');
        s.CriticalHit.Chance = value;
        return s;
      }
    }
  }
];

export const LEGS_VARIANTS: ItemVariantDefinition[] = [
  ...LEGS_PANTS_VARIANTS,
  ...LEGS_SKIRT_VARIANTS
];
//#endregion LEGS

//#region FEET
const FEET_BOOTS_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 't1_feet_boots_1',
    Name: 'Leather Boots',
    Icon: 'boots',
    Slot: 'Feet',
    Type: 'Boots',
    Tier: 'I',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Attack Speed', value),
      ValuesByLevel: INNATE_IAS,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t1_feet_boots_1_innate');
        s.AttackSpeed.Value = value;
        return s;
      }
    }
  },
  {
    Id: 't2_feet_boots_1',
    Name: 'Armored Greaves',
    Icon: 'legarmor',
    Slot: 'Feet',
    Type: 'Boots',
    Tier: 'II',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Attack Speed', value),
      ValuesByLevel: INNATE_IAS,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_feet_boots_1_innate');
        s.AttackSpeed.Value = value;
        return s;
      }
    }
  },
  {
    Id: 't2_feet_boots_2',
    Name: 'Leather Boots',
    Icon: 'boots',
    Slot: 'Feet',
    Type: 'Boots',
    Tier: 'II',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Attack Speed', value),
      ValuesByLevel: INNATE_IAS,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_feet_boots_2_innate');
        s.AttackSpeed.Value = value;
        return s;
      }
    }
  },
  {
    Id: 't2_feet_boots_3',
    Name: 'Heavy Boots',
    Icon: 'steeltoeboots',
    Slot: 'Feet',
    Type: 'Boots',
    Tier: 'II',
    Innate: {
      ToLabel: (value: number) => FlatAdditiveLabel('Charge Gain per Hit', value),
      ValuesByLevel: INNATE_CS_GAIN_T2,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_feet_boots_3_innate');
        s.ChargingStrike.ChargeGain = value;
        return s;
      }
    }
  },
  {
    Id: 't3_feet_boots_1',
    Name: 'Chain Greaves',
    Icon: 'legarmor',
    Slot: 'Feet',
    Type: 'Boots',
    Tier: 'III',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Attack Speed', value),
      ValuesByLevel: INNATE_IAS,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_feet_boots_1_innate');
        s.AttackSpeed.Value = value;
        return s;
      }
    }
  },
  {
    Id: 't3_feet_boots_2',
    Name: 'Valor Treads',
    Icon: 'boots',
    Slot: 'Feet',
    Type: 'Boots',
    Tier: 'III',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Attack Speed', value),
      ValuesByLevel: INNATE_IAS,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_feet_boots_2_innate');
        s.AttackSpeed.Value = value;
        return s;
      }
    }
  },
  {
    Id: 't3_feet_boots_3',
    Name: 'Iron Boots',
    Icon: 'steeltoeboots',
    Slot: 'Feet',
    Type: 'Boots',
    Tier: 'III',
    Innate: {
      ToLabel: (value: number) => FlatAdditiveLabel('Charge Gain per Hit', value),
      ValuesByLevel: INNATE_CS_GAIN_T3,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_feet_boots_3_innate');
        s.ChargingStrike.ChargeGain = value;
        return s;
      }
    }
  }
];
const FEET_SHOES_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 't1_feet_shoes_1',
    Name: 'Simple Shoes',
    Icon: 'sonicshoes',
    Slot: 'Feet',
    Type: 'Shoes',
    Tier: 'I',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Attack Speed', value),
      ValuesByLevel: INNATE_IAS,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t1_feet_shoes_1_innate');
        s.AttackSpeed.Value = value;
        return s;
      }
    }
  },
  {
    Id: 't2_feet_shoes_1',
    Name: 'Leather Shoes',
    Icon: 'sonicshoes',
    Slot: 'Feet',
    Type: 'Shoes',
    Tier: 'II',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Attack Speed', value),
      ValuesByLevel: INNATE_IAS,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t2_feet_shoes_1_innate');
        s.AttackSpeed.Value = value;
        return s;
      }
    }
  },
  {
    Id: 't3_feet_shoes_1',
    Name: 'Silk Shoes',
    Icon: 'sonicshoes',
    Slot: 'Feet',
    Type: 'Shoes',
    Tier: 'III',
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Attack Speed', value),
      ValuesByLevel: INNATE_IAS,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('t3_feet_shoes_1_innate');
        s.AttackSpeed.Value = value;
        return s;
      }
    }
  }
];
export const FEET_VARIANTS: ItemVariantDefinition[] = [
  ...FEET_BOOTS_VARIANTS,
  ...FEET_SHOES_VARIANTS
];
//#endregion FEET

export const ITEM_VARIANTS: ItemVariantDefinition[] = [
  ...WEAPON_VARIANTS,
  ...OFFHAND_VARIANTS,
  ...HEAD_VARIANTS,
  ...CHEST_VARIANTS,
  ...LEGS_VARIANTS,
  ...FEET_VARIANTS
];

export const STARTER_WEAPON_VARIANTS: ItemVariantDefinition[] = [
  ...ITEM_VARIANTS.filter((v) => v.Tier === 'I' && v.Slot === 'Weapon')
];
