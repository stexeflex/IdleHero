import { Component, inject, signal } from '@angular/core';
import { IconComponent, TabDefinition, TabStrip } from '../../shared/components';
import { Router, RouterOutlet } from '@angular/router';

import { CharacterArea } from './character-area/character-area';
import { CharacterLoadout } from './character-loadout/character-loadout';
import { CombatState } from '../../core/systems/combat';
import { GameService } from '../../core/services';
import { InfoArea } from './info-area/info-area';
import { Menu } from './menu/menu';
import { MenuService } from '../../shared/services';
import { StatisticsFlyout } from './statistics-flyout/statistics-flyout';

@Component({
  selector: 'app-game',
  imports: [
    CharacterArea,
    Menu,
    InfoArea,
    RouterOutlet,
    IconComponent,
    TabStrip,
    CharacterLoadout,
    StatisticsFlyout
  ],
  templateUrl: './game.html',
  styleUrl: './game.scss'
})
export class Game {
  private router = inject(Router);
  private gameService = inject(GameService);
  private menuService = inject(MenuService);
  private combatState = inject(CombatState);

  protected readonly title = this.gameService.Title;
  protected readonly currentArea = signal<'Town' | 'Dungeon'>('Town');

  // Tabs
  protected get Tabs(): TabDefinition[] {
    return [
      { id: 'character', label: 'CHARACTER', disabled: false },
      { id: 'loadout', label: 'LOADOUT', disabled: false }
    ];
  }

  protected SelectedTab = signal<TabDefinition['id']>('character');

  protected onTabSelected(tabId: TabDefinition['id']): void {
    this.SelectedTab.set(tabId);
  }

  // UI State
  protected get IsMenuOpen(): boolean {
    return this.menuService.IsMenuOpen();
  }

  protected get CanSwitchArea(): boolean {
    return !this.combatState.InProgress();
  }

  SwitchArea() {
    this.currentArea.set(this.currentArea() === 'Town' ? 'Dungeon' : 'Town');

    if (this.currentArea() === 'Town') {
      this.combatState.Leave();
    }

    this.router.navigate([`/game/${this.currentArea().toLowerCase()}`]);
  }
}
