#!/usr/bin/env ts-node

// npm run exp:sim
// npm run exp:sim -- --dungeon D1
// npm run exp:sim -- --dungeon D1 --targetLevel 50
// npm run exp:sim -- --dungeon D1 --targetLevel 10 --maxKills 50000
// npm run exp:sim -- --dungeon D1 --startLevel 10 --targetLevel 20
// npm run exp:sim -- --dungeon D1 --noPrestige
//
// Notes
// - Simulates boss kills stage-by-stage.
// - Grants stage XP, mid-boss XP (multiplier), and completion XP (multiplier).
// - Can optionally "prestige" after each full run to record highest stage reached,
//   which activates experience damping below mid-stages.

import { CAPSTONE_DUNGEONS, NORMAL_DUNGEONS } from '../src/core/constants/dungeons.config';
import {
  CompletionFactor,
  ComputeProgressFromTotalXP,
  MidBossFactor,
  XpToNextLevel
} from '../src/core/systems/progression';
import {
  DungeonRoom,
  DungeonStatistics,
  DungeonType,
  InitialDungeonStatistics
} from '../src/core/models';

import { ComputeDampedExperience } from '../src/core/systems/progression/rewards-scaling.utils';
import { LEVELING_CONFIG } from '../src/core/constants/leveling.config';

interface ParsedArgs {
  DungeonId: string;
  StartLevel: number;
  StartExperienceInLevel: number;
  TargetLevel: number;
  MaxKills: number;
  PrestigeEachRun: boolean;
  PrintLevelTable: boolean;
}

function ParseBooleanFlag(args: string[], name: string): boolean {
  return args.includes(name);
}

function ParseNumberFlag(args: string[], name: string, fallback: number): number {
  const index = args.findIndex((a) => a === name);
  if (index < 0) return fallback;

  const value = args[index + 1];
  const parsed = value ? Number(value) : NaN;
  return Number.isFinite(parsed) ? parsed : fallback;
}

function ParseStringFlag(args: string[], name: string, fallback: string): string {
  const index = args.findIndex((a) => a === name);
  if (index < 0) return fallback;

  const value = args[index + 1];
  if (!value || value.startsWith('-')) return fallback;
  return value;
}

function ParseArgs(): ParsedArgs {
  const args = process.argv.slice(2);

  const dungeonId = ParseStringFlag(args, '--dungeon', ParseStringFlag(args, '-d', 'D1')) ?? 'D1';

  const startLevel = ParseNumberFlag(args, '--startLevel', 1);
  const startExperienceInLevel = ParseNumberFlag(args, '--startExp', 0);
  const targetLevel = ParseNumberFlag(args, '--targetLevel', LEVELING_CONFIG.LEVEL_CAP);
  const maxKills = ParseNumberFlag(args, '--maxKills', 250_000);

  const prestigeEachRun = !ParseBooleanFlag(args, '--noPrestige');
  const printLevelTable = !ParseBooleanFlag(args, '--quiet');

  return {
    DungeonId: String(dungeonId),
    StartLevel: Math.max(1, Math.floor(startLevel)),
    StartExperienceInLevel: Math.max(0, Math.floor(startExperienceInLevel)),
    TargetLevel: Math.max(1, Math.floor(targetLevel)),
    MaxKills: Math.max(1, Math.floor(maxKills)),
    PrestigeEachRun: prestigeEachRun,
    PrintLevelTable: printLevelTable
  };
}

function GetDungeonById(dungeonId: string): DungeonRoom | null {
  return [...NORMAL_DUNGEONS, ...CAPSTONE_DUNGEONS].find((d) => d.Id === dungeonId) ?? null;
}

function SetHighestStageReached(
  statistics: DungeonStatistics,
  dungeon: DungeonRoom,
  highestStageReached: number
): DungeonStatistics {
  const clampedHighestStage = Math.max(0, Math.floor(highestStageReached));

  if (dungeon.Type === DungeonType.Capstone) {
    const current = statistics.Capstone[dungeon.Id] ?? 0;
    if (clampedHighestStage <= current) return statistics;

    return {
      ...statistics,
      Capstone: {
        ...statistics.Capstone,
        [dungeon.Id]: clampedHighestStage
      }
    };
  }

  const current = statistics.Dungeon[dungeon.Id] ?? 0;
  if (clampedHighestStage <= current) return statistics;

  return {
    ...statistics,
    Dungeon: {
      ...statistics.Dungeon,
      [dungeon.Id]: clampedHighestStage
    }
  };
}

function IsMidBossStage(dungeon: DungeonRoom, stage: number): boolean {
  return dungeon.MidStages.includes(stage);
}

function GetExperienceForKill(
  dungeon: DungeonRoom,
  stage: number,
  statistics: DungeonStatistics
): number {
  const base = ComputeDampedExperience(dungeon, stage, statistics);

  if (stage >= dungeon.StagesMax) {
    return Math.max(0, Math.round(base * CompletionFactor('EXPERIENCE')));
  }

  if (IsMidBossStage(dungeon, stage)) {
    return Math.max(0, Math.round(base * MidBossFactor('EXPERIENCE')));
  }

  return Math.max(0, base);
}

function ComputeTotalExperienceForLevel(level: number): number {
  const clamped = Math.max(1, Math.floor(level));
  let total = 0;
  for (let l = 1; l < clamped; l++) {
    total += XpToNextLevel(l);
  }
  return total;
}

