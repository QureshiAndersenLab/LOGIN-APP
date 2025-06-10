import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FocusDirective } from '@directives';
import { LoginService, OTPService } from '@services';
import { catchError, EMPTY, finalize, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AppRoutes } from 'app/app.routes';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'allianz-login',
  imports: [ReactiveFormsModule, FocusDirective, CommonModule, TranslateModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly #formBuilder: FormBuilder = inject(FormBuilder);
  readonly #loginService: LoginService = inject(LoginService);
  readonly #otpService: OTPService = inject(OTPService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #router = inject(Router);

  readonly errorMessage = signal('');
  readonly isLoading = signal(false);

  readonly loginForm = this.#formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);

    this.#loginService
      .getQuote()
      .pipe(
        switchMap(() => this.#otpService.generateOtp()),
        // self NOTE: now catchError can be optional since we have error interceptor now, yet this is required for component specific error handling
        catchError((err) => {
          this.errorMessage.set(err.message);
          console.log('Error from catchError:', this.errorMessage());
          return EMPTY;
        }),
        finalize(() => {
          this.isLoading.set(false);
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe({
        next: (otp) => {
          console.log('OTP generated:', otp);
          this.#otpService.setOTP(otp);
          this.#router.navigate([AppRoutes.OTP], {
            state: { email: this.loginForm.value.email },
          });
        },
        error: (err) => console.error('Unexpected error:', err),
      });
  }
}
