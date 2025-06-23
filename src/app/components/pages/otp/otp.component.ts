import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OtpInputDirective } from '@directives';
import { TranslateModule } from '@ngx-translate/core';
import { LoginService, OTPService } from '@services';
import { OTP_LENGTH } from '@shared/constants';
import { AppRoutes } from 'app/app.routes';
import { take } from 'rxjs';

@Component({
  selector: 'allianz-otp',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    OtpInputDirective,
    TranslateModule,
  ],
  templateUrl: './otp.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpComponent implements OnInit {
  readonly #formBuilder: FormBuilder = inject(FormBuilder);
  readonly #router = inject(Router);
  readonly #otpService = inject(OTPService);
  readonly #loginService = inject(LoginService);
  readonly #destroyRef = inject(DestroyRef);
  readonly newOTPRequested = signal<boolean>(false);
  readonly email = this.#router.getCurrentNavigation()?.extras.state?.['email'];

  readonly isOTPInvalid = this.#otpService.isOTPInvalid;
  readonly isExpired = this.#otpService.isExpired;
  readonly errMsgTranslationKey = this.#otpService.errMsgTranslationKey;

  ngOnInit(): void {
    if (!this.email || !this.#otpService.receivedOTP()) {
      this.#router.navigate([AppRoutes.Login]);
    }
  }

  readonly otpForm = this.#formBuilder.group(
    Object.fromEntries(
      Array.from({ length: OTP_LENGTH }).map((_, i) => [
        i.toString(),
        ['', [Validators.required, Validators.pattern(/^\d$/)]],
      ])
    )
  );

  get otpControls(): string[] {
    return Object.keys(this.otpForm.controls);
  }

  resendOTP(): void {
    this.#otpService
      .generateOtp()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (otp) => {
          console.log('OTP regenerated:', otp);
          this.resetOtpFields();
          this.#otpService.setOTP(otp);
          this.newOTPRequested.set(true);
        },

        error: (err) =>
          console.error('Unexpected error during regeneration:', err),
      });
  }

  resetOtpFields(): void {
    this.otpControls.forEach((ctrl) => this.otpForm.get(ctrl)?.setValue(''));
  }

  onSubmit(): void {
    const enteredOTP = this.otpControls
      .map((key) => this.otpForm.get(key)?.value)
      .join('');

    this.#otpService
      .validateOTP(enteredOTP)
      .pipe(take(1))
      .subscribe(({ isValid }) => {
        if (isValid) {
          this.#loginService.login();
          this.#router.navigate([AppRoutes.Dashboard]);
        }
      });
  }
}
