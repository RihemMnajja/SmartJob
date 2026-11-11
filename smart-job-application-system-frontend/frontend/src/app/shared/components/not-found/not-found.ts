import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <p class="font-display text-8xl font-extrabold text-primary-500">404</p>
      <h1 class="mt-4 font-display text-2xl font-bold text-ink-900">This page went off the grid</h1>
      <p class="mt-2 max-w-sm text-sm text-ink-500">
        The page you're looking for doesn't exist or may have moved. Let's get you back on track.
      </p>
      <a
        routerLink="/"
        class="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-lift transition hover:bg-primary-600"
      >
        <span class="material-icons-round text-[18px]">home</span>
        Back to home
      </a>
    </div>
  `,
})
export class NotFoundPage {}
