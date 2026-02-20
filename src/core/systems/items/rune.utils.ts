import { RUNE_DEFINITIONS, RUNE_QUALITY_ORDER } from '../../constants';
import { Rune, RuneDefinition, RuneQuality, RuneQualitySpec } from '../../models';

import { ComputeRolledValue } from './stat-value.utils';

export function QualityIndex(quality: RuneQuality): number {
  const idx = RUNE_QUALITY_ORDER.indexOf(quality);
  return idx >= 0 ? idx : 0;
}

export function GetRuneValue(rune: Rune): number {
  const definition: RuneDefinition = GetRuneDefinition(rune.DefinitionId);
  const qualitySpec: RuneQualitySpec = GetRuneQualitySpec(definition, rune.Quality);
  const minMax: { min: number; max: number } = GetRuneMinMaxRoll(qualitySpec);
  const rolledValue = ComputeRolledValue(
    minMax.min,
    minMax.max,
    rune.ValueRangePercentage,
    qualitySpec.Value.Type
  );
  return rolledValue;
}

export function GetRuneDefinition(definitionId: string): RuneDefinition {
  return RUNE_DEFINITIONS.find((r) => r.Id === definitionId)!;
}

export function GetRuneQualitySpec(
  definition: RuneDefinition,
  quality: RuneQuality
): RuneQualitySpec {
  return definition.Qualities.find((t) => t.Quality === quality)!;
}

export function GetRuneMinMaxRoll(qualitySpec: RuneQualitySpec): { min: number; max: number } {
  return { min: qualitySpec.Value.Min, max: qualitySpec.Value.Max };
}
