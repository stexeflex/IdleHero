import {
  CreateEmptySkillTreeState,
  InitialPassives,
  Passives,
  Skill,
  SkillDefinition,
  SkillTier,
  SkillTreeState,
  StatSource
} from '../models';
import {
  GetPreviousTier,
  GetSkillEffect,
  GetSkillMaxLevel,
  GetSkillUnlockCost,
  GetSkillUpgradeCost,
  GetTierMeta,
  SkillDefinitionsById,
  SkillDefinitionsByTier,
  TierOrder
} from '../systems/skills';
import { Injectable, LOCALE_ID, computed, inject, signal } from '@angular/core';
import { MapSkillToPassiveEffect, MapSkillToStatSources } from '../systems/stats';

import { GoldService } from './gold.service';
import { LevelService } from './level.service';

export interface SkillViewModel {
  Definition: SkillDefinition;
  Effect: string;
  NextEffect: string;
  Level: number;
  MaxLevel: number;
  IsUnlocked: boolean;
  CanUnlock: boolean;
  CanUpgrade: boolean;
}

export interface SkillTierViewModel {
  Tier: SkillTier;
  RequiredLevel: number;
  UnlockGoldCost: number;
  IsUnlocked: boolean;
  CanUnlock: boolean;
  Skills: SkillViewModel[];
}

@Injectable({ providedIn: 'root' })
export class SkillsService {
  private readonly Locale = inject(LOCALE_ID);
  private readonly Gold = inject(GoldService);
  private readonly Level = inject(LevelService);

  public readonly SkillTreeState = signal<SkillTreeState>(CreateEmptySkillTreeState());

  public readonly SkillTree = computed<SkillTierViewModel[]>(() => {
    const state = this.SkillTreeState();

    return TierOrder.map((tier) => {
      const tierMeta = GetTierMeta(tier);
      const isTierUnlocked = !!state.TierState[tier];

      return {
        Tier: tier,
        RequiredLevel: tierMeta.REQUIRED_LEVEL,
        UnlockGoldCost: tierMeta.GOLD_COST,
        IsUnlocked: isTierUnlocked,
        CanUnlock: this.CanUnlockTier(tier),
        Skills: SkillDefinitionsByTier[tier].map((definition) => {
          const level = this.GetSkillLevel(definition.Id);
          const maxLevel = GetSkillMaxLevel(definition.Id);
          const effect = GetSkillEffect(definition.Id, level, this.Locale);
          const nextEffect = GetSkillEffect(definition.Id, level + 1, this.Locale);

          return {
            Definition: definition,
            Level: level,
            MaxLevel: maxLevel,
            Effect: effect,
            NextEffect: nextEffect,
            IsUnlocked: level > 0,
            CanUnlock: this.CanUnlockSkill(definition.Id),
            CanUpgrade: this.CanUpgradeSkill(definition.Id)
          };
        })
      };
    });
  });

  /**
   * Returns the complete skill tree state.
   * @returns a copy of the current skill tree state
   */
  public GetState(): SkillTreeState {
    const state = this.SkillTreeState();
    return {
      TierState: { ...state.TierState },
      SkillState: state.SkillState.map((skill) => ({ ...skill }))
    };
  }

  /**
   * Replaces the current skill tree state.
   * @param state the new skill tree state
   */
  public SetState(state: SkillTreeState): void {
    this.SkillTreeState.set({
      TierState: { ...state.TierState },
      SkillState: state.SkillState.map((skill) => ({ ...skill }))
    });
  }

  /**
   * Returns all stat sources provided by unlocked skills.
   */
  public readonly StatSources = computed<StatSource[]>(() =>
    this.SkillTreeState().SkillState.flatMap((skill) => MapSkillToStatSources(skill))
  );

  /**
   * Returns the combined passive effects provided by unlocked skills.
   */
  public readonly Passives = computed<Passives>(() => {
    const state = this.SkillTreeState();
    const passives = InitialPassives();
    state.SkillState.flatMap((skill) => MapSkillToPassiveEffect(skill, passives));
    return passives;
  });

  /**
   * Returns whether a tier has already been unlocked.
   * @param tier the skill tier
   * @returns true if the tier is unlocked, otherwise false
   */
  public IsTierUnlocked(tier: SkillTier): boolean {
    return !!this.SkillTreeState().TierState[tier];
  }

  /**
   * Returns the current level for a specific skill.
   * @param skillId the skill definition identifier
   * @returns the current skill level, or 0 when locked
   */
  public GetSkillLevel(skillId: string): number {
    const skill = this.FindSkill(skillId);
    return skill?.Level ?? 0;
  }

  /**
   * Returns whether a skill has reached its maximum level.
   * @param skillId the skill definition identifier
   * @returns true if skill level is at max level, otherwise false
   */
  public IsSkillMaxLevel(skillId: string): boolean {
    const currentLevel = this.GetSkillLevel(skillId);
    const maxLevel = GetSkillMaxLevel(skillId);
    return maxLevel > 0 && currentLevel >= maxLevel;
  }

  /**
   * Returns whether the player can unlock a given skill tier.
   * @param tier the skill tier
   * @returns true when requirements and costs are fulfilled
   */
  public CanUnlockTier(tier: SkillTier): boolean {
    if (this.IsTierUnlocked(tier)) return false;

    const tierMeta = GetTierMeta(tier);
    if (this.Level.Level() < tierMeta.REQUIRED_LEVEL) return false;

    const previousTier = GetPreviousTier(tier);
    if (previousTier && !this.IsTierUnlocked(previousTier)) return false;

    return this.Gold.CanAfford(tierMeta.GOLD_COST);
  }

