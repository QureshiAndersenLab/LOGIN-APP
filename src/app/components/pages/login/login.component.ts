import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent, FooterComponent } from '../../layout';
import { FocusDirective } from '@directives';
import { emailValidator } from '@shared/validators';
import { LoginService, OTPService } from '@services';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';

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
  readonly #changeDetectionRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  OTPCode: string | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;

  loginForm = this.#formBuilder.group({
    email: ['', [Validators.required, emailValidator]],
  });

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.errors?.['invalidEmail'] && control.touched);
  }

  goBack(): void {
    this.#location.back();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;

    this.#loginService
      .getQuote()
      .pipe(
        switchMap((quote) => {
          console.log('Quote:', quote);
          return this.#otpService.generateOtp();
        }),
        tap((otp) => {
          this.OTPCode = otp;
          console.log('OTP generated:', this.OTPCode);
        }),
        catchError((err) => {
          this.errorMessage = err.message;
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
          this.#changeDetectionRef.markForCheck();
        })
      )
      .subscribe();
  }
}
