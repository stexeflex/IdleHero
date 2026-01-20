import { Component, EventEmitter, Output, input } from '@angular/core';

import { IconComponent } from '../../../../shared/components';
import { Skill } from '../../../../shared/models';

@Component({
  selector: 'app-skill-area',
  imports: [IconComponent],
  templateUrl: './skill-area.html',
  styleUrl: './skill-area.scss'
})
export class SkillArea {
  readonly skill = input.required<Skill>();
  readonly unlockable = input.required<boolean>();

  readonly canUnlock = input.required<boolean>();
  readonly canLevel = input.required<boolean>();

  @Output() unlockSkill = new EventEmitter<Skill>();
  @Output() upgradeSkill = new EventEmitter<Skill>();

  protected get unlocked() {
    return this.skill().Level > 0;
  }

  protected get isMaxed() {
    return this.skill().Level >= this.skill().MaxLevel;
  }

  protected get hasDependencies(): boolean {
    return this.skill().Dependencies.length > 0;
  }

  protected get skillDependencies(): string {
    return this.skill().Dependencies.join(', ');
  }
}
