import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OtpInputDirective } from '@directives';
import { OTP_LENGTH } from '@shared/constants';

@Component({
  selector: 'allianz-otp',
  imports: [ReactiveFormsModule, CommonModule, OtpInputDirective],
  templateUrl: './otp.component.html',
})
export class OtpComponent implements OnInit {
  readonly #formBuilder: FormBuilder = inject(FormBuilder);
  readonly #router = inject(Router);

  email = this.#router.getCurrentNavigation()?.extras.state?.['email'];

  otpForm = this.#formBuilder.group(
    Object.fromEntries(
      Array.from({ length: OTP_LENGTH }).map((_, i) => [
        i.toString(),
        ['', [Validators.required, Validators.pattern(/^\d$/)]],
      ])
    )
  );

  ngOnInit() {
    if (!this.email) {
      this.#router.navigate(['/']);
    }
  }

  get otpControls(): string[] {
    return Object.keys(this.otpForm.controls);
  }
}
