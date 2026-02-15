import { Component, input } from '@angular/core';

import { Separator } from '../separator/separator';

@Component({
  selector: 'app-panel-header',
  imports: [Separator],
  templateUrl: './panel-header.html',
  styleUrl: './panel-header.scss'
})
export class PanelHeader {
  readonly title = input.required<string>();
}
