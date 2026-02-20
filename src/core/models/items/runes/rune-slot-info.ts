import { RuneQuality } from './rune-quality.enum';

export interface RuneSlotInfo {
  DefinitionId: string;
  DefinitionName: string;

  IsEmpty: boolean;

  Quality: RuneQuality | null;
  Label: string | null;
  Value: number | null;
  MinRoll: string | null;
  MaxRoll: string | null;
}
