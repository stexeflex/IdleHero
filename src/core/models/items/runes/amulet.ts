import { AmuletQuality } from './amulet-quality.enum';
import { Rune } from './rune';

export interface AmuletState {
  IsUnlocked: boolean;
  Quality: AmuletQuality;
  Slots: Array<Rune | null>;
}

export function CreateAmuletSlots(
  slotAmount: number,
  existingSlots: Array<Rune | null> = []
): Array<Rune | null> {
  const normalizedSlotAmount = Math.max(0, Math.floor(slotAmount));
  return Array.from({ length: normalizedSlotAmount }, (_, index) => existingSlots[index] ?? null);
}

export function CreateLockedAmuletState(): AmuletState {
  return {
    IsUnlocked: false,
    Quality: 'Common',
    Slots: [null]
  };
}

export function CreateUnlockedAmuletState(
  quality: AmuletQuality,
  slotAmount: number,
  existingSlots: Array<Rune | null> = []
): AmuletState {
  return {
    IsUnlocked: true,
    Quality: quality,
    Slots: CreateAmuletSlots(slotAmount, existingSlots)
  };
}