function numberWithSeparator(x: number): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function PrintHeader(dungeon: DungeonRoom, args: ParsedArgs): void {
  console.log(
    `\n==================================== EXP Simulation (${dungeon.Id}) ====================================`
  );
  console.log(`Dungeon: ${dungeon.Title}`);
  console.log(
    `XpBase: ${dungeon.XpBase}, StagesMax: ${dungeon.StagesMax}, MidStages: [${dungeon.MidStages.join(', ')}]`
  );
  console.log(
    `Level curve: BASE_XP_TO_NEXT=${LEVELING_CONFIG.BASE_XP_TO_NEXT}, TOTAL_XP_EXPONENT=${LEVELING_CONFIG.TOTAL_XP_EXPONENT}`
  );
  console.log(
    `Run: startLevel=${args.StartLevel}, startExp=${args.StartExperienceInLevel}, targetLevel=${args.TargetLevel}, maxKills=${args.MaxKills}, prestigeEachRun=${args.PrestigeEachRun}`
  );
  console.log(
    '--------------------------------------------------------------------------------------------'
  );
}

function GetLogSeparator(s: string): string {
  return s.length >= 8 ? '\t' : '\t\t';
}

function PrintLevelLine(
  fromLevel: number,
  toLevel: number,
  xpToNext: number,
  killsForThisLevel: number,
  experienceGainedForThisLevel: number,
  totalKills: number
): void {
  const average = killsForThisLevel > 0 ? experienceGainedForThisLevel / killsForThisLevel : 0;
  const xpForLevel = numberWithSeparator(xpToNext).padStart(6, ' ');
  const killsForLevel = numberWithSeparator(killsForThisLevel).padStart(6, ' ');
  const averageString = average.toFixed(2).padStart(6, ' ');
  const kills = numberWithSeparator(totalKills).padStart(7, ' ');

  console.log(
    `L${fromLevel}->${toLevel}\t\t` +
      `XP: ${xpForLevel}${GetLogSeparator('XP: ' + xpForLevel)}` +
      `Kills: ${killsForLevel}${GetLogSeparator('Kills: ' + killsForLevel)}` +
      `AvgXP/Kill: ${averageString}${GetLogSeparator('AvgXP/Kill: ' + averageString)}` +
      `TotalKills: ${kills}`
  );
}

function Run(): void {
  const args = ParseArgs();
  const dungeon = GetDungeonById(args.DungeonId);

  if (!dungeon) {
    console.log(`Dungeon not found: ${args.DungeonId}`);
    process.exitCode = 1;
    return;
  }

  PrintHeader(dungeon, args);

  let statistics: DungeonStatistics = InitialDungeonStatistics();

  const startLevelTotalExperience = ComputeTotalExperienceForLevel(args.StartLevel);
  let totalExperience = startLevelTotalExperience + args.StartExperienceInLevel;

  let progress = ComputeProgressFromTotalXP(totalExperience);
  let currentLevel = progress.Level;

  const killsAtLevel: Record<number, number> = {};
  killsAtLevel[currentLevel] = 0;

  let stage = 1;
  let totalKills = 0;

  let levelStartKills = 0;
  let levelStartTotalExperience = totalExperience;

  while (currentLevel < args.TargetLevel && totalKills < args.MaxKills) {
    const experienceGained = GetExperienceForKill(dungeon, stage, statistics);
    totalExperience += experienceGained;
    totalKills += 1;

    const newProgress = ComputeProgressFromTotalXP(totalExperience);

    if (newProgress.Level > currentLevel) {
      // Print one line per level gained. If multiple levels are gained in one kill,
      // subsequent levels may show 0 kills for that level; that is expected.
      for (let level = currentLevel; level < newProgress.Level; level++) {
        const xpToNext = XpToNextLevel(level);
        const killsForThisLevel = totalKills - levelStartKills;
        const experienceGainedForThisLevel = totalExperience - levelStartTotalExperience;

        if (args.PrintLevelTable) {
          PrintLevelLine(
            level,
            level + 1,
            xpToNext,
            killsForThisLevel,
            experienceGainedForThisLevel,
            totalKills
          );
        }

        killsAtLevel[level + 1] = totalKills;
        levelStartKills = totalKills;
        levelStartTotalExperience = totalExperience;
      }

      currentLevel = newProgress.Level;
    }

    // Advance stage: stage 1..StagesMax-1 grant stage/mid rewards; stage==StagesMax grants completion.
    if (stage < dungeon.StagesMax) {
      stage += 1;
    } else {
      // End of a dungeon run; optionally "prestige" to record highest stage reached.
      if (args.PrestigeEachRun) {
        statistics = SetHighestStageReached(statistics, dungeon, dungeon.StagesMax);
      }
      stage = 1;
    }
  }

  console.log(
    '--------------------------------------------------------------------------------------------'
  );
  console.log(
    `Result: Level ${currentLevel}, TotalKills: ${totalKills}, TotalXP: ${Math.floor(totalExperience)}`
  );

  const l2 = killsAtLevel[2];
  if (l2 !== undefined) {
    console.log(`Kills for L1->2: ${l2}`);
  }

  const l10 = killsAtLevel[10];
  const l11 = killsAtLevel[11];
  if (l10 !== undefined && l11 !== undefined) {
    console.log(`Kills for L10->11: ${l11 - l10}`);
  }

  if (totalKills >= args.MaxKills && currentLevel < args.TargetLevel) {
    console.log(
      `Stopped at maxKills (${args.MaxKills}) before reaching targetLevel (${args.TargetLevel}). Increase --maxKills to continue.`
    );
  }
}

Run();
