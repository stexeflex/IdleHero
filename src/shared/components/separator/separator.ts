import { Component } from '@angular/core';

@Component({
  selector: 'separator',
  imports: [],
  template: `<hr class="separator" />`,
  styles: `
    @use 'index' as *;
    .separator {
      margin: $gap 0;
    }
  `
})
export class Separator {}
