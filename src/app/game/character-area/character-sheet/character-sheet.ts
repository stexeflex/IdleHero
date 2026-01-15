import { CharactersIconName, IconComponent, Separator } from '../../../../shared/components';

import { Component } from '@angular/core';
import { HeroService } from '../../../../shared/services';
import { Info } from './info/info';
import { Stats } from './stats/stats';

@Component({
  selector: 'app-character-sheet',
  imports: [Info, Stats, Separator, IconComponent],
  templateUrl: './character-sheet.html',
  styleUrl: './character-sheet.scss'
})
export class CharacterSheet {
  protected get HeroIcon(): CharactersIconName {
    return this.heroService.CharacterIcon();
  }

  constructor(private heroService: HeroService) {}
}
