import { Component, signal } from '@angular/core';

import { CharacterArea } from './character-area/character-area';
import { GameArea } from './game-area/game-area';
import { InventoryArea } from './inventory-area/inventory-area';

@Component({
  selector: 'app-root',
  imports: [GameArea, CharacterArea, InventoryArea],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Idle Hero');
}
