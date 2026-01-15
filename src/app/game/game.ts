import { Component, signal } from '@angular/core';

import { CharacterArea } from './character-area/character-area';
import { GameArea } from './game-area/game-area';
import { InventoryArea } from './inventory-area/inventory-area';
import { Menu } from './menu/menu';
import { MenuService } from '../../shared/services';

@Component({
  selector: 'app-game',
  imports: [GameArea, CharacterArea, InventoryArea, Menu],
  templateUrl: './game.html',
  styleUrl: './game.scss'
})
export class Game {
  protected readonly title = signal('Idle Hero');

  protected get IsMenuOpen(): boolean {
    return this.menuService.IsMenuOpen();
  }

  constructor(private menuService: MenuService) {}
}
