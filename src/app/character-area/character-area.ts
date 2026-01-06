import { CharacterSheet } from './character-sheet/character-sheet';
import { Component } from '@angular/core';

@Component({
  selector: 'app-character-area',
  imports: [CharacterSheet],
  templateUrl: './character-area.html',
  styleUrl: './character-area.scss'
})
export class CharacterArea {}
