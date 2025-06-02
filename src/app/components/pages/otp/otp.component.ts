import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OtpInputDirective } from '@directives';
import { OTPService } from '@services';
import { OTP_LENGTH } from '@shared/constants';
import { AppRoutes } from 'app/app.routes';

@Component({
  selector: 'allianz-otp',
  imports: [ReactiveFormsModule, CommonModule, OtpInputDirective],
  templateUrl: './otp.component.html',
})
export class OtpComponent implements OnInit {
  readonly #formBuilder: FormBuilder = inject(FormBuilder);
  readonly #router = inject(Router);
  readonly otpService = inject(OTPService);
  readonly newOTPRequested = signal<boolean>(false);
  readonly email = this.#router.getCurrentNavigation()?.extras.state?.['email'];

  ngOnInit(): void {
    if (!this.email || !this.otpService.receivedOTP()) {
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
    this.otpService.generateOtp().subscribe({
      next: (otp) => {
        console.log('OTP regenerated:', otp);
        this.otpService.setOTP(otp);
        this.newOTPRequested.set(true);
      },

      error: (err) =>
        console.error('Unexpected error during regeneration:', err),
    });
  }

  onSubmit(): void {
    if (this.otpService.isOTPInvalid()) return;

    this.#router.navigate([AppRoutes.Dashboard]);
  }
}
