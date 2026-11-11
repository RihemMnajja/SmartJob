import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AuthService, CandidateProfileService, NotificationService } from '../../../core/services';
import { CandidateProfile } from '../../../core/models';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { SecureImage } from '../../../shared/components/secure-image/secure-image';

@Component({
  selector: 'app-candidate-profile-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeader, LoadingSpinner, SecureImage],
  templateUrl: './profile.html',
})
export class CandidateProfilePage {
  private fb = inject(FormBuilder);
  auth = inject(AuthService);
  private profileService = inject(CandidateProfileService);
  private notification = inject(NotificationService);

  @ViewChild('photoInput') photoInput?: ElementRef<HTMLInputElement>;

  loading = signal(true);
  saving = signal(false);
  editing = signal(false);
  uploadingPhoto = signal(false);
  photoVersion = signal(0);
  profile = signal<CandidateProfile | null>(null);

  educationLevels = ['High School', 'Bachelor', 'Master', 'PhD', 'Bootcamp / Certification', 'Other'];
  availabilities = ['Immediately', 'Within 1 month', 'Within 3 months', 'Not looking'];
  languageLevels = ['Beginner', 'Intermediate', 'Advanced', 'Fluent', 'Native'];

  form = this.fb.nonNullable.group({
    firstName: [''],
    lastName: [''],
    professionalTitle: [''],
    summary: [''],
    phone: [''],
    address: [''],
    city: [''],
    nationality: [''],
    availability: [''],
    educationLevel: [''],
    school: [''],
    linkedin: [''],
    github: [''],
    portfolio: [''],
    experiences: this.fb.array<ReturnType<typeof this.buildExperience>>([]),
    educations: this.fb.array<ReturnType<typeof this.buildEducation>>([]),
    skills: this.fb.array<ReturnType<typeof this.buildSkill>>([]),
    languages: this.fb.array<ReturnType<typeof this.buildLanguage>>([]),
    certifications: this.fb.array<ReturnType<typeof this.buildCertification>>([]),
    projects: this.fb.array<ReturnType<typeof this.buildProject>>([]),
  });

  get experiences() {
    return this.form.controls.experiences;
  }
  get educations() {
    return this.form.controls.educations;
  }
  get skills() {
    return this.form.controls.skills;
  }
  get languages() {
    return this.form.controls.languages;
  }
  get certifications() {
    return this.form.controls.certifications;
  }
  get projects() {
    return this.form.controls.projects;
  }

  constructor() {
    this.load();
  }

  private userId(): number {
    return this.auth.currentUser()!.userId;
  }

