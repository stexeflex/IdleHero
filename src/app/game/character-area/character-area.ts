import { ExperienceBar, PanelHeader, Separator } from '../../../shared/components';

import { CharacterSheet } from './character-sheet/character-sheet';
import { Component } from '@angular/core';
import { LevelService } from '../../../shared/services';
import { Stats } from './stats/stats';

@Component({
  selector: 'app-character-area',
  imports: [CharacterSheet, PanelHeader, Separator, Stats, ExperienceBar],
  templateUrl: './character-area.html',
  styleUrl: './character-area.scss'
})
export class CharacterArea {
  constructor(protected levelService: LevelService) {}
}
