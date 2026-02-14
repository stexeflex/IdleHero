import {
  CharactersIconName,
  IconComponent,
  ItemVariantPreview,
  Separator
} from '../../shared/components';
import { Component, computed, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { GameLoaderService } from '../../persistence';
import { GameService } from '../../shared/services';
import { ItemVariantDefinition } from '../../core/models';
import { Router } from '@angular/router';
import { STARTER_WEAPON_VARIANTS } from '../../core/constants';

@Component({
  selector: 'app-new-game',
  imports: [FormsModule, Separator, IconComponent, ItemVariantPreview],
  templateUrl: './new-game.html',
  styleUrl: './new-game.scss'
})
export class NewGame {
  private router = inject(Router);
  private gameService = inject(GameService);
  private gameLoaderService = inject(GameLoaderService);

  protected readonly title = this.gameService.Title;

  private CharacterIcons: CharactersIconName[] = [
    'dwarf',
    'overlord',
    'wizard',
    'womanelf',
    'monkface',
    'cowled',
    'bandit',
    'vampiredracula',
    'femalevampire',
    'piratecaptain',
    'cleopatra'
  ];
  protected CurrentCharacterIndex = signal<number>(0);
  protected TotalCharacters = this.CharacterIcons.length;
  protected CharacterIcon = computed(() => this.CharacterIcons[this.CurrentCharacterIndex()]);

  private Weapons: ItemVariantDefinition[] = STARTER_WEAPON_VARIANTS;
  protected CurrentWeaponIndex = signal<number>(0);
  protected TotalWeapons = this.Weapons.length;
  protected WeaponVariant = computed(() => this.Weapons[this.CurrentWeaponIndex()]);

  protected heroName: string = '';

  async StartGame() {
    await this.gameLoaderService.LoadNewGame(
      this.heroName,
      this.CharacterIcon(),
      this.WeaponVariant()
    );
    await this.router.navigate(['']);
  }

  NextCharacter() {
    this.CurrentCharacterIndex.set((this.CurrentCharacterIndex() + 1) % this.CharacterIcons.length);
  }

  PreviousCharacter() {
    this.CurrentCharacterIndex.set(
      (this.CurrentCharacterIndex() - 1 + this.CharacterIcons.length) % this.CharacterIcons.length
    );
  }

  NextWeapon() {
    this.CurrentWeaponIndex.set((this.CurrentWeaponIndex() + 1) % this.Weapons.length);
  }

  PreviousWeapon() {
    this.CurrentWeaponIndex.set(
      (this.CurrentWeaponIndex() - 1 + this.Weapons.length) % this.Weapons.length
    );
  }
}
