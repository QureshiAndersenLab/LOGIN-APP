import { inject, Injectable, OnDestroy } from '@angular/core';
import { LOGIN_EXPIRY_TIME_KEY, LOGOUT_EXPIRY_SEC } from '@shared/constants';
import { interval, Subject, takeUntil, tap } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class TimerService implements OnDestroy {
  readonly stop$ = new Subject<void>();
  readonly sessionExpired$ = new Subject<void>();
  readonly #localStorageService = inject(LocalStorageService);

  startLogoutTimer(): void {
    this.stopLogoutTimer();

    let loginEndTimeStamp = Number(
      this.#localStorageService.getItem(LOGIN_EXPIRY_TIME_KEY)
    );

    if (!loginEndTimeStamp || isNaN(loginEndTimeStamp)) {
      loginEndTimeStamp = Date.now() + LOGOUT_EXPIRY_SEC * 1000;
      this.#localStorageService.setItem(
        LOGIN_EXPIRY_TIME_KEY,
        loginEndTimeStamp.toString()
      );
    }

    let warned = false;

    interval(1000)
      .pipe(
        tap(() => {
          const remaining = Math.floor((loginEndTimeStamp - Date.now()) / 1000);
          if (remaining <= 0) {
            this.sessionExpired$.next();
            this.stopLogoutTimer();
          } else if (remaining <= 30 && !warned) {
            alert('Session will expire soon');
            warned = true;
          }
        }),
        takeUntil(this.stop$)
      )
      .subscribe();
  }

  stopLogoutTimer(): void {
    this.stop$.next();
  }

  ngOnDestroy(): void {
    this.stopLogoutTimer();
    this.stop$.complete();
    this.sessionExpired$.complete();
  }
}
