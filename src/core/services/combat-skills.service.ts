import { BuffSkillDefinition, StatSource } from '../models';
import { Injectable, OnDestroy, computed, inject, signal } from '@angular/core';
import { IsBuffSkillDefinition, SkillDefinitionsById } from '../systems/skills';

import { SkillsService } from './skills.service';

interface CombatSkillRuntime {
  ActivatedAtMs: number;
  ActiveUntilMs: number;
  CooldownUntilMs: number;
  ActiveStatSource: StatSource | null;
}

type CombatSkillRuntimeState = Record<string, CombatSkillRuntime>;

export interface CombatSkillViewModel {
  Definition: BuffSkillDefinition;
  IsActive: boolean;
  CanActivate: boolean;
  RemainingDurationSeconds: number;
  RemainingCooldownSeconds: number;
}

@Injectable({ providedIn: 'root' })
export class CombatSkillsService implements OnDestroy {
  private readonly Skills = inject(SkillsService);

  private readonly RuntimeState = signal<CombatSkillRuntimeState>({});
  private readonly NowMilliseconds = signal<number>(Date.now());
  private readonly RevisionState = signal<number>(0);
  private CooldownTickerId: ReturnType<typeof setInterval> | null = null;

  private readonly ScheduledRevisionTimers = new Set<ReturnType<typeof setTimeout>>();

  public readonly StatusRevision = computed<number>(() => this.RevisionState());

  public ngOnDestroy(): void {
    this.StopCooldownTicker();
    this.ClearScheduledRevisionTimers();
  }

  public readonly SkillBarSkills = computed<CombatSkillViewModel[]>(() => {
    const runtimeState = this.RuntimeState();
    const nowMilliseconds = this.NowMilliseconds();

    return this.UnlockedBuffDefinitions().map((definition) => {
      const runtime = runtimeState[definition.Id];

      const isActive = !!runtime && nowMilliseconds < runtime.ActiveUntilMs;
      const isOnCooldown = !!runtime && nowMilliseconds < runtime.CooldownUntilMs;

      const remainingDurationSeconds = runtime
        ? Math.max(0, Math.ceil((runtime.ActiveUntilMs - nowMilliseconds) / 1000))
        : 0;

      const remainingCooldownSeconds = runtime
        ? Math.max(0, Math.ceil((runtime.CooldownUntilMs - nowMilliseconds) / 1000))
        : 0;

      return {
        Definition: definition,
        IsActive: isActive,
        CanActivate: !isOnCooldown,
        RemainingDurationSeconds: remainingDurationSeconds,
        RemainingCooldownSeconds: remainingCooldownSeconds
      };
    });
  });

  public readonly ActiveStatSources = computed<StatSource[]>(() => {
    const runtimeState = this.RuntimeState();

    const activeStatSources: StatSource[] = [];

    for (const definition of this.UnlockedBuffDefinitions()) {
      const runtime = runtimeState[definition.Id];

      if (!runtime || !runtime.ActiveStatSource) {
        continue;
      }

      activeStatSources.push(runtime.ActiveStatSource);
    }

    return activeStatSources;
  });

  /**
   * Attempts to activate a temporary skill.
   * @param skillId the skill definition id
   * @returns true when activation succeeded, otherwise false
   */
  public ActivateSkill(skillId: string): boolean {
    const definition: BuffSkillDefinition | null = this.GetUnlockedBuffsById(skillId);
    if (!definition) return false;

    const nowMilliseconds = Date.now();
    const previousRuntime = this.RuntimeState()[skillId];

    if (previousRuntime && nowMilliseconds < previousRuntime.CooldownUntilMs) {
      return false;
    }

    const activeDurationMilliseconds = definition.Duration * 1000;
    const cooldownMilliseconds = definition.Cooldown * 1000;

    const activeUntilMilliseconds = nowMilliseconds + activeDurationMilliseconds;
    const cooldownUntilMilliseconds = nowMilliseconds + cooldownMilliseconds;

    const activeStatSource = definition.MapToStatSource(`SKILL_${definition.Id}`);

    this.RuntimeState.update((state) => ({
      ...state,
      [skillId]: {
        ActivatedAtMs: nowMilliseconds,
        ActiveUntilMs: activeUntilMilliseconds,
        CooldownUntilMs: cooldownUntilMilliseconds,
        ActiveStatSource: activeStatSource
      }
    }));

    this.NowMilliseconds.set(nowMilliseconds);
    this.BumpRevision();
    this.StartCooldownTicker();
    this.ScheduleActiveEnd(skillId, activeUntilMilliseconds);
    this.ScheduleRevisionAt(activeUntilMilliseconds);

    return true;
  }

