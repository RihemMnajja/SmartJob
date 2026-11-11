import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JobApplicationService } from '../../../../core/services';
import { JobApplication } from '../../../../core/models';
import { statusMeta } from '../../../../core/utils/application-status.util';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { ScoreBadge } from '../../../../shared/components/score-badge/score-badge';
import { StatusBadge } from '../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-candidate-application-details',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinner, ScoreBadge, StatusBadge],
  templateUrl: './application-details.html',
})
export class CandidateApplicationDetails {
  private route = inject(ActivatedRoute);
  private applicationService = inject(JobApplicationService);

  loading = signal(true);
  application = signal<JobApplication | null>(null);

  timelineSteps: { status: string; label: string; icon: string }[] = [
    { status: 'SENT', label: 'Application sent', icon: 'send' },
    { status: 'VIEWED', label: 'Viewed by recruiter', icon: 'visibility' },
    { status: 'SHORTLISTED', label: 'Shortlisted', icon: 'star' },
    { status: 'INTERVIEW', label: 'Interview stage', icon: 'forum' },
    { status: 'ACCEPTED', label: 'Offer accepted', icon: 'celebration' },
  ];

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

  currentStepIndex(): number {
    const status = this.application()?.status;
    if (status === 'REJECTED') return -1;
    return this.timelineSteps.findIndex((s) => s.status === status);
  }

  friendlyMessage(): string {
    return statusMeta(this.application()?.status).candidateMessage;
  }
}
