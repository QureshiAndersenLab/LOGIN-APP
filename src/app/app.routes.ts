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
    loadComponent: () => import('./components').then((c) => c.LoginComponent),
  },
  {
    path: AppRoutes.OTP,
    loadComponent: () => import('./components').then((c) => c.OtpComponent),
  },
  {
    path: AppRoutes.Dashboard,
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./components').then((c) => c.DashboardComponent),
  },
];
