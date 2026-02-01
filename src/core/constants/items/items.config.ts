import {
  EmptyStatSource,
  FlatAdditiveLabel,
  ItemLevel,
  ItemVariantDefinition,
  PercentageAdditiveLabel,
  StatSource
} from '../../models';

function ScaleLinearValueCurve(
  baseValue: number,
  incrementPerLevel: number
): Record<ItemLevel, number> {
  const values: Partial<Record<ItemLevel, number>> = {};
  for (let level = 1 as ItemLevel; level <= 25; level++) {
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
  25: 350
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
  BASE_DAMAGE_BASE14: ScaleWeaponBaseDamageCurve(14),
  BASE_DAMAGE_BASE16: ScaleWeaponBaseDamageCurve(16),
  BASE_DAMAGE_BASE20: ScaleWeaponBaseDamageCurve(20),
  BASE_DAMAGE_BASE22: ScaleWeaponBaseDamageCurve(22),
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

  CRIT_DAMAGE_BASE10: ScaleLinearValueCurve(0.11, 0.01),
  CRIT_DAMAGE_BASE25: {
    1: 0.25,
    2: 0.26,
    3: 0.27,
    4: 0.28,
    5: 0.3,
    6: 0.32,
    7: 0.34,
    8: 0.36,
    9: 0.38,
    10: 0.4,
    11: 0.42,
    12: 0.44,
    13: 0.46,
    14: 0.48,
    15: 0.5,
    16: 0.52,
    17: 0.54,
    18: 0.56,
    19: 0.58,
    20: 0.6,
    21: 0.63,
    22: 0.66,
    23: 0.69,
    24: 0.72,
    25: 0.75
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
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE7,
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
    Id: 't2_weapon_sword_bleed',
    Name: 'Shard Sword',
    Icon: 'shardsword',
    Slot: 'Weapon',
    Type: 'Sword',
    Tier: 'II',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE10,
    WeaponBaseAttackSpeed: 1.2,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleed Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.BLEED_CHANCE_BASE6,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_sword_bleed_innate');
        s.Bleeding.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 't2_weapon_sword_crit',
    Name: 'Broadsword',
    Icon: 'broadsword',
    Slot: 'Weapon',
    Type: 'Sword',
    Tier: 'II',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE10,
    WeaponBaseAttackSpeed: 1.2,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Crit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.CRIT_CHANCE_BASE6,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_sword_crit_innate');
        s.CriticalHit.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 't2_weapon_sword_fast',
    Name: 'Katana',
    Icon: 'katana',
    Slot: 'Weapon',
    Type: 'Sword',
    Tier: 'II',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE8,
    WeaponBaseAttackSpeed: 1.6,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.MULTI_HIT_CHANCE_BASE6,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_sword_fast_innate');
        s.MultiHit.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 't3_weapon_sword_heavy',
    Name: 'Claymore',
    Icon: 'piercingsword',
    Slot: 'Weapon',
    Type: 'Sword',
    Tier: 'III',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE20,
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
    Id: 't3_weapon_sword_powerful',
    Name: 'Relic Blade',
    Icon: 'relicblade',
    Slot: 'Weapon',
    Type: 'Sword',
    Tier: 'III',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE14,
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
    Id: 't2_weapon_axe_bleed',
    Name: 'Marauder Axe',
    Icon: 'sharpaxe',
    Slot: 'Weapon',
    Type: 'Axe',
    Tier: 'II',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE12,
    WeaponBaseAttackSpeed: 1.0,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleed Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.BLEED_CHANCE_BASE6,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_axe_bleed_innate');
        s.Bleeding.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 't2_weapon_axe_crit',
    Name: 'Battle Axe',
    Icon: 'battleaxe',
    Slot: 'Weapon',
    Type: 'Axe',
    Tier: 'II',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE12,
    WeaponBaseAttackSpeed: 1.0,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Crit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.CRIT_CHANCE_BASE6,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_axe_crit_innate');
        s.CriticalHit.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 't3_weapon_axe_heavy',
    Name: 'War Axe',
    Icon: 'waraxe',
    Slot: 'Weapon',
    Type: 'Axe',
    Tier: 'III',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE30,
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
    Id: 't3_weapon_axe_halberd',
    Name: 'Halberd',
    Icon: 'halberd',
    Slot: 'Weapon',
    Type: 'Axe',
    Tier: 'III',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE22,
    WeaponBaseAttackSpeed: 1.0,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleed Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.BLEED_CHANCE_BASE6,
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
    Id: 't1_weapon_bow_starter',
    Name: 'Short Bow',
    Icon: 'highshot',
    Slot: 'Weapon',
    Type: 'Bow',
    Tier: 'I',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE5,
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
    Id: 't2_weapon_bow_bleed',
    Name: 'Siege Crossbow',
    Icon: 'crossbow',
    Slot: 'Weapon',
    Type: 'Bow',
    Tier: 'II',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE8,
    WeaponBaseAttackSpeed: 1.6,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleed Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.BLEED_CHANCE_BASE6,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_bow_bleed_innate');
        s.Bleeding.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 't2_weapon_bow_crit',
    Name: 'Hunting Bow',
    Icon: 'pocketbow',
    Slot: 'Weapon',
    Type: 'Bow',
    Tier: 'II',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE8,
    WeaponBaseAttackSpeed: 1.6,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Crit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.CRIT_CHANCE_BASE6,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_bow_crit_innate');
        s.CriticalHit.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 't2_weapon_bow_multi',
    Name: 'Double Shot',
    Icon: 'doubleshot',
    Slot: 'Weapon',
    Type: 'Bow',
    Tier: 'II',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE8,
    WeaponBaseAttackSpeed: 1.6,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.MULTI_HIT_CHANCE_BASE6,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_bow_multi_innate');
        s.MultiHit.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 't3_weapon_bow_heavy',
    Name: 'Battle Bow',
    Icon: 'heavyarrow',
    Slot: 'Weapon',
    Type: 'Bow',
    Tier: 'III',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE14,
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
    Id: 't1_weapon_dagger_starter',
    Name: 'Simple Dagger',
    Icon: 'bowieknife',
    Slot: 'Weapon',
    Type: 'Dagger',
    Tier: 'I',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE6,
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
    Id: 't2_weapon_dagger_bleed',
    Name: 'Curvy Dagger',
    Icon: 'curvyknife',
    Slot: 'Weapon',
    Type: 'Dagger',
    Tier: 'II',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE10,
    WeaponBaseAttackSpeed: 1.2,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Bleed Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.BLEED_CHANCE_BASE6,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_dagger_bleed_innate');
        s.Bleeding.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 't2_weapon_dagger_crit',
    Name: 'Jagged Dagger',
    Icon: 'knifethrust',
    Slot: 'Weapon',
    Type: 'Dagger',
    Tier: 'II',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE10,
    WeaponBaseAttackSpeed: 1.2,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Crit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.CRIT_CHANCE_BASE6,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_dagger_crit_innate');
        s.CriticalHit.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 't2_weapon_dagger_multi',
    Name: 'Deadly Dagger',
    Icon: 'plaindagger',
    Slot: 'Weapon',
    Type: 'Dagger',
    Tier: 'II',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE10,
    WeaponBaseAttackSpeed: 1.2,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Multi Hit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.MULTI_HIT_CHANCE_BASE6,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_dagger_multi_innate');
        s.MultiHit.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 't3_weapon_dagger_powerful',
    Name: 'Obsidian Dagger',
    Icon: 'broaddagger',
    Slot: 'Weapon',
    Type: 'Dagger',
    Tier: 'III',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE14,
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
    Id: 't2_weapon_wand_crit',
    Name: 'Orb Wand',
    Icon: 'orbwand',
    Slot: 'Weapon',
    Type: 'Wand',
    Tier: 'II',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE9,
    WeaponBaseAttackSpeed: 1.4,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Crit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.CRIT_CHANCE_BASE6,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_wand_crit_innate');
        s.CriticalHit.FlatChance = value;
        return s;
      }
    }
  },
  {
    Id: 't2_weapon_staff_crit_damage',
    Name: 'Mentor Staff',
    Icon: 'flangedmace',
    Slot: 'Weapon',
    Type: 'Staff',
    Tier: 'II',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE9,
    WeaponBaseAttackSpeed: 1.4,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Crit Damage', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.CRIT_DAMAGE_BASE10,
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_staff_crit_damage_innate');
        s.CriticalHit.FlatDamage = value;
        return s;
      }
    }
  },
  {
    Id: 't3_weapon_wand_crit_damage',
    Name: 'Lunar Wand',
    Icon: 'lunarwand',
    Slot: 'Weapon',
    Type: 'Wand',
    Tier: 'III',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE16,
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
    Id: 't3_weapon_staff_crit',
    Name: 'Wizard Staff',
    Icon: 'wizardstaff',
    Slot: 'Weapon',
    Type: 'Staff',
    Tier: 'III',
    WeaponBaseDamage: WEAPON_BASE_DAMAGE_CONFIG.BASE_DAMAGE_BASE16,
    WeaponBaseAttackSpeed: 1.4,
    Innate: {
      ToLabel: (value: number) => PercentageAdditiveLabel('Crit Chance', value),
      ValuesByLevel: WEAPON_INNATE_CONFIG.CRIT_CHANCE_BASE6,
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
//#endregion WEAPONS

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
      ToLabel: (value: number) => FlatAdditiveLabel('Strength', value),
      ValuesByLevel: ScaleLinearValueCurve(1, 1),
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('offhand_shield_starter_innate');
        s.Strength.Flat = value;
        return s;
      }
    }
  }
];

