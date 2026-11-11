import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService, CandidateProfileService, JobApplicationService } from '../../../core/services';
import { CandidateProfile, JobApplication } from '../../../core/models';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { ScoreBadge } from '../../../shared/components/score-badge/score-badge';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeader, EmptyState, LoadingSpinner, ScoreBadge, StatusBadge],
  templateUrl: './dashboard.html',
})
export class CandidateDashboard {
  auth = inject(AuthService);
  private profileService = inject(CandidateProfileService);
  private applicationService = inject(JobApplicationService);

  loading = signal(true);
  loadFailed = signal(false);
  profile = signal<CandidateProfile | null>(null);
  applications = signal<JobApplication[]>([]);

  recentApplications = computed(() =>
    [...this.applications()]
      .sort((a, b) => new Date(b.applicationDate ?? 0).getTime() - new Date(a.applicationDate ?? 0).getTime())
      .slice(0, 5)
  );

  stats = computed(() => {
    const apps = this.applications();
    const scored = apps.filter((a) => a.scoreIa !== null && a.scoreIa !== undefined);
    const avgScore = scored.length
      ? Math.round(scored.reduce((sum, a) => sum + (a.scoreIa ?? 0), 0) / scored.length)
      : null;
    return {
      total: apps.length,
      interviews: apps.filter((a) => a.status === 'INTERVIEW').length,
      accepted: apps.filter((a) => a.status === 'ACCEPTED').length,
      avgScore,
    };
  });

  profileCompleteness = computed(() => {
    const p = this.profile();
    if (!p) return 0;
    const checks = [
      !!p.professionalTitle,
      !!p.summary,
      !!p.phone,
      !!p.city,
      !!(p.experiences && p.experiences.length),
      !!(p.educations && p.educations.length),
      !!(p.skills && p.skills.length),
      !!p.cvPath,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
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

    // The applications endpoint (GET /api/applications/candidate/{id}) is keyed
    // by CandidateProfile.id, not User.id, so the profile must be resolved first.
    this.profileService
      .getByUserId(userId, true)
      .pipe(
        switchMap((profile) => {
          this.profile.set(profile);
          if (!profile.id) return of([] as JobApplication[]);
          return this.applicationService.getByCandidate(profile.id);
        })
      )
      .subscribe({
        next: (applications) => {
          this.applications.set(applications);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load dashboard data', err);
          this.loadFailed.set(true);
          this.loading.set(false);
        },
      });
  }
}
