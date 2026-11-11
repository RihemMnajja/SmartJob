import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService, CandidateProfileService, NotificationService } from '../../../core/services';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('newPassword')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return password && confirm && password !== confirm ? { mismatch: true } : null;
}

@Component({
  selector: 'app-candidate-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeader],
  templateUrl: './settings.html',
})
export class CandidateSettings {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private profileService = inject(CandidateProfileService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  saving = signal(false);
  deleting = signal(false);

  form = this.fb.nonNullable.group(
    {
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatch }
  );

  get f() {
    return this.form.controls;
  }

  changePassword(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const { oldPassword, newPassword, confirmPassword } = this.form.getRawValue();
    this.auth.changePassword(oldPassword, newPassword, confirmPassword).subscribe({
      next: () => {
        this.saving.set(false);
        this.form.reset();
        this.notification.success('Password updated successfully.');
      },
      error: () => this.saving.set(false),
    });
  }

  deleteProfile(): void {
    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Delete your candidate profile?',
        message: 'This permanently removes your profile data (experience, education, skills, etc.). Your account login stays active.',
        confirmLabel: 'Delete profile',
        danger: true,
      },
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      const userId = this.auth.currentUser()?.userId;
      if (!userId) return;

      this.deleting.set(true);
      this.profileService.delete(userId).subscribe({
        next: () => {
          this.deleting.set(false);
          this.notification.success('Profile deleted.');
          this.router.navigate(['/candidate/profile']);
        },
        error: () => this.deleting.set(false),
      });
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
