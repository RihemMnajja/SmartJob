import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService, CandidateProfileService, JobApplicationService, JobOfferService, NotificationService } from '../../../../core/services';
import { JobApplication, JobOffer } from '../../../../core/models';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { ScoreBadge } from '../../../../shared/components/score-badge/score-badge';

type ApplyStep = 'idle' | 'creating' | 'uploading' | 'analyzing' | 'done';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinner, ScoreBadge],
  templateUrl: './job-details.html',
})
export class JobDetails {
  private route = inject(ActivatedRoute);
  private jobOfferService = inject(JobOfferService);
  private applicationService = inject(JobApplicationService);
  private profileService = inject(CandidateProfileService);
  private auth = inject(AuthService);
  private notification = inject(NotificationService);

  @ViewChild('cvInput') cvInput?: ElementRef<HTMLInputElement>;

  loading = signal(true);
  offer = signal<JobOffer | null>(null);
  existingApplication = signal<JobApplication | null>(null);

  applyStep = signal<ApplyStep>('idle');
  createdApplication = signal<JobApplication | null>(null);
  selectedFileName = signal<string | null>(null);

  requiredSkillsList(): string[] {
    return (this.offer()?.requiredSkills ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.jobOfferService.getById(id).subscribe({
      next: (offer) => {
        this.offer.set(offer);
        this.loading.set(false);
        this.checkExistingApplication(id);
      },
      error: () => this.loading.set(false),
    });
  }

  checkFailed = signal(false);

  private checkExistingApplication(offerId: number): void {
    const userId = this.auth.currentUser()?.userId;
    if (!userId) return;
    this.profileService.getByUserId(userId, true).subscribe({
      next: (profile) => {
        if (!profile.id) return;
        this.applicationService.getByCandidate(profile.id).subscribe({
          next: (applications) => {
            const found = applications.find((a) => a.jobOffer?.id === offerId);
            if (found) this.existingApplication.set(found);
          },
          error: (err) => {
            console.error('Failed to check existing applications', err);
            this.checkFailed.set(true);
          },
        });
      },
      error: (err) => {
        // A 404 here is normal (no profile created yet); anything else
        // (e.g. a network/CORS failure) means we genuinely couldn't check,
        // so surface that instead of silently assuming "not applied yet".
        if (err?.status !== 404) {
          console.error('Failed to load candidate profile', err);
          this.checkFailed.set(true);
        }
      },
    });
  }

  triggerFilePicker(): void {
    this.cvInput?.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.selectedFileName.set(file.name);
    this.startApply(file);
  }

  private stepOrder: ApplyStep[] = ['creating', 'uploading', 'analyzing', 'done'];

  isStepDone(step: string): boolean {
    if (this.applyStep() === 'done') return true;
    const current = this.stepOrder.indexOf(this.applyStep());
    const target = this.stepOrder.indexOf(step as ApplyStep);
    return target < current;
  }

  private startApply(file: File): void {
    const offer = this.offer();
    const userId = this.auth.currentUser()?.userId;
    if (!offer?.id || !userId) return;

    this.applyStep.set('creating');
    this.applicationService.create({ candidateId: userId, jobOfferId: offer.id }).subscribe({
      next: (application) => {
        this.createdApplication.set(application);
        this.applyStep.set('uploading');

        this.applicationService.uploadCv(application.id!, file).subscribe({
          next: () => {
            this.applyStep.set('analyzing');
            // The backend runs AI analysis synchronously as part of upload-cv;
            // re-fetch to get the final scored application.
            this.applicationService.getById(application.id!).subscribe({
              next: (finalApp) => {
                this.createdApplication.set(finalApp);
                this.existingApplication.set(finalApp);
                this.applyStep.set('done');
                this.notification.success('Application submitted! Good luck! 🤞 Your CV has been analyzed by AI. 🤖');
              },
              error: () => this.applyStep.set('done'),
            });
          },
          error: () => this.applyStep.set('idle'),
        });
      },
      error: () => this.applyStep.set('idle'),
    });
  }
}
