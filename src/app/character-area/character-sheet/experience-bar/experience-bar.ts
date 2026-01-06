import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-experience-bar',
  imports: [],
  templateUrl: './experience-bar.html',
  styleUrl: './experience-bar.scss'
})
export class ExperienceBar {
  @Input() currentLevel: number = 0;
  @Input() currentExp: number = 0;
  @Input() expToNextLevel: number = 0;

  get progress(): number {
    return Math.min(100, (this.currentExp / this.expToNextLevel) * 100);
  }
}
