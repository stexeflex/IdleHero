import { GetItemVariant } from '../../core/systems/items';
import { Item } from '../../core/models';
import { Schema } from '../models/schema';

/**
 * Migration function to transform schema from version 2.0.1 to 2.1.0
 *
 * Changes:
 * - Affixes of Tier 'Epic' on Tier 'I' items are downgraded to 'Rare'
 *
 * @param schema The input schema in version 2.0.1 format
 * @returns The migrated schema in version 2.1.0 format
 */
export function MigrateSchema_2_0_1_to_2_1_0(schema: Schema): Schema {
  console.log('Starting migration from 2.0.1 to 2.1.0');

  let migratedSchema: Schema = {
    ...schema
  };

  for (let item of Object.values(migratedSchema.Loadout)) {
    if (item) {
      item = DowngradeEpicAffixesOnTierIItems(item);
    }
  }

  for (let item of migratedSchema.Inventory.Items) {
    if (item) {
      item = DowngradeEpicAffixesOnTierIItems(item);
    }
  }

  return migratedSchema;
}
/**
 * In version 2.0.0 and 2.0.1, the rules allowed Tier I items to have 'Epic' affixes.
 * This migration downgrades such affixes to 'Rare' to comply with the new rules.
 * @param item The item to be migrated
 * @returns The migrated item with downgraded affixes if necessary
 */
function DowngradeEpicAffixesOnTierIItems(item: Item): Item {
  const definition = GetItemVariant(item.DefinitionId);
  if (definition.Tier === 'I') {
    for (const affix of item.Affixes) {
      if (affix && affix.Tier === 'Epic') {
        affix.Tier = 'Rare';
      }
    }
  }
  return item;
}
