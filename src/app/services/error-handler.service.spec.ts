import { TestBed } from '@angular/core/testing';
import { ErrorHandlerService } from './error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;
  let logSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorHandlerService);

    logSpy = spyOn(console, 'log');
  });

  it('should log Bad Request for 400 error', () => {
    const error = new HttpErrorResponse({
      status: 400,
      statusText: 'Bad Request',
    });

    service.handleError(error);

    expect(logSpy).toHaveBeenCalledWith(
      'Error logging via service & interceptor:',
      'Bad Request'
    );
  });

  it('should log Access denied for 403 error', () => {
    const error = new HttpErrorResponse({ status: 403 });

    service.handleError(error);

    expect(logSpy).toHaveBeenCalledWith(
      'Error logging via service & interceptor:',
      'Access denied.'
    );
  });

  it('should log Server error, try again later for 500 error', () => {
    const error = new HttpErrorResponse({ status: 500 });

    service.handleError(error);

    expect(logSpy).toHaveBeenCalledWith(
      'Error logging via service & interceptor:',
      'Server error, try again later.'
    );
  });

  it('should log Unknown error for 0 error', () => {
    const error = new HttpErrorResponse({ status: 0 });

    service.handleError(error);

    expect(logSpy).toHaveBeenCalledWith(
      'Error logging via service & interceptor:',
      'Unknown error.'
    );
  });
});
