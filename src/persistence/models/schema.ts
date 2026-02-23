import {
  AmuletState,
  Attributes,
  CreateEmptyLoadout,
  CreateEmptyRuneInventoryState,
  CreateEmptySkillTreeState,
  CreateLockedAmuletState,
  DamageStatistics,
  DungeonKeysState,
  DungeonStatistics,
  GearLoadout,
  GoldState,
  InitialDamageStatistics,
  InitialDungeonKeysState,
  InitialDungeonStatistics,
  InitialGoldState,
  InitialInventoryState,
  InitialLevelState,
  InventoryState,
  RuneInventoryState,
  SkillTreeState,
  ZeroAttributes
} from '../../core/models';

import { ATTRIBUTES_CONFIG } from '../../core/constants';
import { CharactersIconName } from '../../shared/components';
import { RUNE_DEFINITIONS } from '../../core/constants/runes/runes.config';

export interface Schema {
  Player: {
    Name: string;
    CharacterIcon: CharactersIconName;
  };
  Level: {
    Level: number;
    ExperienceInLevel: number;
  };
  Attributes: {
    Allocated: Attributes;
    Unallocated: number;
  };
  Gold: GoldState;
  DungeonKeys: DungeonKeysState;
  Loadout: GearLoadout;
  Amulet: AmuletState;
  RuneInventory: RuneInventoryState;
  Inventory: InventoryState;
  Skills: SkillTreeState;
  Statistics: {
    Dungeon: DungeonStatistics;
    Damage: DamageStatistics;
  };
}

export function InitialSchema(): Schema {
  return {
    Player: {
      Name: 'Hero',
      CharacterIcon: 'dwarf'
    },
    Level: InitialLevelState(),
    Attributes: {
      Allocated: ZeroAttributes(),
      Unallocated: ATTRIBUTES_CONFIG.INITIAL_ATTR_POINTS
    },
    Gold: InitialGoldState(),
    DungeonKeys: InitialDungeonKeysState(),
    Loadout: CreateEmptyLoadout(),
    Amulet: CreateLockedAmuletState(),
    RuneInventory: CreateEmptyRuneInventoryState(RUNE_DEFINITIONS.map((rune) => rune.Id)),
    Inventory: InitialInventoryState(),
    Skills: CreateEmptySkillTreeState(),
    Statistics: {
      Dungeon: InitialDungeonStatistics(),
      Damage: InitialDamageStatistics()
    }
  };
}

export function MergeSchemas(base: Schema, updates: Partial<Schema>): Schema {
  return {
    Player: {
      Name: updates.Player?.Name ?? base.Player.Name,
      CharacterIcon: updates.Player?.CharacterIcon ?? base.Player.CharacterIcon
    },
    Level: updates.Level ?? base.Level,
    Attributes: updates.Attributes ?? base.Attributes,
    Gold: updates.Gold ?? base.Gold,
    DungeonKeys: updates.DungeonKeys ?? base.DungeonKeys,
    Loadout: updates.Loadout ?? base.Loadout,
    Amulet: updates.Amulet ?? base.Amulet,
    RuneInventory: updates.RuneInventory ?? base.RuneInventory,
    Inventory: updates.Inventory ?? base.Inventory,
    Skills: updates.Skills ?? base.Skills,
    Statistics: {
      Dungeon: updates.Statistics?.Dungeon ?? base.Statistics.Dungeon,
      Damage: updates.Statistics?.Damage ?? base.Statistics.Damage
    }
  };
}
