import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { AuthService, JobApplicationService, JobOfferService, NotificationService } from '../../../../core/services';
import { JobApplication, JobOffer } from '../../../../core/models';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-offer-list',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeader, EmptyState, LoadingSpinner],
  templateUrl: './offer-list.html',
})
export class OfferList {
  private auth = inject(AuthService);
  private offerService = inject(JobOfferService);
  private applicationService = inject(JobApplicationService);
  private notification = inject(NotificationService);
  private dialog = inject(MatDialog);

  loading = signal(true);
  offers = signal<JobOffer[]>([]);
  applications = signal<JobApplication[]>([]);
  search = signal('');
  deletingId = signal<number | null>(null);

  myOffers = computed(() => {
    const userId = this.auth.currentUser()?.userId;
    return this.offers().filter((o) => o.recruiter?.user?.id === userId);
  });

  filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.myOffers().filter((o) => !term || o.title?.toLowerCase().includes(term));
  });

  applicationCount(offerId: number | undefined): number {
    return this.applications().filter((a) => a.jobOffer?.id === offerId).length;
  }

  constructor() {
    forkJoin({
      offers: this.offerService.getAll(),
      applications: this.applicationService.getAll(),
    }).subscribe({
      next: ({ offers, applications }) => {
        this.offers.set(offers);
        this.applications.set(applications);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  deleteOffer(offer: JobOffer): void {
    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        title: `Delete "${offer.title}"?`,
        message: 'This will permanently remove the job offer. This action cannot be undone.',
        confirmLabel: 'Delete offer',
        danger: true,
      },
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed || !offer.id) return;
      this.deletingId.set(offer.id);
      this.offerService.delete(offer.id).subscribe({
        next: () => {
          this.offers.update((list) => list.filter((o) => o.id !== offer.id));
          this.deletingId.set(null);
          this.notification.success('Job offer deleted.');
        },
        error: () => this.deletingId.set(null),
      });
    });
  }
}
