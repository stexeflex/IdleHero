import { Component, input } from '@angular/core';

import { DecimalPipe } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { IconSize } from '../icon/icon-size.type';

@Component({
  selector: 'app-gold',
  imports: [DecimalPipe, IconComponent],
  templateUrl: './gold.html',
  styleUrl: './gold.scss'
})
export class Gold {
  readonly amount = input<number>(0);
  readonly size = input<IconSize>('md');
  readonly fontSize = input<string>('1.5rem');
}
