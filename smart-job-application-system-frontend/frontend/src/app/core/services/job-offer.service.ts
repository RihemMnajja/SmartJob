import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JobOffer } from '../models';

@Injectable({ providedIn: 'root' })
export class JobOfferService {
  private readonly baseUrl = `${environment.apiUrl}/api/offers`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(this.baseUrl);
  }

  getById(id: number): Observable<JobOffer> {
    return this.http.get<JobOffer>(`${this.baseUrl}/${id}`);
  }

  create(offer: Partial<JobOffer>): Observable<JobOffer> {
    return this.http.post<JobOffer>(this.baseUrl, offer);
  }

  update(id: number, offer: Partial<JobOffer>): Observable<JobOffer> {
    return this.http.put<JobOffer>(`${this.baseUrl}/${id}`, offer);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
