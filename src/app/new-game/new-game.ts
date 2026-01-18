import { CharactersIconName, IconComponent, Separator } from '../../shared/components';

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameLoaderService } from '../../persistence';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-game',
  imports: [FormsModule, Separator, IconComponent],
  templateUrl: './new-game.html',
  styleUrl: './new-game.scss'
})
export class NewGame {
  private CharacterIcons: CharactersIconName[] = ['dwarf', 'overlord', 'wizard'];
  protected CharacterIcon: CharactersIconName = 'dwarf';

  protected heroName: string = '';

  constructor(
    private router: Router,
    private gameLoaderService: GameLoaderService
  ) {}

  async StartGame() {
    await this.gameLoaderService.LoadNewGame(this.heroName, this.CharacterIcon);
    await this.router.navigate(['']);
  }

  NextCharacter() {
    this.CharacterIcon =
      this.CharacterIcons[
        (this.CharacterIcons.indexOf(this.CharacterIcon) + 1) % this.CharacterIcons.length
      ];
  }

  PreviousCharacter() {
    this.CharacterIcon =
      this.CharacterIcons[
        (this.CharacterIcons.indexOf(this.CharacterIcon) - 1 + this.CharacterIcons.length) %
          this.CharacterIcons.length
      ];
  }
}
