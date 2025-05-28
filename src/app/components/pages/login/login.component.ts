import { CommonModule, Location } from '@angular/common';
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
import { LoginStep } from '@shared/models';
import { OTP_LENGTH, LOGIN_STEPS } from '@shared/constants';

@Component({
  selector: 'allianz-login',
  imports: [ReactiveFormsModule, FocusDirective, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly #formBuilder: FormBuilder = inject(FormBuilder);
  readonly #location: Location = inject(Location);
  readonly #loginService: LoginService = inject(LoginService);
  readonly #otpService: OTPService = inject(OTPService);
  readonly #destroyRef = inject(DestroyRef);

  readonly OTPCode = signal('');
  readonly errorMessage = signal('');
  readonly isLoading = signal(false);

  readonly loginStep = signal<LoginStep>(LOGIN_STEPS.EMAIL);

  loginForm = this.#formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  otpForm = this.#formBuilder.group(
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

  handleOtpInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (!/^\d$/.test(value)) {
      input.value = '';
      this.otpForm.get(index.toString())?.setValue('');
      return;
    }

    if (index < 5) {
      const nextInput = document.querySelectorAll('input')[index + 1];
      nextInput?.focus();
    }
  }

  handleOtpBackspace(index: number, event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = document.querySelectorAll('input')[index - 1];
      (prevInput as HTMLInputElement)?.focus();
    }
  }

  goBack(): void {
    if (this.loginStep() === LOGIN_STEPS.OTP) {
      this.loginStep.set(LOGIN_STEPS.EMAIL);
    } else {
      this.#location.back();
    }
  }

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
          this.OTPCode.set(otp);
          console.log('OTP generated:', this.OTPCode());
          this.loginStep.set(LOGIN_STEPS.OTP);
        },
        error: (err) => console.error('Unexpected error:', err),
      });
  }
}
