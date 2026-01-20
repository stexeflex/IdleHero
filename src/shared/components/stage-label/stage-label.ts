import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stage-label',
  imports: [],
  templateUrl: './stage-label.html',
  styleUrl: './stage-label.scss'
})
export class StageLabel {
  readonly stageNumber = input<number | null>(null);
}
