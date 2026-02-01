import { AFFIX_DEFINITIONS, ITEM_VARIANTS, RUNE_DEFINITIONS, STATS_CONFIG } from '../../constants';
import {
  AffixDefinition,
  EmptyStatSource,
  Item,
  ItemVariantDefinition,
  RuneDefinition,
  StatSource
} from '../../models';

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
    const affixDefinition: AffixDefinition | undefined = AFFIX_DEFINITIONS.find(
      (a) => a.Id === affix.DefinitionId
    );

    if (!affixDefinition) {
      continue;
    }

    const affixStatSource: StatSource = affixDefinition.Effect.MapToStatSource(
      item.Id,
      affix.RolledValue
    );
    statSources.push(affixStatSource);
  }

  // Map rune stats
  if (item.Rune) {
    const runeDefinition: RuneDefinition | undefined = RUNE_DEFINITIONS.find(
      (r) => r.Id === item.Rune!.DefinitionId
    );

    if (runeDefinition) {
      const runeStatSource: StatSource = runeDefinition.Effect.MapToStatSource(
        item.Id,
        item.Rune.RolledValue
      );
      statSources.push(runeStatSource);
    }
  }

  return statSources;
}
