import { computed, Injectable, OnDestroy, signal } from '@angular/core';
import {
  OTP_EXPIRED_ERROR_MSG,
  OTP_EXPIRY_SEC,
  OTP_INVALID_ERROR_MSG,
} from '@shared/constants';
import {
  delay,
  interval,
  Observable,
  of,
  Subscription,
  takeWhile,
  tap,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OTPService implements OnDestroy {
  readonly receivedOTP = signal<string | null>(null);
  readonly isOTPInvalid = signal<boolean>(false);
  readonly errorMessage = signal<string>('');
  readonly otpExpiryTimer = signal<number>(OTP_EXPIRY_SEC);
  readonly isExpired = computed(() => this.otpExpiryTimer() <= 0);

  private otpIntervalSubscription!: Subscription;

  generateOtp(length: number = 6): Observable<string> {
    this.reset();
    const otp = Array.from({ length }, () =>
      Math.floor(Math.random() * 10)
    ).join('');
    this.#startExpiryCountdown();
    return of(otp);
  }

  setOTP(value: string): void {
    this.receivedOTP.set(value);
  }

  #startExpiryCountdown(): void {
    this.otpIntervalSubscription?.unsubscribe();
    this.otpExpiryTimer.set(OTP_EXPIRY_SEC);

    this.otpIntervalSubscription = interval(1000)
      .pipe(
        takeWhile(() => this.otpExpiryTimer() > 0),
        tap(() => {
          const time = this.otpExpiryTimer() - 1;
          this.otpExpiryTimer.set(time);

          if (time <= 0) {
            this.isOTPInvalid.set(true);
            this.errorMessage.set(OTP_EXPIRED_ERROR_MSG);
          }
        })
      )
      .subscribe();
  }

  validateOTP(value: string): Observable<boolean> {
    if (this.isExpired()) {
      this.isOTPInvalid.set(true);
      this.errorMessage.set(OTP_EXPIRED_ERROR_MSG);
      return of(false).pipe(delay(1000));
    }

    const isValid = value === this.receivedOTP();

    this.isOTPInvalid.set(!isValid);
    this.errorMessage.set(isValid ? '' : OTP_INVALID_ERROR_MSG);

    return of(isValid).pipe(delay(1000));
  }

  reset(): void {
    this.receivedOTP.set('');
    this.isOTPInvalid.set(false);
    this.errorMessage.set('');
  }

  ngOnDestroy(): void {
    this.otpIntervalSubscription.unsubscribe();
  }
}
