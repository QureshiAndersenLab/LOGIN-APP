import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

export const createMockTranslateService = () => ({
  get: jasmine.createSpy('get').and.returnValue(of('mocked translation')),
  instant: jasmine.createSpy('instant').and.returnValue('mocked translation'),
  getParsedResult: jasmine.createSpy('getParsedResult'),
  use: jasmine.createSpy('use').and.returnValue(of('en')),
  onLangChange: of({ lang: 'en', translations: {} }),
  onTranslationChange: of({ lang: 'en', translations: {} }),
  onDefaultLangChange: of({ lang: 'en', translations: {} }),
  addLangs: jasmine.createSpy('addLangs'),
  getLangs: jasmine.createSpy('getLangs').and.returnValue(['en', 'es']),
  getBrowserLang: jasmine.createSpy('getBrowserLang').and.returnValue('en'),
  getDefaultLang: jasmine.createSpy('getDefaultLang').and.returnValue('en'),
  setDefaultLang: jasmine.createSpy('setDefaultLang'),
  resetLang: jasmine.createSpy('resetLang'),
  getBrowserCultureLang: jasmine
    .createSpy('getBrowserCultureLang')
    .and.returnValue('en-US'),
  set: jasmine.createSpy('set'),
  reloadLang: jasmine.createSpy('reloadLang').and.returnValue(of({})),
  getTranslation: jasmine.createSpy('getTranslation').and.returnValue(of({})),
  setTranslation: jasmine.createSpy('setTranslation'),
  getStreamOnTranslationChange: jasmine
    .createSpy('getStreamOnTranslationChange')
    .and.returnValue(of({})),
  stream: jasmine.createSpy('stream').and.returnValue(of('mocked translation')),
});

export const MOCK_TRANSLATE_SERVICE_PROVIDER = {
  provide: TranslateService,
  useFactory: createMockTranslateService,
};

export const getTranslateTestingConfig = () => ({
  providers: [MOCK_TRANSLATE_SERVICE_PROVIDER],
});

export const createMockTranslateServiceWithTranslations = (
  translations: Record<string, string>
) => {
  const mockService = createMockTranslateService();
  mockService.get = jasmine
    .createSpy('get')
    .and.callFake((key: string) => of(translations[key] || key));
  mockService.instant = jasmine
    .createSpy('instant')
    .and.callFake((key: string) => translations[key] || key);
  mockService.getParsedResult = jasmine
    .createSpy('getParsedResult')
    .and.callFake((key: string) => of(translations[key] || key));
  return mockService;
};
