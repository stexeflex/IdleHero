import { AMULET_QUALITY_ORDER, AMULET_SLOT_RULES } from '../../constants';

import { AmuletQuality } from '../../models';

export function GetNextQuality(quality: AmuletQuality): AmuletQuality | null {
  const currentIndex = AMULET_QUALITY_ORDER.indexOf(quality);
  if (currentIndex < 0) return null;

  const nextIndex = currentIndex + 1;
  if (nextIndex >= AMULET_QUALITY_ORDER.length) return null;

  return AMULET_QUALITY_ORDER[nextIndex];
}

export function GetSlotAmountForQuality(quality: AmuletQuality): number {
  return AMULET_SLOT_RULES[quality].SlotAmount;
}
