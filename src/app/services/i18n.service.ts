import { Injectable, inject, signal, computed, Signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import {
  DEFAULT_LANGUAGE,
  Language,
  LANGUAGE_CONFIG,
  APP_LANG_KEY,
} from '@shared/constants';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  readonly #translateService = inject(TranslateService);
  readonly #document = inject(DOCUMENT);
  readonly #currentLanguage = signal<Language>(DEFAULT_LANGUAGE);

  readonly currentLanguage: Signal<Language> =
    this.#currentLanguage.asReadonly();
  readonly availableLanguages = computed(() => Object.values(LANGUAGE_CONFIG));

  constructor() {
    this.#initializeTranslation();
  }


  async setLanguage(language: Language): Promise<void> {
    if (!this.#isValidLanguage(language)) {
      console.warn(`Invalid language: ${language}`);
      return;
    }

    await firstValueFrom(this.#translateService.use(language));

    this.#currentLanguage.set(language);
    this.#persistLanguage(language);

    this.#document.documentElement.lang = language;
  }

   async #initializeTranslation(): Promise<void> {
    this.#translateService.addLangs(Object.values(Language));

    this.#translateService.setDefaultLang(DEFAULT_LANGUAGE);

    const initialLanguage = this.#getInitialLanguage();

    await this.setLanguage(initialLanguage);
  }

   #getInitialLanguage(): Language {
    const storedLang = this.#getStoredLanguage();
    if (storedLang && this.#isValidLanguage(storedLang)) {
      return storedLang as Language;
    }

    const browserLanguage = this.#getBrowserLanguage();
    if (browserLanguage) {
      return browserLanguage;
    }

    return DEFAULT_LANGUAGE;
  }

  #getStoredLanguage(): string | null {
    try {
      return localStorage.getItem(APP_LANG_KEY);
    } catch {
      return null;
    }
  }

  #getBrowserLanguage(): Language | null {
    const browserLang = navigator.language || navigator.languages?.[0];
    if (!browserLang) return null;

    const langCode = browserLang.split('-')[0].toLowerCase();
    return this.#isValidLanguage(langCode) ? (langCode as Language) : null;
  }

  #isValidLanguage(lang: string): boolean {
    return Object.values(Language).includes(lang as Language);
  }

  #persistLanguage(language: Language): void {
    try {
      localStorage.setItem(APP_LANG_KEY, language);
    } catch (error) {
      console.warn('Failed to persist language preference:', error);
    }
  }
}
