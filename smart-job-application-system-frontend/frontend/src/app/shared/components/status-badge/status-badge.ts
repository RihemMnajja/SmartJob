import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { ApplicationStatus } from '../../../core/models';
import { statusMeta } from '../../../core/utils/application-status.util';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [NgClass],
  template: `
    <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" [ngClass]="meta().badgeClasses">
      @if (showEmoji) {
        <span aria-hidden="true">{{ meta().emoji }}</span>
      } @else {
        <span class="h-1.5 w-1.5 rounded-full" [ngClass]="meta().dotClasses"></span>
      }
      {{ meta().label }}
    </span>
  `,
})
export class StatusBadge {
  @Input() status: ApplicationStatus | undefined;
  /** Dense tables (recruiter ranking) keep the plain dot; candidate-facing
   * surfaces can opt into the small emoji for a bit of warmth. */
  @Input() showEmoji = false;

  meta() {
    return statusMeta(this.status);
  }
}
