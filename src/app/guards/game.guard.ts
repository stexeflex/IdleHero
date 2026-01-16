import type { CanActivateFn } from '@angular/router';
import { GameStateService } from '../../shared/services';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const gameGuard: CanActivateFn = (route, state) => {
  const gameStateService = inject(GameStateService);

  if (gameStateService.GameCreated()) {
    return true;
  }

  const router = inject(Router);
  return router.createUrlTree(['new']);
};