  private load(): void {
    this.loading.set(true);
    this.profileService.getByUserId(this.userId(), true).subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.patchForm(profile);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.profile.set(null);
        this.loading.set(false);
        if (err.status === 404) {
          // Expected first-time state — no profile created yet.
          return;
        }
        if (err.status === 0) {
          this.notification.error(
            "Can't reach the profile service. If this keeps happening, the backend may be missing CORS configuration for /profile/**."
          );
        } else {
          this.notification.error('Failed to load your profile. Please try again.');
        }
      },
    });
  }

  private buildExperience(exp?: any) {
    return this.fb.nonNullable.group({
      id: [exp?.id ?? null],
      company: [exp?.company ?? '', Validators.required],
      position: [exp?.position ?? '', Validators.required],
      startDate: [exp?.startDate ?? ''],
      endDate: [exp?.endDate ?? ''],
      description: [exp?.description ?? ''],
      technologies: [exp?.technologies ?? ''],
    });
  }

  private buildEducation(edu?: any) {
    return this.fb.nonNullable.group({
      id: [edu?.id ?? null],
      diploma: [edu?.diploma ?? '', Validators.required],
      establishment: [edu?.establishment ?? '', Validators.required],
      year: [edu?.year ?? ''],
    });
  }

  private buildSkill(skill?: any) {
    return this.fb.nonNullable.group({
      id: [skill?.id ?? null],
      name: [skill?.name ?? '', Validators.required],
      category: [skill?.category ?? ''],
    });
  }

  private buildLanguage(lang?: any) {
    return this.fb.nonNullable.group({
      id: [lang?.id ?? null],
      name: [lang?.name ?? '', Validators.required],
      level: [lang?.level ?? 'Intermediate'],
    });
  }

  private buildCertification(cert?: any) {
    return this.fb.nonNullable.group({
      id: [cert?.id ?? null],
      name: [cert?.name ?? '', Validators.required],
      organization: [cert?.organization ?? ''],
      year: [cert?.year ?? ''],
    });
  }

  private buildProject(proj?: any) {
    return this.fb.nonNullable.group({
      id: [proj?.id ?? null],
      name: [proj?.name ?? '', Validators.required],
      description: [proj?.description ?? ''],
      technologies: [proj?.technologies ?? ''],
      githubLink: [proj?.githubLink ?? ''],
    });
  }

  private patchForm(profile: CandidateProfile): void {
    this.form.patchValue({
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      professionalTitle: profile.professionalTitle ?? '',
      summary: profile.summary ?? '',
      phone: profile.phone ?? '',
      address: profile.address ?? '',
      city: profile.city ?? '',
      nationality: profile.nationality ?? '',
      availability: profile.availability ?? '',
      educationLevel: profile.educationLevel ?? '',
      school: profile.school ?? '',
      linkedin: profile.linkedin ?? '',
      github: profile.github ?? '',
      portfolio: profile.portfolio ?? '',
    });

    this.setArray(this.experiences, profile.experiences, (e) => this.buildExperience(e));
    this.setArray(this.educations, profile.educations, (e) => this.buildEducation(e));
    this.setArray(this.skills, profile.skills, (e) => this.buildSkill(e));
    this.setArray(this.languages, profile.languages, (e) => this.buildLanguage(e));
    this.setArray(this.certifications, profile.certifications, (e) => this.buildCertification(e));
    this.setArray(this.projects, profile.projects, (e) => this.buildProject(e));
  }

  private setArray(array: FormArray, items: any[] | undefined, factory: (item: any) => any): void {
    array.clear();
    (items ?? []).forEach((item) => array.push(factory(item)));
  }

  addExperience(): void {
    this.experiences.push(this.buildExperience());
  }
  removeExperience(i: number): void {
    this.experiences.removeAt(i);
  }

  addEducation(): void {
    this.educations.push(this.buildEducation());
  }
  removeEducation(i: number): void {
    this.educations.removeAt(i);
  }

  addSkill(): void {
    this.skills.push(this.buildSkill());
  }
  removeSkill(i: number): void {
    this.skills.removeAt(i);
  }

  addLanguage(): void {
    this.languages.push(this.buildLanguage());
  }
  removeLanguage(i: number): void {
    this.languages.removeAt(i);
  }

  addCertification(): void {
    this.certifications.push(this.buildCertification());
  }
  removeCertification(i: number): void {
    this.certifications.removeAt(i);
  }

  addProject(): void {
    this.projects.push(this.buildProject());
  }
  removeProject(i: number): void {
    this.projects.removeAt(i);
  }

  startEditing(): void {
    if (this.profile()) this.patchForm(this.profile()!);
    this.editing.set(true);
  }

  cancelEditing(): void {
    if (this.profile()) this.patchForm(this.profile()!);
    this.editing.set(false);
  }

  save(): void {
    this.saving.set(true);
    const payload = this.form.getRawValue() as unknown as Partial<CandidateProfile>;
    const exists = !!this.profile();
    const request$ = exists
      ? this.profileService.update(this.userId(), payload)
      : this.profileService.create(this.userId(), payload);

    request$.subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.patchForm(profile);
        this.saving.set(false);
        this.editing.set(false);
        this.notification.success('Profile saved successfully.');
      },
      error: () => this.saving.set(false),
    });
  }

  triggerPhotoUpload(): void {
    this.photoInput?.nativeElement.click();
  }

  onPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.uploadingPhoto.set(true);
    this.profileService.uploadPhoto(this.userId(), file).subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.uploadingPhoto.set(false);
        this.photoVersion.update((v) => v + 1);
        this.notification.success('Profile photo updated.');
      },
      error: () => this.uploadingPhoto.set(false),
    });
  }

  photoUrl(): string {
    return `${this.profileService.photoUrl(this.userId())}?v=${this.photoVersion()}`;
  }

  initials(): string {
    const p = this.profile();
    const name = `${p?.firstName ?? ''} ${p?.lastName ?? ''}`.trim() || this.auth.currentUser()?.name || '';
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
}
