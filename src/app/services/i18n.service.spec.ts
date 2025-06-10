import { TestBed } from '@angular/core/testing';
import { I18nService } from './i18n.service';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { DEFAULT_LANGUAGE, Language } from '@shared/constants';
import { of } from 'rxjs';

describe('I18nService', () => {
  let service: I18nService;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;
  let documentMock: Document;

  beforeEach(() => {
    translateServiceSpy = jasmine.createSpyObj('TranslateService', [
      'addLangs',
      'setDefaultLang',
      'use',
    ]);
    translateServiceSpy.use.and.returnValue(of('en') as any);

    documentMock = document;

    TestBed.configureTestingModule({
      providers: [
        I18nService,
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: DOCUMENT, useValue: documentMock },
      ],
    });

    service = TestBed.inject(I18nService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set default and available languages on initialization', () => {
    expect(translateServiceSpy.addLangs).toHaveBeenCalledWith(
      Object.values(Language)
    );
    expect(translateServiceSpy.setDefaultLang).toHaveBeenCalledWith(
      DEFAULT_LANGUAGE
    );
  });

  it('should return current language signal', () => {
    expect(service.currentLanguage()).toBe(DEFAULT_LANGUAGE);
  });

  it('should set a valid language', async () => {
    await service.setLanguage('EN' as Language);
    expect(translateServiceSpy.use).toHaveBeenCalledWith('EN');
    expect(service.currentLanguage()).toBe('EN');
    expect(documentMock.documentElement.lang).toBe('EN');
  });

  it('should not set an invalid language', async () => {
    await service.setLanguage('xx' as Language);
    expect(translateServiceSpy.use).not.toHaveBeenCalledWith('xx');
  });
});
