import { Game } from './game/game';
import { NewGame } from './new-game/new-game';
import { Routes } from '@angular/router';
import { gameGuard } from './guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'game',
    pathMatch: 'full'
  },
  // Game route protected by the gameGuard
  {
    path: 'game',
    component: Game,
    canActivate: [gameGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'town'
      },
      {
        path: 'town',
        loadComponent: () => import('./game-town/game-town').then((m) => m.GameTown)
      },
      {
        path: 'dungeon',
        loadComponent: () => import('./game-dungeon/game-dungeon').then((m) => m.GameDungeon)
      }
    ]
  },
  // New Game route
  {
    path: 'new',
    component: NewGame
  },
  // Optional: fallback to new game for unknown paths
  {
    path: '**',
    redirectTo: 'new'
  }
];
