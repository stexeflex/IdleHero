import { BattleLog, BuffsBar, CharactersIconName } from '../../../../shared/components';
import { BuffsService, HeroService } from '../../../../shared/services';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  Signal,
  computed,
  inject,
  output,
  signal
} from '@angular/core';

import { Boss } from '../../../../core/models';
import { CombatState } from '../../../../core/systems/combat';
import { DELAYS } from '../../../../shared/constants';
import { DungeonArena } from './../dungeon-arena/dungeon-arena';
import { DungeonRoomService } from '../../../../core/services';
import { DungeonTopBar } from './../dungeon-top-bar/dungeon-top-bar';
import { Subscription } from 'rxjs';

export interface DungeonTopBarInfo {
  RoomId: number;
  Stage: number;
  ShowBossHealthBar: boolean;
  CurrentBossHealth: number;
  MaxBossHealth: number;
}

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
export class DungeonRoom implements OnDestroy {
  private restartTimer?: any;
  private bossSub?: Subscription;

  // Outputs
  public readonly onStartBattle = output<void>();
  public readonly onPrestige = output<void>();
  public readonly onLeaveRoom = output<void>();

  // Service injections
  private readonly heroService = inject(HeroService);
  private readonly buffsService = inject(BuffsService);
  private readonly combatState = inject(CombatState);
  private readonly dungeonRoomService = inject(DungeonRoomService);

  // Signals from services
  protected readonly heroIcon: Signal<CharactersIconName> = this.heroService.CharacterIcon;

  protected Boss = signal<Boss | undefined>(undefined);
  protected DungeonTopBarInfo: Signal<DungeonTopBarInfo> = computed(() => {
    const boss = this.Boss();
    const inBattle: boolean = this.combatState.InProgress();
    const stage: number = this.dungeonRoomService.CurrentStage();

    return {
      RoomId: this.dungeonRoomService.CurrentDungeonId() || 0,
      Stage: stage,
      ShowBossHealthBar: inBattle,
      CurrentBossHealth: boss?.Life?.Hp || 0,
      MaxBossHealth: boss?.Life?.MaxHp || 0
    };
  });

  // State
  protected RestartDelay = signal<boolean>(false);
  protected InBattle = computed(() => this.combatState.InProgress());
  protected CanStartGame = computed<boolean>(() => {
    const dungeonId = this.dungeonRoomService.CurrentDungeonId();
    if (dungeonId) {
      return this.dungeonRoomService.CanEnter(dungeonId);
    } else {
      return false;
    }
  });

  constructor() {
    this.bossSub = this.combatState.Boss$.subscribe((s) => {
      this.Boss.set({ ...s } as Boss | undefined);
    });
  }

  ngOnDestroy(): void {
    if (this.restartTimer) clearTimeout(this.restartTimer);
    this.bossSub?.unsubscribe();
  }

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
    // Delay before the player can start a new game
    this.DelayRestart();

    this.onPrestige.emit();
  }

  protected Leave(): void {
    this.onLeaveRoom.emit();
  }

  private DelayRestart() {
    this.RestartDelay.set(true);

    if (this.restartTimer) clearTimeout(this.restartTimer);

    this.restartTimer = setTimeout(() => {
      this.RestartDelay.set(false);
    }, DELAYS.BATTLE_RESTART_MS);
  }
}
