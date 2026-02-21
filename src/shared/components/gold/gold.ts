import { Component, LOCALE_ID, inject, input } from '@angular/core';

import { DecimalPipe } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { IconSize } from '../icon/icon-size.type';

@Component({
  selector: 'app-gold',
  imports: [IconComponent],
  templateUrl: './gold.html',
  styleUrl: './gold.scss'
})
export class Gold {
  readonly locale = inject(LOCALE_ID);
  readonly amount = input<number>(0);
  readonly size = input<IconSize>('md');
  readonly fontSize = input<string>('1.5rem');

  private readonly DecimalPipe = new DecimalPipe(this.locale);

  splittedAmount(): string[] {
    const formatted = this.DecimalPipe.transform(this.amount(), '1.0-0') ?? '0';

    // Split the formatted string into each letter
    return formatted.split('');
  }
}
