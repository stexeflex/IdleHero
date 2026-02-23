import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { IconComponent, Separator } from '../../../../shared/components';

import { CombatSkillsService } from '../../../../core/services';
import { GetSkillMetaInfo } from '../../../../core/systems/skills';
import { SkillDefinition } from '../../../../core/models';

@Component({
  selector: 'app-skill-bar',
  imports: [IconComponent, Separator],
  templateUrl: './skill-bar.html',
  styleUrl: './skill-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillBar {
  private readonly CombatSkills = inject(CombatSkillsService);

  protected readonly Buffs = computed(() => this.CombatSkills.SkillBarSkills());

  protected ActivateSkill(skillId: string): void {
    this.CombatSkills.ActivateSkill(skillId);
  }

  protected SkillTypeText(definition: SkillDefinition): string {
    return GetSkillMetaInfo(definition);
  }

  protected IconClass(definition: SkillDefinition): string {
    switch (definition.Id) {
      case 'BUFF_ATTACK_SPEED':
        return 'skill-icon-haste';
      case 'BUFF_BLEED_CHANCE':
        return 'skill-icon-bleed';
      case 'BUFF_CRIT_CHANCE':
        return 'skill-icon-crit';
      case 'BUFF_MULTI_HIT_CHANCE':
        return 'skill-icon-multi';
      default:
        return '';
    }
  }
}
