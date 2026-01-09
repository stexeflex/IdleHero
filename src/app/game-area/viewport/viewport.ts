import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BattleLog, ExperienceBar, HealthBar, StageLabel } from '../../../shared/components';
import { BossService, GameService, LevelService, StageService } from '../../../shared/services';

@Component({
  selector: 'app-viewport',
  imports: [HealthBar, ExperienceBar, StageLabel, BattleLog],
  templateUrl: './viewport.html',
  styleUrl: './viewport.scss'
})
export class Viewport implements AfterViewInit {
  protected get showStage(): boolean {
    return this.gameService.InProgress();
  }

  protected get showBoss(): boolean {
    return this.gameService.InProgress();
  }

  protected get showExpBar(): boolean {
    return this.gameService.InProgress();
  }

  protected get showLog(): boolean {
    return this.gameService.InProgress();
  }

  @ViewChild('battleLogContainer') battleLogContainer!: ElementRef;

  constructor(
    protected stageService: StageService,
    protected bossService: BossService,
    protected levelService: LevelService,
    protected gameService: GameService
  ) {}

  ngAfterViewInit(): void {
    this.scrollToBottom(this.battleLogContainer);
  }

  private scrollToBottom(element: ElementRef): void {
    setInterval(() => {
      const isScrolledToBottom = element.nativeElement.scrollTop >= 1;

      if (isScrolledToBottom) {
        element.nativeElement.scrollTop = 0;
      }
    }, 500);
  }
}
