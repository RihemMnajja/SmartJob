import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  template: `
    <div class="p-2 font-body">
      <h2 class="font-display text-lg font-semibold text-ink-900">{{ data.title }}</h2>
      <p class="mt-2 text-sm text-ink-500">{{ data.message }}</p>
      <div class="mt-6 flex justify-end gap-3">
        <button
          type="button"
          class="rounded-xl px-4 py-2 text-sm font-semibold text-ink-600 hover:bg-ink-100"
          (click)="ref.close(false)"
        >
          {{ data.cancelLabel || 'Cancel' }}
        </button>
        <button
          type="button"
          class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-soft"
          [class.bg-rose-600]="data.danger"
          [class.bg-primary-500]="!data.danger"
          (click)="ref.close(true)"
        >
          {{ data.confirmLabel || 'Confirm' }}
        </button>
      </div>
    </div>
  `,
})
export class ConfirmDialog {
  constructor(
    public ref: MatDialogRef<ConfirmDialog, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}
