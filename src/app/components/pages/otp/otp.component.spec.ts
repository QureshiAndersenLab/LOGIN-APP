import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { OtpComponent } from './otp.component';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { OTPService } from '@services';
import { AppRoutes } from 'app/app.routes';
import {
  OTP_EXPIRED_ERROR_KEY,
  OTP_INVALID_ERROR_KEY,
} from '@shared/constants';
import { createMockTranslateServiceWithTranslations } from '@shared/utils';
import { TranslateService } from '@ngx-translate/core';
import { provideTestConfig } from '@shared/utils/provide-test-config';

describe('OtpComponent', () => {
  let component: OtpComponent;
  let fixture: ComponentFixture<OtpComponent>;
  let otpService: OTPService;

  let router: Router;
  let navigateSpy: jasmine.Spy;

  const mockTranslateService = createMockTranslateServiceWithTranslations({
    'pages.otp.otpTitle': 'OTP Verification',
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpComponent],
      providers: [
        ...provideTestConfig([
          { provide: TranslateService, useValue: mockTranslateService },
        ]),
      ],
    }).compileComponents();

    otpService = TestBed.inject(OTPService);
    router = TestBed.inject(Router);
    navigateSpy = spyOn(router, 'navigate');

    fixture = TestBed.createComponent(OtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create OtpComponent', () => {
    expect(component).toBeTruthy();
  });

  it('show have otp verification title', () => {
    const titleTxt = fixture.debugElement.query(By.css('h2')).nativeElement;
    console.log('titleTxt', titleTxt);
    const txtContent = titleTxt.textContent.trim();
    expect(txtContent).toBe('OTP Verification');
  });

  it('should have six input fields', () => {
    const allInputs = fixture.debugElement.queryAll(By.css('input'));
    expect(allInputs.length).toEqual(6);
  });

  it('should apply maxlength of 1 to each input', () => {
    const inputs = fixture.debugElement.queryAll(By.css('input'));
    inputs.forEach((input) => {
      expect(input.attributes['maxlength']).toBe('1');
    });
  });

  it('should disable submit button when OTP is not filled and NOT call onSubmit', fakeAsync(() => {
    const submitSpy = spyOn(component, 'onSubmit');

    const button = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement;
    expect(button.disabled).toBeTrue();

    button.click();
    fixture.detectChanges();

    expect(submitSpy).not.toHaveBeenCalled();
  }));

  it('should enable submit button when valid OTP entered', fakeAsync(() => {
    const testOTP = '123456';

    otpService.setOTP(testOTP);

    testOTP.split('').forEach((digit, index) => {
      component.otpForm.get(index.toString())?.setValue(digit);
    });
    fixture.detectChanges();

    const button = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement;
    expect(button.disabled).toBeFalse();
  }));

  it('should submit valid OTP and navigate to dashboard', fakeAsync(() => {
    const testOTP = '123456';
    otpService.setOTP(testOTP);

    testOTP.split('').forEach((digit, index) => {
      component.otpForm.get(index.toString())?.setValue(digit);
    });
    fixture.detectChanges();

    let enteredOTP: string = '';
    const allInputs = fixture.debugElement.queryAll(By.css('input'));
    allInputs.forEach((input) => (enteredOTP += input.nativeElement.value));

    expect(enteredOTP).toEqual(testOTP);
    expect(otpService.receivedOTP()).toEqual(testOTP);

    const formEl = fixture.debugElement.query(By.css('form'));
    formEl.triggerEventHandler('ngSubmit', null);
    tick(1000);

    expect(otpService.isOTPInvalid()).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith([AppRoutes.Dashboard]);
  }));

  it('should resend OTP and reset fields', fakeAsync(() => {
    const testOTP = '123456';
    otpService.setOTP(testOTP);

    component.otpForm.get('0')?.setValue('1');
    expect(component.otpForm.get('0')?.value).toEqual('1');

    component.resendOTP();
    tick();

    expect(component.otpForm.get('0')?.value).toBe('');
    expect(component.newOTPRequested()).toBeTrue();
  }));

  it('should show invalid OTP error in the UI when user enters wrong OTP', fakeAsync(() => {
    const testOTP = '123456';
    otpService.setOTP(testOTP);

    '000000'.split('').forEach((digit, index) => {
      component.otpForm.get(index.toString())?.setValue(digit);
    });

    let enteredOTP: string = '';
    const allInputs = fixture.debugElement.queryAll(By.css('input'));
    allInputs.forEach((input) => (enteredOTP += input.nativeElement.value));

    const formEl = fixture.debugElement.query(By.css('form'));
    formEl.triggerEventHandler('ngSubmit', null);
    tick(1000);

    fixture.detectChanges();

    expect(otpService.isOTPInvalid()).toBeTrue();
    expect(navigateSpy).not.toHaveBeenCalledWith(['/dashboard']);

    const errorDiv = fixture.debugElement.query(By.css('.error-message'));
    expect(errorDiv).toBeTruthy();

    const errorSpan = errorDiv.query(By.css('span')).nativeElement;
    expect(errorSpan.textContent).toBe(OTP_INVALID_ERROR_KEY);
  }));

  it('should mark OTP as expired after 10 sec and show expired error in the UI', fakeAsync(() => {
    otpService.generateOtp();

    tick(9999);
    expect(otpService.isExpired()).toBeFalse();
    expect(otpService.errMsgTranslationKey()).toBe('');

    tick(10000);
    fixture.detectChanges();

    expect(otpService.isExpired()).toBeTrue();
    expect(otpService.isOTPInvalid()).toBeTrue();
    expect(otpService.errMsgTranslationKey()).toBe(OTP_EXPIRED_ERROR_KEY);

    const errorDiv = fixture.debugElement.query(By.css('.error-message'));
    expect(errorDiv).toBeTruthy();

    const errorSpan = errorDiv.query(By.css('span')).nativeElement;
    expect(errorSpan.textContent).toBe(OTP_EXPIRED_ERROR_KEY);
  }));
});
