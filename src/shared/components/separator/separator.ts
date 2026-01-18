import { Component, Input } from '@angular/core';

@Component({
  selector: 'separator',
  imports: [],
  template: `
    @if (vertical == true) {
      <div class="separator-vertical"></div>
    } @else {
      <hr class="separator" />
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
  @Input() vertical: boolean = false;
}
