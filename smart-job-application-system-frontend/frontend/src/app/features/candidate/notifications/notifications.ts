import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService, CandidateProfileService, JobApplicationService } from '../../../core/services';
import { JobApplication } from '../../../core/models';
import { statusMeta } from '../../../core/utils/application-status.util';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

interface NotificationItem {
  id: string;
  emoji: string;
  iconClass: string;
  title: string;
  message: string;
  date: string;
  link: string[];
}

@Component({
  selector: 'app-candidate-notifications',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeader, EmptyState, LoadingSpinner],
  templateUrl: './notifications.html',
})
export class CandidateNotifications {
  private auth = inject(AuthService);
  private profileService = inject(CandidateProfileService);
  private applicationService = inject(JobApplicationService);

  loading = signal(true);
  applications = signal<JobApplication[]>([]);

  notifications = computed<NotificationItem[]>(() => {
    const items: NotificationItem[] = [];

    for (const app of this.applications()) {
      const jobTitle = app.jobOffer?.title ?? 'a job';

      if (app.scoreIa !== null && app.scoreIa !== undefined) {
        items.push({
          id: `score-${app.id}`,
          emoji: '🤖',
          iconClass: 'bg-primary-50 text-primary-600',
          title: 'AI analysis complete',
          message: `Your CV for "${jobTitle}" has been analyzed by AI — ${app.scoreIa}% match.`,
          date: app.applicationDate ?? '',
          link: ['/candidate/applications', String(app.id)],
        });
      }

      if (app.status) {
        const meta = statusMeta(app.status);
        items.push({
          id: `status-${app.id}`,
          emoji: meta.emoji,
          iconClass: meta.badgeClasses,
          title: `Application ${meta.label.toLowerCase()}`,
          message: `Your application for "${jobTitle}": ${meta.candidateMessage}`,
          date: app.applicationDate ?? '',
          link: ['/candidate/applications', String(app.id)],
        });
      }
    }

    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  constructor() {
    const userId = this.auth.currentUser()?.userId;
    if (!userId) {
      this.loading.set(false);
      return;
    }
    this.profileService
      .getByUserId(userId, true)
      .pipe(switchMap((profile) => (profile.id ? this.applicationService.getByCandidate(profile.id) : of([]))))
      .subscribe({
        next: (applications) => {
          this.applications.set(applications);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load notifications', err);
          this.loading.set(false);
        },
      });
  }
}