  /**
   * Returns whether the player can unlock a specific skill.
   * @param skillId the skill definition identifier
   * @returns true when tier is unlocked, skill is locked, and cost is affordable
   */
  public CanUnlockSkill(skillId: string): boolean {
    const definition = SkillDefinitionsById.get(skillId);
    if (!definition) return false;
    if (!this.IsTierUnlocked(definition.Tier)) return false;
    if (this.GetSkillLevel(skillId) > 0) return false;

    const unlockCost = GetSkillUnlockCost(definition.Tier);
    return this.Gold.CanAfford(unlockCost);
  }

  /**
   * Returns whether the player can upgrade a specific skill by one level.
   * @param skillId the skill definition identifier
   * @returns true if upgrade is possible and affordable
   */
  public CanUpgradeSkill(skillId: string): boolean {
    const definition = SkillDefinitionsById.get(skillId);
    if (!definition) return false;
    if (!this.IsTierUnlocked(definition.Tier)) return false;

    const currentLevel = this.GetSkillLevel(skillId);
    if (currentLevel <= 0) return false;
    if (currentLevel >= GetSkillMaxLevel(skillId)) return false;

    const upgradeCost = this.GetSkillUpgradeCost(skillId);
    if (upgradeCost === null) return false;

    return this.Gold.CanAfford(upgradeCost);
  }

  /**
   * Attempts to unlock a skill tier by paying the configured cost.
   * @param tier the skill tier
   * @returns true when tier unlock was successful, otherwise false
   */
  public UnlockTier(tier: SkillTier): boolean {
    if (!this.CanUnlockTier(tier)) return false;

    const tierMeta = GetTierMeta(tier);
    const wasSpent = this.Gold.Spend(tierMeta.GOLD_COST);
    if (!wasSpent) return false;

    this.SkillTreeState.update((state) => ({
      TierState: { ...state.TierState, [tier]: true },
      SkillState: state.SkillState
    }));

    return true;
  }

  /**
   * Attempts to unlock a skill at level 1 by paying the unlock cost.
   * @param skillId the skill definition identifier
   * @returns true when skill unlock was successful, otherwise false
   */
  public UnlockSkill(skillId: string): boolean {
    if (!this.CanUnlockSkill(skillId)) return false;

    const definition = SkillDefinitionsById.get(skillId)!;
    const unlockCost = GetSkillUnlockCost(definition.Tier);
    const wasSpent = this.Gold.Spend(unlockCost);
    if (!wasSpent) return false;

    this.SkillTreeState.update((state) => ({
      TierState: state.TierState,
      SkillState: [...state.SkillState, { DefinitionId: skillId, Level: 1 }]
    }));

    return true;
  }

  /**
   * Attempts to upgrade a skill by one level by paying the next-level cost.
   * @param skillId the skill definition identifier
   * @returns true when upgrade was successful, otherwise false
   */
  public UpgradeSkill(skillId: string): boolean {
    if (!this.CanUpgradeSkill(skillId)) return false;

    const cost = this.GetSkillUpgradeCost(skillId);
    if (cost === null) return false;

    const wasSpent = this.Gold.Spend(cost);
    if (!wasSpent) return false;

    this.SkillTreeState.update((state) => ({
      TierState: state.TierState,
      SkillState: state.SkillState.map((stateSkill) => {
        if (stateSkill.DefinitionId !== skillId) return stateSkill;
        return {
          ...stateSkill,
          Level: stateSkill.Level + 1
        };
      })
    }));

    return true;
  }

  /**
   * Returns the unlock cost for a skill.
   * @param skillId the skill definition identifier
   * @returns the unlock cost, or null when the skill does not exist
   */
  public GetSkillUnlockCost(skillId: string): number | null {
    const definition = SkillDefinitionsById.get(skillId);
    if (!definition) return null;
    return GetSkillUnlockCost(definition.Tier);
  }

  /**
   * Returns the next-level upgrade cost for a skill.
   * @param skillId the skill definition identifier
   * @returns upgrade cost for the next level, or null when no upgrade is possible
   */
  public GetSkillUpgradeCost(skillId: string): number | null {
    const definition = SkillDefinitionsById.get(skillId);
    if (!definition) return null;

    const currentLevel = this.GetSkillLevel(skillId);
    const maxLevel = GetSkillMaxLevel(skillId);
    if (currentLevel <= 0 || currentLevel >= maxLevel) return null;

    return GetSkillUpgradeCost(definition.Tier, currentLevel);
  }

  /**
   * Returns all skill definitions of a specific tier.
   * @param tier the skill tier
   * @returns all skill definitions assigned to the tier
   */
  public GetTierSkills(tier: SkillTier): SkillDefinition[] {
    return [...SkillDefinitionsByTier[tier]];
  }

  /**
   * Resets all tier and skill progress.
   */
  public Reset(): void {
    this.SkillTreeState.set(CreateEmptySkillTreeState());
  }

  private FindSkill(skillId: string): Skill | undefined {
    return this.SkillTreeState().SkillState.find(
      (stateSkill) => stateSkill.DefinitionId === skillId
    );
  }
}
