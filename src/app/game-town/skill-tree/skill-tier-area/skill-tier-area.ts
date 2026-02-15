import { Component, input, output } from '@angular/core';
import { Gold, IconComponent } from '../../../../shared/components';

import { SkillTier } from '../../../../shared/models';

@Component({
  selector: 'app-skill-tier-area',
  imports: [IconComponent, Gold],
  templateUrl: './skill-tier-area.html',
  styleUrl: './skill-tier-area.scss'
})
export class SkillTierArea {
  readonly tier = input.required<SkillTier>();
  readonly isUnlocked = input.required<boolean>();
  readonly canUnlock = input.required<boolean>();

  readonly unlockTier = output<SkillTier>();
}
