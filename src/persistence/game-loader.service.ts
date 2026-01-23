import { GameStateService, HeroService } from '../shared/services';
import { Injectable, inject } from '@angular/core';

import { CharactersIconName } from '../shared/components';
import { StateApplicationService } from './state-application.service';
import { StatePersistenceService } from './state-persistence.service';

@Injectable({ providedIn: 'root' })
export class GameLoaderService {
  private heroService = inject(HeroService);
  private statePersistenceService = inject(StatePersistenceService);
  private stateApplicationService = inject(StateApplicationService);

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

    this.heroService.Name.set(heroName);
    this.heroService.CharacterIcon.set(characterIcon);
  }
}
