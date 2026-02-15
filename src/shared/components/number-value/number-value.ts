import { Component, input } from '@angular/core';

import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-number-value',
  imports: [DecimalPipe],
  templateUrl: './number-value.html',
  styleUrl: './number-value.scss'
})
export class NumberValue {
  readonly label = input<string>();
  readonly value = input.required<number>();
}
