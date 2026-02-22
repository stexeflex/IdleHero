import { CHARACTERS_ICONS, CharactersIconName } from './characters.icons';
import { COMBAT_ICONS, CombatIconName } from './combat.icons';
import { CREATURES_ICONS, CreaturesIconName } from './creatures.icons';
import { Component, HostBinding, OnChanges, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GEAR_SLOT_ICONS, GearSlotIconName } from './gear-slot.icons';
import { PLACES_ICONS, PlacesIconName } from './places.icons';
import { SKILLS_ICONS, SkillsIconName } from './skills.icons';
import { SYMBOLS_ICONS, SymbolsIconName } from './symbols.icons';
import { UI_ICONS, UiIconName } from './ui.icons';

import { IconSize } from './icon-size.type';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg
      [innerHTML]="safeSvgContent"
      viewBox="0 0 512 512"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      [class.rotate-y-180]="rotate()"></svg>
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

  readonly size = input<IconSize>('lg');
  readonly rotate = input<boolean>(false);

  readonly gear = input<GearSlotIconName>();
  readonly symbol = input<SymbolsIconName>();
  readonly ui = input<UiIconName>();
  readonly character = input<CharactersIconName>();
  readonly creatures = input<CreaturesIconName>();
  readonly combat = input<CombatIconName>();
  readonly places = input<PlacesIconName>();
  readonly skills = input<SkillsIconName>();

  @HostBinding('style.width.px') get width() {
    return this.sizeMap[this.size()];
  }
  @HostBinding('style.height.px') get height() {
    return this.sizeMap[this.size()];
  }

  private sizeMap: Record<IconSize, number> = {
    mini: 16,
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

    const gear = this.gear();
    const symbol = this.symbol();
    const ui = this.ui();
    const character = this.character();
    const creatures = this.creatures();
    const combat = this.combat();
    const places = this.places();
    const skills = this.skills();

    if (gear !== undefined) {
      path = GEAR_SLOT_ICONS[gear];
    } else if (symbol !== undefined) {
      path = SYMBOLS_ICONS[symbol];
    } else if (ui !== undefined) {
      path = UI_ICONS[ui];
    } else if (character !== undefined) {
      path = CHARACTERS_ICONS[character];
    } else if (creatures !== undefined) {
      path = CREATURES_ICONS[creatures];
    } else if (combat !== undefined) {
      path = COMBAT_ICONS[combat];
    } else if (places !== undefined) {
      path = PLACES_ICONS[places];
    } else if (skills !== undefined) {
      path = SKILLS_ICONS[skills];
    }

    return path;
  }
}
