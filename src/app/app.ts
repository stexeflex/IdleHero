import { Router, RouterOutlet } from '@angular/router';

import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private router = inject(Router);

  constructor() {
    this.router.navigate(['']);
  }
}
