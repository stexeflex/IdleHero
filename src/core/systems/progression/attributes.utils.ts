import { ATTRIBUTES_CONFIG } from '../../constants';

export function AttributePointsForGainedLevels(gainedLevels: number): number {
  return gainedLevels * ATTRIBUTES_CONFIG.ATTR_POINTS_PER_LEVEL;
}

export function RespecCost(spentPoints: number): number {
  return spentPoints * ATTRIBUTES_CONFIG.RESPEC_COST_PER_POINT_SPENT;
}
