import {
  EmptyStatSource,
  FlatAdditiveLabel,
  ItemLevel,
  ItemVariantDefinition,
  PercentageAdditiveLabel,
  StatSource
} from '../../models';

export const ITEM_CONFIG = {
  LEVEL: {
    MIN: 1 as ItemLevel,
    MAX: 25 as ItemLevel
  }
};

export const WEAPON_INNATE_CONFIG = {
  BASE_DAMAGE_BASE10: {
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
    25: 350
  } as Record<ItemLevel, number>,
  DAMAGE_BASE1: {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    11: 11,
    12: 12,
    13: 13,
    14: 14,
    15: 15,
    16: 16,
    17: 17,
    18: 18,
    19: 19,
    20: 20,
    21: 21,
    22: 22,
    23: 23,
    24: 24,
    25: 25
  } as Record<ItemLevel, number>,

  BLEED_CHANCE_BASE1: {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    11: 11,
    12: 12,
    13: 13,
    14: 14,
    15: 15,
    16: 16,
    17: 17,
    18: 18,
    19: 19,
    20: 20,
    21: 21,
    22: 22,
    23: 23,
    24: 24,
    25: 25
  } as Record<ItemLevel, number>,
  CRIT_CHANCE_BASE1: {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    11: 11,
    12: 12,
    13: 13,
    14: 14,
    15: 15,
    16: 16,
    17: 17,
    18: 18,
    19: 19,
    20: 20,
    21: 21,
    22: 22,
    23: 23,
    24: 24,
    25: 25
  } as Record<ItemLevel, number>,
  MULTI_HIT_CHANCE_BASE1: {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    11: 11,
    12: 12,
    13: 13,
    14: 14,
    15: 15,
    16: 16,
    17: 17,
    18: 18,
    19: 19,
    20: 20,
    21: 21,
    22: 22,
    23: 23,
    24: 24,
    25: 25
  } as Record<ItemLevel, number>,

  BLEED_CHANCE_BASE5: {
    1: 5,
    2: 6,
    3: 7,
    4: 8,
    5: 9,
    6: 10,
    7: 11,
    8: 12,
    9: 13,
    10: 14,
    11: 15,
    12: 16,
    13: 17,
    14: 18,
    15: 19,
    16: 20,
    17: 21,
    18: 22,
    19: 23,
    20: 24,
    21: 25,
    22: 26,
    23: 27,
    24: 28,
    25: 30
  } as Record<ItemLevel, number>,
  CRIT_CHANCE_BASE5: {
    1: 5,
    2: 6,
    3: 7,
    4: 8,
    5: 9,
    6: 10,
    7: 11,
    8: 12,
    9: 13,
    10: 14,
    11: 15,
    12: 16,
    13: 17,
    14: 18,
    15: 19,
    16: 20,
    17: 21,
    18: 22,
    19: 23,
    20: 24,
    21: 25,
    22: 26,
    23: 27,
    24: 28,
    25: 30
  } as Record<ItemLevel, number>,
  MULTI_HIT_CHANCE_BASE5: {
    1: 5,
    2: 6,
    3: 7,
    4: 8,
    5: 9,
    6: 10,
    7: 11,
    8: 12,
    9: 13,
    10: 14,
    11: 15,
    12: 16,
    13: 17,
    14: 18,
    15: 19,
    16: 20,
    17: 21,
    18: 22,
    19: 23,
    20: 24,
    21: 25,
    22: 26,
    23: 27,
    24: 28,
    25: 30
  } as Record<ItemLevel, number>,

  CRIT_DAMAGE_BASE25: {
    1: 25,
    2: 26,
    3: 27,
    4: 28,
    5: 30,
    6: 32,
    7: 34,
    8: 36,
    9: 38,
    10: 40,
    11: 42,
    12: 44,
    13: 46,
    14: 48,
    15: 50,
    16: 52,
    17: 54,
    18: 56,
    19: 58,
    20: 60,
    21: 63,
    22: 66,
    23: 69,
    24: 72,
    25: 75
  } as Record<ItemLevel, number>
};

