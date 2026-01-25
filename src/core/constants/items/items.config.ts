import { EmptyStatSource, ItemLevel, ItemVariantDefinition, StatSource } from '../../models';

export const ITEM_CONFIG = {
  LEVEL: {
    MIN: 1 as ItemLevel,
    MAX: 5 as ItemLevel
  }
};

export const ITEM_VARIANTS: ItemVariantDefinition[] = [
  {
    Id: 'weapon_sword',
    Name: 'Sword',
    Slot: 'Weapon',
    Innate: {
      Label: 'Base Damage',
      ValuesByLevel: {
        1: 10,
        2: 12,
        3: 14,
        4: 17,
        5: 20
      },
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_sword_innate');
        s.Damage.Flat = value;
        return s;
      }
    }
  },
  {
    Id: 'weapon_wand',
    Name: 'Wand',
    Slot: 'Weapon',
    Innate: {
      Label: 'Arcane Damage',
      ValuesByLevel: {
        1: 8,
        2: 10,
        3: 12,
        4: 15,
        5: 18
      },
      MapToStatSource: (value: number): StatSource => {
        const s = EmptyStatSource('weapon_wand_innate');
        s.Damage.Flat = value;
        s.CriticalHit.FlatChance = 0.02; // wands slightly favor crit chance
        return s;
      }
    }
  }
];
