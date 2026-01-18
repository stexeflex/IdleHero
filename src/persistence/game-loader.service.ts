import { GameStateService, HeroService } from '../shared/services';

import { CharactersIconName } from '../shared/components';
import { Injectable } from '@angular/core';
import { StateApplicationService } from './state-application.service';
import { StatePersistenceService } from './state-persistence.service';

@Injectable({ providedIn: 'root' })
export class GameLoaderService {
  constructor(
    private gameStateService: GameStateService,
    private heroService: HeroService,
    private statePersistenceService: StatePersistenceService,
    private stateApplicationService: StateApplicationService
  ) {}

  public async LoadGame(): Promise<void> {
    const schema = await this.statePersistenceService.LoadSchema();
    console.log('Loaded schema:', schema);
    this.stateApplicationService.ApplyState(schema);
  }

  public async LoadNewGame(heroName: string, characterIcon: CharactersIconName): Promise<void> {
    this.statePersistenceService.Clear();

    const schema = await this.statePersistenceService.LoadSchema();
    console.log('Loaded schema:', schema);
    this.stateApplicationService.ApplyState(schema);

    this.gameStateService.GameCreated.set(true);
    this.heroService.Name.set(heroName);
    this.heroService.CharacterIcon.set(characterIcon);
  }
}
