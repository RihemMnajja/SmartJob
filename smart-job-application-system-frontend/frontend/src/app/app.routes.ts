import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing').then((m) => m.Landing),
    title: 'SmartJob — AI-Powered Hiring',
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
        title: 'Sign in — SmartJob',
      },
      {
        path: 'register/candidate',
        loadComponent: () =>
          import('./features/auth/register-candidate/register-candidate').then((m) => m.RegisterCandidate),
        title: 'Create your candidate account — SmartJob',
      },
      {
        path: 'register/recruiter',
        loadComponent: () =>
          import('./features/auth/register-recruiter/register-recruiter').then((m) => m.RegisterRecruiter),
        title: 'Create your recruiter account — SmartJob',
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./features/auth/forgot-password/forgot-password').then((m) => m.ForgotPassword),
        title: 'Reset your password — SmartJob',
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./features/auth/reset-password/reset-password').then((m) => m.ResetPassword),
        title: 'Choose a new password — SmartJob',
      },
    ],
  },
  {
    path: 'candidate',
    canActivate: [authGuard, roleGuard(['ROLE_CANDIDAT'])],
    loadComponent: () => import('./layouts/candidate-layout/candidate-layout').then((m) => m.CandidateLayout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/candidate/dashboard/dashboard').then((m) => m.CandidateDashboard),
        title: 'Dashboard — SmartJob',
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/candidate/profile/profile').then((m) => m.CandidateProfilePage),
        title: 'My Profile — SmartJob',
      },
      {
        path: 'jobs',
        loadComponent: () => import('./features/candidate/jobs/job-list/job-list').then((m) => m.JobList),
        title: 'Browse Jobs — SmartJob',
      },
      {
        path: 'jobs/:id',
        loadComponent: () => import('./features/candidate/jobs/job-details/job-details').then((m) => m.JobDetails),
        title: 'Job Details — SmartJob',
      },
      {
        path: 'applications',
        loadComponent: () =>
          import('./features/candidate/applications/application-list/application-list').then(
            (m) => m.CandidateApplicationList
          ),
        title: 'My Applications — SmartJob',
      },
      {
        path: 'applications/:id',
        loadComponent: () =>
          import('./features/candidate/applications/application-details/application-details').then(
            (m) => m.CandidateApplicationDetails
          ),
        title: 'Application Details — SmartJob',
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/candidate/notifications/notifications').then((m) => m.CandidateNotifications),
        title: 'Notifications — SmartJob',
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/candidate/settings/settings').then((m) => m.CandidateSettings),
        title: 'Settings — SmartJob',
      },
    ],
  },
  {
    path: 'recruiter',
    canActivate: [authGuard, roleGuard(['ROLE_RH'])],
    loadComponent: () => import('./layouts/recruiter-layout/recruiter-layout').then((m) => m.RecruiterLayout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/recruiter/dashboard/dashboard').then((m) => m.RecruiterDashboard),
        title: 'Recruiter Dashboard — SmartJob',
      },
      {
        path: 'offers',
        loadComponent: () => import('./features/recruiter/offers/offer-list/offer-list').then((m) => m.OfferList),
        title: 'Job Offers — SmartJob',
      },
      {
        path: 'offers/new',
        loadComponent: () => import('./features/recruiter/offers/offer-form/offer-form').then((m) => m.OfferForm),
        title: 'Create Job Offer — SmartJob',
      },
      {
        path: 'offers/:id/edit',
        loadComponent: () => import('./features/recruiter/offers/offer-form/offer-form').then((m) => m.OfferForm),
        title: 'Edit Job Offer — SmartJob',
      },
      {
        path: 'offers/:id/applications',
        loadComponent: () =>
          import('./features/recruiter/applications/application-list/application-list').then(
            (m) => m.RecruiterApplicationList
          ),
        title: 'Candidate Ranking — SmartJob',
      },
      {
        path: 'applications/:id',
        loadComponent: () =>
          import('./features/recruiter/applications/candidate-details/candidate-details').then(
            (m) => m.CandidateDetails
          ),
        title: 'Candidate Details — SmartJob',
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/recruiter/settings/settings').then((m) => m.RecruiterSettings),
        title: 'Settings — SmartJob',
      },
    ],
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./shared/components/unauthorized/unauthorized').then((m) => m.UnauthorizedPage),
    title: 'Unauthorized — SmartJob',
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found').then((m) => m.NotFoundPage),
    title: 'Page not found — SmartJob',
  },
];
