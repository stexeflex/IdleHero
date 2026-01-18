// Directly importing to avoid circular dependency issues

import { EnchantmentPool } from '../models/gear/enchantment-pool';

export const WEAPON_ENCHANTMENT_POOL = new EnchantmentPool([
  { Stat: 'Strength', Min: 1, Max: 15, Probability: 0.5 },
  { Stat: 'CriticalHitChance', Min: 0.01, Max: 0.07, Probability: 0.3 },
  { Stat: 'AttackSpeed', Min: 0.02, Max: 0.1, Probability: 0.2 }
]);

export const SHIELD_ENCHANTMENT_POOL = new EnchantmentPool([
  { Stat: 'Strength', Min: 10, Max: 20, Probability: 0.5 },
  { Stat: 'CriticalHitDamage', Min: 0.1, Max: 0.5, Probability: 0.5 }
]);

export const HEAD_ENCHANTMENT_POOL = new EnchantmentPool([
  { Stat: 'Intelligence', Min: 1, Max: 15, Probability: 0.8 },
  { Stat: 'Strength', Min: 1, Max: 5, Probability: 0.1 },
  { Stat: 'Dexterity', Min: 1, Max: 5, Probability: 0.1 }
]);

export const CHEST_ENCHANTMENT_POOL = new EnchantmentPool([
  { Stat: 'Strength', Min: 1, Max: 10, Probability: 0.5 },
  { Stat: 'Dexterity', Min: 1, Max: 10, Probability: 0.5 }
]);

export const LEGS_ENCHANTMENT_POOL = new EnchantmentPool([
  { Stat: 'Strength', Min: 1, Max: 6, Probability: 0.35 },
  { Stat: 'Dexterity', Min: 1, Max: 6, Probability: 0.65 }
]);

export const BOOTS_ENCHANTMENT_POOL = new EnchantmentPool([
  { Stat: 'AttackSpeed', Min: 0.02, Max: 0.1, Probability: 0.9 },
  { Stat: 'CriticalHitChance', Min: 0.01, Max: 0.07, Probability: 0.1 }
]);
