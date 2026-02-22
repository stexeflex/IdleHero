#!/usr/bin/env ts-node

// npm run boss:hp-table
// npm run boss:hp-table -- --dungeon D1
// npm run boss:hp-table -- --dungeon D1 --dps 10

import { CAPSTONE_DUNGEONS, NORMAL_DUNGEONS } from '../src/core/constants/dungeons/dungeons.config';

import { DUNGEON_BOSS_SCALING } from '../src/core/constants/dungeons/dungeon-boss.config';
import { GetHealthForBossAtStage } from '../src/core/systems/combat/dungeons/boss-health.utils';

interface DungeonDefinition {
  Id: string;
  MidStages: number[];
  StagesMax: number;
}

function numberWithSeparator(x: number): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function FormatDuration(totalSeconds: number): string {
  const clampedSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(clampedSeconds / 3600);
  const minutes = Math.floor((clampedSeconds % 3600) / 60);
  const seconds = clampedSeconds % 60;
  const hh = hours.toString().padStart(2, '0');
  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

function GetTtkString(hp: number, dps?: number): string {
  if (!dps || !Number.isFinite(dps) || dps <= 0) return '';
  return FormatDuration(hp / dps);
}

function GetLogSeparator(s: string): string {
  return s.length >= 8 ? '\t' : '\t\t';
}

function PrintStage(
  dungeon: DungeonDefinition,
  stage: number | 'SUM',
  hp: number,
  hpSum: number,
  dps?: number,
  totalTtkSeconds?: number
): void {
  const hpWithSeparator = numberWithSeparator(hp);
  const totalHpWithSeparator = numberWithSeparator(hpSum);
  const separator = GetLogSeparator(hpWithSeparator);
  let ttk = '';
  let ttksum = '';

  if (dps && totalTtkSeconds) {
    ttk = GetTtkString(hp, dps);
    ttksum = FormatDuration(totalTtkSeconds);
  }

  if (stage === 'SUM') {
    console.log(`SUM\t${totalHpWithSeparator}${separator}${ttksum}\t========`);
  } else if (stage === dungeon.StagesMax) {
    console.log(`${stage}x\t${hpWithSeparator}${separator}${ttk}\t${ttksum}`);
  } else if (dungeon.MidStages.includes(stage)) {
    console.log(`${stage}x\t${hpWithSeparator}${separator}${ttk}\t${ttksum}`);
    console.log(`===\t${totalHpWithSeparator}${separator}${ttksum}\t========`);
  } else {
    console.log(`${stage}\t${hpWithSeparator}${separator}${ttk}\t${ttksum}`);
  }
}

function PrintTable(dungeon: DungeonDefinition, dps?: number): void {
  console.log(`\n================== Dungeon ${dungeon.Id} ==================`);
  console.log(dps ? 'Stage\tHP\t\tTTK\t\tTTK SUM' : 'Stage\tHP');

  let totalHp = 0;
  let totalTtkSeconds = 0;

  for (let stage = 1; stage <= dungeon.StagesMax; stage++) {
    // const { hp, note } = GetBossHealthForStage(stage, dungeon, scaling);
    const hp = GetHealthForBossAtStage(dungeon.Id, stage);
    totalHp += hp;

    if (dps && Number.isFinite(dps) && dps > 0) {
      totalTtkSeconds += hp / dps;
    }

    PrintStage(dungeon, stage, hp, totalHp, dps, totalTtkSeconds);
  }

  console.log('------------------------------------------------');
  PrintStage(dungeon, 'SUM', totalHp, totalHp, dps, totalTtkSeconds);
}

function ParseArgs(): { dungeonId?: string; dps?: number } {
  const args = process.argv.slice(2);
  const dungeonIndex = args.findIndex((a) => a === '--dungeon' || a === '-d');
  const dpsIndex = args.findIndex((a) => a === '--dps');

  let dungeonId: string | undefined;
  if (dungeonIndex >= 0) {
    const dungeonIdValue = args[dungeonIndex + 1];
    if (dungeonIdValue && !dungeonIdValue.startsWith('-')) dungeonId = dungeonIdValue;
  }

  let dps: number | undefined;

  if (dpsIndex >= 0) {
    const dpsValue = args[dpsIndex + 1];
    const parsed = dpsValue ? Number(dpsValue) : NaN;
    if (Number.isFinite(parsed) && parsed > 0) dps = parsed;
  }

  return { dungeonId, dps };
}

function Run(): void {
  const { dungeonId, dps } = ParseArgs();
  const allDungeons: DungeonDefinition[] = [...NORMAL_DUNGEONS, ...CAPSTONE_DUNGEONS];

  for (const dungeon of allDungeons) {
    if (dungeonId && dungeon.Id !== dungeonId) continue;

    const scaling = DUNGEON_BOSS_SCALING[dungeon.Id];

    if (!scaling) {
      console.log(`\n=== Dungeon ${dungeon.Id} ===`);
      console.log('No scaling params found in DUNGEON_BOSS_SCALING.');
      continue;
    }

    PrintTable(dungeon, dps);
  }
}

Run();
