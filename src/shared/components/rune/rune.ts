import { Component, input } from '@angular/core';

import { IconComponent } from '../icon/icon.component';
import { IconSize } from '../icon/icon-size.type';
import { PercentPipe } from '@angular/common';
import { Rune } from '../../../core/models';

@Component({
  selector: 'app-rune',
  imports: [PercentPipe, IconComponent],
  templateUrl: './rune.html',
  styleUrl: './rune.scss'
})
export class RuneIcon {
  readonly rune = input.required<Rune>();
  readonly size = input<IconSize>('md');
  readonly fontSize = input<string>('1.2rem');
}
