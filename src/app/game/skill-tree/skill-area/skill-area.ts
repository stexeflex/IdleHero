import { Component, EventEmitter, Input, Output } from '@angular/core';

import { IconComponent } from '../../../../shared/components';
import { Skill } from '../../../../shared/models';

@Component({
  selector: 'app-skill-area',
  imports: [IconComponent],
  templateUrl: './skill-area.html',
  styleUrl: './skill-area.scss'
})
export class SkillArea {
  @Input({ required: true }) skill!: Skill;
  @Input({ required: true }) unlockable!: boolean;

  @Input({ required: true }) canUnlock!: boolean;
  @Input({ required: true }) canLevel!: boolean;

  @Output() unlockSkill = new EventEmitter<Skill>();
  @Output() upgradeSkill = new EventEmitter<Skill>();

  protected get unlocked() {
    return this.skill.Level > 0;
  }

  protected get isMaxed() {
    return this.skill.Level >= this.skill.MaxLevel;
  }

  protected get hasDependencies(): boolean {
    return this.skill.Dependencies.length > 0;
  }

  protected get skillDependencies(): string {
    return this.skill.Dependencies.join(', ');
  }
}
