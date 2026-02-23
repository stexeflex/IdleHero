import { Component, inject } from '@angular/core';
import { ExperienceBar, Separator } from '../../../shared/components';

import { CharacterSheet } from './character-sheet/character-sheet';
import { LevelService } from '../../../core/services';
import { Stats } from './stats/stats';

@Component({
  selector: 'app-character-area',
  imports: [CharacterSheet, Separator, Stats, ExperienceBar],
  templateUrl: './character-area.html',
  styleUrl: './character-area.scss'
})
export class CharacterArea {
  private readonly levelService = inject(LevelService);

  public get LevelInfo(): { level: number; currentExp: number; expToNext: number; isMax: boolean } {
    return {
      level: this.levelService.Level(),
      currentExp: this.levelService.ExperienceInLevel(),
      expToNext: this.levelService.ExperienceToNext(),
      isMax: this.levelService.IsMaxLevel()
    };
  }
}
