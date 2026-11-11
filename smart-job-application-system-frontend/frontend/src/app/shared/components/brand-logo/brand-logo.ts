import { Component, Input } from '@angular/core';

/**
 * Single source of truth for the SmartJob logo lockup so every surface
 * (navbar, sidebars, auth pages, footer) renders it identically.
 */
@Component({
  selector: 'app-brand-logo',
  standalone: true,
  template: `
    <span class="inline-flex items-center gap-2.5">
      <img
        src="/brand/logo.png"
        alt="SmartJob"
        class="shrink-0 object-contain"
        [style.width.px]="mark"
        [style.height.px]="mark"
      />
      @if (wordmark) {
        <span class="font-display font-bold leading-none" [class]="textClass">
          SmartJob
        </span>
      }
    </span>
  `,
})
export class BrandLogo {
  /** Pixel size of the mark. */
  @Input() mark = 32;
  /** Whether to render the "SmartJob" wordmark next to the mark. */
  @Input() wordmark = true;
  /** Tailwind classes for the wordmark text (color/size vary by surface). */
  @Input() textClass = 'text-lg text-ink-900';
}
