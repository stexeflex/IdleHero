import { AmuletQuality, AmuletState, Rune, RuneInfo } from '../../../core/models';
import {
  Component,
  LOCALE_ID,
  OnDestroy,
  computed,
  inject,
  input,
  output,
  signal
} from '@angular/core';

import { GetRuneInfo } from '../../../core/systems/runes';
import { IconComponent } from '../icon/icon.component';
import { Separator } from '../separator/separator';

@Component({
  selector: 'app-amulet-preview',
  imports: [IconComponent, Separator],
  templateUrl: './amulet-preview.html',
  styleUrl: './amulet-preview.scss'
})
export class AmuletPreview implements OnDestroy {
  private readonly locale = inject(LOCALE_ID);
  public readonly Amulet = input.required<AmuletState>();
  public readonly AllowUnsocketRunes = input<boolean>(true);
  public readonly UnsockableRuneSlots = input<number[]>([]);
  public readonly OnUnsocket = output<number>();

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
  }

  // UI
  protected readonly Quality = computed<AmuletQuality>(() => {
    return this.Amulet().Quality;
  });
  protected readonly IsLocked = computed<boolean>(() => {
    return !this.Amulet().IsUnlocked;
  });
  protected readonly Slots = computed<Array<Rune | null>>(() => {
    return this.Amulet().Slots.map((rune) => (rune ? rune : null));
  });

  protected readonly Effects = computed<RuneInfo[]>(() => {
    return this.Slots()
      .filter((rune): rune is Rune => rune != null)
      .map((rune) => GetRuneInfo(rune, this.locale));
  });

  protected get SlotIsEmpty(): (index: number) => boolean {
    return (index: number) => {
      const slot = this.Slots()[index];
      return slot == null;
    };
  }

  // Unsocket
  private timeout: number = 0;
  protected readonly SelectedIndex = signal<number | null>(null);

  protected SelectSlot(index: number): void {
    if (!this.AllowUnsocketRunes()) return;
    if (this.SlotIsEmpty(index)) return;
    this.SelectedIndex.set(index);

    clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
      this.SelectedIndex.set(null);
    }, 2000);
  }

  protected readonly CanUnsocketRune = computed<boolean>(() => {
    const selectedIndex = this.SelectedIndex();
    if (selectedIndex == null) return false;
    return this.UnsockableRuneSlots().includes(selectedIndex);
  });

  protected UnsocketSelectedRune(): void {
    const selectedIndex = this.SelectedIndex();
    if (selectedIndex == null) return;
    const selectedSlot = this.Slots()[selectedIndex];
    if (selectedSlot == null) return;

    this.OnUnsocket.emit(selectedIndex);
    this.SelectedIndex.set(null);
  }
}
