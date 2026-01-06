import { Component, signal } from '@angular/core';

import { AttributesArea } from './attributes-area/attributes-area';
import { GameArea } from './game-area/game-area';
import { InventoryArea } from './inventory-area/inventory-area';

@Component({
  selector: 'app-root',
  imports: [GameArea, AttributesArea, InventoryArea],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Idle Hero');
}
