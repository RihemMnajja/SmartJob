import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CandidateProfileService, JobApplicationService, NotificationService } from '../../../../core/services';
import { ApplicationStatus, JobApplication } from '../../../../core/models';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { ScoreBadge } from '../../../../shared/components/score-badge/score-badge';
import { StatusBadge } from '../../../../shared/components/status-badge/status-badge';
import { SecureImage } from '../../../../shared/components/secure-image/secure-image';

@Component({
  selector: 'app-candidate-details',
  standalone: true,
  imports: [CommonModule, LoadingSpinner, ScoreBadge, StatusBadge, SecureImage],
  templateUrl: './candidate-details.html',
})
export class CandidateDetails {
  private route = inject(ActivatedRoute);
  private applicationService = inject(JobApplicationService);
  private candidateProfileService = inject(CandidateProfileService);
  private notification = inject(NotificationService);

  loading = signal(true);
  application = signal<JobApplication | null>(null);
  analyzing = signal(false);
  updatingStatus = signal(false);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.applicationService.getById(id).subscribe({
      next: (app) => {
        this.application.set(app);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  photoUrl(): string | null {
    const userId = this.application()?.candidate?.user?.id;
    return userId ? this.candidateProfileService.photoUrl(userId) : null;
  }

  initials(): string {
    const p = this.application()?.candidate;
    const name = `${p?.firstName ?? ''} ${p?.lastName ?? ''}`.trim();
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

  viewCv(): void {
    const id = this.application()?.id;
    if (!id) return;
    const tab = window.open('', '_blank');
    this.applicationService.fetchCvBlob(id).subscribe({
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
  }

  reanalyze(): void {
    const id = this.application()?.id;
    if (!id) return;
    this.analyzing.set(true);
    this.applicationService.analyze(id).subscribe({
      next: (updated) => {
        this.application.set(updated);
        this.analyzing.set(false);
        this.notification.success('AI analysis re-run successfully.');
      },
      error: () => this.analyzing.set(false),
    });
  }

  goBack(): void {
    window.history.back();
  }

  setStatus(status: ApplicationStatus): void {
    const id = this.application()?.id;
    if (!id) return;
    this.updatingStatus.set(true);
    this.applicationService.updateStatus(id, status).subscribe({
      next: (updated) => {
        this.application.set(updated);
        this.updatingStatus.set(false);
        this.notification.success(`Application marked as ${status.toLowerCase()}.`);
      },
      error: () => this.updatingStatus.set(false),
    });
  }
}
