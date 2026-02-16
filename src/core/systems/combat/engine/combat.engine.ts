import { Injectable, NgZone, inject } from '@angular/core';

import { CombatEvent } from '../../../models';
import { CombatState } from './combat.state';
import { EventHandler } from './event.handler';
import { TimestampUtils } from '../../../../shared/utils';

/**
 * Combat Engine Service
 */
@Injectable({ providedIn: 'root' })
export class CombatEngine {
  private static readonly MAX_EVENTS_PER_CYCLE = 1000;

  private readonly Zone: NgZone = new NgZone({ enableLongStackTrace: false });

  private readonly CombatState: CombatState = inject<CombatState>(CombatState);
  private readonly EventHandler: EventHandler = inject<EventHandler>(EventHandler);

  private Running: boolean = false;
  private TimerId: any = null;

  /**
   * Starts the combat loop
   */
  public Start(): void {
    if (this.Running) return;
    this.Running = true;

    this.EventHandling();
    this.ListenOnVisibilityChange();
  }

  /**
   * Stops the combat loop
   */
  public Stop(): void {
    if (!this.Running) return;
    this.Running = false;
    this.CombatState.Prestige();

    if (this.TimerId !== null) {
      clearTimeout(this.TimerId);
      this.TimerId = null;
    }

    this.RemoveVisibilityChangeListener();
  }

  private EventHandling(): void {
    if (!this.Running) return;

    const nextEvent: CombatEvent | undefined = this.CombatState.Queue.Peek();

    if (!nextEvent) return;

    const now: number = TimestampUtils.GetTimestamp();
    const delay: number = Math.max(0, nextEvent.AtMs - now);

    // MANUALLY INSERTED
    if (this.TimerId) clearTimeout(this.TimerId);
    // MANUALLY INSERTED END

    this.Zone.runOutsideAngular(() => {
      this.TimerId = setTimeout(() => {
        this.Zone.run(async () => {
          await this.ProcessDueEvents();
          this.EventHandling();
        });
      }, delay);
    });
  }

  private async ProcessDueEvents(): Promise<void> {
    if (!this.Running) return;

    const now: number = TimestampUtils.GetTimestamp();
    let nextEvent: CombatEvent | undefined = this.CombatState.Queue.Peek();
    let processedEvents: number = 0;

    while (this.EventCanBeProcessed(nextEvent, now, processedEvents)) {
      const eventToProcess: CombatEvent = this.CombatState.Queue.Pop()!;
      await this.EventHandler.HandleEvent(eventToProcess);
      processedEvents++;
      nextEvent = this.CombatState.Queue.Peek();
    }
  }

  //#region Helpers
  private EventCanBeProcessed(
    event: CombatEvent | undefined,
    now: number,
    processedEvents: number
  ): boolean {
    return (
      event !== undefined &&
      event.AtMs <= now &&
      processedEvents < CombatEngine.MAX_EVENTS_PER_CYCLE
    );
  }

  private ListenOnVisibilityChange(): void {
    document.addEventListener('visibilitychange', this.OnVisibilityChange);
  }

  private RemoveVisibilityChangeListener(): void {
    document.removeEventListener('visibilitychange', this.OnVisibilityChange);
  }

  private OnVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      this.ProcessDueEvents();
      this.EventHandling();
    }
  };
  //#endregion
}
