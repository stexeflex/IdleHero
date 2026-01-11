import { Component, Input } from '@angular/core';

import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-number-value',
  imports: [DecimalPipe],
  templateUrl: './number-value.html',
  styleUrl: './number-value.scss'
})
export class NumberValue {
  @Input() label: string | undefined = undefined;
  @Input({ required: true }) value!: number;
}
