import { BossService, StageService } from '../../../shared/services';

import { Component } from '@angular/core';

@Component({
  selector: 'app-viewport',
  imports: [],
  templateUrl: './viewport.html',
  styleUrl: './viewport.scss'
})
export class Viewport {
  constructor(
    protected stageService: StageService,
    protected bossService: BossService
  ) {}
}
