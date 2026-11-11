import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../core/services';
import { BrandLogo } from '../../shared/components/brand-logo/brand-logo';

interface NavItem {
  label: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'app-recruiter-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, BrandLogo],
  template: `
    <div class="flex min-h-screen bg-ink-50">
      <aside class="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-ink-900 text-ink-200 lg:flex">
        <div class="flex h-16 items-center gap-2 px-6">
          <app-brand-logo [mark]="28" textClass="text-base text-white" />
          <span class="ml-auto rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-300">HR</span>
        </div>

        <nav class="mt-4 flex-1 space-y-1 px-3">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-white/10 text-white"
              [routerLinkActiveOptions]="{ exact: item.path === '/recruiter/dashboard' }"
              class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-300 transition hover:bg-white/5 hover:text-white"
            >
              <span class="material-icons-round text-[20px]">{{ item.icon }}</span>
              {{ item.label }}
            </a>
          }
        </nav>

        <div class="mx-3 mb-4 rounded-2xl bg-white/5 p-4">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
              {{ initials() }}
            </div>
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-white">{{ auth.currentUser()?.name }}</p>
              <p class="truncate text-xs text-ink-400">Recruiter</p>
            </div>
          </div>
          <button
            type="button"
            (click)="logout()"
            class="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-ink-200 transition hover:bg-white/10"
          >
            <span class="material-icons-round text-[16px]">logout</span>
            Sign out
          </button>
        </div>
      </aside>

      @if (mobileNavOpen()) {
        <div class="fixed inset-0 z-50 lg:hidden">
          <div class="absolute inset-0 bg-ink-900/60" (click)="mobileNavOpen.set(false)"></div>
          <aside class="absolute inset-y-0 left-0 flex w-72 flex-col bg-ink-900 text-ink-200">
            <div class="flex h-16 items-center justify-between px-6">
              <app-brand-logo [mark]="28" textClass="text-base text-white" />
              <button (click)="mobileNavOpen.set(false)" class="text-ink-300"><span class="material-icons-round">close</span></button>
            </div>
            <nav class="mt-4 flex-1 space-y-1 px-3">
              @for (item of navItems; track item.path) {
                <a
                  [routerLink]="item.path"
                  routerLinkActive="bg-white/10 text-white"
                  (click)="mobileNavOpen.set(false)"
                  class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-300 hover:bg-white/5 hover:text-white"
                >
                  <span class="material-icons-round text-[20px]">{{ item.icon }}</span>
                  {{ item.label }}
                </a>
              }
            </nav>
            <div class="p-4">
              <button
                type="button"
                (click)="logout()"
                class="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-ink-200"
              >
                <span class="material-icons-round text-[16px]">logout</span>
                Sign out
              </button>
            </div>
          </aside>
        </div>
      }

      <div class="flex min-h-screen flex-1 flex-col lg:pl-64">
        <header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink-100 bg-white/90 px-4 backdrop-blur-md sm:px-8">
          <button class="text-ink-600 lg:hidden" (click)="mobileNavOpen.set(true)">
            <span class="material-icons-round">menu</span>
          </button>
          <div class="hidden text-sm font-medium text-ink-400 lg:block">Welcome back, {{ firstName() }} 👋</div>
          <div class="flex items-center gap-2 sm:gap-4">
            <a routerLink="/recruiter/offers/new" class="hidden items-center gap-2 rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-lift transition hover:bg-primary-600 sm:flex">
              <span class="material-icons-round text-[18px]">add</span>
              New job offer
            </a>
          </div>
        </header>

        <main class="flex-1 px-4 py-8 sm:px-8">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class RecruiterLayout {
  auth = inject(AuthService);
  private router = inject(Router);

  mobileNavOpen = signal(false);

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', path: '/recruiter/dashboard' },
    { label: 'Job Offers', icon: 'work', path: '/recruiter/offers' },
    { label: 'Settings', icon: 'settings', path: '/recruiter/settings' },
  ];

  firstName(): string {
    return this.auth.currentUser()?.name?.split(' ')[0] ?? '';
  }

  initials(): string {
    const name = this.auth.currentUser()?.name ?? '';
    return name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
