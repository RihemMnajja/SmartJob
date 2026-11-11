import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JobOfferService, NotificationService } from '../../../../core/services';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-offer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeader, LoadingSpinner],
  templateUrl: './offer-form.html',
})
export class OfferForm {
  private fb = inject(FormBuilder);
  private offerService = inject(JobOfferService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notification = inject(NotificationService);

  contractTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];

  offerId = signal<number | null>(null);
  isEdit = signal(false);
  loading = signal(false);
  saving = signal(false);

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    location: ['', Validators.required],
    contractType: ['Full-time', Validators.required],
    requiredSkills: ['', Validators.required],
    status: ['OPEN'],
  });

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.offerId.set(id);
      this.isEdit.set(true);
      this.loading.set(true);
      this.offerService.getById(id).subscribe({
        next: (offer) => {
          this.form.patchValue({
            title: offer.title ?? '',
            description: offer.description ?? '',
            location: offer.location ?? '',
            contractType: offer.contractType ?? 'Full-time',
            requiredSkills: offer.requiredSkills ?? '',
            status: offer.status ?? 'OPEN',
          });
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const payload = this.form.getRawValue();
    const request$ = this.isEdit()
      ? this.offerService.update(this.offerId()!, payload)
      : this.offerService.create(payload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.notification.success(this.isEdit() ? 'Job offer updated.' : 'Job offer created.');
        this.router.navigate(['/recruiter/offers']);
      },
      error: () => this.saving.set(false),
    });
  }
}
