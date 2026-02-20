import { RuneQuality } from './rune-quality.enum';

export interface RuneInfo {
  Quality: RuneQuality;
  Label: string;
  Value: number;
  MinRoll: string;
  MaxRoll: string;
}
