import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, NotificationService, RecruiterProfileService } from '../../../core/services';
import { RecruiterProfile } from '../../../core/models';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('newPassword')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return password && confirm && password !== confirm ? { mismatch: true } : null;
}

@Component({
  selector: 'app-recruiter-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeader, LoadingSpinner],
  templateUrl: './settings.html',
})
export class RecruiterSettings {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private recruiterProfileService = inject(RecruiterProfileService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  loading = signal(true);
  savingCompany = signal(false);
  savingPassword = signal(false);
  myProfile = signal<RecruiterProfile | null>(null);

  companyForm = this.fb.nonNullable.group({
    companyName: ['', Validators.required],
    companyEmail: ['', [Validators.required, Validators.email]],
    phone: [''],
    position: [''],
  });

  passwordForm = this.fb.nonNullable.group(
    {
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatch }
  );

  get pf() {
    return this.passwordForm.controls;
  }

  constructor() {
    const userId = this.auth.currentUser()?.userId;
    this.recruiterProfileService.getAll().subscribe({
      next: (profiles) => {
        const mine = profiles.find((p) => p.user?.id === userId) ?? null;
        this.myProfile.set(mine);
        if (mine) {
          this.companyForm.patchValue({
            companyName: mine.companyName ?? '',
            companyEmail: mine.companyEmail ?? '',
            phone: mine.phone ?? '',
            position: mine.position ?? '',
          });
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  saveCompany(): void {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }
    const id = this.myProfile()?.id;
    if (!id) return;

    this.savingCompany.set(true);
    this.recruiterProfileService.update(id, this.companyForm.getRawValue()).subscribe({
      next: (profile) => {
        this.myProfile.set(profile);
        this.savingCompany.set(false);
        this.notification.success('Company profile updated.');
      },
      error: () => this.savingCompany.set(false),
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.savingPassword.set(true);
    const { oldPassword, newPassword, confirmPassword } = this.passwordForm.getRawValue();
    this.auth.changePassword(oldPassword, newPassword, confirmPassword).subscribe({
      next: () => {
        this.savingPassword.set(false);
        this.passwordForm.reset();
        this.notification.success('Password updated successfully.');
      },
      error: () => this.savingPassword.set(false),
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
