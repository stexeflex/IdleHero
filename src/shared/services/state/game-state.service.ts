import { Injectable, signal } from '@angular/core';

import { GameState } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  public GameCreated = signal(false);

  public GameState = signal<GameState>('IDLE');

  public Reset(): void {
    this.GameCreated.set(false);
    this.SetGameIdle();
  }

  public get IsGameInProgress(): boolean {
    return this.GameState() === 'IN_PROGRESS';
  }

  public SetGameInProgress(): void {
    this.GameState.set('IN_PROGRESS');
  }

  public SetGameIdle(): void {
    this.GameState.set('IDLE');
  }
}
