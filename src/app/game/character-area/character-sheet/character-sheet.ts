import { CharactersIconName, IconComponent } from '../../../../shared/components';

import { Component } from '@angular/core';
import { HeroService } from '../../../../shared/services';
import { Info } from './info/info';

@Component({
  selector: 'app-character-sheet',
  imports: [Info, IconComponent],
  templateUrl: './character-sheet.html',
  styleUrl: './character-sheet.scss'
})
export class CharacterSheet {
  protected get HeroIcon(): CharactersIconName {
    return this.heroService.CharacterIcon();
  }

  constructor(private heroService: HeroService) {}
}
