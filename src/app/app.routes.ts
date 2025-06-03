import { Routes } from '@angular/router';
import { loginGuard } from './guards/login.guard';

export enum AppRoutes {
  Login = '',
  OTP = 'otp',
  Dashboard = 'dashboard',
}

export const routes: Routes = [
  {
    path: AppRoutes.Login,
    loadComponent: () =>
      import('./components').then(({ LoginComponent }) => LoginComponent),
  },
  {
    path: AppRoutes.OTP,
    loadComponent: () =>
      import('./components').then(({ OtpComponent }) => OtpComponent),
  },
  {
    path: AppRoutes.Dashboard,
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./components').then(
        ({ DashboardComponent }) => DashboardComponent
      ),
  },
];
