import { Injectable, signal } from '@angular/core';

import { CharactersIconName } from '../../shared/components';

@Injectable({ providedIn: 'root' })
export class PlayerHeroService {
  public Name = signal('Hero');
  public CharacterIcon = signal<CharactersIconName>('dwarf');
}
