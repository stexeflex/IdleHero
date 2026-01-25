import { Component, inject, signal } from '@angular/core';
import { TabDefinition, TabStrip } from '../../shared/components';

import { CharacterArea } from './character-area/character-area';
import { CraftingArea } from './crafting-area/crafting-area/crafting-area';
import { DungeonArea } from './dungeon-area/dungeon-area';
import { InfoArea } from './info-area/info-area';
import { InventoryArea } from './inventory-area/inventory-area';
import { Menu } from './menu/menu';
import { MenuService } from '../../shared/services';
import { SkillTree } from './skill-tree/skill-tree';

@Component({
  selector: 'app-game',
  imports: [
    CharacterArea,
    InventoryArea,
    Menu,
    InfoArea,
    SkillTree,
    TabStrip,
    DungeonArea,
    CraftingArea
  ],
  templateUrl: './game.html',
  styleUrl: './game.scss'
})
export class Game {
  private menuService = inject(MenuService);

  protected readonly title = signal('IDLE HERO');

  protected get IsMenuOpen(): boolean {
    return this.menuService.IsMenuOpen();
  }

  protected get Tabs(): TabDefinition[] {
    return [
      { id: 'inventory', label: 'INVENTORY', disabled: false },
      { id: 'skills', label: 'SKILLS', disabled: false },
      { id: 'crafting', label: 'CRAFTING', disabled: false }
    ];
  }

  protected SelectedTab = signal<TabDefinition['id'] | null>('inventory');

  protected onTabSelected(tabId: TabDefinition['id']): void {
    this.SelectedTab.set(tabId);
  }
}
