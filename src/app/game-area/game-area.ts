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
  protected CanStartGame: boolean = true;

  constructor(protected gameService: GameService) {}

  startGame() {
    this.gameService.Start();
  }

  prestige() {
    this.gameService.Prestige();
    this.CanStartGame = false;

    // Delay before the player can start a new game
    setTimeout(() => {
      this.CanStartGame = true;
    }, 5000);
  }
}
