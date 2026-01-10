import { CharacterSheet } from './character-sheet/character-sheet';
import { Component } from '@angular/core';
import { PanelHeader } from '../../shared/components';

@Component({
  selector: 'app-character-area',
  imports: [CharacterSheet, PanelHeader],
  templateUrl: './character-area.html',
  styleUrl: './character-area.scss'
})
export class CharacterArea {}
