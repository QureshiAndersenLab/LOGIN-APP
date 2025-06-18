import { computed, Injectable, OnDestroy, signal } from '@angular/core';
import {
  OTP_EXPIRED_ERROR_KEY,
  OTP_EXPIRY_SEC,
  OTP_INVALID_ERROR_KEY,
} from '@shared/constants';
import {
  delay,
  interval,
  Observable,
  of,
  Subject,
  takeUntil,
  takeWhile,
  tap,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OTPService implements OnDestroy {
  readonly receivedOTP = signal<string | null>(null);
  readonly isOTPInvalid = signal<boolean>(false);
  readonly errMsgTranslationKey = signal<string>('');
  readonly otpExpiryTimer = signal<number>(OTP_EXPIRY_SEC);
  readonly isExpired = computed(() => this.otpExpiryTimer() <= 0);

  readonly stop$ = new Subject<void>();

  generateOtp(length: number = 6): Observable<string> {
    this.reset();
    const otp = Array.from({ length }, () =>
      Math.floor(Math.random() * 10)
    ).join('');
    this.#startExpiryCountdown().subscribe();
    return of(otp);
  }

  setOTP(value: string): void {
    this.receivedOTP.set(value);
  }

  #startExpiryCountdown(): Observable<number> {
    this.stop$.next();
    this.otpExpiryTimer.set(OTP_EXPIRY_SEC);

    return interval(1000).pipe(
      takeWhile(() => this.otpExpiryTimer() > 0),
      tap(() => {
        const time = this.otpExpiryTimer() - 1;
        this.otpExpiryTimer.set(time);

        if (time <= 0) {
          this.isOTPInvalid.set(true);
          this.errMsgTranslationKey.set(OTP_EXPIRED_ERROR_KEY);
        }
      }),
      takeUntil(this.stop$)
    );
  }

  validateOTP(
    value: string
  ): Observable<{ isValid: boolean; accessToken: string }> {
    if (this.isExpired()) {
      return of({ isValid: false, accessToken: '' }).pipe(
        tap(() => {
          this.isOTPInvalid.set(true);
          this.errMsgTranslationKey.set(OTP_EXPIRED_ERROR_KEY);
        }),
        delay(1000)
      );
    }

    const isValid = value === this.receivedOTP();

    return of({ isValid, accessToken: 'fake-auth-key-789' }).pipe(
      tap(({ isValid }) => {
        this.isOTPInvalid.set(!isValid);
        this.errMsgTranslationKey.set(isValid ? '' : OTP_INVALID_ERROR_KEY);
      }),
      delay(1000)
    );
  }

  reset(): void {
    this.receivedOTP.set('');
    this.isOTPInvalid.set(false);
    this.errMsgTranslationKey.set('');
  }

  ngOnDestroy(): void {
    this.stop$.next();
    this.stop$.complete();
  }
}
