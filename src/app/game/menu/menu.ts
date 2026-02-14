import { Component, ElementRef, HostListener, inject } from '@angular/core';

import { GameSaverService } from '../../../persistence';
import { MenuService } from '../../../shared/services';
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
  private router = inject(Router);
  private menuService = inject(MenuService);
  private gameSaverService = inject(GameSaverService);

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

  private CloseMenu() {
    this.menuService.IsMenuOpen.set(false);
  }

  protected ToggleMenu() {
    this.menuService.IsMenuOpen.set(!this.menuService.IsMenuOpen());
  }

  protected async NewGame() {
    await this.router.navigate(['new']);
  }

  protected async SaveGame() {
    await this.gameSaverService.SaveGame();
    this.CloseMenu();
  }
}
