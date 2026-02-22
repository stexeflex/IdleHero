import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {
  GetSkillMetaInfo,
  GetSkillUnlockCost,
  GetSkillUpgradeCost
} from '../../../../core/systems/skills';
import { Gold, IconComponent } from '../../../../shared/components';

import { SkillViewModel } from '../../../../core/services';

@Component({
  selector: 'app-skill-area',
  imports: [IconComponent, Gold],
  templateUrl: './skill-area.html',
  styleUrl: './skill-area.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillArea {
  readonly skill = input.required<SkillViewModel>();
  readonly unlockable = input.required<boolean>();

  readonly canUnlock = input.required<boolean>();
  readonly canLevel = input.required<boolean>();

  readonly unlockSkill = output<SkillViewModel>();
  readonly upgradeSkill = output<SkillViewModel>();

  protected get unlocked() {
    const skill = this.skill();
    return skill.IsUnlocked;
  }

  protected get isMaxed() {
    const skill = this.skill();
    return skill.Level >= skill.MaxLevel;
  }

  protected get MetaInfo(): string {
    const skill = this.skill();
    return GetSkillMetaInfo(skill.Definition);
  }

  protected get UnlockCost(): number {
    const skill = this.skill();
    return GetSkillUnlockCost(skill.Definition.Tier);
  }

  protected get UpgradeCost(): number {
    const skill = this.skill();
    return GetSkillUpgradeCost(skill.Definition.Tier, skill.Level);
  }
}
