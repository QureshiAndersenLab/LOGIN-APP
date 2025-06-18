import { LanguageInfo } from '@shared/models/language.model';

export enum Language {
  EN = 'EN',
  FR = 'FR',
  DE = 'DE',
}

export const DEFAULT_LANGUAGE = Language.EN;

export const LANGUAGE_CONFIG: Record<Language, LanguageInfo> = {
  [Language.EN]: {
    code: Language.EN,
    name: 'English',
    nativeName: 'English',
  },
  [Language.FR]: {
    code: Language.FR,
    name: 'French',
    nativeName: 'Français',
  },
  [Language.DE]: {
    code: Language.DE,
    name: 'German',
    nativeName: 'Deutsch',
  },
};
