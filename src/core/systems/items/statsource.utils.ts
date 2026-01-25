import { AFFIX_DEFINITIONS, ITEM_VARIANTS, RUNE_DEFINITIONS } from '../../constants';
import {
  AffixDefinition,
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
  }

  // Map affix stats
  for (const affix of item.Affixes) {
    const affixDefinition: AffixDefinition | undefined = AFFIX_DEFINITIONS.find(
      (a) => a.Id === affix.DefinitionId
    );

    if (!affixDefinition) {
      continue;
    }

    const affixStatSource: StatSource = affixDefinition.Effect.MapToStatSource(affix.RolledValue);
    statSources.push(affixStatSource);
  }

  // Map rune stats
  if (item.Rune) {
    const runeDefinition: RuneDefinition | undefined = RUNE_DEFINITIONS.find(
      (r) => r.Id === item.Rune!.DefinitionId
    );

    if (runeDefinition) {
      const runeStatSource: StatSource = runeDefinition.Effect.MapToStatSource(
        item.Rune.RolledValue
      );
      statSources.push(runeStatSource);
    }
  }

  return statSources;
}
