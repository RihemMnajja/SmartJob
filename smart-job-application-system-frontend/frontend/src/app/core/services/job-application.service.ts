import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApplicationRequest, ApplicationStatus, JobApplication } from '../models';

@Injectable({ providedIn: 'root' })
export class JobApplicationService {
  private readonly baseUrl = `${environment.apiUrl}/api/applications`;

  constructor(private http: HttpClient) {}

  create(request: ApplicationRequest): Observable<JobApplication> {
    return this.http.post<JobApplication>(this.baseUrl, request);
  }

  getAll(): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(this.baseUrl);
  }

  getById(id: number): Observable<JobApplication> {
    return this.http.get<JobApplication>(`${this.baseUrl}/${id}`);
  }

  update(id: number, application: Partial<JobApplication>): Observable<JobApplication> {
    return this.http.put<JobApplication>(`${this.baseUrl}/${id}`, application);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * IMPORTANT: unlike POST /api/applications (which takes candidateId = User.id
   * and resolves the profile internally), this GET endpoint is backed by
   * `repository.findByCandidateId(...)`, a JPA-derived query on the
   * `JobApplication.candidate` association — so it expects the
   * **CandidateProfile.id**, not the User.id. Always resolve the profile
   * first (`CandidateProfileService.getByUserId`) and pass `profile.id` here.
   */
  getByCandidate(candidateProfileId: number): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.baseUrl}/candidate/${candidateProfileId}`);
  }

  getByOffer(offerId: number): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.baseUrl}/offer/${offerId}`);
  }

  getByOfferSortedByScore(offerId: number): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.baseUrl}/offer/${offerId}/sorted`);
  }

  /**
   * Fetches the candidate's CV as a blob via HttpClient (so the JWT
   * interceptor attaches Authorization). A plain <a>/window.open() to this
   * URL would send no auth header and get rejected — this endpoint is
   * RH-only per the backend's SecurityConfig.
   */
  fetchCvBlob(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/view-cv`, { responseType: 'blob' });
  }

  updateStatus(id: number, status: ApplicationStatus): Observable<JobApplication> {
    return this.http.put<JobApplication>(`${this.baseUrl}/${id}/status`, { status });
  }

  /** Uploads the CV for an application; backend automatically triggers AI analysis. */
  uploadCv(id: number, file: File): Observable<JobApplication> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<JobApplication>(`${this.baseUrl}/${id}/upload-cv`, formData);
  }

  /** Manually re-triggers AI analysis on an existing application. */
  analyze(id: number): Observable<JobApplication> {
    return this.http.post<JobApplication>(`${this.baseUrl}/${id}/analyze`, {});
  }
}
