import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { OTPService } from './otp.service';
import {
  OTP_EXPIRED_ERROR_KEY,
  OTP_INVALID_ERROR_KEY,
} from '@shared/constants';

describe('OTPService', () => {
  let service: OTPService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OTPService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return otp of lenght six when length not passed', (done: DoneFn) => {
    service.generateOtp().subscribe((otp) => {
      expect(otp.length).toEqual(6);
      done();
    });
  });

  it('should return correct custom lenght of otp which is passed to param', (done: DoneFn) => {
    const lenght = 10;
    service.generateOtp(lenght).subscribe((otp) => {
      expect(otp.length).toEqual(lenght);
      done();
    });
  });

  it('should return true for correct OTP', fakeAsync(() => {
    const testOTP = '654321';
    service.setOTP(testOTP);

    service.validateOTP(testOTP);
    tick(1000);

    expect(service.isOTPInvalid()).toBe(false);
    expect(service.errMsgTranslationKey()).toBe('');
  }));

  it('should return false and set error for wrong OTP', fakeAsync(() => {
    const testOTP = '654321';
    service.setOTP(testOTP);

    service.validateOTP('000000').subscribe(({ isValid }) => {
      expect(isValid).toBe(false);
      expect(service.isOTPInvalid()).toBe(true);
      expect(service.errMsgTranslationKey()).toBe(OTP_INVALID_ERROR_KEY);
    });
    tick(1000);
  }));

  it('should handle OTP expiry and return false', fakeAsync(() => {
    service.setOTP('111111');
    service.otpExpiryTimer.set(0);
    service.validateOTP('111111').subscribe(({ isValid }) => {
      expect(isValid).toBe(false);
      expect(service.isOTPInvalid()).toBe(true);
      expect(service.errMsgTranslationKey()).toBe(OTP_EXPIRED_ERROR_KEY);
    });
    tick(1000);
  }));

  it('should reset the state', () => {
    service.setOTP('999999');
    service.errMsgTranslationKey.set('some error');
    service.isOTPInvalid.set(true);

    service.reset();

    expect(service.receivedOTP()).toBe('');
    expect(service.isOTPInvalid()).toBe(false);
    expect(service.errMsgTranslationKey()).toBe('');
  });
});
