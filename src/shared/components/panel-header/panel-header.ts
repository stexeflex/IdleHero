import { Component, Input } from '@angular/core';

import { Separator } from '../separator/separator';

@Component({
  selector: 'app-panel-header',
  imports: [Separator],
  templateUrl: './panel-header.html',
  styleUrl: './panel-header.scss'
})
export class PanelHeader {
  @Input({ required: true }) title: string = '';
}
