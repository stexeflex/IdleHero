import {
  Attributes,
  CreateEmptyLoadout,
  DamageStatistics,
  DungeonKeysState,
  DungeonRoomKey,
  DungeonStatistics,
  GearLoadout,
  GoldState,
  InitialDamageStatistics,
  InitialDungeonKeysState,
  InitialDungeonStatistics,
  InitialGoldState,
  InitialInventoryState,
  InitialPlayerLevelState,
  InventoryState,
  PlayerLevelState,
  ZeroAttributes
} from '../../core/models';

import { CharactersIconName } from '../../shared/components';

export interface Schema {
  Player: {
    Name: string;
    CharacterIcon: CharactersIconName;
  };
  Level: PlayerLevelState;
  Attributes: Attributes;
  Gold: GoldState;
  DungeonKeys: DungeonKeysState;
  Loadout: GearLoadout;
  Inventory: InventoryState;
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
    Level: InitialPlayerLevelState(),
    Attributes: ZeroAttributes(),
    Gold: InitialGoldState(),
    DungeonKeys: InitialDungeonKeysState(),
    Loadout: CreateEmptyLoadout(),
    Inventory: InitialInventoryState(),
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
    Inventory: updates.Inventory ?? base.Inventory,
    Statistics: {
      Dungeon: updates.Statistics?.Dungeon ?? base.Statistics.Dungeon,
      Damage: updates.Statistics?.Damage ?? base.Statistics.Damage
    }
  };
}
