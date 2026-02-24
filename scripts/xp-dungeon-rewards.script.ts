#!/usr/bin/env ts-node

// npm run xp:sim

import { NORMAL_DUNGEONS } from '../src/core/constants/dungeons/dungeons.config';
import { REWARDS_CONFIG } from '../src/core/constants/dungeons/rewards.config';

interface DungeonStageRewardRow {
  Stage: number;
  Rewards: Record<string, number | null>;
  RewardSums: Record<string, number | null>;
}

function FormatNumber(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function ComputeExperienceRewardForStage(dungeonId: string, stage: number): number | null {
  const dungeon = NORMAL_DUNGEONS.find((item) => item.Id === dungeonId);

  if (!dungeon) {
    return null;
  }

  if (stage < dungeon.StagesBase || stage > dungeon.StagesMax) {
    return null;
  }

  const stageFactor = 1 + REWARDS_CONFIG.STAGE_LINEAR_FACTOR * (Math.max(1, Math.floor(stage)) - 1);
  const baseExperienceReward = Math.round(dungeon.Rewards.XpBase * stageFactor);

  if (stage === dungeon.StagesMax) {
    return Math.round(baseExperienceReward * REWARDS_CONFIG.EXPERIENCE.COMPLETION_MULTIPLIER);
  }

  if (dungeon.MidStages.includes(stage)) {
    return Math.round(baseExperienceReward * REWARDS_CONFIG.EXPERIENCE.MID_BOSS_MULTIPLIER);
  }

  return baseExperienceReward;
}

function BuildRows(maxStage: number): DungeonStageRewardRow[] {
  const dungeonIds = NORMAL_DUNGEONS.map((dungeon) => dungeon.Id);
  const cumulativeSums = dungeonIds.reduce<Record<string, number>>((carry, dungeonId) => {
    carry[dungeonId] = 0;
    return carry;
  }, {});

  const rows: DungeonStageRewardRow[] = [];

  for (let stage = 1; stage <= maxStage; stage++) {
    const rewards: Record<string, number | null> = {};
    const rewardSums: Record<string, number | null> = {};

    for (const dungeonId of dungeonIds) {
      const reward = ComputeExperienceRewardForStage(dungeonId, stage);
      rewards[dungeonId] = reward;

      if (reward === null) {
        rewardSums[dungeonId] = null;
        continue;
      }

      cumulativeSums[dungeonId] += reward;
      rewardSums[dungeonId] = cumulativeSums[dungeonId];
    }

    rows.push({
      Stage: stage,
      Rewards: rewards,
      RewardSums: rewardSums
    });
  }

  return rows;
}

function BuildHeader(dungeonIds: string[]): string[] {
  const headerColumns = ['Stage'];

  for (const dungeonId of dungeonIds) {
    headerColumns.push(dungeonId);
    headerColumns.push(`${dungeonId} Sum`);
  }

  return headerColumns;
}

function BuildBody(rows: DungeonStageRewardRow[], dungeonIds: string[]): string[][] {
  return rows.map((row) => {
    const columns = [String(row.Stage)];

    for (const dungeonId of dungeonIds) {
      const reward = row.Rewards[dungeonId];
      const rewardSum = row.RewardSums[dungeonId];

      columns.push(reward === null ? '' : FormatNumber(reward));
      columns.push(rewardSum === null ? '' : FormatNumber(rewardSum));
    }

    return columns;
  });
}

function ComputeColumnWidths(header: string[], body: string[][]): number[] {
  return header.map((headerColumn, index) => {
    let maxLength = headerColumn.length;

    for (const row of body) {
      const valueLength = row[index]?.length ?? 0;
      if (valueLength > maxLength) {
        maxLength = valueLength;
      }
    }

    return maxLength;
  });
}

function PadRight(value: string, width: number): string {
  return value.padEnd(width, ' ');
}

function PadLeft(value: string, width: number): string {
  return value.padStart(width, ' ');
}

function PrintTable(rows: DungeonStageRewardRow[]): void {
  const dungeonIds = NORMAL_DUNGEONS.map((dungeon) => dungeon.Id);
  const header = BuildHeader(dungeonIds);
  const body = BuildBody(rows, dungeonIds);
  const widths = ComputeColumnWidths(header, body);

  const headerLine = header
    .map((headerValue, index) => PadRight(headerValue, widths[index]))
    .join(' | ');

  const separatorLine = widths.map((width) => '-'.repeat(width)).join('-|-');

  console.log(headerLine);
  console.log(separatorLine);

  for (const row of body) {
    const line = row
      .map((value, index) => {
        if (index === 0) {
          return PadLeft(value, widths[index]);
        }

        return PadLeft(value, widths[index]);
      })
      .join(' | ');

    console.log(line);
  }
}

function Run(): void {
  const maxStage = 100;
  const rows = BuildRows(maxStage);
  PrintTable(rows);
}

Run();
