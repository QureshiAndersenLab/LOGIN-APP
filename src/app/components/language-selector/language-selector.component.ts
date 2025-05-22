import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Language, DEFAULT_LANGUAGE } from '@shared/constants';

@Component({
  selector: 'app-language-selector',
  imports: [CommonModule],
  templateUrl: './language-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectorComponent {
  readonly languages: Language[] = Object.values(Language);
  readonly selectedLanguage = signal(DEFAULT_LANGUAGE);
  readonly showDropdown = signal(false);

  toggleDropdown(): void {
    this.showDropdown.set(!this.showDropdown());
  }

  selectLanguage(lang: Language): void {
    this.selectedLanguage.set(lang);
    this.showDropdown.set(false);
  }
}
