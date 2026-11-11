import { Component, DestroyRef, Input, OnChanges, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Renders an image served behind JWT authentication.
 * Plain <img> tags can't send an Authorization header, so we fetch the
 * bytes via HttpClient (which goes through the JWT interceptor) and
 * render them as an object URL instead.
 */
@Component({
  selector: 'app-secure-image',
  standalone: true,
  template: `
    @if (objectUrl()) {
      <img [src]="objectUrl()" [alt]="alt" [class]="imgClass" />
    } @else {
      <div [class]="fallbackClass || imgClass" class="flex items-center justify-center bg-primary-100 font-bold text-primary-700">
        {{ initials }}
      </div>
    }
  `,
})
export class SecureImage implements OnChanges {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  @Input() src: string | null | undefined;
  @Input() alt = '';
  @Input() imgClass = 'h-10 w-10 rounded-full object-cover';
  @Input() fallbackClass = '';
  @Input() initials = '';

  objectUrl = signal<string | null>(null);

  ngOnChanges(): void {
    this.objectUrl.set(null);
    if (!this.src) return;

    this.http
      .get(this.src, { responseType: 'blob' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (blob) => this.objectUrl.set(URL.createObjectURL(blob)),
        error: () => this.objectUrl.set(null),
      });
  }
}
