import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Gold, IconComponent, Level } from '../../../../shared/components';

import { SkillTierViewModel } from '../../../../core/services';

@Component({
  selector: 'app-skill-tier-area',
  imports: [IconComponent, Gold, Level],
  templateUrl: './skill-tier-area.html',
  styleUrl: './skill-tier-area.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillTierArea {
  readonly tier = input.required<SkillTierViewModel>();
  readonly isUnlocked = input.required<boolean>();
  readonly canUnlock = input.required<boolean>();

  readonly unlockTier = output<SkillTierViewModel>();

  protected get isMaxed() {
    return (
      this.isUnlocked() &&
      this.tier().Skills.every((skill) => skill.IsUnlocked && skill.Level >= skill.MaxLevel)
    );
  }
}
