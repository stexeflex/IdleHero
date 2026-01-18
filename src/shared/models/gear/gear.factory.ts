import { Enchantment } from './enchantment';
import { EnchantmentSlot } from './enchantment-slot';
import { Gear } from './gear';
import { GearType } from './gear-type';
import { ObjectUtils } from '../../utils';

/**
 * Reconstructs a Gear object from a plain object.
 */
export function ReconstructGear(plain: unknown): Gear | null {
  if (!plain || !ObjectUtils.isPlainObject(plain)) return null;

  const type = (plain as any).Type as GearType | undefined;
  if (!isValidGearType(type)) return null;

  // GEAR CREATION
  const gear = Gear.Create(type);

  // LEVEL
  const level = (plain as any).Level;
  if (typeof level === 'number' && Number.isFinite(level)) {
    gear.Level = level;
  }

  // ENCHANTMENT SLOTS
  const slots = (plain as any).Slots as Array<unknown> | undefined;

  if (Array.isArray(slots)) {
    for (let i = 0; i < gear.Slots.length; i++) {
      const saved = slots[i] as any;
      const slot: EnchantmentSlot = gear.Slots[i];

      if (saved && ObjectUtils.isPlainObject(saved)) {
        const savedLevel = (saved as any)['Level'];
        const savedEnchant = (saved as any)['Enchantment'];

        if (typeof savedLevel === 'number' && Number.isFinite(savedLevel)) {
          slot.Level = savedLevel;
        }

        if (savedEnchant && ObjectUtils.isPlainObject(savedEnchant)) {
          const stat = (savedEnchant as any).Stat;
          const value = (savedEnchant as any).Value;

          if (
            (typeof stat === 'string' || typeof stat === 'number') &&
            typeof value === 'number' &&
            Number.isFinite(value)
          ) {
            slot.Enchantment = new Enchantment(stat as any, value);
          }
        } else {
          slot.Enchantment = undefined;
        }
      }
    }
  }

  // SELL VALUE
  const sellValue = (plain as any).SellValue;
  if (typeof sellValue === 'number' && Number.isFinite(sellValue)) {
    gear.SellValue = sellValue;
  }

  return gear;
}

function isValidGearType(type: unknown): type is GearType {
  return (
    type === GearType.Weapon ||
    type === GearType.Shield ||
    type === GearType.Head ||
    type === GearType.Chest ||
    type === GearType.Legs ||
    type === GearType.Boots
  );
}
