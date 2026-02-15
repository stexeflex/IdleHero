import { Component, input } from '@angular/core';

import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-charge-bar',
  imports: [DecimalPipe],
  templateUrl: './charge-bar.html',
  styleUrl: './charge-bar.scss'
})
export class ChargeBar {
  readonly current = input<number>(0);
  readonly max = input<number>(0);
  readonly showValues = input<boolean>(false);
  readonly charged = input<boolean>(false);

  get progress(): number {
    return Math.min(100, (this.current() / this.max()) * 100);
  }
}
