import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Separator } from '../separator/separator';

export interface TabDefinition {
  id: string | number;
  label: string;
  disabled?: boolean;
}

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
  public readonly selected = input<TabDefinition['id']>();

  // Emits when selection changes (id of selected tab)
  public readonly selectedChange = output<TabDefinition['id']>();

  select(tab: TabDefinition): void {
    if (tab.disabled) return;
    if (this.selected() === tab.id) return;
    this.selectedChange.emit(tab.id);
  }
}
