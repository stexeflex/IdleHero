import { AmuletQuality } from '../../models';

export interface AmuletSlotRule {
  /** Number of available slots for the given amulet quality */
  SlotAmount: number;
}

export type AmuletSlotRulesMap = Record<AmuletQuality, AmuletSlotRule>;

export const AMULET_SLOT_RULES: AmuletSlotRulesMap = {
  Common: { SlotAmount: 1 },
  Magic: { SlotAmount: 2 },
  Rare: { SlotAmount: 3 },
  Epic: { SlotAmount: 4 },
  Legendary: { SlotAmount: 5 }
};

export const AMULET_QUALITY_ORDER: AmuletQuality[] = [
  'Common',
  'Magic',
  'Rare',
  'Epic',
  'Legendary'
];

export const AMULET_UNLOCK_RULES = {
  Common: { RequiredPlayerLevel: 1 },
  Magic: { RequiredPlayerLevel: 5 },
  Rare: { RequiredPlayerLevel: 10 },
  Epic: { RequiredPlayerLevel: 15 },
  Legendary: { RequiredPlayerLevel: 20 }
};
