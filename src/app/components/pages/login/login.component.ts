import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent, FooterComponent } from '../../layout';
import { FocusDirective } from '@directives';
import { LoginService, OTPService } from '@services';
import { catchError, finalize, of, switchMap } from 'rxjs';

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

  OTPCode = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  loginForm = this.#formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

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
          return of(null);
        }),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (otp) => {
          if (otp) {
            this.OTPCode.set(otp);
            console.log('OTP generated:', otp);
          }
        },
        error: (err) => console.error('Unexpected error:', err),
      });
  }
}
