import { Component, Input } from '@angular/core';

import { DecimalPipe } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { IconSize } from '../icon/icon-size';

@Component({
  selector: 'app-gold',
  imports: [DecimalPipe, IconComponent],
  templateUrl: './gold.html',
  styleUrl: './gold.scss'
})
export class Gold {
  @Input() amount: number = 0;
  @Input() size: IconSize = 'md';
  @Input() fontSize: string = '1.5rem';
}
