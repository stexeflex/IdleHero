import { Component, inject } from '@angular/core';
import { CreaturesIconName, Gold, IconComponent, Separator } from '../../../shared/components';
import { DungeonKeyService, GoldService, StatisticsService } from '../../../core/services';
import { DungeonRoomKey, DungeonType } from '../../../core/models';
import { GetAllDungeons, GetDungeonById } from '../../../core/constants';

@Component({
  selector: 'app-info-area',
  imports: [Gold, Separator, IconComponent],
  templateUrl: './info-area.html',
  styleUrl: './info-area.scss'
})
export class InfoArea {
  private readonly dungeonOrderIndexById: Record<string, number> = GetAllDungeons().reduce<
    Record<string, number>
  >((indexById, dungeon, index) => {
    indexById[dungeon.Id] = index;
    return indexById;
  }, {});

  private readonly goldService = inject<GoldService>(GoldService);
  private readonly dungeonKeyService = inject<DungeonKeyService>(DungeonKeyService);
  private readonly statisticsService = inject<StatisticsService>(StatisticsService);

  protected get GoldAmount(): number {
    return this.goldService.Balance();
  }

  protected get DungeonStages(): DungeonStageProgress[] {
    const stageStatistics = this.statisticsService.DungeonStatistics();
    return this.BuildDungeonStageProgress(stageStatistics.Dungeon, DungeonType.Normal);
  }

  protected get CapstoneStages(): DungeonStageProgress[] {
    const stageStatistics = this.statisticsService.DungeonStatistics();
    return this.BuildDungeonStageProgress(stageStatistics.Capstone, DungeonType.Capstone);
  }

  protected get HasAnyKey(): boolean {
    return this.dungeonKeyService.Keys().length > 0;
  }

  protected HasKey(key: DungeonRoomKey): boolean {
    return this.dungeonKeyService.HasKey(key);
  }

  private BuildDungeonStageProgress(
    stageByDungeonId: Record<string, number>,
    dungeonType: DungeonType
  ): DungeonStageProgress[] {
    return Object.entries(stageByDungeonId)
      .filter(([, stage]) => stage >= 1)
      .map(([dungeonId, stage]) => {
        const dungeon = GetDungeonById(dungeonId);
        return {
          DungeonId: dungeonId,
          DungeonIcon: dungeon?.Icon ?? 'slime',
          Type: dungeon?.Type ?? DungeonType.Normal,
          Stage: stage,
          Cleared: stage >= (dungeon?.StagesMax ?? 1)
        };
      })
      .filter((dungeonStage) => dungeonStage.Type === dungeonType)
      .sort((left, right) => {
        const leftOrder = this.dungeonOrderIndexById[left.DungeonId] ?? Number.MAX_SAFE_INTEGER;
        const rightOrder = this.dungeonOrderIndexById[right.DungeonId] ?? Number.MAX_SAFE_INTEGER;
        return leftOrder - rightOrder;
      });
  }
}

interface DungeonStageProgress {
  DungeonId: string;
  DungeonIcon: CreaturesIconName;
  Type: DungeonType;
  Stage: number;
  Cleared: boolean;
}
