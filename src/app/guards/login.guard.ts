import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { OTPService } from '@services';

export const loginGuard: CanActivateFn = () => {
  const otpService = inject(OTPService);

  return !!(otpService.receivedOTP() && !otpService.isOTPInvalid());
};
