import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OTPService } from '@services';
import { AppRoutes } from 'app/app.routes';

export const loginGuard: CanActivateFn = () => {
  const otpService = inject(OTPService);
  const router = inject(Router);

  if (otpService.receivedOTP() && !otpService.isOTPInvalid()) {
    return true;
  }

  router.navigate([AppRoutes.Login]);
  return false;
};
