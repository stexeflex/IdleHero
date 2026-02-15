import { CharactersIconName, IconComponent } from '../../../../shared/components';
import { Component, inject } from '@angular/core';

import { Info } from './info/info';
import { PlayerHeroService } from '../../../../core/services';

@Component({
  selector: 'app-character-sheet',
  imports: [Info, IconComponent],
  templateUrl: './character-sheet.html',
  styleUrl: './character-sheet.scss'
})
export class CharacterSheet {
  private heroService = inject(PlayerHeroService);

  protected get HeroIcon(): CharactersIconName {
    return this.heroService.CharacterIcon();
  }
}
