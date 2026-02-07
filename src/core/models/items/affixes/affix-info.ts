import { AffixTier } from './affix-tier.enum';

export interface AffixInfo {
  Tier: AffixTier;
  Label: string;
  Value: number;
  MinRoll: number;
  MaxRoll: number;
  Improved: boolean;
}
