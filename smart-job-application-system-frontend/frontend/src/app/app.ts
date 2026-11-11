import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalLoader } from './shared/components/loading-spinner/global-loader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GlobalLoader],
  template: `
    <app-global-loader />
    <router-outlet />
  `,
})
export class App {}
