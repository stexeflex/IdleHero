import { Injectable, WritableSignal, signal } from '@angular/core';

import { CharactersIconName } from '../../components';
import { HeroSchema } from '../../../persistence';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  public Name = signal('Hero');
  public CharacterIcon: WritableSignal<CharactersIconName> = signal('dwarf');

  public Init(heroSchema: HeroSchema) {
    this.Name.set(heroSchema.Name);
    this.CharacterIcon.set(heroSchema.CharacterIcon as CharactersIconName);
  }

  public CollectSchema(schema: HeroSchema): HeroSchema {
    schema.Name = this.Name();
    schema.CharacterIcon = this.CharacterIcon();
    return schema;
  }
}
