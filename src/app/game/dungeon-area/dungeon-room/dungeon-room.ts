import {
  BattleLog,
  BuffsBar,
  CharactersIconName,
  CreaturesIconName
} from '../../../../shared/components';
import {
  BossService,
  BuffsService,
  DungeonRoomService,
  GameStateService,
  HeroService,
  StageService
} from '../../../../shared/services';
import { ChangeDetectionStrategy, Component, Signal, inject, output, signal } from '@angular/core';

import { DELAYS } from '../../../../shared/constants';
import { DungeonArena } from './../dungeon-arena/dungeon-arena';
import { DungeonRoomId } from '../../../../shared/models';
import { DungeonSpecifications } from '../../../../shared/specifications';
import { DungeonTopBar } from './../dungeon-top-bar/dungeon-top-bar';

@Component({
  selector: 'app-dungeon-room',
  imports: [BattleLog, BuffsBar, DungeonArena, DungeonTopBar],
  templateUrl: './dungeon-room.html',
  styleUrl: './dungeon-room.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'onKeydown($event)'
  }
})
export class DungeonRoom {
  readonly onStartBattle = output<void>();
  readonly onPrestige = output<void>();
  readonly onLeaveRoom = output<void>();

  // Service injections
  private readonly heroService = inject(HeroService);
  private readonly bossService = inject(BossService);
  private readonly buffsService = inject(BuffsService);
  private readonly stageService = inject(StageService);
  private readonly dungeonRoomService = inject(DungeonRoomService);
  private readonly gameStateService = inject(GameStateService);
  private readonly dungeonSpecifications = inject(DungeonSpecifications);

  // Signals from services
  protected readonly heroIcon: Signal<CharactersIconName> = this.heroService.CharacterIcon;
  protected readonly bossIcon: Signal<CreaturesIconName> = this.bossService.BossIcon;

  protected readonly currentBossHealth: Signal<number> = this.bossService.CurrentHealth;
  protected readonly maxBossHealth: Signal<number> = this.bossService.MaxHealth;

  protected readonly currentStage: Signal<number> = this.stageService.Current;
  protected readonly currentRoomId: Signal<DungeonRoomId> = this.dungeonRoomService.Current;

  // Action State
  protected get CanStartGame(): boolean {
    return this.dungeonSpecifications.CanEnterDungeonRoom(this.currentRoomId());
  }
  protected RestartDelay = signal<boolean>(false);
  protected InDungeon = signal<boolean>(false);
  protected get InBattle(): boolean {
    return this.gameStateService.GameState() === 'IN_PROGRESS';
  }
  private restartTimer: any = null;

  // Keyboard handling for Buffs 1–9
  protected onKeydown(event: KeyboardEvent): void {
    const key = event.key;

    if (key >= '1' && key <= '9') {
      const index = parseInt(key, 10) - 1;
      const buff = this.buffsService.Buffs()[index];

      if (buff) {
        this.buffsService.ActivateBuff(buff);
        event.preventDefault();
      }
    }
  }

  protected Start() {
    this.onStartBattle.emit();
  }

  protected Prestige(): void {
    this.RestartDelay.set(true);
    this.onPrestige.emit();

    // Delay before the player can start a new game
    this.delayRestart();
  }

  protected Leave(): void {
    this.onLeaveRoom.emit();
  }

  private delayRestart() {
    if (this.restartTimer) clearTimeout(this.restartTimer);
    this.restartTimer = setTimeout(() => {
      this.RestartDelay.set(false);
    }, DELAYS.BATTLE_RESTART_MS);
  }
}
