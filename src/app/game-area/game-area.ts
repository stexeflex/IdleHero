import { Component } from '@angular/core';
import { GameService } from '../../shared/services';
import { Viewport } from './viewport/viewport';

@Component({
  selector: 'app-game-area',
  imports: [Viewport],
  templateUrl: './game-area.html',
  styleUrl: './game-area.scss'
})
export class GameArea {
  constructor(protected gameService: GameService) {}

  toggleGame() {
    if (this.gameService.InProgress()) {
      this.gameService.Pause();
    } else {
      this.gameService.Start();
    }
  }

  prestige() {
    this.gameService.Prestige();
  }
}
