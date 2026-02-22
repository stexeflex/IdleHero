import { Component, input } from '@angular/core';

import { DecimalPipe } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { IconSize } from '../icon/icon-size.type';

@Component({
  selector: 'app-exp',
  imports: [DecimalPipe, IconComponent],
  templateUrl: './exp.html',
  styleUrl: './exp.scss'
})
export class Exp {
  readonly exp = input<number>(0);
  readonly size = input<IconSize>('md');
  readonly fontSize = input<string>('1.2rem');
}
