import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { ErrorHandlerService } from '@services';

export const errorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const errorHandler = inject(ErrorHandlerService);

  return next(request).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse) {
        errorHandler.handleError(error);
      }
      return throwError(() => error);
    })
  );
};
