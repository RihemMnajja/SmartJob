import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="flex flex-col items-center justify-center gap-3 py-16 text-ink-400">
      <mat-spinner [diameter]="diameter" color="primary"></mat-spinner>
      @if (label) {
        <p class="text-sm font-medium">{{ label }}</p>
      }
    </div>
  `,
})
export class LoadingSpinner {
  @Input() label = 'Loading…';
  @Input() diameter = 40;
}
