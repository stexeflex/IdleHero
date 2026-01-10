import { Component, Input } from '@angular/core';

import { Gear } from '../../../shared/models';

@Component({
  selector: 'app-enchanting',
  imports: [],
  templateUrl: './enchanting.html',
  styleUrl: './enchanting.scss'
})
export class Enchanting {
  @Input({ required: true }) item: Gear | null = null;
}
