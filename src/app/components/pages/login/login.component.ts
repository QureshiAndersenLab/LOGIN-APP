import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent, FooterComponent } from '../../layout';
import { FocusDirective } from '@directives';
import { LoginService, OTPService } from '@services';
import { catchError, EMPTY, finalize, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'allianz-login',
  imports: [
    ReactiveFormsModule,
    NavbarComponent,
    FooterComponent,
    FocusDirective,
    CommonModule,
  ],
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

  loginForm = this.#formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  goBack(): void {
    this.#location.back();
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
          console.log('OTP generated:', otp);
        },
        error: (err) => console.error('Unexpected error:', err),
      });
  }
}
