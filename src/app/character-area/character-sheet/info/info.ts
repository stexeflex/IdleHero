import { Component } from '@angular/core';
import { PlayerService } from '../../../../shared/services';

@Component({
  selector: 'app-info',
  imports: [],
  templateUrl: './info.html',
  styleUrl: './info.scss'
})
export class Info {
  constructor(protected playerService: PlayerService) {}

  get SummaryStats(): { label: string; value: number }[] {
    return [
      { label: 'Attack Power', value: this.playerService.AttackPower() },
      { label: 'Unspent Skill Points', value: this.playerService.Level().UnspentSkillPoints }
    ];
  }
}
