import { AmuletService, RuneService } from '../../../core/services';
import { Component, inject, input } from '@angular/core';

import { IconComponent } from '../icon/icon.component';
import { RuneSlotInfo } from '../../../core/models';
import { Separator } from '../separator/separator';

@Component({
  selector: 'app-runes-list',
  imports: [IconComponent, Separator],
  templateUrl: './runes-list.html',
  styleUrl: './runes-list.scss'
})
export class RunesList {
  private readonly AmuletState = inject(AmuletService);
  private readonly RuneState = inject(RuneService);

  public readonly RuneSlotsInfo = input.required<RuneSlotInfo[]>();

  protected UpgradeAvailable(definitionId: string): boolean {
    const rune = this.RuneState.GetRune(definitionId);
    if (!rune) return false;
    if (!this.AmuletState.HasRuneEquipped(definitionId)) return false;
    const equipped = this.AmuletState.GetRuneByDefinitionId(definitionId)!;
    return this.RuneState.IsBetterRune(rune, equipped);
  }

  protected ShowSocketButton(definitionId: string): boolean {
    const rune = this.RuneState.GetRune(definitionId);
    if (!rune) return false;

    const hasRuneEquipped = this.AmuletState.HasRuneEquipped(definitionId);
    if (!hasRuneEquipped) return true;

    const isUpgrade = this.UpgradeAvailable(definitionId);
    if (isUpgrade) return true;

    return false;
  }

  protected CanSocket(definitionId: string): boolean {
    const rune = this.RuneState.GetRune(definitionId);
    if (!rune) return false;

    const slotIndex = this.GetSlotIndex(definitionId);
    if (slotIndex === null) return false;

    return this.AmuletState.CanSocket(slotIndex, rune);
  }

  protected SocketRune(definitionId: string): void {
    const rune = this.RuneState.GetRune(definitionId);
    if (!rune) return;

    const slotIndex = this.GetSlotIndex(definitionId);
    if (slotIndex === null) return;

    this.AmuletState.Socket(slotIndex, rune);
  }

  private GetSlotIndex(definitionId: string): number | null {
    const hasRuneEquipped = this.AmuletState.HasRuneEquipped(definitionId);

    if (hasRuneEquipped) {
      const slotIndex = this.AmuletState.GetRuneSlotIndex(definitionId);
      return slotIndex;
    } else {
      return this.AmuletState.GetNextFreeSlotIndex();
    }
  }
}
