// Directly importing to avoid circular dependency issues

import { Enchantment } from '../models/gear/enchantment';

export const GEAR_CONFIG = {
  LEVEL: {
    BASE: 1,
    MAX: 5
  },
  SLOTS: {
    WEAPON: 4,
    SHIELD: 2,
    HEAD: 2,
    CHEST: 3,
    LEGS: 2,
    BOOTS: 1
  },
  INNATES: {
    WEAPON: new Enchantment('AttackSpeed', 0.1),
    SHIELD: new Enchantment('CriticalHitDamage', 0.5),
    HEAD: new Enchantment('CriticalHitChance', 0.05),
    CHEST: new Enchantment('Strength', 5),
    LEGS: new Enchantment('Dexterity', 5),
    BOOTS: new Enchantment('MultiHitChance', 0.01)
  },
  COSTS: {
    UPGRADE_COST_PER_LEVEL: 250
  },
  PRICES: {
    SELLVALUE_MULTIPLIER: 0.5,
    WEAPON: 250,
    SHIELD: 150,
    HEAD: 80,
    CHEST: 100,
    LEGS: 90,
    BOOTS: 70
  },
  UPGRADE: {
    STAT_MODIFIER: 1.1
  }
};
