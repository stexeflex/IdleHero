import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

import { Separator } from '../separator/separator';
import { TabDefinition } from './tab-definition.model';

@Component({
  selector: 'app-tab-strip',
  imports: [Separator],
  templateUrl: './tab-strip.html',
  styleUrl: './tab-strip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'tablist'
  }
})
export class TabStrip {
  public readonly tabs = input.required<TabDefinition[]>();

  // Emits when selection changes (id of selected tab)
  public readonly selectedChange = output<TabDefinition['id']>();

  // Local selection state
  private readonly activeId = signal<TabDefinition['id'] | null>(null);

  ngOnInit(): void {
    const items = this.tabs();

    // Initial selection
    if (items && items.length && this.activeId() === null) {
      this.fallbackSelection(items);
    }
  }

  ngOnChanges(): void {
    const items = this.tabs();
    const current = this.activeId();

    if (!items || !items.length) {
      this.activeId.set(null);
      return;
    }

    // If current selection is not in the list or disabled, select first enabled
    const exists = items.some((t) => t.id === current && !t.disabled);

    if (!exists) {
      this.fallbackSelection(items);
    }
  }

  private fallbackSelection(tabs: TabDefinition[]): void {
    const first = tabs.find((t) => !t.disabled) ?? tabs[0];
    this.activeId.set(first.id);
  }

  isSelected(tab: TabDefinition): boolean {
    return this.activeId() === tab.id;
  }

  select(tab: TabDefinition): void {
    if (tab.disabled) return;

    if (this.activeId() !== tab.id) {
      this.activeId.set(tab.id);
      this.selectedChange.emit(tab.id);
    }
  }
}
