import { RUNE_QUALITY_ORDER } from '../../constants';
import { RuneQuality } from '../../models';

export function QualityIndex(quality: RuneQuality): number {
  const idx = RUNE_QUALITY_ORDER.indexOf(quality);
  return idx >= 0 ? idx : 0;
}
