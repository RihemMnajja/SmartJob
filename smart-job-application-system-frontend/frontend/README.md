# SmartJob — Smart Job Application System (Frontend)

Angular 20 standalone frontend for the Smart Job Application System, connected to a Spring Boot 3 backend
(JWT auth, PostgreSQL, Swagger). No mock data — every screen calls the real REST API.

## Stack

- Angular 20 (standalone components, signals, new control-flow syntax `@if`/`@for`)
- Angular Material (dialogs, snackbars, spinners) + Tailwind CSS (design system)
- Reactive Forms, Angular Router with lazy-loaded feature routes
- JWT auth via `HttpInterceptorFn`, role-based route guards

## Getting started

```bash
npm install
ng serve
```

The app runs at `http://localhost:4200` and expects the Spring Boot backend at `http://localhost:8080`
(see `src/environments/environment.ts`). CORS must allow `http://localhost:4200` on the backend (already
configured per the project spec).

Start the backend first (Spring Boot on port 8080), then run the frontend.

## Project structure

```
src/app/
  core/
    models/         TypeScript interfaces mirroring the backend DTOs/entities exactly
    services/        One service per backend controller (Auth, CandidateProfile, RecruiterProfile,
                     JobOffer, JobApplication, Notification/SnackBar, Loading)
    guards/          authGuard, guestGuard, roleGuard(['ROLE_CANDIDAT' | 'ROLE_RH'])
    interceptors/    jwtInterceptor (attaches Bearer token), errorInterceptor (401 -> logout + redirect,
                     surfaces backend error messages as snackbars), loadingInterceptor (global progress bar)
  layouts/
    candidate-layout/   Dark sidebar + topbar shell for authenticated candidates
    recruiter-layout/   Dark sidebar + topbar shell for authenticated recruiters
  shared/components/    Reusable UI kit: page-header, empty-state, score-badge, status-badge,
                        confirm-dialog, loading-spinner, secure-image, auth-shell, navbar/footer
  features/
    landing/             Public marketing site (hero, features, how it works, AI section, testimonials)
    auth/                login, register (candidate/recruiter), forgot/reset password
    candidate/           dashboard, profile (view/edit), job browsing, apply flow, applications,
                         notifications (derived from real application data), settings
    recruiter/           dashboard, job offer CRUD, AI-ranked candidate list per offer, candidate
                         detail view, settings (company profile + password)
```

## Backend endpoints this app calls

Matches the Swagger contract of the provided Spring Boot project exactly:

- `POST /auth/login`, `POST /auth/register`, `POST /auth/register/recruiter`
- `PUT /auth/change-password`, `POST /auth/forgot-password`, `POST /auth/reset-password`
- `GET|POST|PUT|DELETE /profile/{userId}`, `POST /profile/{userId}/upload-photo`, `GET /profile/{userId}/photo`
- `GET|POST|PUT|DELETE /api/recruiters[/{id}]`
- `GET|POST|PUT|DELETE /api/offers[/{id}]`
- `GET|POST|PUT|DELETE /api/applications[/{id}]`
- `POST /api/applications/{id}/upload-cv` — uploads the CV and the backend runs AI analysis synchronously
- `POST /api/applications/{id}/analyze` — re-run AI analysis
- `GET /api/applications/{id}/view-cv` — **recruiter-only** per the backend's `SecurityConfig`
- `PUT /api/applications/{id}/status`
- `GET /api/applications/candidate/{candidateId}`, `GET /api/applications/offer/{offerId}[/sorted]`

### Two intentional adaptations to match real backend behavior

1. **CV upload is per-application, not per-profile.** The backend has no endpoint to upload/view a CV directly
   on a candidate profile — a CV is only ever attached when applying to a specific job
   (`POST /api/applications/{id}/upload-cv`), which triggers AI analysis automatically. The candidate Profile
   page reflects this instead of calling a non-existent endpoint.
2. **`GET /api/applications/{id}/view-cv` is `hasRole("RH")` only** in `SecurityConfig`. The "View CV" action is
   therefore only exposed in the recruiter's candidate ranking / candidate details screens, not on the
   candidate side. Since a plain `<a>`/`window.open()` can't send the `Authorization` header, this is fetched
   as a blob via `HttpClient` (which goes through the JWT interceptor) and opened from an object URL instead —
   see `fetchCvBlob` in `job-application.service.ts`.
3. **Protected images need the JWT header.** Same reasoning as above — profile photos
   (`GET /profile/{userId}/photo`) are fetched via `HttpClient` and rendered as a blob URL — see
   `shared/components/secure-image`.
4. **`GET /api/applications/candidate/{candidateId}` expects `CandidateProfile.id`, not `User.id`.** Confirmed
   by reading `JobApplicationService.findByCandidate()` on the backend: it calls
   `repository.findByCandidateId(candidateId)`, a JPA-derived query on the `JobApplication.candidate`
   association's primary key — i.e. the *profile* id. This is different from `POST /api/applications`, whose
   `candidateId` is explicitly `User.id` (the controller resolves it via `candidateRepository.findByUserId(...)`
   internally). Every place that lists a candidate's own applications (dashboard, My Applications,
   notifications, "already applied" check on job details) now resolves `CandidateProfile.id` via
   `GET /profile/{userId}` first, then calls the applications endpoint with `profile.id`.

## Known backend gap — requires a one-line fix on your side

**`PUT/POST/DELETE /profile/{userId}` fails from the browser with a network error ("Cannot reach the
server").** This is not a frontend bug: `CandidateProfileController` is the only controller in the project
without a `@CrossOrigin` annotation, and there's no global CORS bean anywhere in the project
(`SecurityConfig` has no `.cors(...)` configuration; no `WebMvcConfigurer`/`CorsConfigurationSource` bean
exists). Swagger UI doesn't hit this because it's same-origin; the Angular app at `:4200` calling `:8080` is a
genuine cross-origin request, so the browser blocks it at the CORS layer before Angular ever sees a real HTTP
status — which is why it can only surface as a generic network error.

Fix: add the same annotation the other controllers already have, e.g.

```java
@RestController
@RequestMapping("/profile")
@CrossOrigin(origins = "http://localhost:4200") // <- add this
@SecurityRequirement(name = "bearerAuth")
public class CandidateProfileController {
```

The frontend already distinguishes this case (a real `status: 0` failure) from an expected "no profile yet"
404, and will show a clear message pointing back to this fix if it happens again.

## Notes

- "Notifications" (candidate) has no dedicated backend endpoint, so it's derived client-side from the
  candidate's own applications (AI score ready, status changes) rather than faking a fresh API.
- Recruiters get a `RecruiterProfile` automatically created at registration (per `UserService`), so
  Settings → Company profile edits that existing record rather than creating a new one.
