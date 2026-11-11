import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { JobApplicationService, JobOfferService, NotificationService, CandidateProfileService } from '../../../../core/services';
import { ApplicationStatus, JobApplication, JobOffer } from '../../../../core/models';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { ScoreBadge } from '../../../../shared/components/score-badge/score-badge';
import { StatusBadge } from '../../../../shared/components/status-badge/status-badge';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { SecureImage } from '../../../../shared/components/secure-image/secure-image';

@Component({
  selector: 'app-recruiter-application-list',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeader, EmptyState, LoadingSpinner, ScoreBadge, StatusBadge, SecureImage],
  templateUrl: './application-list.html',
})
export class RecruiterApplicationList {
  private route = inject(ActivatedRoute);
  private offerService = inject(JobOfferService);
  private applicationService = inject(JobApplicationService);
  private notification = inject(NotificationService);
  private dialog = inject(MatDialog);
  private candidateProfileService = inject(CandidateProfileService);

  offerId = Number(this.route.snapshot.paramMap.get('id'));

  loading = signal(true);
  offer = signal<JobOffer | null>(null);
  applications = signal<JobApplication[]>([]);
  analyzingId = signal<number | null>(null);
  updatingId = signal<number | null>(null);

  constructor() {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    forkJoin({
      offer: this.offerService.getById(this.offerId),
      applications: this.applicationService.getByOfferSortedByScore(this.offerId),
    }).subscribe({
      next: ({ offer, applications }) => {
        this.offer.set(offer);
        this.applications.set(applications);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  viewCv(app: JobApplication): void {
    if (!app.id) return;
    // window.open() on a protected URL sends no Authorization header, which
    // the backend rejects (403). Open a blank tab synchronously (so popup
    // blockers don't kill it), then fetch the PDF via HttpClient — which
    // goes through the JWT interceptor — and redirect that tab to the blob.
    const tab = window.open('', '_blank');
    this.applicationService.fetchCvBlob(app.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        if (tab) tab.location.href = url;
        else window.open(url, '_blank');
      },
      error: () => {
        tab?.close();
        this.notification.error("Could not open this candidate's CV.");
      },
    });
    // Backend flips SENT -> VIEWED as a side effect; reflect it locally.
    if (app.status === 'SENT') {
      this.applications.update((list) =>
        list.map((a) => (a.id === app.id ? { ...a, status: 'VIEWED' as ApplicationStatus } : a))
      );
    }
  }

  reanalyze(app: JobApplication): void {
    if (!app.id) return;
    this.analyzingId.set(app.id);
    this.applicationService.analyze(app.id).subscribe({
      next: (updated) => {
        this.applications.update((list) => list.map((a) => (a.id === app.id ? updated : a)));
        this.analyzingId.set(null);
        this.notification.success('AI analysis re-run successfully.');
      },
      error: () => this.analyzingId.set(null),
    });
  }

  setStatus(app: JobApplication, status: ApplicationStatus): void {
    if (!app.id) return;
    this.updatingId.set(app.id);
    this.applicationService.updateStatus(app.id, status).subscribe({
      next: (updated) => {
        this.applications.update((list) => list.map((a) => (a.id === app.id ? updated : a)));
        this.updatingId.set(null);
        this.notification.success(`Application marked as ${status.toLowerCase()}.`);
      },
      error: () => this.updatingId.set(null),
    });
  }

  deleteApplication(app: JobApplication): void {
    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Remove this application?',
        message: `This will permanently delete ${app.candidate?.firstName ?? 'this candidate'}'s application. This cannot be undone.`,
        confirmLabel: 'Delete',
        danger: true,
      },
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed || !app.id) return;
      this.applicationService.delete(app.id).subscribe({
        next: () => {
          this.applications.update((list) => list.filter((a) => a.id !== app.id));
          this.notification.success('Application deleted.');
        },
      });
    });
  }

  candidatePhotoUrl(app: JobApplication): string | null {
    const userId = app.candidate?.user?.id;
    return userId ? this.candidateProfileService.photoUrl(userId) : null;
  }

  candidateInitials(app: JobApplication): string {
    const name = `${app.candidate?.firstName ?? ''} ${app.candidate?.lastName ?? ''}`.trim();
    return (
      name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || '—'
    );
  }
}
