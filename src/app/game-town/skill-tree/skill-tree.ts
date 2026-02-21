import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkillTierViewModel, SkillViewModel, SkillsService } from '../../../core/services';

import { Separator } from '../../../shared/components';
import { SkillArea } from './skill-area/skill-area';
import { SkillTierArea } from './skill-tier-area/skill-tier-area';

@Component({
  selector: 'app-skill-tree',
  imports: [SkillTierArea, SkillArea, Separator],
  templateUrl: './skill-tree.html',
  styleUrl: './skill-tree.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillTree {
  private readonly SkillsService = inject(SkillsService);

  protected readonly SkillTreeState = this.SkillsService.SkillTree;

  protected UnlockTier(tier: SkillTierViewModel): void {
    this.SkillsService.UnlockTier(tier.Tier);
  }

  protected UnlockSkill(skill: SkillViewModel): void {
    this.SkillsService.UnlockSkill(skill.Definition.Id);
  }

  protected UpgradeSkill(skill: SkillViewModel): void {
    this.SkillsService.UpgradeSkill(skill.Definition.Id);
  }
}
