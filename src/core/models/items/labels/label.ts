import { DecimalPipe } from '@angular/common';

export type ComputeType = 'Additive' | 'Multiplicative';

export type ValueType = 'Flat' | 'Percentage';

export interface Label {
  Type: ComputeType;
  Value: number;
  ValueType: ValueType;
  Stat: string;
}

export function FlatAdditiveLabel(stat: string, value: number): Label {
  return {
    Type: 'Additive',
    Value: value,
    ValueType: 'Flat',
    Stat: stat
  };
}

export function PercentageAdditiveLabel(stat: string, value: number): Label {
  return {
    Type: 'Additive',
    Value: value,
    ValueType: 'Percentage',
    Stat: stat
  };
}

export function FlatMultiplicativeLabel(stat: string, value: number): Label {
  return {
    Type: 'Multiplicative',
    Value: value,
    ValueType: 'Flat',
    Stat: stat
  };
}

export function PercentageMultiplicativeLabel(stat: string, value: number): Label {
  return {
    Type: 'Multiplicative',
    Value: value,
    ValueType: 'Percentage',
    Stat: stat
  };
}

export function LabelToString(label: Label, decimalPipe: DecimalPipe): string {
  const typeStr = label.Type === 'Additive' ? '+' : '\u00D7'; // Multiplication sign
  const valueStr =
    label.ValueType === 'Flat'
      ? `${label.Value}`
      : `${decimalPipe.transform(label.Value * 100, '1.0-0')}%`;

  // Example output: "+5 Strength" or "×20% Critical Strike Chance"
  return `${typeStr}${valueStr} ${label.Stat}`;
}
