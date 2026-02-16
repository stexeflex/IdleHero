import {
  DamageStatistics,
  DungeonStatistics,
  InitialDamageStatistics,
  InitialDungeonStatistics
} from '../models';
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  public DungeonStatistics = signal<DungeonStatistics>(InitialDungeonStatistics());
  public DamageStatistics = signal<DamageStatistics>(InitialDamageStatistics());

  public UpdateDungeon(newStats: Partial<DungeonStatistics>): void {
    const current = this.DungeonStatistics();
    const updated: DungeonStatistics = {
      Dungeon: { ...current.Dungeon },
      Capstone: { ...current.Capstone }
    };

    for (const categoryKey of Object.keys(newStats)) {
      const category = categoryKey as keyof DungeonStatistics;

      if (newStats[category] === undefined) {
        continue;
      }

      for (const roomKey of Object.keys(newStats[category])) {
        const roomId = roomKey as keyof DungeonStatistics[typeof category];
        const newStage = newStats[category]?.[roomId];
        const currentStage = updated[category][roomId] || 0;

        if (newStage === undefined || newStage <= currentStage) {
          continue;
        }

        updated[category][roomId] = newStage;
      }
    }

    this.DungeonStatistics.update(() => updated);
  }

  public UpdateDamage(newStats: Partial<DamageStatistics>): void {
    const current = this.DamageStatistics();
    const updated: DamageStatistics = { ...current };

    for (const statKey of Object.keys(newStats)) {
      const key = statKey as keyof DamageStatistics;
      const newValue = newStats[key];

      if (newValue === undefined || newValue <= current[key]) {
        continue;
      }

      updated[key] = newValue;
    }

    this.DamageStatistics.update(() => updated);
  }

  public ResetDamageStatistics(): void {
    this.DamageStatistics.set(InitialDamageStatistics());
  }

  public SetState(newStats: { Dungeon: DungeonStatistics; Damage: DamageStatistics }): void {
    this.DungeonStatistics.set(newStats.Dungeon);
    this.DamageStatistics.set(newStats.Damage);
  }
}
