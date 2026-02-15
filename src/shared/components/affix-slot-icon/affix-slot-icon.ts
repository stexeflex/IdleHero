import { Component, input } from '@angular/core';

import { Affix } from '../../../core/models';

interface AffixSlotInfo {
  IsCommon: boolean;
  IsMagic: boolean;
  IsRare: boolean;
  IsEpic: boolean;
  IsLegendary: boolean;
}

@Component({
  selector: 'app-affix-slot-icon',
  imports: [],
  templateUrl: './affix-slot-icon.html',
  styleUrl: './affix-slot-icon.scss'
})
export class AffixSlotIcon {
  readonly affixes = input.required<Affix[]>();
  readonly size = input<string>('20px');

  protected GetAffixSlotInfo(affixIndex: number): AffixSlotInfo {
    const affix = this.affixes()[affixIndex];

    const isCommon = affix.Tier === 'Common';
    const isMagic = affix.Tier === 'Magic';
    const isRare = affix.Tier === 'Rare';
    const isEpic = affix.Tier === 'Epic';
    const isLegendary = affix.Tier === 'Legendary';

    return {
      IsCommon: isCommon,
      IsMagic: isMagic,
      IsRare: isRare,
      IsEpic: isEpic,
      IsLegendary: isLegendary
    };
  }
}
