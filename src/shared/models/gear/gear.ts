import { Enchantment } from './enchantment';
import { EnchantmentSlot } from './enchantment-slot';
import { GEAR_CONFIG } from '../../constants';
import { GearType } from './gear-type';
import { StatType } from '../stats/stat-type';

export abstract class Gear {
  public Level: number = GEAR_CONFIG.LEVEL.BASE;
  public readonly Slots: EnchantmentSlot[] = [];
  public SellValue: number;

  constructor(
    public Type: GearType,
    public SlotAmount: number,
    public Innate: Enchantment,
    public BuyPrice: number
  ) {
    for (let i = 0; i < SlotAmount; i++) {
      this.Slots.push(new EnchantmentSlot(i + 1));
    }

    this.SellValue = Gear.CalculateSellValue(BuyPrice);
  }

  public Upgrade() {
    if (this.Level >= GEAR_CONFIG.LEVEL.MAX) {
      return;
    }

    this.Level++;

    for (const slot of this.Slots) {
      if (slot.IsEnchanted) {
        slot.GearUpgrade(GEAR_CONFIG.UPGRADE.STAT_MODIFIER);
      }
    }
  }

  private static CalculateSellValue(price: number): number {
    return Math.floor(price * GEAR_CONFIG.PRICES.SELLVALUE_MULTIPLIER);
  }

  public static Create(slot: GearType): Gear {
    switch (slot) {
      case GearType.Weapon:
        return new Weapon();
      case GearType.Shield:
        return new Shield();
      case GearType.Head:
        return new Head();
      case GearType.Chest:
        return new Chest();
      case GearType.Legs:
        return new Legs();
      case GearType.Boots:
        return new Boots();
    }
  }

  public GetStatBonus(stat: StatType): number {
    let totalBonus = 0;

    if (this.Innate.Stat === stat) {
      totalBonus += this.Innate.Value;
    }

    this.Slots.forEach((slot) => {
      if (slot.IsEnchanted && slot.Enchantment!.Stat === stat) {
        totalBonus += slot.Enchantment!.Value;
      }
    });

    return totalBonus;
  }
}

export class Weapon extends Gear {
  public static readonly Slots: number = GEAR_CONFIG.SLOTS.WEAPON;
  public static readonly Innate: Enchantment = GEAR_CONFIG.INNATES.WEAPON;
  public static readonly BuyPrice: number = GEAR_CONFIG.PRICES.WEAPON;

  constructor() {
    super(GearType.Weapon, Weapon.Slots, Weapon.Innate, Weapon.BuyPrice);
  }
}

export class Shield extends Gear {
  public static readonly Slots: number = GEAR_CONFIG.SLOTS.SHIELD;
  public static readonly Innate: Enchantment = GEAR_CONFIG.INNATES.SHIELD;
  public static readonly BuyPrice: number = GEAR_CONFIG.PRICES.SHIELD;

  constructor() {
    super(GearType.Shield, Shield.Slots, Shield.Innate, Shield.BuyPrice);
  }
}

export class Head extends Gear {
  public static readonly Slots: number = GEAR_CONFIG.SLOTS.HEAD;
  public static readonly Innate: Enchantment = GEAR_CONFIG.INNATES.HEAD;
  public static readonly BuyPrice: number = GEAR_CONFIG.PRICES.HEAD;

  constructor() {
    super(GearType.Head, Head.Slots, Head.Innate, Head.BuyPrice);
  }
}

export class Chest extends Gear {
  public static readonly Slots: number = GEAR_CONFIG.SLOTS.CHEST;
  public static readonly Innate: Enchantment = GEAR_CONFIG.INNATES.CHEST;
  public static readonly BuyPrice: number = GEAR_CONFIG.PRICES.CHEST;

  constructor() {
    super(GearType.Chest, Chest.Slots, Chest.Innate, Chest.BuyPrice);
  }
}

export class Legs extends Gear {
  public static readonly Slots: number = GEAR_CONFIG.SLOTS.LEGS;
  public static readonly Innate: Enchantment = GEAR_CONFIG.INNATES.LEGS;
  public static readonly BuyPrice: number = GEAR_CONFIG.PRICES.LEGS;

  constructor() {
    super(GearType.Legs, Legs.Slots, Legs.Innate, Legs.BuyPrice);
  }
}

export class Boots extends Gear {
  public static readonly Slots: number = GEAR_CONFIG.SLOTS.BOOTS;
  public static readonly Innate: Enchantment = GEAR_CONFIG.INNATES.BOOTS;
  public static readonly BuyPrice: number = GEAR_CONFIG.PRICES.BOOTS;

  constructor() {
    super(GearType.Boots, Boots.Slots, Boots.Innate, Boots.BuyPrice);
  }
}
