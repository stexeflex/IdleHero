import {
  BattleLog,
  BuffsBar,
  CharactersIconName,
  CreaturesIconName,
  ExperienceBar,
  HealthBar,
  IconComponent,
  StageLabel
} from '../../../../shared/components';
import {
  BossService,
  GameService,
  HeroService,
  LevelService,
  StageService
} from '../../../../shared/services';

import { Component } from '@angular/core';

@Component({
  selector: 'app-viewport',
  imports: [HealthBar, ExperienceBar, StageLabel, BattleLog, BuffsBar, IconComponent],
  templateUrl: './viewport.html',
  styleUrl: './viewport.scss'
})
export class Viewport {
  protected get showStage(): boolean {
    return this.gameService.InProgress();
  }

  protected get showHero(): boolean {
    return this.gameService.InProgress();
  }

  protected get showBoss(): boolean {
    return this.gameService.InProgress();
  }

  protected get showExpBar(): boolean {
    return this.gameService.InProgress();
  }

  protected get showBuffBar(): boolean {
    return this.gameService.InProgress();
  }

  protected get HeroIcon(): CharactersIconName {
    return this.heroService.CharacterIcon();
  }

  protected get BossIcon(): CreaturesIconName {
    return this.bossService.BossIcon();
  }

  constructor(
    protected heroService: HeroService,
    protected stageService: StageService,
    protected bossService: BossService,
    protected levelService: LevelService,
    protected gameService: GameService
  ) {}
}
