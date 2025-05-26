import { ErrorHandler, inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService implements ErrorHandler {
  handleError(error: HttpErrorResponse): void {
    const errorMessages: Record<number, string> = {
      400: 'Bad Request',
      403: 'Access denied.',
      500: 'Server error, try again later.',
      0: 'Unknown error.',
    };

    const message = errorMessages[error.status] || 'Unexpected error occurred.';
    this.#log(message);
  }

  #log(message: string): void {
    console.log('Error logging via service & interceptor:', message);
  }
}
