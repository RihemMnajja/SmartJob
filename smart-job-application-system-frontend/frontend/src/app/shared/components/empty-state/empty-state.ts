import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ink-200 bg-ink-50/60 px-6 py-14 text-center">
      <span class="material-icons-round text-4xl text-ink-300">{{ icon }}</span>
      <h3 class="font-display text-lg font-semibold text-ink-800">{{ title }}</h3>
      <p class="max-w-sm text-sm text-ink-500">{{ description }}</p>
      <ng-content></ng-content>
    </div>
  `,
})
export class EmptyState {
  @Input() icon = 'inbox';
  @Input() title = 'Nothing here yet';
  @Input() description = '';
}
