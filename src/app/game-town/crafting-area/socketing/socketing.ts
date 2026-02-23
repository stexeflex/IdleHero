import { AmuletPreview, Gold, RunesList } from '../../../../shared/components';
import { AmuletService, RuneService } from '../../../../core/services';
import { Component, LOCALE_ID, computed, inject } from '@angular/core';
import { GetNextAmuletQuality, GetRuneSlotInfo } from '../../../../core/systems/runes';
import { Rune, RuneSlotInfo } from '../../../../core/models';

@Component({
  selector: 'app-socketing',
  imports: [AmuletPreview, Gold, RunesList],
  templateUrl: './socketing.html',
  styleUrl: './socketing.scss'
})
export class Socketing {
  private readonly locale = inject(LOCALE_ID);
  private readonly AmuletState = inject(AmuletService);
  private readonly RuneState = inject(RuneService);

  //#region Amulet
  protected readonly Amulet = computed(() => this.AmuletState.GetState());
  protected readonly Unlocked = computed(() => this.AmuletState.IsUnlocked());

  protected AmuletUpgradeCost = computed<number>(() => {
    if (this.Unlocked()) {
      return this.AmuletState.GetUpgradeCost();
    } else {
      return this.AmuletState.GetUnlockCost();
    }
  });

  protected ShowUpgradeAmuletButton(): boolean {
    if (!this.Unlocked()) return true;
    else if (GetNextAmuletQuality(this.Amulet().Quality) !== null) return true;
    return false;
  }

  protected CanUpgradeAmulet(): boolean {
    return this.AmuletState.CanUnlock() || this.AmuletState.CanUpgrade();
  }

  protected UpgradeAmulet(): void {
    if (this.Unlocked()) {
      this.AmuletState.Upgrade();
    } else {
      this.AmuletState.Unlock();
    }
  }
  //#endregion Amulet

  //#region Runes
  protected readonly RuneSlotsInfo = computed<RuneSlotInfo[]>(() => {
    const runeSlotsById = this.RuneState.SlotsById();
    const runeSlotsInfo: RuneSlotInfo[] = [];

    for (const definitionId in runeSlotsById) {
      const rune: Rune | null = runeSlotsById[definitionId];
      const slotInfo: RuneSlotInfo = GetRuneSlotInfo(definitionId, rune, this.locale);
      runeSlotsInfo.push(slotInfo);
    }

    return runeSlotsInfo;
  });

  protected readonly UnsockableRuneSlots = computed<number[]>(() => {
    const unsockableSlots: number[] = [];
    const amuletState = this.AmuletState.GetState();
    amuletState.Slots.forEach((rune, index) => {
      if (rune != null && this.AmuletState.CanUnsocket(index)) {
        unsockableSlots.push(index);
      }
    });
    return unsockableSlots;
  });

  protected RuneSocketCost(): number {
    return this.AmuletState.GetSocketCost();
  }

  protected RuneUnsocketCost(): number {
    return this.AmuletState.GetUnsocketCost();
  }

  protected CanUnsocketRune(index: number): boolean {
    return this.AmuletState.CanUnsocket(index);
  }

  protected UnsocketRune(slotIndex: number): void {
    this.AmuletState.Unsocket(slotIndex);
  }
  //#endregion Runes
}
