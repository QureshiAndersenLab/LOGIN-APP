import { CommonModule } from '@angular/common';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LanguageSelectorComponent } from '@components';
import { DEFAULT_LANGUAGE } from '@shared/constants';
import { MOCK_TRANSLATE_SERVICE_PROVIDER } from '@shared/utils';

describe('LanguageSelectorComponent', () => {
  let component: LanguageSelectorComponent;
  let fixture: ComponentFixture<LanguageSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSelectorComponent, CommonModule],
      providers: [MOCK_TRANSLATE_SERVICE_PROVIDER],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create LanguageSelectorComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial selected language as DEFAULT_LANGUAGE', () => {
    const langSelectorEl = fixture.nativeElement;
    const selectedLang = langSelectorEl
      .querySelector('[data-testId="selected-lang"]')
      .textContent.trim();
    expect(selectedLang).toBe(DEFAULT_LANGUAGE);
  });

  it('should have dropdown hidden initially', () => {
    const langSelectorEl = fixture.nativeElement;
    const dropdown = langSelectorEl.querySelector(
      '[data-testId="lang-dropdown"]'
    );
    expect(dropdown).toBeNull();
  });

  it('should toggle dropdown visibility when button is clicked', () => {
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.showDropdown()).toBeTrue();
    let dropdown = fixture.debugElement.query(
      By.css('[data-testId="lang-dropdown"]')
    );
    expect(dropdown).toBeTruthy();

    button.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.showDropdown()).toBeFalse();
    dropdown = fixture.debugElement.query(
      By.css('[data-testId="lang-dropdown"]')
    );
    expect(dropdown).toBeNull();
  });

  it('should render all language options in dropdown', () => {
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);
    fixture.detectChanges();

    const listOfLanguages = fixture.debugElement.queryAll(
      By.css('[data-testId="lang-dropdown"] > li')
    );
    expect(listOfLanguages.length).toBe(component.availableLanguages().length);

    const langCodeOption = fixture.debugElement
      .queryAll(By.css('[data-testId="lang-code"]'))
      .map((el) => el.nativeElement.textContent.trim());

    const availLangCodes = component
      .availableLanguages()
      .map((lang) => lang.code);

    expect(langCodeOption).toEqual(availLangCodes);
  });

  it('should set selected language and close dropdown when a language is clicked', fakeAsync(() => {
    const selectLanguageSpy = spyOn(
      component,
      'selectLanguage'
    ).and.callThrough();

    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);
    fixture.detectChanges();

    const listOfLanguages = fixture.debugElement.queryAll(
      By.css('[data-testId="lang-dropdown"] > li')
    );

    const secondLangCode = component.availableLanguages()[1].code;

    listOfLanguages[1].triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();

    expect(selectLanguageSpy).toHaveBeenCalled();

    expect(component.currentLanguage()).toBe(secondLangCode);
    expect(component.showDropdown()).toBeFalse();
  }));
});
