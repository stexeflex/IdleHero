import { AffixTier } from './affix-tier.enum';

export interface AffixInfo {
  Tier: AffixTier;
  Label: string;
  Value: number;
  MinRoll: string;
  MaxRoll: string;
  Improved: boolean;
}
