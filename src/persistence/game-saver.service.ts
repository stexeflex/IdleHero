import { Injectable } from '@angular/core';
import { StateCollectionService } from './state-collection.service';
import { StatePersistenceService } from './state-persistence.service';

@Injectable({ providedIn: 'root' })
export class GameSaverService {
  constructor(
    private stateCollectionService: StateCollectionService,
    private statePersistenceService: StatePersistenceService
  ) {}

  public async SaveGame(): Promise<void> {
    const schema = this.stateCollectionService.CollectStates();
    console.log('Saving game:', schema);
    await this.statePersistenceService.Save(schema);
  }
}