  /**
   * Clears all temporary combat skill runtime data.
   */
  public Reset(): void {
    this.RuntimeState.set({});
    this.NowMilliseconds.set(Date.now());
    this.StopCooldownTicker();
    this.ClearScheduledRevisionTimers();
    this.BumpRevision();
  }

  private UnlockedBuffDefinitions(): BuffSkillDefinition[] {
    const unlockedSkillIds = new Set(
      this.Skills.SkillTreeState()
        .SkillState.filter((skillState) => skillState.Level > 0)
        .map((skillState) => skillState.DefinitionId)
    );

    return this.Skills.SkillTree()
      .flatMap((tier) => tier.Skills)
      .map((skill) => skill.Definition)
      .filter((definition) => unlockedSkillIds.has(definition.Id))
      .filter((definition): definition is BuffSkillDefinition => IsBuffSkillDefinition(definition));
  }

  private GetUnlockedBuffsById(skillId: string): BuffSkillDefinition | null {
    const definition = SkillDefinitionsById.get(skillId);
    if (!definition || !IsBuffSkillDefinition(definition)) return null;

    const isUnlocked = this.Skills.SkillTreeState().SkillState.some(
      (stateSkill) => stateSkill.DefinitionId === skillId && stateSkill.Level > 0
    );

    if (!isUnlocked) {
      return null;
    }

    return definition;
  }

  private CleanupExpiredCooldowns(): void {
    const nowMilliseconds = this.NowMilliseconds();
    const runtimeState = this.RuntimeState();

    let hasChanges = false;
    const nextState: CombatSkillRuntimeState = {};

    for (const skillId of Object.keys(runtimeState)) {
      const runtime = runtimeState[skillId];
      if (runtime.CooldownUntilMs <= nowMilliseconds) {
        hasChanges = true;
        continue;
      }

      nextState[skillId] = runtime;
    }

    if (hasChanges) {
      this.RuntimeState.set(nextState);
      this.BumpRevision();
    }

    if (Object.keys(nextState).length === 0) {
      this.StopCooldownTicker();
    }
  }

  private ScheduleActiveEnd(skillId: string, timestampMilliseconds: number): void {
    const delayMilliseconds = Math.max(0, timestampMilliseconds - Date.now() + 10);

    const timerId = setTimeout(() => {
      this.ScheduledRevisionTimers.delete(timerId);
      this.NowMilliseconds.set(Date.now());
      this.RuntimeState.update((state) => {
        const runtime = state[skillId];
        if (!runtime || runtime.ActiveStatSource === null) {
          return state;
        }

        return {
          ...state,
          [skillId]: {
            ...runtime,
            ActiveStatSource: null
          }
        };
      });
      this.BumpRevision();
    }, delayMilliseconds);

    this.ScheduledRevisionTimers.add(timerId);
  }

  private ScheduleRevisionAt(timestampMilliseconds: number): void {
    const delayMilliseconds = Math.max(0, timestampMilliseconds - Date.now() + 10);

    const timerId = setTimeout(() => {
      this.ScheduledRevisionTimers.delete(timerId);
      this.NowMilliseconds.set(Date.now());
    }, delayMilliseconds);

    this.ScheduledRevisionTimers.add(timerId);
  }

  private StartCooldownTicker(): void {
    if (this.CooldownTickerId) return;

    this.CooldownTickerId = setInterval(() => {
      this.NowMilliseconds.set(Date.now());
      this.CleanupExpiredCooldowns();
    }, 200);
  }

  private StopCooldownTicker(): void {
    if (!this.CooldownTickerId) {
      return;
    }

    clearInterval(this.CooldownTickerId);
    this.CooldownTickerId = null;
  }

  private ClearScheduledRevisionTimers(): void {
    for (const timerId of this.ScheduledRevisionTimers) {
      clearTimeout(timerId);
    }

    this.ScheduledRevisionTimers.clear();
  }

  private BumpRevision(): void {
    this.RevisionState.update((revision) => revision + 1);
  }
}
