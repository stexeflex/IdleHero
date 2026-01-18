import { Injectable } from '@angular/core';
import { LevelSpecifications } from './level.specifications';
import { SkillId } from '../models';
import { SkillsService } from '../services';
import { VendorSpecifications } from './vendor.specifications';

@Injectable({ providedIn: 'root' })
export class SkillsSpecifications {
  constructor(
    private levelSpecifications: LevelSpecifications,
    private vendorSpecifications: VendorSpecifications,
    private skillsService: SkillsService
  ) {}

  public CanUnlockTier(tierId: number): boolean {
    const tier = this.skillsService.GetTier(tierId);

    if (!tier) {
      return false;
    }

    const previousTier = this.skillsService.GetTier(tierId - 1);
    const previousTierUnlocked = previousTier
      ? this.skillsService.IsUnlocked(previousTier.Id)
      : true;

    const canUnlock =
      previousTierUnlocked &&
      this.levelSpecifications.HasRequiredLevel(tier.RequiredLevel) &&
      this.vendorSpecifications.CanBuy() &&
      this.vendorSpecifications.EnoughGold(tier.GoldCost);

    return canUnlock;
  }

  public SkillAvailable(skillId: SkillId): boolean {
    const tierUnlocked: boolean = this.skillsService.IsUnlocked(skillId.Tier);

    if (!tierUnlocked) {
      return false;
    }

    const skill = this.skillsService.GetSkill(skillId);

    if (!skill) {
      return false;
    }

    const dependenciesFulfilled: boolean = (skill.Dependencies ?? []).every(
      (dependencySkill) => this.skillsService.GetSkillLevel(dependencySkill) >= 1
    );

    return tierUnlocked && dependenciesFulfilled;
  }

  public CanUnlockSkill(skillId: SkillId): boolean {
    const skillAvailable = this.SkillAvailable(skillId);

    // Add enough skill points check when skill points are implemented
    const canUnlock = skillAvailable && this.vendorSpecifications.CanBuy();

    return canUnlock;
  }

  public CanLevelSkill(skillId: SkillId): boolean {
    const skill = this.skillsService.GetSkill(skillId);

    if (!skill) {
      return false;
    }

    const skillAvailable = this.SkillAvailable(skillId);
    const currentLevel = this.skillsService.GetSkillLevel(skillId);
    const skillUnlocked = currentLevel > 0;
    const isMaxed = currentLevel < skill.MaxLevel;

    // Add enough skill points check when skill points are implemented
    const canLevel =
      skillAvailable && skillUnlocked && isMaxed && this.vendorSpecifications.CanBuy();

    return canLevel;
  }
}
