import { ChanceUtils, TimestampUtils } from '../../../shared/utils';
import { ComputeRolledValue, RandomInRange } from '../stats/stat-value.utils';
import { DecimalPipe, PercentPipe } from '@angular/common';
import { GetDungeonById, RUNE_DEFINITIONS, RUNE_QUALITY_ORDER } from '../../constants';
import {
  LabelToString,
  Rune,
  RuneDefinition,
  RuneInfo,
  RuneQuality,
  RuneQualitySpec,
  RuneSlotInfo
} from '../../models';

export function QualityIndex(quality: RuneQuality): number {
  const idx = RUNE_QUALITY_ORDER.indexOf(quality);
  return idx >= 0 ? idx : 0;
}

export function GetRuneInfo(rune: Rune, locale: string): RuneInfo {
  const decimalPipe = new DecimalPipe(locale);
  const percentPipe = new PercentPipe(locale);

  const definition: RuneDefinition = GetRuneDefinition(rune.DefinitionId);
  const qualitySpec: RuneQualitySpec = GetRuneQualitySpec(definition, rune.Quality);
  const minMax: { min: number; max: number } = GetRuneMinMaxRoll(qualitySpec);
  const rolledValue = ComputeRolledValue(
    minMax.min,
    minMax.max,
    rune.ValueRangePercentage,
    qualitySpec.Value.Type
  );
  const label: string = LabelToString(definition.Effect.ToLabel(rolledValue), decimalPipe);

  let minRollLabel: string = minMax.min.toString();
  let maxRollLabel: string = minMax.max.toString();

  switch (qualitySpec.Value.Type) {
    case 'Flat':
      minRollLabel = decimalPipe.transform(minMax.min, '1.0-0')!;
      maxRollLabel = decimalPipe.transform(minMax.max, '1.0-0')!;
      break;

    case 'Percent':
      minRollLabel = percentPipe.transform(minMax.min, '1.0-0')!;
      maxRollLabel = percentPipe.transform(minMax.max, '1.0-0')!;
      break;
  }

  return {
    Quality: rune.Quality,
    Label: label,
    Value: rolledValue,
    MinRoll: minRollLabel,
    MaxRoll: maxRollLabel
  };
}

export function GetRuneSlotInfo(
  definitionId: string,
  rune: Rune | null,
  locale: string
): RuneSlotInfo {
  const definition: RuneDefinition = GetRuneDefinition(definitionId);

  if (rune === null) {
    return {
      DefinitionId: definitionId,
      DefinitionName: definition.Name,
      IsEmpty: true,
      Quality: null,
      Label: null,
      Value: null,
      MinRoll: null,
      MaxRoll: null
    };
  } else {
    const decimalPipe = new DecimalPipe(locale);
    const percentPipe = new PercentPipe(locale);

    const qualitySpec: RuneQualitySpec = GetRuneQualitySpec(definition, rune.Quality);
    const minMax: { min: number; max: number } = GetRuneMinMaxRoll(qualitySpec);
    const rolledValue = ComputeRolledValue(
      minMax.min,
      minMax.max,
      rune.ValueRangePercentage,
      qualitySpec.Value.Type
    );
    const label: string = LabelToString(definition.Effect.ToLabel(rolledValue), decimalPipe);

    let minRollLabel: string = minMax.min.toString();
    let maxRollLabel: string = minMax.max.toString();

    switch (qualitySpec.Value.Type) {
      case 'Flat':
        minRollLabel = decimalPipe.transform(minMax.min, '1.0-0')!;
        maxRollLabel = decimalPipe.transform(minMax.max, '1.0-0')!;
        break;

      case 'Percent':
        minRollLabel = percentPipe.transform(minMax.min, '1.0-0')!;
        maxRollLabel = percentPipe.transform(minMax.max, '1.0-0')!;
        break;
    }

    return {
      DefinitionId: definitionId,
      DefinitionName: definition.Name,
      IsEmpty: false,
      Quality: rune.Quality,
      Label: label,
      Value: rolledValue,
      MinRoll: minRollLabel,
      MaxRoll: maxRollLabel
    };
  }
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

export function GetRuneDefinitions(): RuneDefinition[] {
  return RUNE_DEFINITIONS;
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

export function CreateRandomRuneForQuality(quality: RuneQuality): Rune {
  const definitions = RUNE_DEFINITIONS.filter((def) =>
    def.Qualities.some((q) => q.Quality === quality)
  );
  const definition = definitions[Math.floor(Math.random() * definitions.length)];
  const qualitySpec = GetRuneQualitySpec(definition, quality);
  const rune: Rune = {
    Id: `rune_${definition.Id}_${TimestampUtils.GetTimestampNow()}`,
    DefinitionId: definition.Id,
    Quality: quality,
    ValueRangePercentage: RandomInRange(
      qualitySpec.Value.Min,
      qualitySpec.Value.Max,
      qualitySpec.Value.Type
    )
  };
  return rune;
}

export function DropRandomRuneForDungeon(dungeonId: string): Rune | null {
  const dungeonConfig = GetDungeonById(dungeonId);
  if (!dungeonConfig) return null;

  const reversedQualityOrder = RUNE_QUALITY_ORDER.slice().reverse();
  const chances = dungeonConfig.Rewards.RuneDropChances;
  const rolled = ChanceUtils.Roll();
  let cumulative = 0.0;

  for (const quality of reversedQualityOrder) {
    const chance = chances[quality] ?? 0.0;
    cumulative += chance;

    if (ChanceUtils.isSuccess(cumulative, rolled)) {
      return CreateRandomRuneForQuality(quality);
    }
  }

  return null;
}
