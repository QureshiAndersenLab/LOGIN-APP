import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LanguageSelectorComponent } from '@components';
import { DEFAULT_LANGUAGE } from '@shared/constants';

describe('LanguageSelectorComponent', () => {
  let component: LanguageSelectorComponent;
  let fixture: ComponentFixture<LanguageSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSelectorComponent, CommonModule],
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
    expect(listOfLanguages.length).toBe(component.languages.length);

    const langTexts = listOfLanguages.map((listItem) =>
      listItem.nativeElement.textContent.trim()
    );
    expect(langTexts).toEqual(component.languages);
  });

  it('should set selected language and close dropdown when a language is clicked', () => {
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);
    fixture.detectChanges();

    const listOfLanguages = fixture.debugElement.queryAll(
      By.css('[data-testId="lang-dropdown"] > li')
    );
    const secondLang = component.languages[1];

    listOfLanguages[1].triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.selectedLanguage()).toBe(secondLang);
    expect(component.showDropdown()).toBeFalse();

    const displayedLang = fixture.debugElement
      .query(By.css('[data-testId="selected-lang"]'))
      .nativeElement.textContent.trim();

    expect(displayedLang).toBe(secondLang);
  });
});