const WEAPON_SWORDS_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 'weapon_sword_starter',
    Name: 'Short Sword',
    Icon: 'gladius',
    Slot: 'Weapon',
    Type: 'Sword',
    Tier: 'I',
    WeaponBaseDamage: 7,
    WeaponBaseAttackSpeed: 1.0,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleed Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.BLEED_CHANCE_BASE1,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_sword_starter_innate');
        s.Bleeding.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 'weapon_sword_bleed',
    Name: 'Shard Sword',
    Icon: 'shardsword',
    Slot: 'Weapon',
    Type: 'Sword',
    Tier: 'II',
    WeaponBaseDamage: 10,
    WeaponBaseAttackSpeed: 1.2,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleed Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.BLEED_CHANCE_BASE5,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_sword_bleed_innate');
        s.Bleeding.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 'weapon_sword_crit',
    Name: 'Broadsword',
    Icon: 'broadsword',
    Slot: 'Weapon',
    Type: 'Sword',
    Tier: 'II',
    WeaponBaseDamage: 10,
    WeaponBaseAttackSpeed: 1.2,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Crit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.CRIT_CHANCE_BASE5,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_sword_crit_innate');
        s.CriticalHit.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 'weapon_sword_fast',
    Name: 'Katana',
    Icon: 'katana',
    Slot: 'Weapon',
    Type: 'Sword',
    Tier: 'II',
    WeaponBaseDamage: 8,
    WeaponBaseAttackSpeed: 1.6,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.MULTI_HIT_CHANCE_BASE5,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_sword_fast_innate');
        s.MultiHit.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 'weapon_sword_heavy',
    Name: 'Claymore',
    Icon: 'piercingsword',
    Slot: 'Weapon',
    Type: 'Sword',
    Tier: 'III',
    WeaponBaseDamage: 20,
    WeaponBaseAttackSpeed: 1.0,
    Innate: {
      ToLabel: (value: number) => FlatAdditiveLabel('Damage', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.DAMAGE_BASE1,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_sword_heavy_innate');
        s.Damage.Flat = value;
        return s;
      }
    }
  },
  {
    Id: 'weapon_sword_powerful',
    Name: 'Relic Blade',
    Icon: 'relicblade',
    Slot: 'Weapon',
    Type: 'Sword',
    Tier: 'III',
    WeaponBaseDamage: 14,
    WeaponBaseAttackSpeed: 1.4,
    Innate: {
      ToLabel: (value: number) => FlatAdditiveLabel('Damage', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.DAMAGE_BASE1,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_sword_powerful_innate');
        s.Damage.Flat = value;
        return s;
      }
    }
  }
];
const WEAPON_AXES_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 'weapon_axe_bleed',
    Name: 'Sharp Axe',
    Icon: 'sharpaxe',
    Slot: 'Weapon',
    Type: 'Axe',
    Tier: 'II',
    WeaponBaseDamage: 12,
    WeaponBaseAttackSpeed: 1.0,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleed Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.BLEED_CHANCE_BASE5,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_axe_bleed_innate');
        s.Bleeding.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 'weapon_axe_crit',
    Name: 'Battle Axe',
    Icon: 'battleaxe',
    Slot: 'Weapon',
    Type: 'Axe',
    Tier: 'II',
    WeaponBaseDamage: 12,
    WeaponBaseAttackSpeed: 1.0,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Crit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.CRIT_CHANCE_BASE5,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_axe_crit_innate');
        s.CriticalHit.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 'weapon_axe_heavy',
    Name: 'War Axe',
    Icon: 'waraxe',
    Slot: 'Weapon',
    Type: 'Axe',
    Tier: 'III',
    WeaponBaseDamage: 25,
    WeaponBaseAttackSpeed: 0.8,
    Innate: {
      ToLabel: (value: number) => FlatAdditiveLabel('Damage', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.DAMAGE_BASE1,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_axe_heavy_innate');
        s.Damage.Flat = value;
        return s;
      }
    }
  },
  {
    Id: 'weapon_axe_halberd',
    Name: 'Halberd',
    Icon: 'halberd',
    Slot: 'Weapon',
    Type: 'Axe',
    Tier: 'III',
    WeaponBaseDamage: 20,
    WeaponBaseAttackSpeed: 1.0,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleed Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.BLEED_CHANCE_BASE5,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_axe_halberd_innate');
        s.Bleeding.FlatChance = value;
        return s;
      }
    }
  }
];
const WEAPON_BOWS_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 'weapon_bow_starter',
    Name: 'Short Bow',
    Icon: 'highshot',
    Slot: 'Weapon',
    Type: 'Bow',
    Tier: 'I',
    WeaponBaseDamage: 5,
    WeaponBaseAttackSpeed: 1.4,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.MULTI_HIT_CHANCE_BASE1,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_bow_multi_hit_innate');
        s.MultiHit.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 'weapon_bow_bleed',
    Name: 'Crossbow',
    Icon: 'crossbow',
    Slot: 'Weapon',
    Type: 'Bow',
    Tier: 'II',
    WeaponBaseDamage: 8,
    WeaponBaseAttackSpeed: 1.6,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleed Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.BLEED_CHANCE_BASE5,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_bow_bleed_innate');
        s.Bleeding.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 'weapon_bow_crit',
    Name: 'Hunting Bow',
    Icon: 'pocketbow',
    Slot: 'Weapon',
    Type: 'Bow',
    Tier: 'II',
    WeaponBaseDamage: 8,
    WeaponBaseAttackSpeed: 1.6,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Crit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.CRIT_CHANCE_BASE5,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_bow_crit_innate');
        s.CriticalHit.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 'weapon_bow_multi',
    Name: 'Double Shot',
    Icon: 'doubleshot',
    Slot: 'Weapon',
    Type: 'Bow',
    Tier: 'II',
    WeaponBaseDamage: 8,
    WeaponBaseAttackSpeed: 1.6,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.MULTI_HIT_CHANCE_BASE5,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_bow_multi_innate');
        s.MultiHit.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 'weapon_bow_heavy',
    Name: 'Battle Bow',
    Icon: 'heavyarrow',
    Slot: 'Weapon',
    Type: 'Bow',
    Tier: 'III',
    WeaponBaseDamage: 14,
    WeaponBaseAttackSpeed: 1.4,
    Innate: {
      ToLabel: (value: number) => FlatAdditiveLabel('Damage', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.DAMAGE_BASE1,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_bow_heavy_innate');
        s.Damage.Flat = value;
        return s;
      }
    }
  }
];
const WEAPON_DAGGER_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 'weapon_dagger_starter',
    Name: 'Simple Dagger',
    Icon: 'bowieknife',
    Slot: 'Weapon',
    Type: 'Dagger',
    Tier: 'I',
    WeaponBaseDamage: 6,
    WeaponBaseAttackSpeed: 1.2,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Crit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.CRIT_CHANCE_BASE1,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_dagger_starter_innate');
        s.CriticalHit.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 'weapon_dagger_bleed',
    Name: 'Curvy Dagger',
    Icon: 'curvyknife',
    Slot: 'Weapon',
    Type: 'Dagger',
    Tier: 'II',
    WeaponBaseDamage: 10,
    WeaponBaseAttackSpeed: 1.2,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleed Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.BLEED_CHANCE_BASE5,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_dagger_bleed_innate');
        s.Bleeding.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 'weapon_dagger_crit',
    Name: 'Jagged Dagger',
    Icon: 'knifethrust',
    Slot: 'Weapon',
    Type: 'Dagger',
    Tier: 'II',
    WeaponBaseDamage: 10,
    WeaponBaseAttackSpeed: 1.2,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Crit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.CRIT_CHANCE_BASE5,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_dagger_crit_innate');
        s.CriticalHit.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 'weapon_dagger_multi',
    Name: 'Deadly Dagger',
    Icon: 'plaindagger',
    Slot: 'Weapon',
    Type: 'Dagger',
    Tier: 'II',
    WeaponBaseDamage: 10,
    WeaponBaseAttackSpeed: 1.2,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.MULTI_HIT_CHANCE_BASE5,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_dagger_multi_innate');
        s.MultiHit.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 'weapon_dagger_powerful',
    Name: 'Obsidian Dagger',
    Icon: 'broaddagger',
    Slot: 'Weapon',
    Type: 'Dagger',
    Tier: 'III',
    WeaponBaseDamage: 14,
    WeaponBaseAttackSpeed: 1.4,
    Innate: {
      ToLabel: (value: number) => FlatAdditiveLabel('Damage', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.DAMAGE_BASE1,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_dagger_powerful_innate');
        s.Damage.Flat = value;
        return s;
      }
    }
  }
];
const WEAPON_STAFF_WAND_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 'weapon_wand_crit',
    Name: 'Orb Wand',
    Icon: 'orbwand',
    Slot: 'Weapon',
    Type: 'Wand',
    Tier: 'II',
    WeaponBaseDamage: 9,
    WeaponBaseAttackSpeed: 1.4,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Crit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.CRIT_CHANCE_BASE5,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_wand_crit_innate');
        s.CriticalHit.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 'weapon_wand_crit_damage',
    Name: 'Lunar Wand',
    Icon: 'lunarwand',
    Slot: 'Weapon',
    Type: 'Wand',
    Tier: 'III',
    WeaponBaseDamage: 14,
    WeaponBaseAttackSpeed: 1.4,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Crit Damage', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.CRIT_DAMAGE_BASE25,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_wand_crit_damage_innate');
        s.CriticalHit.FlatDamage = value;
        return s;
      }
    }
  },
  {
    Id: 'weapon_staff_crit',
    Name: 'Wizard Staff',
    Icon: 'wizardstaff',
    Slot: 'Weapon',
    Type: 'Staff',
    Tier: 'III',
    WeaponBaseDamage: 14,
    WeaponBaseAttackSpeed: 1.4,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Crit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.CRIT_CHANCE_BASE5,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_staff_crit_innate');
        s.CriticalHit.FlatChance = value;
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

export const ITEM_VARIANTS: ItemVariantDefinition[] = [...WEAPON_VARIANTS];
