import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { LoginService } from './login.service';
import { KANYE_API_URL } from 'app/app.config';
import { QuoteResponse } from '@shared/models';
import { provideHttpClient } from '@angular/common/http';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;

  const mockUrl = 'https://mock.kanye.rest';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoginService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: KANYE_API_URL,
          useValue: mockUrl,
        },
      ],
    });

    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch a quote from the API', (done: DoneFn) => {
    const quoteStr: string = 'I am the greatest.';

    const mockResponse: QuoteResponse = {
      quote: quoteStr,
    };

    service.getQuote().subscribe((quote) => {
      expect(quote).toBe(quoteStr);
      done();
    });

    const req = httpMock.expectOne(mockUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
