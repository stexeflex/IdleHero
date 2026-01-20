import { Component, input } from '@angular/core';

import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-health-bar',
  imports: [DecimalPipe],
  templateUrl: './health-bar.html',
  styleUrl: './health-bar.scss'
})
export class HealthBar {
  readonly currentHealth = input<number>(0);
  readonly maxHealth = input<number>(0);
  readonly showHealthValues = input<boolean>(false);

  get progress(): number {
    return Math.min(100, (this.currentHealth() / this.maxHealth()) * 100);
  }
}
