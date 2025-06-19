import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { loginGuard } from './login.guard';
import { LoginService } from '@services';

describe('loginGuard', () => {
  let loginServiceMock: jasmine.SpyObj<LoginService>;

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  beforeEach(() => {
    const spy = jasmine.createSpyObj<LoginService>('LoginService', [], {
      isLoggedIn: false,
    });

    TestBed.configureTestingModule({
      providers: [{ provide: LoginService, useValue: spy }],
    });

    loginServiceMock = TestBed.inject(
      LoginService
    ) as jasmine.SpyObj<LoginService>;
  });

  it('should be created', () => {
    expect(loginGuard).toBeTruthy();
  });

  it('should allow navigation if user is logged in', () => {
    Object.defineProperty(loginServiceMock, 'isLoggedIn', { get: () => true });

    TestBed.runInInjectionContext(() => {
      const result = loginGuard(mockRoute, mockState);
      expect(result).toBeTrue();
    });
  });

  it('should block navigation if user is not logged in', () => {
    Object.defineProperty(loginServiceMock, 'isLoggedIn', { get: () => false });

    TestBed.runInInjectionContext(() => {
      const result = loginGuard(mockRoute, mockState);
      expect(result).toBeFalse();
    });
  });
});
