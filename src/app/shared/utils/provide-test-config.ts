import { importProvidersFrom } from '@angular/core';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { errorInterceptor } from 'app/interceptor';
import { routes } from 'app/app.routes';
import { provideRouter } from '@angular/router';
import { HttpLoaderFactory, KANYE_API_URL } from 'app/app.config';

export function provideTestConfig(overrides: any[] = []) {
  return [
    provideHttpClient(withInterceptors([errorInterceptor])),
    provideRouter(routes),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
        defaultLanguage: 'EN',
      })
    ),
    { provide: KANYE_API_URL, useValue: 'https://api.kanye.rest' },
    ...overrides,
  ];
}
