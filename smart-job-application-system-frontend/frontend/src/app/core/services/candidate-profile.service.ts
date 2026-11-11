import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CandidateProfile } from '../models';
import { SKIP_ERROR_NOTIFICATION } from '../interceptors/error.interceptor';

@Injectable({ providedIn: 'root' })
export class CandidateProfileService {
  private readonly baseUrl = `${environment.apiUrl}/profile`;

  constructor(private http: HttpClient) {}

  /**
   * @param silentIfMissing When true, suppresses the global error snackbar —
   * use this on first load, where a 404 just means "no profile yet" and is
   * not a real error worth surfacing.
   */
  getByUserId(userId: number, silentIfMissing = false): Observable<CandidateProfile> {
    return this.http.get<CandidateProfile>(`${this.baseUrl}/${userId}`, {
      context: silentIfMissing ? new HttpContext().set(SKIP_ERROR_NOTIFICATION, true) : undefined,
    });
  }

  create(userId: number, profile: Partial<CandidateProfile>): Observable<CandidateProfile> {
    return this.http.post<CandidateProfile>(`${this.baseUrl}/${userId}`, profile);
  }

  update(userId: number, profile: Partial<CandidateProfile>): Observable<CandidateProfile> {
    return this.http.put<CandidateProfile>(`${this.baseUrl}/${userId}`, profile);
  }

  delete(userId: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${userId}`, { responseType: 'text' });
  }

  uploadPhoto(userId: number, file: File): Observable<CandidateProfile> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<CandidateProfile>(`${this.baseUrl}/${userId}/upload-photo`, formData);
  }

  photoUrl(userId: number): string {
    return `${this.baseUrl}/${userId}/photo`;
  }
}
