import { Component, ElementRef, HostListener, inject } from '@angular/core';

import { MenuService } from '../../../shared/services';
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

  constructor(private menuService: MenuService) {}

  private CloseMenu() {
    this.menuService.IsMenuOpen.set(false);
  }

  ToggleMenu() {
    this.menuService.IsMenuOpen.set(!this.menuService.IsMenuOpen());
  }

  Reload() {
    window.location.reload();
    this.CloseMenu();
  }
}
