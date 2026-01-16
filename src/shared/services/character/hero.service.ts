import { Injectable, WritableSignal, signal } from '@angular/core';

import { CharactersIconName } from '../../components';
import { HeroSchema } from '../../../persistence';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  public Name = signal('Hero');
  public CharacterIcon: WritableSignal<CharactersIconName> = signal('dwarf');
  public readonly PrestigeLevel = signal(0);
  public readonly HighestStageReached = signal(0);
  public readonly HighestDamageDealt = signal(0);

  public Init(heroSchema: HeroSchema) {
    this.Name.set(heroSchema.Name);
    this.CharacterIcon.set(heroSchema.CharacterIcon as CharactersIconName);
    this.PrestigeLevel.set(heroSchema.PrestigeLevel);
    this.HighestStageReached.set(heroSchema.HighestStageReached);
    this.HighestDamageDealt.set(heroSchema.HighestDamageDealt);
  }

  public CollectSchema(): HeroSchema {
    const schema = new HeroSchema();
    schema.Name = this.Name();
    schema.CharacterIcon = this.CharacterIcon();
    schema.PrestigeLevel = this.PrestigeLevel();
    schema.HighestStageReached = this.HighestStageReached();
    schema.HighestDamageDealt = this.HighestDamageDealt();
    return schema;
  }

  public Prestige(atStage: number) {
    this.PrestigeLevel.update((level) => level + 1);
    this.HighestStageReached.update((highest) => Math.max(highest, atStage));
  }

  public RecordDamageDealt(amount: number) {
    this.HighestDamageDealt.update((highest) => Math.max(highest, amount));
  }
}
