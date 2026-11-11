import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService, NotificationService } from '../services';

/**
 * Set this to `true` in a request's HttpContext to suppress the automatic
 * error snackbar — used for calls where a failure is an expected, normal
 * state (e.g. "GET profile" returning 404 for a candidate who hasn't
 * created one yet) and the component handles the message itself.
 */
export const SKIP_ERROR_NOTIFICATION = new HttpContextToken<boolean>(() => false);

function extractMessage(error: HttpErrorResponse): string {
  if (typeof error.error === 'string' && error.error.trim().length) {
    return error.error;
  }
  if (error.error?.error) return error.error.error;
  if (error.error?.message) return error.error.message;
  if (error.status === 0) return 'Cannot reach the server. Is the backend running on localhost:8080?';
  if (error.status === 404) return 'The requested resource was not found.';
  if (error.status === 403) return 'You do not have permission to perform this action.';
  return error.message || 'Something went wrong. Please try again.';
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        auth.logout();
        notification.error('Your session has expired. Please sign in again.');
        router.navigate(['/auth/login']);
      } else {
        // SKIP_ERROR_NOTIFICATION only ever suppresses the expected "no
        // profile yet" 404 — a CORS failure, 500, or any other error must
        // always surface, or it fails completely silently for the user.
        const isExpectedMissingResource = req.context.get(SKIP_ERROR_NOTIFICATION) && error.status === 404;
        if (!isExpectedMissingResource) {
          notification.error(extractMessage(error));
        }
      }
      // Always log the real error for developers, regardless of what the
      // user sees — never let a failure disappear entirely.
      console.error(`[HTTP ${error.status}] ${req.method} ${req.url}`, error);
      return throwError(() => error);
    })
  );
};
