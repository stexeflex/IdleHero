import {
  BattleLog,
  BuffsBar,
  ExperienceBar,
  HealthBar,
  StageLabel
} from '../../../shared/components';
import { BossService, GameService, LevelService, StageService } from '../../../shared/services';

import { Component } from '@angular/core';

@Component({
  selector: 'app-viewport',
  imports: [HealthBar, ExperienceBar, StageLabel, BattleLog, BuffsBar],
  templateUrl: './viewport.html',
  styleUrl: './viewport.scss'
})
export class Viewport {
  protected get showStage(): boolean {
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

  constructor(
    protected stageService: StageService,
    protected bossService: BossService,
    protected levelService: LevelService,
    protected gameService: GameService
  ) {}
}
