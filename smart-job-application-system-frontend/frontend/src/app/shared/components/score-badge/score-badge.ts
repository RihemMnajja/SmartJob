import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-score-badge',
  standalone: true,
  imports: [NgClass],
  template: `
    <span
      class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
      [ngClass]="classes()"
    >
      <span class="material-icons-round text-[14px]">bolt</span>
      {{ score !== null && score !== undefined ? score + '% match' : 'Not analyzed' }}
    </span>
  `,
})
export class ScoreBadge {
  @Input() score: number | null | undefined = null;

  classes(): string {
    const s = this.score;
    if (s === null || s === undefined) return 'bg-ink-100 text-ink-500';
    if (s >= 75) return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200';
    if (s >= 50) return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';
    return 'bg-rose-50 text-rose-700 ring-1 ring-rose-200';
  }
}
