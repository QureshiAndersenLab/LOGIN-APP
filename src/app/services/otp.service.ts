import { computed, Injectable, OnDestroy, signal } from '@angular/core';
import {
  OTP_EXPIRED_ERROR_MSG,
  OTP_EXPIRY_SEC,
  OTP_INVALID_ERROR_MSG,
} from '@shared/constants';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OTPService implements OnDestroy {
  readonly receivedOTP = signal<string | null>(null);
  readonly isOTPInvalid = signal<boolean>(false);
  readonly errorMessage = signal<string>('');
  readonly otpExpiryTimer = signal<number>(OTP_EXPIRY_SEC);
  readonly isExpired = computed(() => this.otpExpiryTimer() <= 0);

  readonly canSubmitOTP = computed(() => {
    return !this.isOTPInvalid() && !this.isExpired();
  });

  private otpInterval!: ReturnType<typeof setInterval>;

  generateOtp(length: number = 6): Observable<string> {
    this.reset();
    const otp = Array.from({ length }, () =>
      Math.floor(Math.random() * 10)
    ).join('');
    this.startExpiryCountdown();
    return of(otp);
  }

  setOTP(value: string): void {
    this.receivedOTP.set(value);
  }

  startExpiryCountdown(): void {
    clearInterval(this.otpInterval);
    this.otpExpiryTimer.set(OTP_EXPIRY_SEC);

    this.otpInterval = setInterval(() => {
      const time = this.otpExpiryTimer() - 1;
      this.otpExpiryTimer.set(time);

      if (time <= 0) {
        clearInterval(this.otpInterval);
        this.isOTPInvalid.set(true);
        this.errorMessage.set(OTP_EXPIRED_ERROR_MSG);
      }
    }, 1000);
  }

  validateOTP(value: string): void {
    if (this.isExpired()) {
      this.isOTPInvalid.set(true);
      this.errorMessage.set(OTP_EXPIRED_ERROR_MSG);
      return;
    }

    if (value === this.receivedOTP()) {
      this.isOTPInvalid.set(false);
      this.errorMessage.set('');
      return;
    }

    this.isOTPInvalid.set(true);
    this.errorMessage.set(OTP_INVALID_ERROR_MSG);
  }

  reset(): void {
    clearInterval(this.otpInterval);
    this.receivedOTP.set('');
    this.isOTPInvalid.set(false);
    this.errorMessage.set('');
  }

  ngOnDestroy(): void {
    clearInterval(this.otpInterval);
  }
}
