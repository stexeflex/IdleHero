import { Component, input } from '@angular/core';

import { IconComponent } from '../icon/icon.component';
import { Rune } from '../../../core/models';

interface RuneInfo {
  IsEmpty: boolean;
  IsCommon: boolean;
  IsMagic: boolean;
  IsRare: boolean;
  IsEpic: boolean;
  IsLegendary: boolean;
}

@Component({
  selector: 'app-socketed-runes-icon',
  imports: [IconComponent],
  templateUrl: './socketed-runes-icon.html',
  styleUrl: './socketed-runes-icon.scss'
})
export class SocketedRunesIcon {
  readonly runes = input.required<Array<Rune | null>>();

  protected GetRuneInfo(runeIndex: number): RuneInfo {
    const rune = this.runes()[runeIndex];

    const isCommon = rune?.Quality === 'Common';
    const isMagic = rune?.Quality === 'Magic';
    const isRare = rune?.Quality === 'Rare';
    const isEpic = rune?.Quality === 'Epic';
    const isLegendary = rune?.Quality === 'Legendary';

    return {
      IsEmpty: !rune,
      IsCommon: isCommon,
      IsMagic: isMagic,
      IsRare: isRare,
      IsEpic: isEpic,
      IsLegendary: isLegendary
    };
  }
}
