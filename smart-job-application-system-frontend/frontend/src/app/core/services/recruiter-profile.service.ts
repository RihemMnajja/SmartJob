import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RecruiterProfile } from '../models';

@Injectable({ providedIn: 'root' })
export class RecruiterProfileService {
  private readonly baseUrl = `${environment.apiUrl}/api/recruiters`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<RecruiterProfile[]> {
    return this.http.get<RecruiterProfile[]>(this.baseUrl);
  }

  getById(id: number): Observable<RecruiterProfile> {
    return this.http.get<RecruiterProfile>(`${this.baseUrl}/${id}`);
  }

  create(profile: Partial<RecruiterProfile>): Observable<RecruiterProfile> {
    return this.http.post<RecruiterProfile>(this.baseUrl, profile);
  }

  update(id: number, profile: Partial<RecruiterProfile>): Observable<RecruiterProfile> {
    return this.http.put<RecruiterProfile>(`${this.baseUrl}/${id}`, profile);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
