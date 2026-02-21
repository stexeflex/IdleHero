import {
  AffixDefinition,
  EmptyStatSource,
  Item,
  ItemVariantDefinition,
  Rune,
  RuneDefinition,
  StatSource
} from '../../models';
import { GetAffixDefinition, GetAffixValue } from '../items/affix.utils';
import { GetRuneDefinition, GetRuneValue } from '../runes/rune.utils';
import { ITEM_VARIANTS, STATS_CONFIG } from '../../constants';

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
      weaponBaseDamageStatSource.Damage.Value += weaponBaseDamage[item.Level];
      statSources.push(weaponBaseDamageStatSource);
    }

    // If the weapon has a base attack speed modifier, apply it
    const weaponBaseAttackSpeedMultiplier =
      itemDefinition.WeaponBaseAttackSpeed ?? STATS_CONFIG.BASE.ATTACK_SPEED;

    if (weaponBaseAttackSpeedMultiplier !== 1) {
      const weaponBaseAttackSpeed = EmptyStatSource(`${item.Id}_weapon_base_attackspeed`);

      weaponBaseAttackSpeed.AttackSpeed.Value = weaponBaseAttackSpeedMultiplier - 1.0;

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

export function MapRuneToStatSources(rune: Rune): StatSource[] {
  const statSources: StatSource[] = [];

  const runeDefinition: RuneDefinition | undefined = GetRuneDefinition(rune.DefinitionId);

  if (runeDefinition) {
    const runeStatSource: StatSource = runeDefinition.Effect.MapToStatSource(
      rune.Id,
      GetRuneValue(rune)
    );

    statSources.push(runeStatSource);
  }

  return statSources;
}
