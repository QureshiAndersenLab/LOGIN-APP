import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  DEFAULT_LANGUAGE,
  Language,
} from '../../shared/constants/language.constants';

@Component({
  selector: 'app-language-selector',
  imports: [CommonModule],
  templateUrl: './language-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectorComponent {
  readonly languages: Language[] = Object.values(Language);
  private selectedLanguage = signal(DEFAULT_LANGUAGE);
  private showDropdown = signal(false);

  toggleDropdown(): void {
    this.showDropdown.set(!this.showDropdown());
  }

  selectLanguage(lang: Language): void {
    this.selectedLanguage.set(lang);
    this.showDropdown.set(false);
  }

  get language(): Language {
    return this.selectedLanguage();
  }

  get isDropdownOpen(): boolean {
    return this.showDropdown();
  }
}
