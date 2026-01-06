import { Component } from '@angular/core';
import { ExperienceBar } from './experience-bar/experience-bar';
import { Info } from './info/info';
import { PlayerService } from '../../../shared/services';
import { Stats } from './stats/stats';

@Component({
  selector: 'app-character-sheet',
  imports: [Info, Stats, ExperienceBar],
  templateUrl: './character-sheet.html',
  styleUrl: './character-sheet.scss'
})
export class CharacterSheet {
  constructor(protected playerService: PlayerService) {}
}
