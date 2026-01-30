import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { CharacterArea } from './character-area/character-area';
import { CombatState } from '../../core/systems/combat';
import { IconComponent } from '../../shared/components';
import { InfoArea } from './info-area/info-area';
import { Menu } from './menu/menu';
import { MenuService } from '../../shared/services';

@Component({
  selector: 'app-game',
  imports: [CharacterArea, Menu, InfoArea, RouterOutlet, IconComponent],
  templateUrl: './game.html',
  styleUrl: './game.scss'
})
export class Game {
  private router = inject(Router);
  private menuService = inject(MenuService);
  private combatState = inject(CombatState);

  protected readonly title = signal('NOT SO IDLE HERO');
  protected readonly currentArea = signal<'Town' | 'Dungeon'>('Town');

  // UI State
  protected get IsMenuOpen(): boolean {
    return this.menuService.IsMenuOpen();
  }

  protected get CanSwitchArea(): boolean {
    return !this.combatState.InProgress();
  }

  SwitchArea() {
    this.currentArea.set(this.currentArea() === 'Town' ? 'Dungeon' : 'Town');
    this.router.navigate([`/game/${this.currentArea().toLowerCase()}`]);
  }
}
