import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: `
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        @if (eyebrow) {
          <p class="text-xs font-semibold uppercase tracking-wider text-primary-500">{{ eyebrow }}</p>
        }
        <h1 class="font-display text-2xl font-bold text-ink-900 sm:text-3xl">{{ title }}</h1>
        @if (subtitle) {
          <p class="mt-1 max-w-xl text-sm text-ink-500">{{ subtitle }}</p>
        }
      </div>
      <div class="flex shrink-0 gap-3">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class PageHeader {
  @Input() eyebrow = '';
  @Input() title = '';
  @Input() subtitle = '';
}
