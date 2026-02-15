import { Component, input } from '@angular/core';

@Component({
  selector: 'separator',
  imports: [],
  template: `
    @if (vertical() == true) {
      <div class="separator-vertical"></div>
    } @else {
      <hr [class.separator]="margin()" />
    }
  `,
  styles: `
    @use 'index' as *;
    .separator {
      margin: $gap 0;
    }
    .separator-vertical {
      border-left: 2px solid $clr-border;
      height: 40px;
    }
  `
})
export class Separator {
  readonly vertical = input<boolean>(false);
  readonly margin = input<boolean>(true);
}
