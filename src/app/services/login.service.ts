import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { QuoteResponse } from '@shared/models';
import { KANYE_API_URL } from 'app/app.config';
import { AUTH_TOKEN_KEY, LOGIN_EXPIRY_TIME_KEY } from '@shared/constants';
import { Router } from '@angular/router';
import { AppRoutes } from 'app/app.routes';
import { TimerService } from './timer.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  readonly #url = inject(KANYE_API_URL);
  readonly #http = inject(HttpClient);
  readonly #router = inject(Router);
  readonly #timerService = inject(TimerService);

  private readonly isLoggedInSubject$ = new BehaviorSubject<boolean>(
    this.checkToken()
  );

  isLoggedIn$ = this.isLoggedInSubject$.asObservable();

  get isLoggedIn(): boolean {
    return this.isLoggedInSubject$.value;
  }

  private checkToken(): boolean {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  }

  getQuote(): Observable<string> {
    return this.#http
      .get<QuoteResponse>(this.#url)
      .pipe(map(({ quote }) => quote));
  }

  login(): void {
    localStorage.setItem(AUTH_TOKEN_KEY, 'your-token');
    this.#timerService.startLogoutTimer();
    this.isLoggedInSubject$.next(true);
  }

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(LOGIN_EXPIRY_TIME_KEY);
    this.#timerService.stopLogoutTimer();
    this.#router.navigate([AppRoutes.Login]);
    this.isLoggedInSubject$.next(false);
  }
}
