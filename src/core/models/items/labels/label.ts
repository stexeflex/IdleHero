import { DecimalPipe } from '@angular/common';

export type ValueType = 'Flat' | 'Percentage';

export interface Label {
  Value: number;
  ValueType: ValueType;
  Stat: string;
}

export function FlatAdditiveLabel(stat: string, value: number): Label {
  return {
    Value: value,
    ValueType: 'Flat',
    Stat: stat
  };
}

export function PercentageAdditiveLabel(stat: string, value: number): Label {
  return {
    Value: value,
    ValueType: 'Percentage',
    Stat: stat
  };
}

export function LabelToString(label: Label, decimalPipe: DecimalPipe): string {
  // const typeStr = label.Type === 'Additive' ? '+' : '\u00D7'; // Multiplication sign

  // Show '+' for positive values, '-' is included in the value for negative numbers
  const typeStr = label.Value >= 0 ? '+' : '';
  const valueStr =
    label.ValueType === 'Flat'
      ? `${decimalPipe.transform(label.Value, '1.0-0')}`
      : `${decimalPipe.transform(label.Value * 100, '1.0-0')}%`;

  // Example output: "+5 Strength" or "×20% Critical Strike Chance"
  return `${typeStr}${valueStr} ${label.Stat}`;
}
