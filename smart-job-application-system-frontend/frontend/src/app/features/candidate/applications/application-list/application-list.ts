import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService, CandidateProfileService, JobApplicationService } from '../../../../core/services';
import { ApplicationStatus, JobApplication } from '../../../../core/models';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { ScoreBadge } from '../../../../shared/components/score-badge/score-badge';
import { StatusBadge } from '../../../../shared/components/status-badge/status-badge';

type Tab = 'ALL' | ApplicationStatus;

@Component({
  selector: 'app-candidate-application-list',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeader, EmptyState, LoadingSpinner, ScoreBadge, StatusBadge],
  templateUrl: './application-list.html',
})
export class CandidateApplicationList {
  private auth = inject(AuthService);
  private profileService = inject(CandidateProfileService);
  private applicationService = inject(JobApplicationService);

  loading = signal(true);
  loadFailed = signal(false);
  applications = signal<JobApplication[]>([]);
  activeTab = signal<Tab>('ALL');
  search = signal('');

  tabs: { key: Tab; label: string }[] = [
    { key: 'ALL', label: 'All' },
    { key: 'SENT', label: 'Sent' },
    { key: 'VIEWED', label: 'Viewed' },
    { key: 'SHORTLISTED', label: 'Shortlisted' },
    { key: 'INTERVIEW', label: 'Interview' },
    { key: 'ACCEPTED', label: 'Accepted' },
    { key: 'REJECTED', label: 'Rejected' },
  ];

  filtered = computed(() => {
    const tab = this.activeTab();
    const term = this.search().trim().toLowerCase();
    return [...this.applications()]
      .filter((a) => tab === 'ALL' || a.status === tab)
      .filter(
        (a) =>
          !term ||
          a.jobOffer?.title?.toLowerCase().includes(term) ||
          a.jobOffer?.recruiter?.companyName?.toLowerCase().includes(term)
      )
      .sort((a, b) => new Date(b.applicationDate ?? 0).getTime() - new Date(a.applicationDate ?? 0).getTime());
  });

  constructor() {
    this.load();
  }

  load(): void {
    const userId = this.auth.currentUser()?.userId;
    if (!userId) {
      this.loading.set(false);
      return;
    }
    this.loading.set(true);
    this.loadFailed.set(false);
    this.profileService
      .getByUserId(userId, true)
      .pipe(switchMap((profile) => (profile.id ? this.applicationService.getByCandidate(profile.id) : of([]))))
      .subscribe({
        next: (applications) => {
          this.applications.set(applications);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load applications', err);
          this.loadFailed.set(true);
          this.loading.set(false);
        },
      });
  }
}
