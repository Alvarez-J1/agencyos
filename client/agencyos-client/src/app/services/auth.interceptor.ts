import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  const authRequest = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthRequest = req.url.includes('/api/auth/');

      if (error.status === 401 && !isAuthRequest) {
        authService.logout();
        router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
      }

      return throwError(() => error);
    })
  );
};
