import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <div class="flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-50">
        <span class="material-icons-round text-4xl text-rose-500">lock</span>
      </div>
      <h1 class="mt-6 font-display text-2xl font-bold text-ink-900">Access restricted</h1>
      <p class="mt-2 max-w-sm text-sm text-ink-500">
        Your account doesn't have permission to view this page. Try heading back to your dashboard.
      </p>
      <a
        [routerLink]="auth.homeRouteForRole(auth.role())"
        class="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-lift transition hover:bg-primary-600"
      >
        Go to my dashboard
      </a>
    </div>
  `,
})
export class UnauthorizedPage {
  auth = inject(AuthService);
}
