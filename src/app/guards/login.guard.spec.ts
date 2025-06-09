import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { loginGuard } from './login.guard';
import { OTPService } from '@services';

describe('loginGuard', () => {
  let otpService: OTPService;

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({}).compileComponents();

    otpService = TestBed.inject(OTPService);
  });

  it('should be created', () => {
    expect(loginGuard).toBeTruthy();
  });

  it('should allow navigation if OTP is present and valid', () => {
    TestBed.runInInjectionContext(() => {
      otpService.receivedOTP.set('123456');
      otpService.isOTPInvalid.set(false);

      const result = loginGuard(mockRoute, mockState);
      expect(result).toBeTrue();
    });
  });

  it('should block navigation if OTP is missing', () => {
    TestBed.runInInjectionContext(() => {
      otpService.receivedOTP.set(null);
      otpService.isOTPInvalid.set(false);

      const result = loginGuard(mockRoute, mockState);
      expect(result).toBeFalse();
    });
  });

  it('should block navigation if OTP is invalid', () => {
    TestBed.runInInjectionContext(() => {
      otpService.receivedOTP.set('123456');
      otpService.isOTPInvalid.set(true);

      const result = loginGuard(mockRoute, mockState);
      expect(result).toBeFalse();
    });
  });
});
