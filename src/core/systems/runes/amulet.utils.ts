import { AMULET_COST_CONFIG, AMULET_QUALITY_ORDER, AMULET_SLOT_RULES } from '../../constants';

import { AmuletQuality } from '../../models';

export function AmuletQualityIndex(quality: AmuletQuality): number {
  const idx = AMULET_QUALITY_ORDER.indexOf(quality);
  return idx >= 0 ? idx : 0;
}

export function GetNextAmuletQuality(quality: AmuletQuality): AmuletQuality | null {
  const currentIndex = AMULET_QUALITY_ORDER.indexOf(quality);
  if (currentIndex < 0) return null;

  const nextIndex = currentIndex + 1;
  if (nextIndex >= AMULET_QUALITY_ORDER.length) return null;

  return AMULET_QUALITY_ORDER[nextIndex];
}

export function GetSlotAmountForQuality(quality: AmuletQuality): number {
  return AMULET_SLOT_RULES[quality].SlotAmount;
}

export function GetAmuletUnlockCost(): number {
  return AMULET_COST_CONFIG.AMULET_COST;
}

export function GetAmuletUpgradeCost(currentQuality: AmuletQuality): number {
  const nextQuality = GetNextAmuletQuality(currentQuality);
  if (!nextQuality) return Infinity; // Max Quality reached
  return AMULET_COST_CONFIG.AMULET_COST_PER_UPGRADE * AmuletQualityIndex(nextQuality);
}

export function GetAmuletSocketCost(currentQuality: AmuletQuality): number {
  const baseCost = AMULET_COST_CONFIG.SOCKET_COST_BASE;
  const multiplier = AMULET_COST_CONFIG.SOCKET_COST_MULTIPLIER;
  const qualityIndex = AmuletQualityIndex(currentQuality);
  return baseCost * Math.pow(multiplier, qualityIndex);
}

export function GetAmuletUnsocketCost(currentQuality: AmuletQuality): number {
  const baseCost = AMULET_COST_CONFIG.SOCKET_COST_BASE;
  const multiplier = AMULET_COST_CONFIG.SOCKET_COST_MULTIPLIER;
  const qualityIndex = AmuletQualityIndex(currentQuality);
  const socketCost = baseCost * Math.pow(multiplier, qualityIndex);
  return socketCost * AMULET_COST_CONFIG.UNSOCKET_COST_MULTIPLIER;
}
