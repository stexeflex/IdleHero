import { Injectable, signal } from '@angular/core';

import { CharactersIconName } from '../../shared/components';

@Injectable({ providedIn: 'root' })
export class PlayerHeroService {
  public Name = signal('Hero');
  public CharacterIcon = signal<CharactersIconName>('dwarf');

  public Get(): { Name: string; CharacterIcon: CharactersIconName } {
    return {
      Name: this.Name(),
      CharacterIcon: this.CharacterIcon()
    };
  }

  public Set(name: string, icon: CharactersIconName): void {
    this.Name.set(name);
    this.CharacterIcon.set(icon);
  }
}
