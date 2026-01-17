import { Component, OnDestroy } from '@angular/core';
import { PanelHeader, Separator } from '../../../shared/components';

import { BattleService } from '../../../shared/engine';
import { DELAYS } from '../../../shared/constants';
import { GameStateService } from '../../../shared/services';
import { Viewport } from './viewport/viewport';

@Component({
  selector: 'app-game-area',
  imports: [Viewport, PanelHeader, Separator],
  templateUrl: './game-area.html',
  styleUrl: './game-area.scss'
})
export class GameArea implements OnDestroy {
  private timeoutId: any;

  protected CanStartGame: boolean = true;
  protected get CanPrestige(): boolean {
    return this.gameStateService.GameState() === 'IN_PROGRESS';
  }

  constructor(
    private gameStateService: GameStateService,
    private battleService: BattleService
  ) {}

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  startGame() {
    this.battleService.Battle();
    this.CanStartGame = false;
  }

  prestige() {
    this.battleService.Prestige();

    // Delay before the player can start a new game
    this.delayRestart();
  }

  private delayRestart() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.CanStartGame = true;
    }, DELAYS.BATTLE_RESTART_MS);
  }
}
