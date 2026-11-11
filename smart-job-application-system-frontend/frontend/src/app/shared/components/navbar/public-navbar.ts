import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandLogo } from '../brand-logo/brand-logo';

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [RouterLink, BrandLogo],
  template: `
    <header class="sticky top-0 z-50 border-b border-ink-100 bg-white/80 backdrop-blur-md">
      <nav class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a routerLink="/" class="flex items-center gap-2 transition hover:opacity-80">
          <app-brand-logo [mark]="34" textClass="text-lg text-ink-900" />
        </a>

        <div class="hidden items-center gap-8 md:flex">
          <a href="#features" class="text-sm font-medium text-ink-600 hover:text-ink-900">Features</a>
          <a href="#how-it-works" class="text-sm font-medium text-ink-600 hover:text-ink-900">How it works</a>
          <a href="#ai" class="text-sm font-medium text-ink-600 hover:text-ink-900">AI Matching</a>
          <a href="#testimonials" class="text-sm font-medium text-ink-600 hover:text-ink-900">Testimonials</a>
        </div>

        <div class="hidden items-center gap-3 md:flex">
          <a routerLink="/auth/login" class="rounded-xl px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-100">
            Log in
          </a>
          <a
            routerLink="/auth/register/candidate"
            class="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lift transition hover:bg-primary-600"
          >
            Get started
          </a>
        </div>

        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-xl text-ink-700 hover:bg-ink-100 md:hidden"
          (click)="menuOpen.set(!menuOpen())"
        >
          <span class="material-icons-round">{{ menuOpen() ? 'close' : 'menu' }}</span>
        </button>
      </nav>

      @if (menuOpen()) {
        <div class="border-t border-ink-100 bg-white px-6 py-4 md:hidden">
          <div class="flex flex-col gap-1">
            <a href="#features" class="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50" (click)="menuOpen.set(false)">Features</a>
            <a href="#how-it-works" class="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50" (click)="menuOpen.set(false)">How it works</a>
            <a href="#ai" class="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50" (click)="menuOpen.set(false)">AI Matching</a>
            <a href="#testimonials" class="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50" (click)="menuOpen.set(false)">Testimonials</a>
            <hr class="my-2 border-ink-100" />
            <a routerLink="/auth/login" class="rounded-lg px-3 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-50">Log in</a>
            <a routerLink="/auth/register/candidate" class="mt-1 rounded-lg bg-primary-500 px-3 py-2.5 text-center text-sm font-semibold text-white">
              Get started
            </a>
          </div>
        </div>
      }
    </header>
  `,
})
export class PublicNavbar {
  menuOpen = signal(false);
}
