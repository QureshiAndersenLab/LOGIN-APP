import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { QuoteResponse } from '@shared/models';
import { KANYE_API_URL } from 'app/app.config';
import { AUTH_TOKEN_KEY, LOGIN_EXPIRY_TIME_KEY } from '@shared/constants';
import { Router } from '@angular/router';
import { AppRoutes } from 'app/app.routes';
import { TimerService } from './timer.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService implements OnDestroy {
  readonly #url = inject(KANYE_API_URL);
  readonly #http = inject(HttpClient);
  readonly #router = inject(Router);
  readonly #timerService = inject(TimerService);
  readonly #localStorageService = inject(LocalStorageService);

  private readonly isLoggedInSubject$ = new BehaviorSubject<boolean>(
    this.#checkToken()
  );

  isLoggedIn$ = this.isLoggedInSubject$.asObservable();

  ngOnDestroy(): void {
    this.isLoggedInSubject$.complete();
  }

  get isLoggedIn(): boolean {
    return this.isLoggedInSubject$.value;
  }

  getQuote(): Observable<string> {
    return this.#http
      .get<QuoteResponse>(this.#url)
      .pipe(map(({ quote }) => quote));
  }

  login(): void {
    this.#localStorageService.setItem(AUTH_TOKEN_KEY, 'your-token');
    this.#timerService.startLogoutTimer();
    this.isLoggedInSubject$.next(true);
    this.#router.navigate([AppRoutes.Dashboard]);
  }

  logout(): void {
    this.#localStorageService.removeItem(AUTH_TOKEN_KEY);
    this.#localStorageService.removeItem(LOGIN_EXPIRY_TIME_KEY);
    this.#timerService.stopLogoutTimer();
    this.#router.navigate([AppRoutes.Login]);
    this.isLoggedInSubject$.next(false);
  }

  #checkToken(): boolean {
    return !!this.#localStorageService.getItem(AUTH_TOKEN_KEY);
  }
}
