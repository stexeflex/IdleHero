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

  displayAmount(): string[] {
    const formatted = this.FormatAmount(this.amount());

    // Split the formatted string into each letter
    return formatted.split('');
  }

  private FormatAmount(amount: number): string {
    if (!Number.isFinite(amount)) return '0';

    const normalizedAmount = Math.max(0, Math.floor(amount));

    if (normalizedAmount >= 100_000_000) {
      return `${(normalizedAmount / 1_000_000).toFixed(0)} M`;
    }

    if (normalizedAmount >= 10_000_000) {
      return `${(normalizedAmount / 1_000_000).toFixed(1)} M`;
    }

    if (normalizedAmount >= 1_000_000) {
      return `${(normalizedAmount / 1_000_000).toFixed(2)} M`;
    }

    return this.DecimalPipe.transform(normalizedAmount, '1.0-0') ?? '0';
  }
}
