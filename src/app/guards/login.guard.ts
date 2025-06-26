import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { LoginService } from '@services';

export const loginGuard: CanActivateFn = () => inject(LoginService).isLoggedIn;
