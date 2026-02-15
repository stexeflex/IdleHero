import { IsMaxLevel, NextLevel } from '.';
import { Item, ItemLevel } from '../../models';

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ItemLevelService {
  /**
   * Checks if the item can be leveled up.
   * @param item The item to check.
   * @returns True if the level is below 5; otherwise false.
   */
  public CanLevelUp(item: Item): boolean {
    return !IsMaxLevel(item);
  }

  /**
   * Levels up the item by one.
   * @param item The item instance to update.
   * @returns A new item instance with increased level.
   */
  public LevelUp(item: Item): Item {
    const nextLevel: ItemLevel = NextLevel(item);
    return { ...item, Level: nextLevel };
  }
}
