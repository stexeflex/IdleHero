import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Skill, SkillTier } from '../../../shared/models';

import { SkillArea } from './skill-area/skill-area';
import { SkillTierArea } from './skill-tier-area/skill-tier-area';
import { SkillsService } from '../../../shared/services';
import { SkillsSpecifications } from '../../../shared/specifications';

@Component({
  selector: 'app-skill-tree',
  imports: [SkillTierArea, SkillArea],
  templateUrl: './skill-tree.html',
  styleUrl: './skill-tree.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillTree {
  availableSkillPoints = input<number>(100);

  protected get SkillTree() {
    return this.skillsService.SkillTree();
  }

  constructor(
    private skillsService: SkillsService,
    private skillsSpecifications: SkillsSpecifications
  ) {}

  protected getTierState(tier: SkillTier) {
    const isUnlocked: boolean = this.skillsService.IsUnlocked(tier.Id);
    const canUnlock = !isUnlocked && this.skillsSpecifications.CanUnlockTier(tier.Id);

    return { isUnlocked, canUnlock };
  }

  protected getSkillState(skill: Skill) {
    const available: boolean = this.skillsSpecifications.SkillAvailable(skill.Id);
    const canUnlock: boolean = this.skillsSpecifications.CanUnlockSkill(skill.Id);
    const canLevel: boolean = this.skillsSpecifications.CanLevelSkill(skill.Id);

    return { available, canUnlock, canLevel };
  }

  protected unlockTier(tier: SkillTier) {
    if (!this.skillsSpecifications.CanUnlockTier(tier.Id)) {
      return;
    }

    this.skillsService.UnlockTier(tier.Id);
  }

  protected unlockSkill(skill: Skill) {
    if (!this.skillsSpecifications.CanUnlockSkill(skill.Id)) {
      return;
    }

    this.skillsService.UnlockSkill(skill.Id);
  }

  protected upgradeSkill(skill: Skill) {
    if (!this.skillsSpecifications.CanLevelSkill(skill.Id)) {
      return;
    }

    this.skillsService.UpgradeSkill(skill.Id);
  }
}
