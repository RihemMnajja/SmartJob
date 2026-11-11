import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandLogo } from '../brand-logo/brand-logo';

@Component({
  selector: 'app-auth-shell',
  standalone: true,
  imports: [RouterLink, BrandLogo],
  template: `
    <div class="grid min-h-screen lg:grid-cols-2">
      <!-- Brand panel -->
      <div class="relative hidden overflow-hidden bg-ink-900 px-12 py-16 text-white lg:flex lg:flex-col lg:justify-between">
        <div class="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary-500/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl"></div>

        <a routerLink="/" class="relative">
          <app-brand-logo [mark]="36" textClass="text-lg text-white" />
        </a>

        <div class="relative">
          <h2 class="font-display text-3xl font-bold leading-snug">{{ headline }}</h2>
          <p class="mt-4 max-w-sm text-ink-300">{{ subheadline }}</p>

          <div class="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
                <span class="material-icons-round text-[20px]">verified</span>
              </div>
              <div>
                <p class="text-sm font-semibold">AI-verified match scoring</p>
                <p class="text-xs text-ink-400">Every application, evaluated instantly</p>
              </div>
            </div>
          </div>
        </div>

        <p class="relative text-xs text-ink-500">&copy; {{ year }} SmartJob. All rights reserved.</p>
      </div>

      <!-- Form panel -->
      <div class="flex items-center justify-center bg-white px-6 py-12 sm:px-10">
        <div class="w-full max-w-md">
          <div class="mb-8 lg:hidden">
            <a routerLink="/">
              <app-brand-logo [mark]="32" textClass="text-lg text-ink-900" />
            </a>
          </div>
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
})
export class AuthShell {
  @Input() headline = 'Welcome to SmartJob';
  @Input() subheadline = 'Where great candidates meet the right opportunities.';
  year = new Date().getFullYear();
}