const OFFHAND_ORBS_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 't2_offhand_orb_starter',
    Name: 'Spellbook',
    Icon: 'bookmarklet',
    Slot: 'OffHand',
    Type: 'Orb',
    Tier: 'II',
    Innate: {
      ToLabel: (value: number) => FlatAdditiveLabel('Intelligence', value),
      ValuesByLevel: ScaleLinearValueCurve(1, 1),
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('offhand_orb_starter_innate');
        s.Intelligence.Flat = value;
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
      ToLabel: (value: number) => FlatAdditiveLabel('Dexterity', value),
      ValuesByLevel: ScaleLinearValueCurve(1, 1),
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('offhand_quiver_starter_innate');
        s.Dexterity.Flat = value;
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
      ToLabel: (value: number) => FlatAdditiveLabel('Intelligence', value),
      ValuesByLevel: ScaleLinearValueCurve(1, 1),
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('offhand_dagger_starter_innate');
        s.Intelligence.Flat = value;
        return s;
      }
    }
  }
];

const OFFHAND_VARIANTS: ItemVariantDefinition[] = [
  ...OFFHAND_SHIELDS_VARIANTS,
  ...OFFHAND_ORBS_VARIANTS,
  ...OFFHAND_QUIVERS_VARIANTS,
  ...OFFHAND_DAGGERS_VARIANTS
];
//#endregion OFFHANDS

//#region HEAD
const HEAD_HELMET_VARIANTS: ItemVariantDefinition[] = [];
const HEAD_HOOD_VARIANTS: ItemVariantDefinition[] = [];
const HEAD_HAT_VARIANTS: ItemVariantDefinition[] = [];

export const HEAD_VARIANTS: ItemVariantDefinition[] = [
  ...HEAD_HELMET_VARIANTS,
  ...HEAD_HOOD_VARIANTS,
  ...HEAD_HAT_VARIANTS
];
//#endregion HEAD

//#region CHEST
export const CHEST_VARIANTS: ItemVariantDefinition[] = [];
//#endregion CHEST

export const ITEM_VARIANTS: ItemVariantDefinition[] = [
  ...WEAPON_VARIANTS,
  ...OFFHAND_VARIANTS,
  ...HEAD_VARIANTS,
  ...CHEST_VARIANTS
];
