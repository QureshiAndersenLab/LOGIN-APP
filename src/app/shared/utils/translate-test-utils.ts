import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

export const createMockTranslateService = () => ({
  get: jasmine.createSpy('get').and.returnValue(of('mocked translation')),
  getParsedResult: jasmine.createSpy('getParsedResult'),
  use: jasmine.createSpy('use').and.returnValue(of('en')),
  onLangChange: of({ lang: 'en', translations: {} }),
  onTranslationChange: of({ lang: 'en', translations: {} }),
  onDefaultLangChange: of({ lang: 'en', translations: {} }),
  getLangs: jasmine.createSpy('getLangs').and.returnValue(['en', 'es']),
  addLangs: jasmine.createSpy('addLangs'),
  getDefaultLang: jasmine.createSpy('getDefaultLang').and.returnValue('en'),
  setDefaultLang: jasmine.createSpy('setDefaultLang'),
});

export const MOCK_TRANSLATE_SERVICE_PROVIDER = {
  provide: TranslateService,
  useFactory: createMockTranslateService,
};

export const createMockTranslateServiceWithTranslations = (
  translations: Record<string, string>
) => {
  const mockService = createMockTranslateService();
  mockService.get = jasmine
    .createSpy('get')
    .and.callFake((key: string) => of(translations[key] || key));
  return mockService;
};
