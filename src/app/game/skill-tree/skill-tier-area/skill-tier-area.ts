import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Gold, IconComponent } from '../../../../shared/components';

import { SkillTier } from '../../../../shared/models';

@Component({
  selector: 'app-skill-tier-area',
  imports: [IconComponent, Gold],
  templateUrl: './skill-tier-area.html',
  styleUrl: './skill-tier-area.scss'
})
export class SkillTierArea {
  @Input({ required: true }) tier!: SkillTier;
  @Input({ required: true }) isUnlocked!: boolean;
  @Input({ required: true }) canUnlock!: boolean;

  @Output() unlockTier = new EventEmitter<SkillTier>();
}
