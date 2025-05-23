import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  handleError(error: HttpErrorResponse): void {
    switch (error.status) {
      case 400:
        this.#log('Bad Request');
        break;
      case 403:
        this.#log('Access denied.');
        break;
      case 500:
        this.#log('Server error, try again later.');
        break;
      case 0:
        this.#log('Unknown error.');
        break;
      default:
        this.#log('Unexpected error occurred.');
    }
  }

  #log(message: string): void {
    console.log('Error logging via service & interceptor:', message);
  }
}
