import {
  AffixDefinition,
  EmptyStatSource,
  Item,
  ItemVariantDefinition,
  Rune,
  RuneDefinition,
  StatSource
} from '../../models';
import { GetAffixDefinition, GetAffixValue } from './affix.utils';
import { ITEM_VARIANTS, STATS_CONFIG } from '../../constants';

import { GetRuneDefinition } from './rune.utils';

export function MapItemToStatSources(item: Item): StatSource[] {
  const statSources: StatSource[] = [];

  const itemDefinition: ItemVariantDefinition | undefined = ITEM_VARIANTS.find(
    (v) => v.Id === item.DefinitionId
  );

  // Map innate stats
  if (itemDefinition) {
    const innateValue: number = itemDefinition.Innate.ValuesByLevel[item.Level];
    const innateStatSource: StatSource = itemDefinition.Innate.MapToStatSource(innateValue);
    statSources.push(innateStatSource);

    // If the weapon has a base damage, apply it
    const weaponBaseDamage = itemDefinition.WeaponBaseDamage;
    if (weaponBaseDamage !== undefined) {
      const weaponBaseDamageStatSource = EmptyStatSource(`${item.Id}_weapon_base_damage`);
      weaponBaseDamageStatSource.Damage.Flat += weaponBaseDamage[item.Level];
      statSources.push(weaponBaseDamageStatSource);
    }

    // If the weapon has a base attack speed modifier, apply it
    const weaponBaseAttackSpeedMultiplier =
      itemDefinition.WeaponBaseAttackSpeed ?? STATS_CONFIG.BASE.ATTACK_SPEED;

    if (weaponBaseAttackSpeedMultiplier !== 1) {
      const weaponBaseAttackSpeed = EmptyStatSource(`${item.Id}_weapon_base_attackspeed`);

      weaponBaseAttackSpeed.AttackSpeed.Multiplier = weaponBaseAttackSpeedMultiplier - 1.0;

      statSources.push(weaponBaseAttackSpeed);
    }
  }

  // Map affix stats
  for (const affix of item.Affixes) {
    const affixDefinition: AffixDefinition | undefined = GetAffixDefinition(affix.DefinitionId);

    if (!affixDefinition) {
      continue;
    }

    const affixStatSource: StatSource = affixDefinition.Effect.MapToStatSource(
      item.Id,
      GetAffixValue(affix)
    );
    statSources.push(affixStatSource);
  }

  return statSources;
}

export function MapRunesToStatSources(runes: Rune[]): StatSource[] {
  const statSources: StatSource[] = [];

  for (const rune of runes) {
    const runeDefinition: RuneDefinition | undefined = GetRuneDefinition(rune.DefinitionId);

    if (runeDefinition) {
      const runeStatSource: StatSource = runeDefinition.Effect.MapToStatSource(
        rune.Id,
        rune.ValueRangePercentage
      );

      statSources.push(runeStatSource);
    }
  }

  return statSources;
}
