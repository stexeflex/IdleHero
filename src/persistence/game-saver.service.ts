import { Injectable, inject } from '@angular/core';
import { StateCollectionService } from './state-collection.service';
import { StatePersistenceService } from './state-persistence.service';

@Injectable({ providedIn: 'root' })
export class GameSaverService {
  private stateCollectionService = inject(StateCollectionService);
  private statePersistenceService = inject(StatePersistenceService);


  public async SaveGame(): Promise<void> {
    const schema = this.stateCollectionService.CollectStates();
    console.log('Saving game:', schema);
    await this.statePersistenceService.Save(schema);
  }
}
