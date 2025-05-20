import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  DEFAULT_LANGUAGE,
  Language,
} from '../../shared/constants/language.constants';

@Component({
  selector: 'app-language-selector',
  imports: [CommonModule],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss',
})
export class LanguageSelectorComponent {
  languages = Object.values(Language);
  selectedLanguage = DEFAULT_LANGUAGE;
  showDropdown = false;

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  selectLanguage(lang: Language) {
    this.selectedLanguage = lang;
    this.showDropdown = false;
  }
}
