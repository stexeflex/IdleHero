import { ItemRarity } from './item-rarity.enum';
import { ItemSlot } from './item-slot.enum';
import { StatSource } from '../combat/stats/stat-source.type';

export interface Item extends StatSource {
  Id: string;
  Name: string;
  Description?: string;

  Slot: ItemSlot;
  Rarity: ItemRarity;
  LevelRequirement: number;
}
