import {
  ApplicationConfig,
  InjectionToken,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { errorInterceptor } from './interceptor';

export const KANYE_API_URL = new InjectionToken<string>('KANYE_API_URL');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor])),
    { provide: KANYE_API_URL, useValue: 'https://api.kanye.est' },
  ],
};
