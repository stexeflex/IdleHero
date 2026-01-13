import { Enchantment } from './enchantment';
import { EnchantmentSlot } from './enchantment-slot';
import { GEAR_CONFIG } from '../../constants';
import { GearType } from './gear-type';
import { StatType } from '../stats/stat-type';

export abstract class Gear {
  public readonly Enchantments: EnchantmentSlot[] = [];
  public SellValue: number;

  constructor(
    public Type: GearType,
    public SlotAmount: number,
    public Innate: Enchantment,
    public BuyPrice: number
  ) {
    for (let i = 0; i < SlotAmount; i++) {
      this.Enchantments.push(new EnchantmentSlot(i + 1));
    }

    this.SellValue = Gear.CalculateSellValue(BuyPrice);
  }

  public get Level(): number {
    let highestLevel = 0;

    this.Enchantments.forEach((slot) => {
      if (slot.Level > highestLevel) {
        highestLevel = slot.Level;
      }
    });

    return highestLevel;
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

    this.Enchantments.forEach((slot) => {
      if (slot.IsEnchanted && slot.Enchantment!.Stat === stat) {
        totalBonus += slot.Enchantment!.Value;
      }
    });

    return totalBonus;
  }
}

export class Weapon extends Gear {
  public static readonly Slots: number = GEAR_CONFIG.SLOTS.WEAPON;
  public static readonly Innate: Enchantment = new Enchantment('AttackSpeed', 0.1);
  public static readonly BuyPrice: number = 250;

  constructor() {
    super(GearType.Weapon, Weapon.Slots, Weapon.Innate, Weapon.BuyPrice);
  }
}

export class Shield extends Gear {
  public static readonly Slots: number = GEAR_CONFIG.SLOTS.SHIELD;
  public static readonly Innate: Enchantment = new Enchantment('CriticalHitDamage', 0.5);
  public static readonly BuyPrice: number = 150;

  constructor() {
    super(GearType.Shield, Shield.Slots, Shield.Innate, Shield.BuyPrice);
  }
}

export class Head extends Gear {
  public static readonly Slots: number = GEAR_CONFIG.SLOTS.HEAD;
  public static readonly Innate: Enchantment = new Enchantment('CriticalHitChance', 0.05);
  public static readonly BuyPrice: number = 80;

  constructor() {
    super(GearType.Head, Head.Slots, Head.Innate, Head.BuyPrice);
  }
}

export class Chest extends Gear {
  public static readonly Slots: number = GEAR_CONFIG.SLOTS.CHEST;
  public static readonly Innate: Enchantment = new Enchantment('Strength', 5);
  public static readonly BuyPrice: number = 100;

  constructor() {
    super(GearType.Chest, Chest.Slots, Chest.Innate, Chest.BuyPrice);
  }
}

export class Legs extends Gear {
  public static readonly Slots: number = GEAR_CONFIG.SLOTS.LEGS;
  public static readonly Innate: Enchantment = new Enchantment('Dexterity', 5);
  public static readonly BuyPrice: number = 90;

  constructor() {
    super(GearType.Legs, Legs.Slots, Legs.Innate, Legs.BuyPrice);
  }
}

export class Boots extends Gear {
  public static readonly Slots: number = GEAR_CONFIG.SLOTS.BOOTS;
  public static readonly Innate: Enchantment = new Enchantment('MultiHitChance', 0.01);
  public static readonly BuyPrice: number = 70;

  constructor() {
    super(GearType.Boots, Boots.Slots, Boots.Innate, Boots.BuyPrice);
  }
}
