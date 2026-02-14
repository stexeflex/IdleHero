import { CraftingService, GearLoadoutService, PlayerHeroService } from '../core/services';
import { Injectable, inject } from '@angular/core';

import { AppStateService } from '../shared/services';
import { CharactersIconName } from '../shared/components';
import { ItemVariantDefinition } from '../core/models';
import { StateApplicationService } from './state-application.service';
import { StatePersistenceService } from './state-persistence.service';

@Injectable({ providedIn: 'root' })
export class GameLoaderService {
  private appStateService = inject(AppStateService);
  private playerHeroService = inject(PlayerHeroService);
  private craftingService = inject(CraftingService);
  private loadoutService = inject(GearLoadoutService);
  private statePersistenceService = inject(StatePersistenceService);
  private stateApplicationService = inject(StateApplicationService);

  public async LoadGame(): Promise<void> {
    const schema = await this.statePersistenceService.LoadSchema();
    console.log('Loaded schema:', schema);
    this.stateApplicationService.ApplyState(schema);
  }

  public async LoadNewGame(
    heroName: string,
    characterIcon: CharactersIconName,
    weaponVariant: ItemVariantDefinition
  ): Promise<void> {
    this.statePersistenceService.Clear();

    const schema = await this.statePersistenceService.LoadSchema();

    console.log('Loaded schema:', schema);

    this.stateApplicationService.ApplyState(schema);
    this.appStateService.LoadedExistingSaveGame.set(true);

    this.playerHeroService.Name.set(heroName);
    this.playerHeroService.CharacterIcon.set(characterIcon);
    const starterWeaponCraftResult = this.craftingService.CraftNewItem(weaponVariant);
    if (starterWeaponCraftResult.Success) {
      this.loadoutService.SetStarterWeapon(starterWeaponCraftResult.Item);
    }
  }
}
