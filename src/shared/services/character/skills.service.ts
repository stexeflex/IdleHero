import { Injectable, Signal, computed, signal } from '@angular/core';
import { SKILL_TIERS, Skill, SkillId, SkillTier, SkillTreeState } from '../../models';

import { SkillSchema } from '../../../persistence';

@Injectable({ providedIn: 'root' })
export class SkillsService {
  private _skillTree = signal<SkillTier[]>(SKILL_TIERS);

  public SkillTree: Signal<SkillTier[]> = computed(() => {
    const skillTree: SkillTier[] = this._skillTree();
    const skillTreeState = this.SkillTreeState();

    for (const tier of skillTree) {
      for (const skill of tier.Skills) {
        skill.Level = skillTreeState.SkillState[skill.Id.toString()] ?? 0;
      }
    }

    return skillTree;
  });

  public SkillTreeState = signal<SkillTreeState>({ TierState: {}, SkillState: {} });

  constructor() {}

  public Init(skillSchema: SkillSchema): void {
    this.SkillTreeState.set(skillSchema.SkillTreeState);
  }

  public CollectSchema(schema: SkillSchema): SkillSchema {
    schema.SkillTreeState = this.SkillTreeState();
    return schema;
  }

  public GetTier(tierId: number): SkillTier | undefined {
    return this.SkillTree().find((tier) => tier.Id === tierId);
  }

  public GetSkill(skillId: SkillId): Skill | undefined {
    const tier = this.GetTier(skillId.Tier);

    if (tier) {
      return tier.Skills.find((skill) => skill.Id.Skill === skillId.Skill);
    } else {
      return undefined;
    }
  }

  public IsUnlocked(tierId: number): boolean {
    return !!this.SkillTreeState().TierState[tierId];
  }

  public GetSkillLevel(skillId: SkillId): number {
    return this.SkillTreeState().SkillState[skillId.toString()] ?? 0;
  }

  public UnlockTier(tierId: number): void {
    this.SkillTreeState.update((state) => ({
      TierState: { ...state.TierState, [tierId]: true },
      SkillState: state.SkillState
    }));
  }

  public UnlockSkill(skillId: SkillId): void {
    this.SkillTreeState.update((state) => ({
      TierState: state.TierState,
      SkillState: { ...state.SkillState, [skillId.toString()]: 1 }
    }));
  }

  public UpgradeSkill(skillId: SkillId): void {
    const currentLevel = this.SkillTreeState().SkillState[skillId.toString()] ?? 0;

    this.SkillTreeState.update((state) => ({
      TierState: state.TierState,
      SkillState: { ...state.SkillState, [skillId.toString()]: currentLevel + 1 }
    }));
  }
}
