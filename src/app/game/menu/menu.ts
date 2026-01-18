import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { GameStateService, MenuService } from '../../../shared/services';

import { GameSaverService } from '../../../persistence';
import { Router } from '@angular/router';
import { Separator } from '../../../shared/components';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-menu',
  imports: [Separator],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu {
  private elementRef = inject(ElementRef);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.CloseMenu();
    }
  }

  protected get Version(): string {
    return environment.version;
  }

  protected get IsMenuOpen(): boolean {
    return this.menuService.IsMenuOpen();
  }

  constructor(
    private router: Router,
    private menuService: MenuService,
    private gameStateService: GameStateService,
    private gameSaverService: GameSaverService
  ) {}

  private CloseMenu() {
    this.menuService.IsMenuOpen.set(false);
  }

  protected ToggleMenu() {
    this.menuService.IsMenuOpen.set(!this.menuService.IsMenuOpen());
  }

  protected async NewGame() {
    this.gameStateService.Reset();
    await this.router.navigate(['new']);
  }

  protected async SaveGame() {
    await this.gameSaverService.SaveGame();
    this.CloseMenu();
  }
}
