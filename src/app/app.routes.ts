import { Routes } from '@angular/router';

export enum AppRoutes {
  Login = '',
  OTP = 'otp',
}

export const routes: Routes = [
  {
    path: AppRoutes.Login,
    loadComponent: () => import('./components').then((c) => c.LoginComponent),
  },
  {
    path: AppRoutes.OTP,
    loadComponent: () => import('./components').then((c) => c.OtpComponent),
  },
];
