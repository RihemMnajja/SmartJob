import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterCandidateRequest,
  RegisterRecruiterRequest,
  RegisterResponse,
  Role,
} from '../models';

const TOKEN_KEY = 'sjas_token';
const USER_KEY = 'sjas_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  private readonly currentUserSignal = signal<AuthUser | null>(this.readStoredUser());

  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  readonly role = computed<Role | null>(() => this.currentUserSignal()?.role ?? null);
  readonly isCandidate = computed(() => this.role() === 'ROLE_CANDIDAT');
  readonly isRecruiter = computed(() => this.role() === 'ROLE_RH');

  constructor(private http: HttpClient) {}

  private readStoredUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, request).pipe(
      tap((res) => this.persistSession(res))
    );
  }

  registerCandidate(request: RegisterCandidateRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, request);
  }

  registerRecruiter(request: RegisterRecruiterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register/recruiter`, request);
  }

  forgotPassword(email: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email }, { responseType: 'text' });
  }

  resetPassword(token: string, newPassword: string, confirmPassword: string): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/reset-password`,
      { token, newPassword, confirmPassword },
      { responseType: 'text' }
    );
  }

  changePassword(oldPassword: string, newPassword: string, confirmPassword: string): Observable<string> {
    return this.http.put(
      `${this.baseUrl}/change-password`,
      { oldPassword, newPassword, confirmPassword },
      { responseType: 'text' }
    );
  }

  private persistSession(res: LoginResponse): void {
    const user: AuthUser = { userId: res.userId, name: res.name, email: res.email, role: res.role };
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUserSignal.set(user);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  homeRouteForRole(role: Role | null): string {
    if (role === 'ROLE_RH') return '/recruiter/dashboard';
    if (role === 'ROLE_CANDIDAT') return '/candidate/dashboard';
    return '/';
  }
}
