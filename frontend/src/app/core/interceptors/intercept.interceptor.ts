import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';


export const interceptInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  
  let clonedReq = req;
  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  // Handle the response
  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Check if the error is a 401 Unauthorized response
      if (error.status === 401) {
        // Clear local authentication data
        localStorage.removeItem('token');
        
        
        // Redirect to the login page
        router.navigate(['/login']);
      }
      if (error.status === 403 && error.error?.accountStatus === 'expired') {
        // Clear local authentication data
        localStorage.removeItem('token');
        
        // Redirect to the login page with account expired message
        router.navigate(['/login']);
      }
      // Re-throw the error for other components to handle
      return throwError(() => error);
    })
  );
};