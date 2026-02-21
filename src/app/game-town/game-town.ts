import { Component, signal } from '@angular/core';
import { TabDefinition, TabStrip } from '../../shared/components';

import { CraftingArea } from './crafting-area/crafting-area';
import { InventoryArea } from './inventory-area/inventory-area';
import { SkillTree } from './skill-tree/skill-tree';

@Component({
  selector: 'app-game-town',
  imports: [TabStrip, InventoryArea, SkillTree, CraftingArea],
  templateUrl: './game-town.html',
  styleUrl: './game-town.scss'
})
export class GameTown {
  protected get Tabs(): TabDefinition[] {
    return [
      { id: 'inventory', label: 'INVENTORY', disabled: false },
      { id: 'crafting', label: 'BLACKSMITH', disabled: false },
      { id: 'skills', label: 'SKILL TREE', disabled: false }
    ];
  }

  protected SelectedTab = signal<TabDefinition['id']>('inventory');

  protected onTabSelected(tabId: TabDefinition['id']): void {
    this.SelectedTab.set(tabId);
  }
}
