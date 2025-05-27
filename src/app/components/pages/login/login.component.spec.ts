import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { of, throwError } from 'rxjs';
import { LoginService, OTPService } from '@services';
import { NavbarComponent, FooterComponent } from '../../layout';
import { FocusDirective } from '@directives';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let otpServiceSpy: jasmine.SpyObj<OTPService>;
  let locationSpy: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    loginServiceSpy = jasmine.createSpyObj('LoginService', ['getQuote']);
    otpServiceSpy = jasmine.createSpyObj('OTPService', ['generateOtp']);
    locationSpy = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        LoginComponent,
        NavbarComponent,
        FooterComponent,
        FocusDirective,
      ],
      providers: [
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: OTPService, useValue: otpServiceSpy },
        { provide: Location, useValue: locationSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create LoginComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should render the Insurance Lady image with correct details', () => {
    const navbar = fixture.nativeElement;
    const logo = navbar.querySelector('[data-testId="insurance-lady-img"] img');
    expect(logo).toBeTruthy();
    expect(logo.getAttribute('src')).toContain('login');
    expect(logo.getAttribute('alt')).toBe('Insurance Lady');
  });

  it('should render title and instructions', () => {
    const instructions = fixture.debugElement.nativeElement.querySelector(
      '[data-testId="insurance-lady-img"] h2'
    );
    expect(instructions.textContent).toContain('Welcome');

    const logIn = fixture.debugElement.nativeElement.querySelector('form p');
    expect(logIn.textContent).toContain('Log In');
  });

  it('should disable submit button when form is invalid and NOT call onSubmit', fakeAsync(() => {
    const submitSpy = spyOn(component, 'onSubmit');

    const emailInput = fixture.debugElement.query(
      By.css('input[formControlName="email"]')
    ).nativeElement;

    emailInput.value = 'value@.';
    emailInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const button = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement;
    expect(button.disabled).toBeTrue();

    button.click();
    fixture.detectChanges();
    tick();

    expect(submitSpy).not.toHaveBeenCalled();
  }));

  it('should mark email as invalid when touched and empty', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.markAsTouched();
    emailControl?.setValue('');
    fixture.detectChanges();

    const errorMsg = fixture.debugElement.query(By.css('.error-message'));
    expect(errorMsg).toBeTruthy();
    expect(errorMsg.nativeElement.textContent).toContain('valid email address');
  });

  it('should enable submit button when email is valid', () => {
    const emailInput = fixture.debugElement.query(
      By.css('input[type="email"]')
    ).nativeElement;
    emailInput.value = 'valid@email.com';
    emailInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const button = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement;
    expect(button.disabled).toBeFalse();
  });

  it('should call goBack() and trigger Location.back()', () => {
    const backBtn = fixture.debugElement.query(By.css('button[type="button"]'));
    backBtn.triggerEventHandler('click', null);
    expect(locationSpy.back).toHaveBeenCalled();
  });

  it('should call loginService.getQuote() and otpService.generateOtp() on valid submit', fakeAsync(() => {
    const testOtp = '123456';

    const emailInput = fixture.debugElement.query(
      By.css('input[type="email"]')
    ).nativeElement;
    emailInput.value = 'valid@email.com';
    emailInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    loginServiceSpy.getQuote.and.returnValue(of('Some quote'));
    otpServiceSpy.generateOtp.and.returnValue(of(testOtp));

    const formEl = fixture.debugElement.query(By.css('form'));
    formEl.triggerEventHandler('ngSubmit', null);

    tick();

    expect(loginServiceSpy.getQuote).toHaveBeenCalled();
    expect(otpServiceSpy.generateOtp).toHaveBeenCalled();
    expect(component.OTPCode()).toBe(testOtp);

    flush();
  }));

  it('should set errorMessage if loginService or OTPService fails', fakeAsync(() => {
    const emailInput = fixture.debugElement.query(
      By.css('input[type="email"]')
    ).nativeElement;
    emailInput.value = 'valid@email.com';
    emailInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    loginServiceSpy.getQuote.and.returnValue(
      throwError(() => new Error('API Failed'))
    );
    otpServiceSpy.generateOtp.and.returnValue(of(''));

    const formEl = fixture.debugElement.query(By.css('form'));
    formEl.triggerEventHandler('ngSubmit', null);
    tick();

    expect(component.errorMessage()).toBe('API Failed');
    flush();
  }));

  it('should show "Loading..." when isLoading is true', () => {
    component.isLoading.set(true);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(button.nativeElement.textContent).toContain('Loading...');
  });
});
