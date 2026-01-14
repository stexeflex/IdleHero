import { CHARACTERS_ICONS, CharactersIconName } from './characters.icons';
import { Component, HostBinding, Input, OnChanges, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GEAR_SLOT_ICONS, GearSlotIconName } from './gear-slot.icons';
import { SYMBOLS_ICONS, SymbolsIconName } from './symbols.icons';
import { UI_ICONS, UiIconName } from './ui.icons';

import { IconSize } from './icon-size';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg
      [innerHTML]="safeSvgContent"
      viewBox="0 0 512 512"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"></svg>
  `,
  styles: [
    `
      :host {
        display: inline-block;
        width: 64px;
        height: 64px;
        vertical-align: middle;
      }
      svg {
        width: 100%;
        height: 100%;
        display: block;
      }
    `
  ]
})
export class IconComponent implements OnChanges {
  private sanitizer = inject(DomSanitizer);

  @Input() size: IconSize = 'lg';

  @Input() gear?: GearSlotIconName;
  @Input() symbol?: SymbolsIconName;
  @Input() ui?: UiIconName;
  @Input() character?: CharactersIconName;

  @HostBinding('style.width.px') get width() {
    return this.sizeMap[this.size];
  }
  @HostBinding('style.height.px') get height() {
    return this.sizeMap[this.size];
  }

  private sizeMap: Record<IconSize, number> = {
    sm: 24,
    md: 32,
    lg: 48,
    '2x': 64,
    '3x': 88,
    '4x': 128,
    '5x': 192
  };

  safeSvgContent?: SafeHtml;

  ngOnChanges() {
    const path: string | null = this.getSvgContent();

    if (path) {
      this.safeSvgContent = this.sanitizer.bypassSecurityTrustHtml(path);
    }
  }

  private getSvgContent(): string | null {
    let path: string | null = null;

    if (this.gear !== undefined) {
      path = GEAR_SLOT_ICONS[this.gear];
    } else if (this.symbol !== undefined) {
      path = SYMBOLS_ICONS[this.symbol];
    } else if (this.ui !== undefined) {
      path = UI_ICONS[this.ui];
    } else if (this.character !== undefined) {
      path = CHARACTERS_ICONS[this.character];
    }

    return path;
  }
}
