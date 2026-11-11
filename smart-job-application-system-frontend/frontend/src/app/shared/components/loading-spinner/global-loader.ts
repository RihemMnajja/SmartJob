import { Component, inject } from '@angular/core';
import { LoadingService } from '../../../core/services';

@Component({
  selector: 'app-global-loader',
  standalone: true,
  template: `
    @if (loading.isLoading()) {
      <div class="fixed top-0 left-0 right-0 z-[9999] h-[3px] overflow-hidden bg-primary-100">
        <div class="h-full w-1/3 bg-primary-500 animate-[loaderMove_1.1s_ease-in-out_infinite]"></div>
      </div>
    }
  `,
  styles: [
    `
      @keyframes loaderMove {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(150%); }
        100% { transform: translateX(300%); }
      }
    `,
  ],
})
export class GlobalLoader {
  loading = inject(LoadingService);
}
