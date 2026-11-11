import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService, JobApplicationService, JobOfferService } from '../../../core/services';
import { ApplicationStatus, JobApplication, JobOffer } from '../../../core/models';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { ScoreBadge } from '../../../shared/components/score-badge/score-badge';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-recruiter-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeader, EmptyState, LoadingSpinner, ScoreBadge, StatusBadge],
  templateUrl: './dashboard.html',
})
export class RecruiterDashboard {
  private auth = inject(AuthService);
  private offerService = inject(JobOfferService);
  private applicationService = inject(JobApplicationService);

  loading = signal(true);
  offers = signal<JobOffer[]>([]);
  applications = signal<JobApplication[]>([]);

  myOffers = computed(() => {
    const userId = this.auth.currentUser()?.userId;
    return this.offers().filter((o) => o.recruiter?.user?.id === userId);
  });

  myOfferIds = computed(() => new Set(this.myOffers().map((o) => o.id)));

  myApplications = computed(() => this.applications().filter((a) => this.myOfferIds().has(a.jobOffer?.id)));

  statusBreakdown = computed(() => {
    const statuses: ApplicationStatus[] = ['SENT', 'VIEWED', 'SHORTLISTED', 'INTERVIEW', 'ACCEPTED', 'REJECTED'];
    const apps = this.myApplications();
    const counts = statuses.map((s) => ({ status: s, count: apps.filter((a) => a.status === s).length }));
    const max = Math.max(1, ...counts.map((c) => c.count));
    return counts.map((c) => ({ ...c, percent: Math.round((c.count / max) * 100) }));
  });

  recentApplications = computed(() =>
    [...this.myApplications()]
      .sort((a, b) => new Date(b.applicationDate ?? 0).getTime() - new Date(a.applicationDate ?? 0).getTime())
      .slice(0, 6)
  );

  stats = computed(() => ({
    activeOffers: this.myOffers().length,
    totalApplications: this.myApplications().length,
    avgScore: (() => {
      const scored = this.myApplications().filter((a) => a.scoreIa !== null && a.scoreIa !== undefined);
      return scored.length ? Math.round(scored.reduce((s, a) => s + (a.scoreIa ?? 0), 0) / scored.length) : null;
    })(),
    inInterview: this.myApplications().filter((a) => a.status === 'INTERVIEW').length,
  }));

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
}
