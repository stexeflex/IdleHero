import { Component, input } from '@angular/core';

import { IconComponent } from '../icon/icon.component';
import { IconSize } from '../icon/icon-size.type';

@Component({
  selector: 'app-level',
  imports: [IconComponent],
  templateUrl: './level.html',
  styleUrl: './level.scss'
})
export class Level {
  readonly level = input<number>(0);
  readonly size = input<IconSize>('md');
  readonly fontSize = input<string>('1.5rem');
}
